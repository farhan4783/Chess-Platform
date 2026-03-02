import { GradientText } from '@/components/GradientText';
import { useNavigate } from 'react-router-dom';
import { LESSONS } from '../data/lessons';
import { OpeningExplorer } from '../components/OpeningExplorer';

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const LESSON_ICONS = ['♟', '♞', '♝', '♜', '♛', '♚', '⚔️', '🛡️', '🎯', '🧠'];

export const Learn = () => {
  const navigate = useNavigate();
  const lessons = LESSONS.filter((l) => !l.id.startsWith('opening-'));

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 border"
            style={{ background: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.3)', color: '#a78bfa' }}
          >
            📚 LEARNING HUB
          </div>
          <h1 className="text-4xl font-black text-white">
            Level Up Your <GradientText variant="primary">Chess Skills</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">Master chess step by step with interactive lessons and opening theory.</p>
        </div>

        {/* Progress bar (mock) */}
        <div className="glass rounded-xl p-4 mb-8 border border-white/[0.06] animate-slide-up flex items-center gap-4">
          <div className="text-2xl">🏆</div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white font-bold">Learning Progress</span>
              <span className="text-purple-400 font-bold">3 / {lessons.length} Complete</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(3 / Math.max(lessons.length, 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #667eea, #a78bfa)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">📖</span> Lessons
            </h2>
            <div className="space-y-3">
              {lessons.map((lesson, i) => {
                const isComplete = i < 3;
                const isLocked = i > 5;
                const diffKey = lesson.difficulty ?? 'beginner';
                const diffClass = DIFFICULTY_COLORS[diffKey] ?? DIFFICULTY_COLORS.beginner;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && navigate(`/learn/${lesson.id}`)}
                    className={`glass-dark rounded-xl p-4 border border-white/[0.05] animate-fade-in flex items-center gap-4 group
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.04] hover:border-purple-500/20 transition-all duration-300'}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 font-bold
                        ${isComplete ? 'bg-emerald-500/20 border border-emerald-500/30' : isLocked ? 'bg-white/[0.04]' : 'bg-purple-500/15 border border-purple-500/25 group-hover:bg-purple-500/25'}`}
                    >
                      {isComplete ? '✅' : isLocked ? '🔒' : LESSON_ICONS[i % LESSON_ICONS.length]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-bold text-sm ${isComplete ? 'text-gray-400 line-through' : 'text-white group-hover:text-purple-200'}`}
                        >
                          {lesson.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffClass}`}>
                          {lesson.difficulty ?? 'Beginner'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{lesson.description}</p>
                    </div>

                    {/* Arrow */}
                    {!isLocked && (
                      <div className="text-gray-600 group-hover:text-purple-400 transition-colors flex-shrink-0">›</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opening Explorer */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">🗺️</span> Opening Explorer
            </h2>
            <div className="glass rounded-2xl p-4 border border-cyan-500/15 sticky top-4">
              <OpeningExplorer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
