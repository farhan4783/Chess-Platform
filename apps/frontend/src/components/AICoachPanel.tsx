import { useRecoilValue } from 'recoil';
import { movesAtom } from '@repo/store/chessBoard';
import { useMemo } from 'react';

interface CoachTip {
  icon: string;
  title: string;
  body: string;
  color: string;
}

function generateTip(san: string, moveNumber: number): CoachTip {
  // Endgame tips
  if (moveNumber > 30) {
    return {
      icon: '♚',
      title: 'Endgame Phase',
      body: 'Activate your king! In the endgame, the king is a powerful fighting piece. Centralize it.',
      color: 'text-yellow-400',
    };
  }

  // Castling
  if (san === 'O-O' || san === 'O-O-O') {
    return {
      icon: '🏰',
      title: 'Great — You Castled!',
      body: 'Castling connects your rooks. Now look for ways to open the center and activate your pieces.',
      color: 'text-emerald-400',
    };
  }

  // Check
  if (san.includes('+')) {
    return {
      icon: '⚔️',
      title: 'Check!',
      body: "You gave check! Make sure it's meaningful — pointless checks can waste tempo and let your opponent develop.",
      color: 'text-orange-400',
    };
  }

  // Checkmate
  if (san.includes('#')) {
    return {
      icon: '🏆',
      title: 'Checkmate!',
      body: 'Brilliant — you checkmated your opponent! Perfect execution of your attack.',
      color: 'text-yellow-400',
    };
  }

  // Capture
  if (san.includes('x')) {
    return {
      icon: '💥',
      title: 'Capture!',
      body: "After a capture, ask: what is your opponent's best reply? Don't assume they will recapture immediately.",
      color: 'text-cyan-400',
    };
  }

  // Pawn promotion
  if (san.includes('=')) {
    return {
      icon: '👑',
      title: 'Promotion!',
      body: 'Excellent — you promoted a pawn. Usually queen is best, but consider rook or knight in rare cases.',
      color: 'text-purple-400',
    };
  }

  // Opening principles (first 10 moves)
  if (moveNumber <= 10) {
    const openingTips = [
      {
        icon: '🌟',
        title: 'Control the Center',
        body: 'Place your pawns on e4/d4 (or e5/d5) to control central squares.',
        color: 'text-yellow-400',
      },
      {
        icon: '🐴',
        title: 'Develop Knights First',
        body: 'Knights go to f3/c3 (or f6/c6). They need more moves to reach good squares.',
        color: 'text-emerald-400',
      },
      {
        icon: '👁️',
        title: 'Watch for Forks',
        body: 'A knight fork can win material instantly. Always check if your pieces are vulnerable.',
        color: 'text-blue-400',
      },
      {
        icon: '🏰',
        title: 'Castle Soon',
        body: 'Get your king to safety before launching an attack. Uncastled kings are targets.',
        color: 'text-purple-400',
      },
      {
        icon: '🔗',
        title: 'Connect Your Rooks',
        body: 'After castling, connect rooks by moving your queen and clearing the back rank.',
        color: 'text-cyan-400',
      },
    ];
    return openingTips[moveNumber % openingTips.length];
  }

  // Middlegame tips
  const middlegameTips = [
    {
      icon: '⚖️',
      title: 'Evaluate the Position',
      body: 'Before moving, count material. Are you ahead or behind? This shapes your strategy.',
      color: 'text-gray-300',
    },
    {
      icon: '🎯',
      title: 'Find Your Weaknesses',
      body: 'Look for your weakest pawn or piece — your opponent will target it. Defend proactively.',
      color: 'text-orange-400',
    },
    {
      icon: '🔄',
      title: 'Improve the Worst Piece',
      body: 'Find your least active piece each turn and ask how you can improve it.',
      color: 'text-emerald-400',
    },
    {
      icon: '📐',
      title: 'Prophylaxis',
      body: "Before your move, think: what is my opponent's best plan? Stop it before it starts.",
      color: 'text-purple-400',
    },
  ];
  return middlegameTips[moveNumber % middlegameTips.length];
}

export function AICoachPanel() {
  const moves = useRecoilValue(movesAtom);

  const tip = useMemo<CoachTip>(() => {
    if (moves.length === 0) {
      return {
        icon: '🤖',
        title: 'AI Coach Ready',
        body: "I'll give you real-time coaching tips after each move. Make your first move to begin!",
        color: 'text-purple-400',
      };
    }
    const lastMove = moves[moves.length - 1];
    return generateTip(lastMove?.san ?? '', moves.length);
  }, [moves]);

  return (
    <div className="coach-panel rounded-xl p-4 animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          🤖
        </div>
        <span className="text-xs font-bold text-emerald-300 tracking-wider uppercase">AI Coach</span>
        <span className="ml-auto text-[10px] text-emerald-400/60">Move {moves.length}</span>
      </div>

      {/* Tip */}
      <div className="space-y-1.5">
        <div className={`flex items-center gap-2 font-bold text-sm ${tip.color}`}>
          <span>{tip.icon}</span>
          <span>{tip.title}</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{tip.body}</p>
      </div>

      {/* Move count indicator */}
      {moves.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(moves.length, 8) }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background:
                    i === Math.min(moves.length - 1, 7)
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
