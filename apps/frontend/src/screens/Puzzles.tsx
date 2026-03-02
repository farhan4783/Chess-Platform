import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import { GradientText } from '@/components/GradientText';

// Daily puzzle data – seeded deterministically by day of year
const PUZZLE_POOL = [
  {
    id: 'p1',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    solution: ['f3g5', 'f6e4', 'g5e4'],
    theme: 'Fork',
    rating: 1250,
    description: 'White to move and win material with a fork!',
  },
  {
    id: 'p2',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    theme: 'Back Rank',
    rating: 1100,
    description: 'Find the back rank checkmate!',
  },
  {
    id: 'p3',
    fen: 'r2q1rk1/ppp2ppp/2n1bn2/3pp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
    solution: ['c4f7', 'f8f7', 'f3e5'],
    theme: 'Sacrifice',
    rating: 1450,
    description: 'A classical bishop sacrifice leads to a winning position!',
  },
  {
    id: 'p4',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    solution: ['f1b5'],
    theme: 'Pin',
    rating: 1050,
    description: 'Pin the knight and create immediate pressure!',
  },
  {
    id: 'p5',
    fen: 'r3k2r/ppp2ppp/2n5/3qp3/3P4/2N5/PPP2PPP/R2QK2R b KQkq - 0 1',
    solution: ['d5d4', 'c3d5', 'd4d5'],
    theme: 'Queen Activity',
    rating: 1350,
    description: 'Activate the queen with a tactical sequence!',
  },
  {
    id: 'p6',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/8/3pP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 5',
    solution: ['c3d5', 'f6d5', 'e4d5'],
    theme: 'Double Attack',
    rating: 1200,
    description: 'A double attack wins material immediately.',
  },
  {
    id: 'p7',
    fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
    solution: ['e6f6', 'e8f8', 'e5e6'],
    theme: 'King and Pawn Endgame',
    rating: 900,
    description: 'Master the opposition to queen your pawn!',
  },
];

function getDailyPuzzle() {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return PUZZLE_POOL[dayOfYear % PUZZLE_POOL.length];
}

const THEME_COLORS: Record<string, string> = {
  Fork: 'bg-red-500/20 text-red-300 border-red-500/30',
  'Back Rank': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Sacrifice: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Pin: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Queen Activity': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Double Attack': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'King and Pawn Endgame': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const PIECES: Record<string, string> = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
  P: '♙',
  R: '♖',
  N: '♘',
  B: '♗',
  Q: '♕',
  K: '♔',
};

