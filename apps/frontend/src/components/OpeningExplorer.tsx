import { useNavigate } from 'react-router-dom';
import { LESSONS } from '../data/lessons';

export const OpeningExplorer = () => {
    const navigate = useNavigate();
    const openings = LESSONS.filter(l => l.id.startsWith('opening-'));

    return (
        <div className="bg-bgAuxiliary2 p-4 rounded-md">
            <h3 className="text-xl font-bold text-white mb-4">Popular Openings</h3>
            <div className="space-y-2">
                {openings.map((op) => (
                    <div
                        key={op.id}
                        onClick={() => navigate(`/learn/${op.id}`)}
                        className="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                    >
                        <div className="font-bold text-green-400">{op.title}</div>
                        <div className="text-gray-400 text-xs mt-1">{op.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
