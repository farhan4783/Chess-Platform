import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { useStockfish } from '../hooks/useStockfish';
// import { Button } from '@repo/ui/button'; // Assuming we have a Button component, if not use standard button

const GAME_ID = 'ai_game';

export const GameAI = () => {
    const [chess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const { engine, bestMove } = useStockfish();

    useEffect(() => {
        if (started && engine) {
            // If it's AI's turn (Black)
            if (chess.turn() === 'b') {
                // Determine Move
                // We depend on bestMove from hook, but we need to trigger it first.
                // Triggered in the useEffect below when turn changes.
            }
        }
    }, [started, engine, chess]);

    useEffect(() => {
        if (!started) return;
        if (chess.turn() === 'b') {
            // Ask engine for move
            // We use a small timeout to make it feel natural
            setTimeout(() => {
                // Level 10 depth
                engine?.postMessage(`position fen ${chess.fen()}`);
                engine?.postMessage('go depth 10');
            }, 500);
        }
    }, [chess, chess.turn(), started, engine]);

    useEffect(() => {
        if (bestMove && chess.turn() === 'b') {
            try {
                chess.move(bestMove);
                setBoard(chess.board());
            } catch (e) {
                console.error("AI tried illegal move", bestMove);
            }
        }
    }, [bestMove]);


    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-1 min-h-[500px]">
                        <ChessBoard
                            socket={null as any} // We don't need socket for AI game
                            gameId={GAME_ID}
                            started={started}
                            myColor={'w'}
                            chess={chess}
                            setBoard={setBoard}
                            board={board}
                        />
                    </div>
                    <div className="col-span-1 bg-bgAuxiliary2 rounded-md p-8 flex justify-center content-center flex-wrap">
                        {!started && (
                            <button
                                onClick={() => {
                                    setStarted(true);
                                }}
                                className="px-8 py-4 text-2xl bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                            >
                                Play vs AI
                            </button>
                        )}
                        {started && (
                            <div className="text-white text-xl">
                                {chess.isGameOver() ? "Game Over" : (chess.turn() === 'w' ? "Your Turn" : "AI is thinking...")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
