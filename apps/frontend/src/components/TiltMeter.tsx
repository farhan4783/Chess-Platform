import { useRecoilValue } from 'recoil';
import { movesAtom } from '@repo/store/chessBoard';
import { useMemo } from 'react';

const TILT_TIPS = [
  'Take a deep breath. Slow down and think before moving.',
  "You're making mistakes under pressure. Consider resigning if behind.",
  'Blunder streak detected! Step back and reassess the full position.',
  "You're on tilt! Focus on not losing material rather than attacking.",
  'Time pressure is hurting your accuracy. Play safer moves.',
];

function getTiltLevel(blunderCount: number): {
  level: number;
  label: string;
  color: string;
  barClass: string;
  emoji: string;
} {
  if (blunderCount === 0)
    return { level: 0, label: 'Calm', color: 'text-emerald-400', barClass: 'tilt-bar-low', emoji: '😌' };
  if (blunderCount === 1)
    return { level: 25, label: 'Shaky', color: 'text-yellow-400', barClass: 'tilt-bar-medium', emoji: '😬' };
  if (blunderCount === 2)
    return { level: 55, label: 'Stressed', color: 'text-orange-400', barClass: 'tilt-bar-medium', emoji: '😤' };
  if (blunderCount === 3)
    return { level: 78, label: 'Tilting', color: 'text-red-400', barClass: 'tilt-bar-high', emoji: '😡' };
  return { level: 100, label: '🔥 ON TILT', color: 'text-red-300', barClass: 'tilt-bar-high', emoji: '💀' };
}

interface TiltMeterProps {
  myColor: 'w' | 'b';
}

export function TiltMeter({ myColor }: TiltMeterProps) {
  const moves = useRecoilValue(movesAtom);

  // Count consecutive recent blunders for current player
  const blunderCount = useMemo(() => {
    const myMoves = moves.filter((_, i) => (myColor === 'w' ? i % 2 === 0 : i % 2 !== 0));
    const recent = myMoves.slice(-4);
    // A "blunder" heuristic: move took < 2 seconds equivalent or sacrificed material without gain
    // Since we don't have eval data, we use move patterns: captures of higher value pieces (heuristic)
    let count = 0;
    for (const m of recent) {
      if (m.san?.includes('??') || m.captured) {
        count++;
      }
    }
    return Math.min(count, 4);
  }, [moves, myColor]);

  const tilt = getTiltLevel(blunderCount);
  const tipIndex = Math.min(blunderCount, TILT_TIPS.length - 1);

  return (
    <div
      className="rounded-xl p-4 border border-white/[0.08] animate-slide-in-left"
      style={{ background: 'rgba(0,0,0,0.35)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{tilt.emoji}</span>
          <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">Tilt Meter</span>
        </div>
        <span className={`text-xs font-bold ${tilt.color}`}>{tilt.label}</span>
      </div>

      {/* Bar */}
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${tilt.barClass}`}
          style={{ width: `${tilt.level}%` }}
        />
      </div>

      {/* Tip */}
      {blunderCount >= 1 && (
        <div className="mt-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-300 leading-relaxed">💡 {TILT_TIPS[tipIndex]}</p>
        </div>
      )}

      {blunderCount === 0 && <p className="text-xs text-gray-500 mt-1">Playing well! Stay focused and accurate.</p>}
    </div>
  );
}
