import { useUser } from '@repo/store/useUser';

// Opening DNA data (mock, but structured realistically)
const OPENING_DATA = [
  { name: 'Sicilian Defense', color: '#667eea', games: 42, winRate: 58 },
  { name: "King's Gambit", color: '#f59e0b', games: 28, winRate: 64 },
  { name: 'French Defense', color: '#10b981', games: 19, winRate: 47 },
  { name: 'London System', color: '#06b6d4', games: 15, winRate: 53 },
  { name: 'Other', color: '#6b7280', games: 10, winRate: 50 },
];

const STYLE_METRICS = [
  { label: 'Aggression', value: 72, color: '#ef4444' },
  { label: 'Accuracy', value: 81, color: '#667eea' },
  { label: 'Tactics', value: 68, color: '#f59e0b' },
  { label: 'Endgame', value: 55, color: '#10b981' },
  { label: 'Openings', value: 78, color: '#a78bfa' },
];

const ACHIEVEMENTS = [
  { icon: '⚡', title: 'Speed Demon', desc: 'Won 10 bullet games', earned: true },
  { icon: '🧠', title: 'Tactical Mind', desc: 'Solved 100 puzzles', earned: true },
  { icon: '♟', title: 'Opening Scholar', desc: 'Played 5 different openings', earned: true },
  { icon: '🏆', title: 'Tournament Victor', desc: 'Won a tournament', earned: false },
  { icon: '👑', title: 'Grandmaster', desc: 'Reach 2500 ELO', earned: false },
  { icon: '🔥', title: 'On Fire', desc: '10-game win streak', earned: false },
];

