import React from 'react';
import type { FixtureResponse } from '../types';

interface MatchCardProps {
    fixture: FixtureResponse;
    onPredictClick: (fixture: FixtureResponse) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ fixture, onPredictClick }) => {
    const kickoffDate = new Date(fixture.fixture.date);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div>
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
                    {fixture.league.name} - {kickoffDate.toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center text-center">
                    <div className="flex flex-col items-center w-2/5">
                        <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="w-12 h-12 mb-2 object-contain" />
                        <span className="font-semibold text-sm">{fixture.teams.home.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                        {kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex flex-col items-center w-2/5">
                        <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="w-12 h-12 mb-2 object-contain" />
                        <span className="font-semibold text-sm">{fixture.teams.away.name}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onPredictClick(fixture)}
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
                Predict
            </button>
        </div>
    );
};

export default MatchCard;
