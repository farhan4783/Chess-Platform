import { Chess, Move, Square } from 'chess.js';
import { GAME_ENDED, INIT_GAME, MOVE } from './messages';
import { db } from './db';
import { randomUUID } from 'crypto';
import { socketManager, User } from './SocketManager';
import { AuthProvider } from '@prisma/client';

type GAME_STATUS = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';
type GAME_RESULT = 'WHITE_WINS' | 'BLACK_WINS' | 'DRAW';

const GAME_TIME_MS = 10 * 60 * 60 * 1000;

export function isPromoting(chess: Chess, from: Square, to: Square) {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== 'p') {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!['1', '8'].some((it) => to.endsWith(it))) {
    return false;
  }

  return chess
    .moves({ square: from, verbose: true })
    .map((it) => it.to)
    .includes(to);
}

export class Game {
  public gameId: string;
  public player1UserId: string;
  public player2UserId: string | null;
  public board: Chess;
  private moveCount = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private moveTimer: ReturnType<typeof setTimeout> | null = null;
  public result: GAME_RESULT | null = null;
  private player1TimeConsumed = 0;
  private player2TimeConsumed = 0;
  private startTime = new Date(Date.now());
  private lastMoveTime = new Date(Date.now());

  constructor(player1UserId: string, player2UserId: string | null, gameId?: string, startTime?: Date) {
    this.player1UserId = player1UserId;
    this.player2UserId = player2UserId;
    this.board = new Chess();
    this.gameId = gameId ?? randomUUID();
    if (startTime) {
      this.startTime = startTime;
      this.lastMoveTime = startTime;
    }
  }