function RadarChart({ metrics }: { metrics: typeof STYLE_METRICS }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const n = metrics.length;

  const points = metrics.map((m, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const rv = (m.value / 100) * r;
    return { x: cx + rv * Math.cos(angle), y: cy + rv * Math.sin(angle) };
  });

  const bgPoints = metrics.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const labelPoints = metrics.map((m, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + (r + 20) * Math.cos(angle), y: cy + (r + 20) * Math.sin(angle), label: m.label };
  });

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background grid */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={bgPoints
            .map((p) => `${(cx + (p.x - cx) * scale).toFixed(1)},${(cy + (p.y - cy) * scale).toFixed(1)}`)
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {bgPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* Data polygon */}
      <path d={toPath(points)} fill="rgba(102,126,234,0.3)" stroke="#667eea" strokeWidth="2" />
      {/* Labels */}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={metrics[i].color}
          fontSize="8"
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

function OpeningDonut() {
  const total = OPENING_DATA.reduce((s, o) => s + o.games, 0);
  let cumulative = 0;
  const r = 40;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
      {OPENING_DATA.map((op) => {
        const fraction = op.games / total;
        const offset = circumference * (1 - cumulative) - circumference * 0.01;
        const dashLen = circumference * fraction - circumference * 0.015;
        const el = (
          <circle
            key={op.name}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={op.color}
            strokeWidth="16"
            strokeDasharray={`${dashLen} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        cumulative += fraction;
        return el;
      })}
    </svg>
  );
}

export const Profile = () => {
  const user = useUser();
  const mockRating = 1482;
  const mockGames = 114;
  const mockWinRate = 54;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06] animate-fade-in">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-glow flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              {(user?.name?.[0] ?? 'U').toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white">{user?.name ?? 'Chess Player'}</h1>
              <div className="text-sm text-gray-400 mt-0.5">{user ? 'Member' : 'Guest Account'}</div>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { label: 'Rating', value: mockRating, color: 'text-purple-400' },
                  { label: 'Games', value: mockGames, color: 'text-white' },
                  { label: 'Win Rate', value: `${mockWinRate}%`, color: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Estimated Title</div>
              <div className="px-3 py-1 rounded-lg text-sm font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
                🏅 Club Player
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Opening DNA */}
          <div className="lg:col-span-1 glass rounded-2xl p-5 border border-purple-500/20 animate-slide-in-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🧬</span>
              <h2 className="font-bold text-white">Opening DNA</h2>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                EXCLUSIVE
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <OpeningDonut />
              <div className="space-y-1.5 flex-1 min-w-0">
                {OPENING_DATA.map((op) => (
                  <div key={op.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: op.color }} />
                    <div className="text-[10px] text-gray-400 truncate flex-1">{op.name}</div>
                    <div className="text-[10px] text-white font-bold">{op.games}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Win rates */}
            <div className="space-y-2">
              {OPENING_DATA.slice(0, 4).map((op) => (
                <div key={op.name}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-400">{op.name}</span>
                    <span className="font-bold" style={{ color: op.color }}>
                      {op.winRate}% wins
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${op.winRate}%`, background: op.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Style radar + ELO predictor */}
          <div className="lg:col-span-1 space-y-4">
            {/* Style Radar */}
            <div className="glass rounded-2xl p-5 border border-cyan-500/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📊</span>
                <h2 className="font-bold text-white">Style Profile</h2>
              </div>
              <div className="flex items-center gap-4">
                <RadarChart metrics={STYLE_METRICS} />
                <div className="space-y-2 flex-1">
                  {STYLE_METRICS.map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-gray-400">{m.label}</span>
                        <span className="font-bold text-white">{m.value}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ELO predictor demo */}
            <div className="glass rounded-2xl p-5 border border-yellow-500/20 animate-fade-in-delay">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚡</span>
                <h2 className="font-bold text-white">ELO Predictor</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 font-bold">
                  NOVEL
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { opponent: 1500, control: 'Rapid' },
                  { opponent: 1350, control: 'Blitz' },
                  { opponent: 1600, control: 'Bullet' },
                ].map(({ opponent, control }) => {
                  const K = 20;
                  const exp = 1 / (1 + Math.pow(10, (opponent - mockRating) / 400));
                  const win = Math.round(K * (1 - exp));
                  const loss = Math.round(K * (0 - exp));
                  return (
                    <div key={control} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-bold">vs {opponent}</span>
                        <span className="text-gray-500 ml-2">{control}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-emerald-400 font-bold">+{win}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-red-400 font-bold">{loss}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-1 glass rounded-2xl p-5 border border-white/[0.06] animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏅</span>
              <h2 className="font-bold text-white">Achievements</h2>
              <span className="ml-auto text-xs text-gray-400">
                {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.title}
                  className={`rounded-xl p-3 text-center border transition-all duration-300 ${
                    ach.earned
                      ? 'bg-white/[0.06] border-white/[0.12] hover:bg-white/[0.09]'
                      : 'bg-white/[0.02] border-white/[0.04] opacity-40 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-xs font-bold text-white">{ach.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating history chart (static SVG) */}
        <div className="glass rounded-2xl p-5 border border-white/[0.06] animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📈</span>
            <h2 className="font-bold text-white">Rating History</h2>
            <span className="text-emerald-400 text-sm font-bold ml-auto">+{mockRating - 1200} since start</span>
          </div>
          <div className="h-24 flex items-end gap-1">
            {[
              1200, 1215, 1198, 1242, 1260, 1251, 1290, 1310, 1295, 1340, 1362, 1350, 1385, 1412, 1398, 1440, 1460,
              1448, 1482,
            ].map((r, i, arr) => {
              const min = Math.min(...arr);
              const max = Math.max(...arr);
              const h = ((r - min) / (max - min)) * 80 + 10;
              const isLatest = i === arr.length - 1;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${h}%`,
                    background: isLatest
                      ? 'linear-gradient(180deg, #667eea, #764ba2)'
                      : i > arr.length * 0.7
                        ? 'rgba(102,126,234,0.5)'
                        : 'rgba(102,126,234,0.2)',
                  }}
                  title={`${r}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-600">
            <span>Jan</span>
            <span>Mar</span>
            <span>Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
