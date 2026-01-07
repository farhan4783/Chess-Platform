import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { LESSONS } from '../data/lessons';
import Confetti from 'react-confetti';

const GAME_ID = 'lesson';

export const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find((l) => l.id === lessonId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentStep = lesson?.steps[currentStepIndex];

  useEffect(() => {
    if (currentStep) {
      const newChess = new Chess(currentStep.fen);
      setChess(newChess);
      setBoard(newChess.board());
      setFeedback(null);

      // Auto-advance if no expected move (info step)
      // But for now we might want a manual "Next" button for info steps to let user read.
    }
  }, [currentStepIndex, lesson, currentStep]);

  if (!lesson) {
    return <div className="text-white text-center pt-20">Lesson not found</div>;
  }

  // We can't easily hook into the internal move logic of ChessBoard from here without changing it potentially.
  // However, ChessBoard uses the 'chess' instance we pass.
  // So we can watch for changes in chess.history()

  // BUT, ChessBoard has its own internal state management for moves sometimes.
  // Let's relying on the fact that ChessBoard component calls setBoard(chess.board()) after valid moves on UI.
  // So we can check valid moves in an effect on 'board' or 'chess'.

  // PROBLEM: The existing ChessBoard component takes 'chess' object.

  return (
    <div className="flex justify-center min-h-screen pt-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <div className="max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Left Side: Board */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="w-full max-w-[500px]">
            <ChessBoard
              gameId={GAME_ID}
              started={true}
              myColor="w" // Assume player is white for lessons for now, or derive from FEN
              chess={chess}
              setBoard={(newBoard) => {
                setBoard(newBoard);
                // Validate Move
                const history = chess.history({ verbose: true });
                const lastMove = history[history.length - 1];

                if (lastMove && currentStep?.expectedMove) {
                  if (lastMove.from === currentStep.expectedMove.from && lastMove.to === currentStep.expectedMove.to) {
                    setFeedback(currentStep.explanation || 'Correct!');

                    // If this is the last step
                    if (currentStepIndex === lesson.steps.length - 1) {
                      setShowConfetti(true);
                    } else {
                      // Auto advance after small delay? Or let user click Next.
                      // Let's show a "Next" button.
                    }
                  } else {
                    // Wrong move - undo it
                    // We need to undo it on the board
                    setTimeout(() => {
                      chess.undo();
                      setBoard(chess.board());
                      setFeedback('Incorrect move. Try again.');
                    }, 500);
                  }
                }
              }}
              board={board}
              socket={null}
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="order-1 md:order-2 bg-bgAuxiliary2 p-8 rounded-lg text-white">
          <h1 className="text-3xl font-bold text-green-500 mb-2">{lesson.title}</h1>
          <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / lesson.steps.length) * 100}%` }}
            ></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-200 mb-4">Step {currentStepIndex + 1}</h2>
          <p className="text-lg leading-relaxed text-gray-300 mb-6 min-h-[100px]">{currentStep?.text}</p>

          {feedback && (
            <div
              className={`p-4 rounded-md mb-6 ${feedback.includes('Incorrect') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}
            >
              {feedback}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-500 disabled:opacity-50"
              onClick={() => {
                if (currentStepIndex > 0) setCurrentStepIndex((curr) => curr - 1);
              }}
              disabled={currentStepIndex === 0}
            >
              Previous
            </button>

            {/* Show Next button only if move completed or no move required */}
            {(!currentStep?.expectedMove || (feedback && !feedback.includes('Incorrect'))) &&
              currentStepIndex < lesson.steps.length - 1 && (
                <button
                  className="px-6 py-2 rounded bg-green-600 hover:bg-green-500 font-bold"
                  onClick={() => setCurrentStepIndex((curr) => curr + 1)}
                >
                  Next Step
                </button>
              )}

            {currentStepIndex === lesson.steps.length - 1 && feedback && !feedback.includes('Incorrect') && (
              <button
                className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold"
                onClick={() => navigate('/learn')}
              >
                Complete Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
