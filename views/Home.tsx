import React, { useState, useMemo } from 'react';
import useApiFootball from '../hooks/useApiFootball';
import type { FixtureResponse } from '../types';
import MatchCard from '../components/MatchCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

interface HomeProps {
    onPredictClick: (fixture: FixtureResponse) => void;
}

const Home: React.FC<HomeProps> = ({ onPredictClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Fetching a popular, completed season (Premier League 2023) for reliable demo data.
    // League ID 39 is the English Premier League.
    const { data: fixtures, isLoading, error } = useApiFootball<FixtureResponse[]>(
        `fixtures?league=39&season=2023`
    );

    const filteredFixtures = useMemo(() => {
        if (!fixtures) return [];
        return fixtures.filter(fixture =>
            fixture.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fixture.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fixture.league.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            const dateA = new Date(a.fixture.date);
            const dateB = new Date(b.fixture.date);
            return dateA.getTime() - dateB.getTime();
        });
    }, [fixtures, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered predictions for the beautiful game</p>
            </div>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {isLoading && <Loader />}
            
            {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">Error fetching fixtures: {error}</div>}

            {!isLoading && !error && (
                filteredFixtures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFixtures.map(fixture => (
                            <MatchCard key={fixture.fixture.id} fixture={fixture} onPredictClick={onPredictClick} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">{searchTerm ? 'No matches found for your search.' : 'No upcoming fixtures found.'}</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Home;