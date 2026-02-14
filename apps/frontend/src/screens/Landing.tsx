import { PlayCard } from '@/components/Card';
import { Footer } from '@/components/Footer';
import { GradientText } from '@/components/GradientText';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="text-center md:text-left space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-semibold mb-4">
                ✨ AI-Powered Chess Platform
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Master Chess with{' '}
                  <GradientText variant="primary" className="block mt-2">
                    AI-Powered Insights
                  </GradientText>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
                  Experience the future of chess training with{' '}
                  <span className="text-gradient-accent font-semibold">emotional analytics</span>,{' '}
                  <span className="text-gradient-gold font-semibold">adaptive puzzles</span>, and{' '}
                  <span className="text-gradient-primary font-semibold">real-time coaching</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="primary" size="lg" onClick={() => navigate('/game/random')} className="shadow-glow">
                  🚀 Start Playing Now
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
                  📚 Explore Features
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center glass rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-gradient-accent">10K+</div>
                  <div className="text-sm text-gray-400 mt-1">Active Players</div>
                </div>
                <div className="text-center glass rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-gradient-gold">50K+</div>
                  <div className="text-sm text-gray-400 mt-1">Games Played</div>
                </div>
                <div className="text-center glass rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-gradient-primary">1M+</div>
                  <div className="text-sm text-gray-400 mt-1">Puzzles Solved</div>
                </div>
              </div>
            </div>

            {/* Right side - Play Card */}
            <div className="animate-slide-up">
              <PlayCard />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-semibold mb-4">
              🎯 ADVANCED FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <GradientText variant="primary">Our Platform</GradientText>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered features designed to accelerate your chess improvement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow transition-all duration-300 animate-fade-in border border-purple-500/20">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-3">Emotional Analytics</h3>
              <p className="text-gray-300 mb-4">
                Track your tilt, panic mode, and performance under time pressure with AI-powered insights.
              </p>
              <div className="text-sm text-purple-300 font-semibold">
                "Your blunders increase 70% when below 2 minutes"
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow-accent transition-all duration-300 animate-fade-in border border-cyan-500/20"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-3">Adaptive Puzzles</h3>
              <p className="text-gray-300 mb-4">
                Custom puzzle sets generated from your weaknesses with ML-powered difficulty scaling.
              </p>
              <div className="text-sm text-cyan-300 font-semibold">50+ custom puzzles for your weak spots</div>
            </div>

            {/* Feature 3 */}
            <div
              className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow transition-all duration-300 animate-fade-in border border-yellow-500/20"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-3">Career Mode</h3>
              <p className="text-gray-300 mb-4">
                Gamified progression from 800 to master level with AI personalities and tournaments.
              </p>
              <div className="text-sm text-yellow-300 font-semibold">Story-driven chess improvement</div>
            </div>

            {/* Feature 4 */}
            <div
              className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow transition-all duration-300 animate-fade-in border border-green-500/20"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-Time AI Coach</h3>
              <p className="text-gray-300 mb-4">
                Get live coaching alerts during games to improve your decision-making.
              </p>
              <div className="text-sm text-green-300 font-semibold">Live feedback as you play</div>
            </div>

            {/* Feature 5 */}
            <div
              className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow transition-all duration-300 animate-fade-in border border-pink-500/20"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-5xl mb-4">🧬</div>
              <h3 className="text-2xl font-bold text-white mb-3">Playing Style DNA</h3>
              <p className="text-gray-300 mb-4">
                Discover your unique playing style with aggression scores and tactical complexity metrics.
              </p>
              <div className="text-sm text-pink-300 font-semibold">Personalized style analysis</div>
            </div>

            {/* Feature 6 */}
            <div
              className="glass rounded-2xl p-8 hover:scale-105 hover:shadow-glow transition-all duration-300 animate-fade-in border border-blue-500/20"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-white mb-3">Social Features</h3>
              <p className="text-gray-300 mb-4">
                Connect with friends, join clubs, and compete in tournaments with live brackets.
              </p>
              <div className="text-sm text-blue-300 font-semibold">Build your chess community</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 border-2 border-purple-500/30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <GradientText variant="primary">Level Up</GradientText> Your Chess?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of players improving their game with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="xl" onClick={() => navigate('/game/random')} className="shadow-glow">
                🎮 Start Playing Free
              </Button>
              <Button variant="gold" size="xl" onClick={() => navigate('/game/ai')}>
                🤖 Challenge AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
