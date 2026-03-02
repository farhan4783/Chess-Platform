interface EloPredictorProps {
  myRating?: number;
  opponentRating?: number;
  timeControl?: string;
}

function calculateEloDelta(myRating: number, opponentRating: number): { win: number; loss: number; draw: number } {
  const K = 20;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));
  const win = Math.round(K * (1 - expectedScore));
  const loss = Math.round(K * (0 - expectedScore));
  const draw = Math.round(K * (0.5 - expectedScore));
  return { win, loss, draw };
}

export function EloPredictor({ myRating = 1200, opponentRating = 1200, timeControl = 'Rapid' }: EloPredictorProps) {
  const { win, loss, draw } = calculateEloDelta(myRating, opponentRating);
  const ratingDiff = opponentRating - myRating;
  const isUnderdog = ratingDiff > 50;
  const isFavorite = ratingDiff < -50;

  return (
    <div
      className="rounded-xl p-4 border border-white/[0.08] animate-slide-in-left"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">ELO Predictor</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
          {timeControl}
        </span>
      </div>

      {/* Rating comparison */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="text-center">
          <div className="text-white font-bold text-lg">{myRating}</div>
          <div className="text-gray-500 text-[10px]">You</div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`text-xs font-bold px-2 py-0.5 rounded ${isUnderdog ? 'text-yellow-400' : isFavorite ? 'text-emerald-400' : 'text-gray-400'}`}
          >
            {isUnderdog ? '⬆ Underdog' : isFavorite ? '⬇ Favorite' : '⚖ Even'}
          </div>
          <div className="text-gray-600 text-[10px]">vs</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold text-lg">{opponentRating}</div>
          <div className="text-gray-500 text-[10px]">Opponent</div>
        </div>
      </div>

      {/* Expected ELO changes */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div
          className="rounded-lg py-2 px-1"
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <div className="text-emerald-400 font-black text-base">+{win}</div>
          <div className="text-[10px] text-gray-500">Win</div>
        </div>
        <div
          className="rounded-lg py-2 px-1"
          style={{ background: 'rgba(156,163,175,0.1)', border: '1px solid rgba(156,163,175,0.15)' }}
        >
          <div className={`font-black text-base ${draw >= 0 ? 'text-gray-300' : 'text-gray-400'}`}>
            {draw >= 0 ? `+${draw}` : draw}
          </div>
          <div className="text-[10px] text-gray-500">Draw</div>
        </div>
        <div
          className="rounded-lg py-2 px-1"
          style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}
        >
          <div className="text-red-400 font-black text-base">{loss}</div>
          <div className="text-[10px] text-gray-500">Loss</div>
        </div>
      </div>

      {isUnderdog && (
        <p className="mt-2 text-[10px] text-yellow-400/70 text-center">💡 More to gain, less to lose — play boldly!</p>
      )}
    </div>
  );
}
