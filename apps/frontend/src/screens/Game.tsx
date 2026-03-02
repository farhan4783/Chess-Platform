/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import MoveSound from '/move.wav';
import { Button } from '../components/Button';
import { ChessBoard, isPromoting } from '../components/ChessBoard';
import { useSocket } from '../hooks/useSocket';
import { Chess, Move } from 'chess.js';
import { useNavigate, useParams } from 'react-router-dom';
import MovesTable from '../components/MovesTable';
import { useUser } from '@repo/store/useUser';
import { UserAvatar } from '../components/UserAvatar';
import { TiltMeter } from '../components/TiltMeter';
import { AICoachPanel } from '../components/AICoachPanel';
import { EloPredictor } from '../components/EloPredictor';

// TODO: Move together, there's code repetition here
export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const OPPONENT_DISCONNECTED = 'opponent_disconnected';
export const GAME_OVER = 'game_over';
export const JOIN_ROOM = 'join_room';
export const GAME_JOINED = 'game_joined';
export const GAME_ALERT = 'game_alert';
export const GAME_ADDED = 'game_added';
export const USER_TIMEOUT = 'user_timeout';
export const GAME_TIME = 'game_time';
export const GAME_ENDED = 'game_ended';
export const EXIT_GAME = 'exit_game';
export enum Result {
  WHITE_WINS = 'WHITE_WINS',
  BLACK_WINS = 'BLACK_WINS',
  DRAW = 'DRAW',
}
export interface GameResult {
  result: Result;
  by: string;
}

const GAME_TIME_MS = 10 * 60 * 1000;

export interface Player {
  id: string;
  name: string;
  isGuest: boolean;
  rating?: number;
}
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { movesAtom, userSelectedMoveIndexAtom } from '@repo/store/chessBoard';
import GameEndModal from '@/components/GameEndModal';
import { Waitopponent } from '@/components/ui/waitopponent';
import { ShareGame } from '../components/ShareGame';
import ExitGameModel from '@/components/ExitGameModel';

const moveAudio = new Audio(MoveSound);

export interface Metadata {
  blackPlayer: Player;
  whitePlayer: Player;
}

// Premium player card with animated timer
function PlayerCard({
  player,
  timeConsumed,
  isMyTurn,
  color,
}: {
  player?: Player;
  timeConsumed: number;
  isMyTurn: boolean;
  color: 'w' | 'b';
}) {
  const timeLeftMs = GAME_TIME_MS - timeConsumed;
  const minutes = Math.floor(timeLeftMs / (1000 * 60));
  const secs = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
  const isCritical = timeLeftMs < 30000;
  const isWarning = timeLeftMs < 120000 && !isCritical;

  const timerClass = isCritical ? 'timer-critical' : isWarning ? 'timer-warning' : 'timer-normal';

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300 ${
        isMyTurn ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/[0.05] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{
            background:
              color === 'w' ? 'linear-gradient(135deg, #f0f0f0, #d0d0d0)' : 'linear-gradient(135deg, #2d2d2d, #1a1a1a)',
            color: color === 'w' ? '#333' : '#fff',
            border: '2px solid rgba(255,255,255,0.15)',
          }}
        >
          {color === 'w' ? '♙' : '♟'}
        </div>
        <div>
          <div className="text-sm font-bold text-white truncate max-w-[100px]">
            {player?.name ?? (color === 'w' ? 'White' : 'Black')}
          </div>
          <div className="text-[10px] text-gray-500">
            {player?.rating ?? '—'} • {player?.isGuest ? 'Guest' : 'Member'}
          </div>
        </div>
        {isMyTurn && (
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" title="Your turn" />
        )}
      </div>

      {/* Timer */}
      <div
        className={`font-mono font-bold text-lg px-3 py-1 rounded-lg ${timerClass}`}
        style={{ background: isCritical ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.3)' }}
      >
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
    </div>
  );
}

