export const EvaluationBar = ({ evaluation }: { evaluation: number | null }) => {
  // Evaluation is typically in centipawns (cp 100) or mate (mate 5)
  // We need to parse it.
  // Example format: "info depth 10 ... score cp 123 ..."

  // let score = 0;
  // This is a placeholder parsing logic. The hook currently extracts 'bestmove'.
  // We need to update the hook to extract score as well if we want this to work fully.
  // For now, we will just show a visual indicator.

  // Calculate percentage based on evaluation (assuming centipawns)
  // 0 evaluation -> 50%
  // +ve evaluation (white advantage) -> > 50%
  // -ve evaluation (black advantage) -> < 50%
  // Using a sigmoid-like function to map -Infinity..Infinity to 0..100
  // 300 centipawns (3 pawns) roughly maps to significant advantage.
  const percentage = evaluation === null ? 50 : 100 / (1 + Math.exp(-evaluation / 300));

  return (
    <div className="h-[500px] w-4 bg-gray-700 rounded-md relative overflow-hidden">
      <div
        className="absolute bottom-0 w-full bg-white transition-all duration-500"
        style={{ height: `${percentage}%` }}
      ></div>
      {/* We can improve this with actual score later */}
    </div>
  );
};
