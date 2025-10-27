import React from 'react';
import type { Screen } from '../types';

interface HeaderProps {
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
    label: string;
    screen: Screen;
    currentScreen: Screen;
    onClick: (screen: Screen) => void;
}> = ({ label, screen, currentScreen, onClick }) => {
    const isActive = currentScreen === screen;
    return (
        <button
            onClick={() => onClick(screen)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentScreen, setCurrentScreen }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                           <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.73 14.842a.75.75 0 0 1 1.059-.03l1.461 1.144a.75.75 0 0 0 .9 0l1.46-1.144a.75.75 0 1 1 1.03 1.088l-1.46 1.144a2.25 2.25 0 0 1-2.7 0l-1.46-1.144a.75.75 0 0 1-.03-1.058Zm-2.67-4.498a.75.75 0 0 1 1.03-1.088l1.83 2.34a.75.75 0 0 0 .9 0l1.83-2.34a.75.75 0 1 1 1.03 1.088L11.7 13.04a2.25 2.25 0 0 1-2.7 0L6.06 10.344Z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-xl ml-2 text-gray-900 dark:text-white">PriFoot</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <NavItem label="Home" screen="home" currentScreen={currentScreen} onClick={setCurrentScreen} />
                        <NavItem label="Results" screen="results" currentScreen={currentScreen} onClick={setCurrentScreen} />
                        <NavItem label="About" screen="about" currentScreen={currentScreen} onClick={setCurrentScreen} />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;