export const Game = () => {
  const socket = useSocket();
  const { gameId } = useParams();
  const user = useUser();
  const navigate = useNavigate();

  const [chess, _setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [added, setAdded] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [player1TimeConsumed, setPlayer1TimeConsumed] = useState(0);
  const [player2TimeConsumed, setPlayer2TimeConsumed] = useState(0);
  const [gameID, setGameID] = useState('');

  const setMoves = useSetRecoilState(movesAtom);
  const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
  const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);

  useEffect(() => {
    userSelectedMoveIndexRef.current = userSelectedMoveIndex;
  }, [userSelectedMoveIndex]);

  useEffect(() => {
    if (!user) window.location.href = '/login';
  }, [user, gameId, navigate, setMoves]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case GAME_ADDED:
          setAdded(true);
          setGameID(message.gameId);
          break;
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          navigate(`/game/${message.payload.gameId}`);
          setGameMetadata({ blackPlayer: message.payload.blackPlayer, whitePlayer: message.payload.whitePlayer });
          break;
        case MOVE:
          const { move, player1TimeConsumed, player2TimeConsumed } = message.payload;
          setPlayer1TimeConsumed(player1TimeConsumed);
          setPlayer2TimeConsumed(player2TimeConsumed);
          if (userSelectedMoveIndexRef.current !== null) {
            setMoves((moves) => [...moves, move]);
            return;
          }
          try {
            if (isPromoting(chess, move.from, move.to)) {
              chess.move({ from: move.from, to: move.to, promotion: 'q' });
            } else {
              chess.move({ from: move.from, to: move.to });
            }
            setMoves((moves) => [...moves, move]);
            moveAudio.play();
          } catch (error) {
            console.log('Error', error);
          }
          break;
        case GAME_OVER:
          setResult(message.payload.result);
          break;
        case GAME_ENDED:
          let wonBy;
          switch (message.payload.status) {
            case 'COMPLETED':
              wonBy = message.payload.result !== 'DRAW' ? 'CheckMate' : 'Draw';
              break;
            case 'PLAYER_EXIT':
              wonBy = 'Player Exit';
              break;
            default:
              wonBy = 'Timeout';
          }
          setResult({ result: message.payload.result, by: wonBy });
          chess.reset();
          setStarted(false);
          setAdded(false);
          break;
        case USER_TIMEOUT:
          setResult(message.payload.win);
          break;
        case GAME_JOINED:
          setGameMetadata({ blackPlayer: message.payload.blackPlayer, whitePlayer: message.payload.whitePlayer });
          setPlayer1TimeConsumed(message.payload.player1TimeConsumed);
          setPlayer2TimeConsumed(message.payload.player2TimeConsumed);
          setStarted(true);
          message.payload.moves.map((x: Move) => {
            if (isPromoting(chess, x.from, x.to)) {
              chess.move({ ...x, promotion: 'q' });
            } else {
              chess.move(x);
            }
          });
          setMoves(message.payload.moves);
          break;
        case GAME_TIME:
          setPlayer1TimeConsumed(message.payload.player1Time);
          setPlayer2TimeConsumed(message.payload.player2Time);
          break;
        default:
          alert(message.payload.message);
          break;
      }
    };

    if (gameId !== 'random') {
      socket.send(JSON.stringify({ type: JOIN_ROOM, payload: { gameId } }));
    }
  }, [chess, socket, gameId, navigate, setMoves]);

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        if (chess.turn() === 'w') {
          setPlayer1TimeConsumed((p) => p + 100);
        } else {
          setPlayer2TimeConsumed((p) => p + 100);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [started, gameMetadata, user, chess]);

  const handleExit = () => {
    socket?.send(JSON.stringify({ type: EXIT_GAME, payload: { gameId } }));
    setMoves([]);
    navigate('/');
  };

  const myColor: 'w' | 'b' = user?.id === gameMetadata?.blackPlayer?.id ? 'b' : 'w';
  const isMyTurn = chess.turn() === myColor;

  if (!socket)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-2">♜</div>
          <div className="text-white font-bold">Connecting...</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {result && (
        <GameEndModal
          blackPlayer={gameMetadata?.blackPlayer}
          whitePlayer={gameMetadata?.whitePlayer}
          gameResult={result}
        />
      )}

      {/* Turn indicator banner */}
      {started && (
        <div
          className={`flex justify-center py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-500 ${
            isMyTurn ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.03] text-gray-500'
          }`}
        >
          {isMyTurn ? '⚡ Your Turn' : "🕐 Opponent's Turn"}
        </div>
      )}

      <div className="flex justify-center px-2 py-3">
        <div className="flex gap-4 w-full max-w-[1200px]">
          {/* Board column */}
          <div className="flex flex-col gap-3 justify-center">
            {/* Opponent card */}
            {started && (
              <PlayerCard
                player={myColor === 'w' ? gameMetadata?.blackPlayer : gameMetadata?.whitePlayer}
                timeConsumed={myColor === 'w' ? player2TimeConsumed : player1TimeConsumed}
                isMyTurn={!isMyTurn}
                color={myColor === 'w' ? 'b' : 'w'}
              />
            )}

            {/* Chess Board */}
            <div className="flex justify-center">
              <ChessBoard
                started={started}
                gameId={gameId ?? ''}
                myColor={myColor}
                chess={chess}
                setBoard={setBoard}
                socket={socket}
                board={board}
              />
            </div>

            {/* My card */}
            {started && (
              <PlayerCard
                player={myColor === 'w' ? gameMetadata?.whitePlayer : gameMetadata?.blackPlayer}
                timeConsumed={myColor === 'w' ? player1TimeConsumed : player2TimeConsumed}
                isMyTurn={isMyTurn}
                color={myColor}
              />
            )}
          </div>

          {/* Right panel */}
          <div
            className="rounded-xl flex-1 flex flex-col gap-3 overflow-auto h-[calc(100vh-4rem)] p-3 no-scrollbar"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.05)',
              minWidth: 240,
              maxWidth: 320,
            }}
          >
            {/* Pre-game lobby */}
            {!started ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-5 py-8">
                {added ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <Waitopponent />
                    <ShareGame gameId={gameID} />
                  </div>
                ) : (
                  gameId === 'random' && (
                    <div className="flex flex-col items-center gap-5 w-full">
                      {/* ELO predictor shown pre-game */}
                      <EloPredictor myRating={1200} opponentRating={1185} timeControl="Rapid" />
                      <Button
                        onClick={() => {
                          socket.send(JSON.stringify({ type: INIT_GAME }));
                        }}
                        className="w-full"
                      >
                        🚀 Find Opponent
                      </Button>
                    </div>
                  )
                )}
              </div>
            ) : (
              <>
                <ExitGameModel onClick={() => handleExit()} />

                {/* Tilt Meter — USP Feature */}
                <TiltMeter myColor={myColor} />

                {/* AI Coach — USP Feature */}
                <AICoachPanel />
              </>
            )}

            {/* Moves history */}
            <div className="mt-auto">
              <MovesTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
