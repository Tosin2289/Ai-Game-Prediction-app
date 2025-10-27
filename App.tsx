import React, { useState } from 'react';
import Header from './components/Header';
import { ThemeProvider } from './hooks/useTheme';
import type { FixtureResponse, Screen } from './types';
import Home from './views/Home';
import Results from './views/Results';
import About from './views/About';
import PredictionModal from './components/PredictionModal';

const AppContent: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    const [selectedFixture, setSelectedFixture] = useState<FixtureResponse | null>(null);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return <Home onPredictClick={setSelectedFixture} />;
            case 'results':
                return <Results />;
            case 'about':
                return <About />;
            default:
                return <Home onPredictClick={setSelectedFixture} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {renderScreen()}
            </main>
            {selectedFixture && (
                <PredictionModal
                    fixture={selectedFixture}
                    onClose={() => setSelectedFixture(null)}
                />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
