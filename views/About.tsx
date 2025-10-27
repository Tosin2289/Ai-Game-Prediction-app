import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

const About: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8 text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About PriFoot</h1>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-left space-y-4">
                <h2 className="text-xl font-semibold">How It Works</h2>
                <p>
                    PriFoot leverages the power of Google's Gemini AI to analyze football matches. For each upcoming game, we gather recent performance data for both teams, including wins, losses, draws, and scores.
                </p>
                <p>
                    This statistical data, along with context like home-field advantage, is fed into our AI model. The model then generates a prediction for the match outcome (Home Win, Draw, or Away Win) along with confidence probabilities for each result.
                </p>

                <h2 className="text-xl font-semibold">Data Source</h2>
                <p>
                    All live fixtures, team information, and match results are provided by <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">API-Football</a>. We are grateful for their comprehensive and reliable football data.
                </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default About;