  seedMoves(
    moves: {
      id: string;
      gameId: string;
      moveNumber: number;
      from: string;
      to: string;
      comments: string | null;
      timeTaken: number | null;
      createdAt: Date;
    }[]
  ) {
    console.log(moves);
    moves.forEach((move) => {
      if (isPromoting(this.board, move.from as Square, move.to as Square)) {
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: 'q',
        });
      } else {
        this.board.move({
          from: move.from,
          to: move.to,
        });
      }
    });
    this.moveCount = moves.length;
    if (moves[moves.length - 1]) {
      this.lastMoveTime = moves[moves.length - 1].createdAt;
    }

    moves.map((move, index) => {
      if (move.timeTaken) {
        if (index % 2 === 0) {
          this.player1TimeConsumed += move.timeTaken;
        } else {
          this.player2TimeConsumed += move.timeTaken;
        }
      }
    });
    this.resetAbandonTimer();
    this.resetMoveTimer();
  }
  async updateSecondPlayer(player2UserId: string) {
    this.player2UserId = player2UserId;

    const users = await db.user.findMany({
      where: {
        id: {
          in: [this.player1UserId, this.player2UserId ?? ''],
        },
      },
    });

    try {
      await this.createGameInDb();
    } catch (e) {
      console.error(e);
      return;
    }

    const WhitePlayer = users.find((user: any) => user.id === this.player1UserId);
    const BlackPlayer = users.find((user: any) => user.id === this.player2UserId);

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          gameId: this.gameId,
          whitePlayer: {
            name: WhitePlayer?.name,
            id: this.player1UserId,
            isGuest: WhitePlayer?.provider === AuthProvider.GUEST,
            rating: WhitePlayer?.rating,
          },
          blackPlayer: {
            name: BlackPlayer?.name,
            id: this.player2UserId,
            isGuest: BlackPlayer?.provider === AuthProvider.GUEST,
            rating: BlackPlayer?.rating,
          },
          fen: this.board.fen(),
          moves: [],
        },
      })
    );
  }

  async createGameInDb() {
    this.startTime = new Date(Date.now());
    this.lastMoveTime = this.startTime;

    const game = await db.game.create({
      data: {
        id: this.gameId,
        timeControl: 'CLASSICAL',
        status: 'IN_PROGRESS',
        startAt: this.startTime,
        currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        whitePlayer: {
          connect: {
            id: this.player1UserId,
          },
        },
        blackPlayer: {
          connect: {
            id: this.player2UserId ?? '',
          },
        },
      },
      include: {
        whitePlayer: true,
        blackPlayer: true,
      },
    });
    this.gameId = game.id;
  }

  async addMoveToDb(move: Move, moveTimestamp: Date) {
    await db.$transaction([
      db.move.create({
        data: {
          gameId: this.gameId,
          moveNumber: this.moveCount + 1,
          from: move.from,
          to: move.to,
          before: move.before,
          after: move.after,
          createdAt: moveTimestamp,
          timeTaken: moveTimestamp.getTime() - this.lastMoveTime.getTime(),
          san: move.san,
        },
      }),
      db.game.update({
        data: {
          currentFen: move.after,
        },
        where: {
          id: this.gameId,
        },
      }),
    ]);
  }

  async makeMove(user: User, move: Move) {
    // validate the type of move using zod
    if (this.board.turn() === 'w' && user.userId !== this.player1UserId) {
      return;
    }

    if (this.board.turn() === 'b' && user.userId !== this.player2UserId) {
      return;
    }

    if (this.result) {
      console.error(`User ${user.userId} is making a move post game completion`);
      return;
    }

    const moveTimestamp = new Date(Date.now());

    try {
      if (isPromoting(this.board, move.from, move.to)) {
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: 'q',
        });
      } else {
        this.board.move({
          from: move.from,
          to: move.to,
        });
      }
    } catch (e) {
      console.error('Error while making move');
      return;
    }

    // flipped because move has already happened
    if (this.board.turn() === 'b') {
      this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
    }

    if (this.board.turn() === 'w') {
      this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
    }

    await this.addMoveToDb(move, moveTimestamp);
    this.resetAbandonTimer();
    this.resetMoveTimer();

    this.lastMoveTime = moveTimestamp;

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: MOVE,
        payload: { move, player1TimeConsumed: this.player1TimeConsumed, player2TimeConsumed: this.player2TimeConsumed },
      })
    );

    if (this.board.isGameOver()) {
      const result = this.board.isDraw() ? 'DRAW' : this.board.turn() === 'b' ? 'WHITE_WINS' : 'BLACK_WINS';

      this.endGame('COMPLETED', result);
    }

    this.moveCount++;
  }

  getPlayer1TimeConsumed() {
    if (this.board.turn() === 'w') {
      return this.player1TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
    }
    return this.player1TimeConsumed;
  }

  getPlayer2TimeConsumed() {
    if (this.board.turn() === 'b') {
      return this.player2TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
    }
    return this.player2TimeConsumed;
  }

  async resetAbandonTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.endGame('ABANDONED', this.board.turn() === 'b' ? 'WHITE_WINS' : 'BLACK_WINS');
    }, 60 * 1000);
  }

  async resetMoveTimer() {
    if (this.moveTimer) {
      clearTimeout(this.moveTimer);
    }
    const turn = this.board.turn();
    const timeLeft = GAME_TIME_MS - (turn === 'w' ? this.player1TimeConsumed : this.player2TimeConsumed);

    this.moveTimer = setTimeout(() => {
      this.endGame('TIME_UP', turn === 'b' ? 'WHITE_WINS' : 'BLACK_WINS');
    }, timeLeft);
  }

  async exitGame(user: User) {
    this.endGame('PLAYER_EXIT', user.userId === this.player2UserId ? 'WHITE_WINS' : 'BLACK_WINS');
  }

  async endGame(status: GAME_STATUS, result: GAME_RESULT) {
    const updatedGame = await db.game.update({
      data: {
        status,
        result: result,
      },
      where: {
        id: this.gameId,
      },
      include: {
        moves: {
          orderBy: {
            moveNumber: 'asc',
          },
        },
        blackPlayer: true,
        whitePlayer: true,
      },
    });

    if (this.player1UserId && this.player2UserId) {
      const player1 = await db.user.findUnique({ where: { id: this.player1UserId } });
      const player2 = await db.user.findUnique({ where: { id: this.player2UserId } });

      if (player1 && player2) {
        const rating1 = player1.rating;
        const rating2 = player2.rating;

        const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
        const expected2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

        let score1 = 0.5;
        let score2 = 0.5;

        if (result === 'WHITE_WINS') {
          score1 = 1;
          score2 = 0;
        } else if (result === 'BLACK_WINS') {
          score1 = 0;
          score2 = 1;
        }

        const K = 32;
        const newRating1 = Math.round(rating1 + K * (score1 - expected1));
        const newRating2 = Math.round(rating2 + K * (score2 - expected2));

        await db.user.update({
          where: { id: this.player1UserId },
          data: {
            rating: newRating1,
            wins: result === 'WHITE_WINS' ? { increment: 1 } : undefined,
            losses: result === 'BLACK_WINS' ? { increment: 1 } : undefined,
            draws: result === 'DRAW' ? { increment: 1 } : undefined,
          },
        });

        await db.user.update({
          where: { id: this.player2UserId },
          data: {
            rating: newRating2,
            wins: result === 'BLACK_WINS' ? { increment: 1 } : undefined,
            losses: result === 'WHITE_WINS' ? { increment: 1 } : undefined,
            draws: result === 'DRAW' ? { increment: 1 } : undefined,
          },
        });
      }
    }

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: GAME_ENDED,
        payload: {
          result,
          status,
          moves: updatedGame.moves,
          blackPlayer: {
            id: updatedGame.blackPlayer.id,
            name: updatedGame.blackPlayer.name,
            rating: updatedGame.blackPlayer.rating,
          },
          whitePlayer: {
            id: updatedGame.whitePlayer.id,
            name: updatedGame.whitePlayer.name,
            rating: updatedGame.whitePlayer.rating,
          },
        },
      })
    );
    // clear timers
    this.clearTimer();
    this.clearMoveTimer();
  }

  clearMoveTimer() {
    if (this.moveTimer) clearTimeout(this.moveTimer);
  }

  setTimer(timer: ReturnType<typeof setTimeout>) {
    this.timer = timer;
  }

  clearTimer() {
    if (this.timer) clearTimeout(this.timer);
  }
}