function MiniBoard({ fen }: { fen: string }) {
  const chess = useMemo(() => {
    const c = new Chess();
    c.load(fen);
    return c;
  }, [fen]);
  const board = chess.board();

  return (
    <div className="rounded-xl overflow-hidden inline-block shadow-xl border border-white/10">
      {board.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((sq, ci) => {
            const isLight = (ri + ci) % 2 === 0;
            const piece = sq ? PIECES[sq.color === 'w' ? sq.type.toUpperCase() : sq.type] : null;
            return (
              <div
                key={ci}
                className="w-10 h-10 flex items-center justify-center text-xl select-none"
                style={{ background: isLight ? '#f0d9b5' : '#b58863' }}
              >
                {piece && (
                  <span
                    style={{
                      color: sq?.color === 'w' ? '#fff' : '#000',
                      textShadow: sq?.color === 'w' ? '0 1px 2px rgba(0,0,0,0.8)' : 'none',
                    }}
                  >
                    {piece}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const MOCK_STREAK = 3;
const MOCK_RATING = 1340;

export const Puzzles = () => {
  const puzzle = useMemo(() => getDailyPuzzle(), []);
  const [inputMove, setInputMove] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSubmit = useCallback(() => {
    const move = inputMove.trim().toLowerCase().replace(/\s/g, '');
    if (!move) return;
    setAttempts((a) => a + 1);
    if (puzzle.solution[0] === move || puzzle.solution.some((s) => s.toLowerCase() === move)) {
      setSolved(true);
      setFeedback({ type: 'success', msg: '🎉 Brilliant! You found the key move!' });
    } else {
      setFeedback({
        type: 'error',
        msg: `❌ Not quite. Think about ${puzzle.theme.toLowerCase()} patterns. Try again!`,
      });
    }
    setInputMove('');
  }, [inputMove, puzzle]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚡</span>
            <div>
              <h1 className="text-3xl font-black text-white">
                Daily <GradientText variant="primary">Challenge</GradientText>
              </h1>
              <p className="text-sm text-gray-500">{dateStr}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up">
          {[
            { icon: '🔥', label: 'Streak', value: `${MOCK_STREAK} days` },
            { icon: '⭐', label: 'Puzzle Rating', value: MOCK_RATING.toString() },
            { icon: '✅', label: 'Solved Today', value: solved ? '1' : '0' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center border border-white/[0.06]">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main puzzle area */}
        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in-delay">
          {/* Board */}
          <div className="flex flex-col items-center gap-4">
            <div className="glass-dark rounded-2xl p-6 border border-white/[0.06] w-full flex flex-col items-center">
              <MiniBoard fen={puzzle.fen} />
              <div className="mt-4 text-sm text-gray-400 text-center">
                <span className="font-semibold text-white">{puzzle.fen.split(' ')[1] === 'w' ? 'White' : 'Black'}</span>{' '}
                to move
              </div>
            </div>
          </div>

          {/* Puzzle info + input */}
          <div className="space-y-4">
            {/* Theme badge + rating */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${THEME_COLORS[puzzle.theme] ?? 'bg-gray-500/20 text-gray-300'}`}
              >
                {puzzle.theme}
              </span>
              <span className="text-xs text-gray-500">
                Rating: <span className="text-white font-bold">{puzzle.rating}</span>
              </span>
            </div>

            {/* Description */}
            <div className="glass rounded-xl p-5 border border-white/[0.06]">
              <h2 className="text-lg font-bold text-white mb-2">🧩 {puzzle.description}</h2>
              <p className="text-sm text-gray-400">
                Enter the best move in UCI format (e.g.{' '}
                <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">e2e4</code>) or algebraic
                notation (e.g. <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">Nxd5</code>).
              </p>
            </div>

            {/* Input */}
            {!solved && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMove}
                  onChange={(e) => setInputMove(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Your move..."
                  className="flex-1 px-4 py-3 rounded-xl text-white font-mono text-sm outline-none border border-white/[0.1] focus:border-purple-500/50 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                />
                <button
                  onClick={handleSubmit}
                  className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-primary shadow-glow hover:opacity-90 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`rounded-xl p-4 border animate-scale-in ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/30 text-red-300'
                }`}
              >
                <p className="font-semibold">{feedback.msg}</p>
                {feedback.type === 'error' && attempts >= 2 && (
                  <p className="text-xs mt-1 opacity-70">
                    Hint: The first move is <code className="bg-black/20 px-1 rounded">{puzzle.solution[0]}</code>
                  </p>
                )}
              </div>
            )}

            {/* Attempts */}
            {attempts > 0 && <div className="text-xs text-gray-500">Attempts: {attempts}</div>}

            {/* Other puzzles from pool */}
            <div className="pt-4">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Also Try</h3>
              <div className="space-y-2">
                {PUZZLE_POOL.filter((p) => p.id !== puzzle.id)
                  .slice(0, 3)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="glass-dark rounded-xl p-3 flex items-center justify-between border border-white/[0.04] hover:bg-white/[0.03] transition-all cursor-pointer"
                    >
                      <div>
                        <span className="text-white text-sm font-semibold">{p.theme}</span>
                        <p className="text-[11px] text-gray-500 mt-0.5">{p.description.slice(0, 40)}...</p>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{p.rating}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
