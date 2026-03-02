import { PlayCard } from '@/components/Card';
import { Footer } from '@/components/Footer';
import { GradientText } from '@/components/GradientText';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Animated counter hook
function useCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

const USP_FEATURES = [
  {
    icon: '🧠',
    title: 'Tilt Meter',
    description:
      "Real-time stress tracking detects when you're on a blunder streak and warns you before you make costly mistakes.",
    badge: 'Exclusive',
    color: 'border-red-500/30',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
  },
  {
    icon: '🎤',
    title: 'AI Coach Panel',
    description:
      'Get contextual coaching tips after every move — castling advice, tactical threats, endgame guidance — all inline.',
    badge: 'Exclusive',
    color: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
  },
  {
    icon: '🧬',
    title: 'Opening DNA',
    description:
      'Discover your chess identity — your top openings, style radar, aggression score, and tactical complexity profile.',
    badge: 'Exclusive',
    color: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
  },
  {
    icon: '⚡',
    title: 'ELO Predictor',
    description:
      'Know your expected rating change before the game even starts. Calculated from opponent rating, your streak, and time control.',
    badge: 'Novel',
    color: 'border-yellow-500/30',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
  },
  {
    icon: '🧩',
    title: 'Daily Challenge',
    description:
      'A fresh tactical puzzle every day seeded uniquely by date. Track your streak, rating progress, and solve history.',
    badge: 'Daily',
    color: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
  },
  {
    icon: '🏆',
    title: 'Career Mode',
    description:
      'Gamified progression from 800 to Grandmaster with AI personalities, story arcs, and milestone rewards.',
    badge: 'Coming Soon',
    color: 'border-orange-500/30',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
  },
];

const PLATFORM_FEATURES = [
  { icon: '🌐', title: 'Real-time Multiplayer', desc: 'WebSocket-powered instant matchmaking' },
  { icon: '🤖', title: 'Stockfish AI', desc: 'Play against world-class engine at any level' },
  { icon: '⏱️', title: 'Multiple Time Controls', desc: 'Bullet, Blitz, Rapid & Classical' },
  { icon: '👥', title: 'Chess Clubs', desc: 'Create communities and host intra-club events' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Opening explorer, accuracy scores, rating graphs' },
  { icon: '📚', title: 'Interactive Lessons', desc: 'Step-by-step lessons from beginner to expert' },
];

export const Landing = () => {
  const navigate = useNavigate();
  const players = useCounter(12847, 2000);
  const games = useCounter(58230, 2000);
  const puzzles = useCounter(1200000, 2000);
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AnimatedBackground />

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Hero content */}
            <div className="text-center lg:text-left space-y-7 animate-fade-in">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
                style={{
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))',
                  borderColor: 'rgba(102,126,234,0.4)',
                  color: '#a78bfa',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />✨ AI-Powered Chess Platform — 5
                Exclusive Features
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                  Master Chess
                  <br />
                  <GradientText variant="primary" className="block">
                    Like Never Before
                  </GradientText>
                </h1>
                <p className="text-lg lg:text-xl text-gray-400 max-w-xl leading-relaxed">
                  The only chess platform with <span className="text-red-400 font-semibold">Tilt Detection</span>,{' '}
                  <span className="text-emerald-400 font-semibold">AI Coaching</span>, and{' '}
                  <span className="text-yellow-400 font-semibold">ELO Prediction</span> built right in.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button variant="primary" size="lg" onClick={() => navigate('/game/random')} className="shadow-glow">
                  🚀 Play Online — Free
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/puzzles')}>
                  ⚡ Daily Challenge
                </Button>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { value: `${(players / 1000).toFixed(1)}K`, label: 'Active Players', color: 'text-purple-400' },
                  { value: `${(games / 1000).toFixed(1)}K`, label: 'Games Today', color: 'text-cyan-400' },
                  { value: `${(puzzles / 1000000).toFixed(1)}M+`, label: 'Puzzles Solved', color: 'text-yellow-400' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 border border-white/[0.06]"
                  >
                    <div className={`text-2xl lg:text-3xl font-black ${stat.color} animate-counter`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Play Card */}
            <div className="animate-slide-up">
              <PlayCard />
            </div>
          </div>
        </div>
      </div>

      {/* ===== USP FEATURES SECTION ===== */}
      <div className="relative py-24 px-4">
        {/* Section bg accent */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(102,126,234,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5 border"
              style={{
                background: 'rgba(239,68,68,0.12)',
                borderColor: 'rgba(239,68,68,0.3)',
                color: '#f87171',
              }}
            >
              🚀 WHAT ONLY WE OFFER
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              5 Features <GradientText variant="primary">No Other Platform Has</GradientText>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We've solved the problems chess.com and Lichess haven't touched yet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {USP_FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className={`glass rounded-2xl p-6 ${feat.glow} transition-all duration-300 border animate-fade-in cursor-default group`}
                style={{
                  borderColor: feat.color.replace('border-', '').replace('/30', ''),
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{feat.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-primary transition-all">
                  {feat.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PLATFORM FEATURES ===== */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-full text-purple-300 text-sm font-semibold mb-4 border border-purple-500/20">
              🎮 FULL FEATURE SET
            </div>
            <h2 className="text-4xl font-black text-white mb-3">
              Everything You Need to <GradientText variant="primary">Improve</GradientText>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="glass-dark rounded-xl p-5 flex items-start gap-4 hover:bg-white/[0.04] transition-all duration-300 animate-fade-in border border-white/[0.04]"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <span className="text-3xl flex-shrink-0">{feat.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))',
              borderColor: 'rgba(102,126,234,0.3)',
            }}
          >
            {/* Glow orb */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 -z-10 opacity-40"
              style={{
                background: 'radial-gradient(ellipse, rgba(102,126,234,0.4), transparent)',
                filter: 'blur(40px)',
              }}
            />
            <div className="text-6xl mb-4">♚</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to Level Up
              <br />
              <GradientText variant="primary">Your Chess Game?</GradientText>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of players who train smarter with AI insights and exclusive features unavailable anywhere
              else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="xl" onClick={() => navigate('/game/random')} className="shadow-glow">
                🎮 Start Playing Free
              </Button>
              <Button variant="gold" size="xl" onClick={() => navigate('/game/ai')}>
                🤖 Challenge the AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
