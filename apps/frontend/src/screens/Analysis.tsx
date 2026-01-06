import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { useStockfish } from '../hooks/useStockfish';
import { EvaluationBar } from '../components/EvaluationBar';

const GAME_ID = 'analysis';

export const Analysis = () => {
    const [chess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started] = useState(true); // Analysis is always started
    const { bestMove, evaluatePosition } = useStockfish();
    // const [evaluation, setEvaluation] = useState<string | null>(null);

    useEffect(() => {
        // Whenever board changes, evaluate
        evaluatePosition(chess.fen());
    }, [board, chess, evaluatePosition]);

    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 hidden md:flex justify-center">
                        <EvaluationBar evaluation={null} />
                    </div>
                    <div className="col-span-12 md:col-span-6 min-h-[500px]">
                        <ChessBoard
                            socket={null as any}
                            gameId={GAME_ID}
                            started={started}
                            myColor={'w'} // Analysis view usually valid for both, but we lock to white for now or need toggle
                            chess={chess}
                            setBoard={setBoard}
                            board={board}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-5 bg-bgAuxiliary2 rounded-md p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Analysis</h2>
                        <div className="text-gray-300">
                            {bestMove ? (
                                <div>
                                    <span className="font-bold text-green-400">Best Move: </span>
                                    {bestMove}
                                </div>
                            ) : "Evaluating..."}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                Make moves on the board to analyze different variations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
