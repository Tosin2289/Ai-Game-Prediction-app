import React, { useEffect, useState, useMemo } from 'react';
import type { FixtureResponse, PredictionResult } from '../types';
import { getMatchPrediction } from '../services/geminiService';
import useApiFootball from '../hooks/useApiFootball';
import Loader from './Loader';

interface PredictionModalProps {
    fixture: FixtureResponse;
    onClose: () => void;
}

const PredictionBar: React.FC<{ label: string; percentage: number; color: string }> = ({ label, percentage, color }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div className={`${color} h-4 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const PredictionModal: React.FC<PredictionModalProps> = ({ fixture, onClose }) => {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const homeTeamId = fixture.teams.home.id;
    const awayTeamId = fixture.teams.away.id;
    const season = new Date(fixture.fixture.date).getFullYear();

    const { data: homeTeamHistory, isLoading: isLoadingHomeHistory, error: homeHistoryError } = useApiFootball<FixtureResponse[]>(`fixtures?team=${homeTeamId}&season=${season}&last=5`);
    const { data: awayTeamHistory, isLoading: isLoadingAwayHistory, error: awayHistoryError } = useApiFootball<FixtureResponse[]>(`fixtures?team=${awayTeamId}&season=${season}&last=5`);
    
    useEffect(() => {
        const anyLoading = isLoadingHomeHistory || isLoadingAwayHistory;
        if (anyLoading) return;

        const anyError = homeHistoryError || awayHistoryError;
        if (anyError) {
             setError(`Error fetching match history: ${anyError}`);
             setIsLoadingPrediction(false);
             return;
        }

        const fetchPrediction = async () => {
            setIsLoadingPrediction(true);
            setError(null);
            try {
                // Ensure data is not null before proceeding
                if (homeTeamHistory && awayTeamHistory) {
                    const result = await getMatchPrediction(fixture, homeTeamHistory, awayTeamHistory);
                    if (result) {
                        setPrediction(result);
                    } else {
                        setError('Could not generate prediction. The AI model may be temporarily unavailable.');
                    }
                } else {
                    setError('Missing match history data for one or both teams.');
                }
            } catch (err) {
                setError('An unexpected error occurred while generating the prediction.');
            } finally {
                setIsLoadingPrediction(false);
            }
        };

        fetchPrediction();
    }, [fixture, homeTeamHistory, awayTeamHistory, isLoadingHomeHistory, isLoadingAwayHistory, homeHistoryError, awayHistoryError]);

    const winnerText = useMemo(() => {
        if (!prediction) return 'Analyzing...';
        const { winner } = prediction.prediction;
        if (winner.toLowerCase().includes('home')) return `${fixture.teams.home.name} to Win`;
        if (winner.toLowerCase().includes('away')) return `${fixture.teams.away.name} to Win`;
        return 'Predicted Draw';
    }, [prediction, fixture]);

    const handleShare = async () => {
        if (!prediction) return;
        if (!navigator.share) {
            alert('Web Share API is not supported in your browser.');
            return;
        }
        
        const shareData = {
            title: 'PriFoot AI Prediction',
            text: `🔮 PriFoot AI Prediction: ${fixture.teams.home.name} vs ${fixture.teams.away.name}\n\n🏆 Predicted Outcome: ${winnerText}\n\nConfidence:\n- ${fixture.teams.home.name}: ${Math.round(prediction.prediction.confidence.home)}%\n- Draw: ${Math.round(prediction.prediction.confidence.draw)}%\n- ${fixture.teams.away.name}: ${Math.round(prediction.prediction.confidence.away)}%\n\n"${prediction.prediction.reasoning}"\n\n#PriFoot #AIPredictions #Football`,
        };

        try {
            await navigator.share(shareData);
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Error sharing prediction:', err);
                alert('An error occurred while sharing.');
            }
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all duration-300 ease-out scale-95 animate-scale-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Prediction</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{fixture.league.name}</p>
                </div>

                <div className="flex justify-between items-center text-center mb-8">
                    <div className="flex flex-col items-center w-1/3">
                        <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="w-20 h-20 mb-2 object-contain" />
                        <span className="font-semibold">{fixture.teams.home.name}</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-400 dark:text-gray-500">VS</div>
                    <div className="flex flex-col items-center w-1/3">
                        <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="w-20 h-20 mb-2 object-contain" />
                        <span className="font-semibold">{fixture.teams.away.name}</span>
                    </div>
                </div>

                {isLoadingHomeHistory || isLoadingAwayHistory || isLoadingPrediction ? (
                    <div className="h-48 flex flex-col items-center justify-center">
                        <Loader />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing team data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                        {error}
                    </div>
                ) : prediction && (
                    <div className="space-y-4 text-center animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{winnerText}</h3>
                        <div className="space-y-3 pt-2">
                            <PredictionBar label={fixture.teams.home.name} percentage={prediction.prediction.confidence.home} color="bg-green-500" />
                            <PredictionBar label="Draw" percentage={prediction.prediction.confidence.draw} color="bg-yellow-500" />
                            <PredictionBar label={fixture.teams.away.name} percentage={prediction.prediction.confidence.away} color="bg-red-500" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4 italic">
                            &ldquo;{prediction.prediction.reasoning}&rdquo;
                        </p>

                        {navigator.share && (
                             <div className="pt-4">
                                <button
                                    onClick={handleShare}
                                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                    <span>Share Prediction</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
             <style>{`
                @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in-fast { from { background-color: rgba(0,0,0,0); } to { background-color: rgba(0,0,0,0.7); } }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default PredictionModal;