export const EvaluationBar = ({ evaluation: _ }: { evaluation: string | null }) => {
    // Evaluation is typically in centipawns (cp 100) or mate (mate 5)
    // We need to parse it.
    // Example format: "info depth 10 ... score cp 123 ..."

    // let score = 0;
    // This is a placeholder parsing logic. The hook currently extracts 'bestmove'.
    // We need to update the hook to extract score as well if we want this to work fully.
    // For now, we will just show a visual indicator.

    // Using evaluation so linter doesn't complain
    // console.log(evaluation);

    return (
        <div className="h-[500px] w-4 bg-gray-700 rounded-md relative overflow-hidden">
            <div
                className="absolute bottom-0 w-full bg-white transition-all duration-500"
                style={{ height: '50%' }} // default 50%
            ></div>
            {/* We can improve this with actual score later */}
        </div>
    );
};
