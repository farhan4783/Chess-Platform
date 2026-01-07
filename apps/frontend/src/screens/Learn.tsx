import { useNavigate } from 'react-router-dom';
import { LESSONS } from '../data/lessons';
import { OpeningExplorer } from '../components/OpeningExplorer';

export const Learn = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Learning Hub</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Lessons</h2>
            <div className="grid gap-4">
              {LESSONS.filter((l) => !l.id.startsWith('opening-')).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/learn/${lesson.id}`)}
                  className="bg-bgAuxiliary2 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-green-500">{lesson.title}</h3>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{lesson.difficulty}</span>
                  </div>
                  <p className="text-gray-400">{lesson.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Opening Explorer</h2>
            <OpeningExplorer />
          </div>
        </div>
      </div>
    </div>
  );
};
