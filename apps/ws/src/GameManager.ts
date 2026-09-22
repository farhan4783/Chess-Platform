import { WebSocket } from 'ws';
import {
  GAME_OVER,
  INIT_GAME,
  JOIN_GAME,
  MOVE,
  OPPONENT_DISCONNECTED,
  JOIN_ROOM,
  GAME_JOINED,
  GAME_NOT_FOUND,
  GAME_ALERT,
  GAME_ADDED,
  GAME_ENDED,
  EXIT_GAME,
} from './messages';
import { Game, isPromoting } from './Game';
import { db, isDbConnected } from './db';
import { socketManager, User } from './SocketManager';
import { Square } from 'chess.js';
import { GameStatus } from '@prisma/client';

export class GameManager {
  private games: Game[];
  private pendingGameId: string | null;
  private users: User[];

  constructor() {
    this.games = [];
    this.pendingGameId = null;
    this.users = [];
  }

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket);
    if (!user) {
      console.error('User not found?');
      return;
    }
    this.users = this.users.filter((user) => user.socket !== socket);
    socketManager.removeUser(user);

    if (this.pendingGameId) {
      const pendingGame = this.games.find((g) => g.gameId === this.pendingGameId);
      if (pendingGame && pendingGame.player1UserId === user.userId) {
        this.pendingGameId = null;
        this.removeGame(pendingGame.gameId);
      }
    }
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((g) => g.gameId !== gameId);
  }

  private addHandler(user: User) {
    user.socket.on('message', async (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingGameId) {
          const game = this.games.find((x) => x.gameId === this.pendingGameId);
          if (!game || (game.player1User && game.player1User.socket.readyState !== WebSocket.OPEN)) {
            // Stale or disconnected pending game
            this.pendingGameId = null;
          } else if (user.userId === game.player1UserId) {
            socketManager.broadcast(
              game.gameId,
              JSON.stringify({
                type: GAME_ALERT,
                payload: {
                  message: 'Trying to Connect with yourself?',
                },
              })
            );
            return;
          } else {
            socketManager.addUser(user, game.gameId);
            await game.updateSecondPlayer(user.userId, user);
            this.pendingGameId = null;
            return;
          }
        }

        const game = new Game(user.userId, null, undefined, undefined, user);
        this.games.push(game);
        this.pendingGameId = game.gameId;
        socketManager.addUser(user, game.gameId);
        socketManager.broadcast(
          game.gameId,
          JSON.stringify({
            type: GAME_ADDED,
            gameId: game.gameId,
          })
        );
      }

      if (message.type === MOVE) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.gameId === gameId);
        if (game) {
          game.makeMove(user, message.payload.move);
          if (game.result) {
            this.removeGame(game.gameId);
          }
        }
      }

      if (message.type === EXIT_GAME) {
        const gameId = message.payload.gameId;
        const game = this.games.find((game) => game.gameId === gameId);

        if (game) {
          game.exitGame(user);
          this.removeGame(game.gameId);
        }
      }

      if (message.type === JOIN_ROOM) {
        const gameId = message.payload?.gameId;
        if (!gameId) {
          return;
        }

        let availableGame = this.games.find((game) => game.gameId === gameId);

        // There is a game created but no second player available
        if (availableGame && !availableGame.player2UserId) {
          socketManager.addUser(user, availableGame.gameId);
          await availableGame.updateSecondPlayer(user.userId, user);
          return;
        }

        let gameFromDb: any = null;
        if (isDbConnected()) {
          try {
            gameFromDb = await db.game.findUnique({
              where: { id: gameId },
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
          } catch (e: any) {
            console.warn('[GameManager] DB query failed in JOIN_ROOM (continuing with in-memory):', e?.message || e);
          }
        }

        if (!gameFromDb && !availableGame) {
          user.socket.send(
            JSON.stringify({
              type: GAME_NOT_FOUND,
            })
          );
          return;
        }

        if (gameFromDb && gameFromDb.status !== GameStatus.IN_PROGRESS) {
          user.socket.send(
            JSON.stringify({
              type: GAME_ENDED,
              payload: {
                result: gameFromDb.result,
                status: gameFromDb.status,
                moves: gameFromDb.moves,
                blackPlayer: {
                  id: gameFromDb.blackPlayer.id,
                  name: gameFromDb.blackPlayer.name,
                },
                whitePlayer: {
                  id: gameFromDb.whitePlayer.id,
                  name: gameFromDb.whitePlayer.name,
                },
              },
            })
          );
          return;
        }

        if (!availableGame && gameFromDb) {
          const game = new Game(gameFromDb.whitePlayerId, gameFromDb.blackPlayerId, gameFromDb.id, gameFromDb.startAt);
          game.seedMoves(gameFromDb.moves || []);
          this.games.push(game);
          availableGame = game;
        }

        if (availableGame) {
          socketManager.addUser(user, availableGame.gameId);

          const whitePlayerInfo = gameFromDb?.whitePlayer
            ? {
                id: gameFromDb.whitePlayer.id,
                name: gameFromDb.whitePlayer.name,
                rating: gameFromDb.whitePlayer.rating,
              }
            : {
                id: availableGame.player1UserId,
                name: availableGame.player1User?.name ?? 'White Player',
                rating: 1200,
              };

          const blackPlayerInfo = gameFromDb?.blackPlayer
            ? {
                id: gameFromDb.blackPlayer.id,
                name: gameFromDb.blackPlayer.name,
                rating: gameFromDb.blackPlayer.rating,
              }
            : {
                id: availableGame.player2UserId ?? '',
                name: availableGame.player2User?.name ?? 'Black Player',
                rating: 1200,
              };

          user.socket.send(
            JSON.stringify({
              type: GAME_JOINED,
              payload: {
                gameId,
                moves: gameFromDb?.moves ?? availableGame.board.history({ verbose: true }),
                blackPlayer: blackPlayerInfo,
                whitePlayer: whitePlayerInfo,
                player1TimeConsumed: availableGame.getPlayer1TimeConsumed(),
                player2TimeConsumed: availableGame.getPlayer2TimeConsumed(),
                fen: availableGame.board.fen(),
              },
            })
          );
        }
      }
    });
  }
}
