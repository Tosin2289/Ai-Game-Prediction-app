import React, { useState, useEffect, useMemo } from 'react';
import type { FixtureResponse } from '../types';
import Loader from '../components/Loader';
import { API_FOOTBALL_URL, API_FOOTBALL_KEY } from '../constants';

const LiveIndicator: React.FC<{ elapsed: number | null }> = ({ elapsed }) => (
    <div className="flex items-center space-x-1 text-green-500">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-bold">{elapsed}'</span>
    </div>
);

const Results: React.FC = () => {
    const [data, setData] = useState<FixtureResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const endpoint = 'fixtures?live=all';

    const fetchResults = async (isPolling = false) => {
        if (API_FOOTBALL_KEY === 'YOUR_API_KEY_HERE') {
            setError('Please provide your API-Football key in constants.ts');
            setIsLoading(false);
            return;
        }

        if (!isPolling) setIsLoading(true);
        setError(null);
        try {
            const fullUrl = `${API_FOOTBALL_URL}${endpoint}`;
            const response = await fetch(fullUrl, {
                headers: {
                    'x-rapidapi-key': API_FOOTBALL_KEY,
                    'x-rapidapi-host': 'v3.football.api-sports.io'
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();

            if (json.response) {
                setData(json.response);
            } else {
                 if(!isPolling) throw new Error('API request was not successful.');
            }
        } catch (e: any) {
            if(!isPolling) setError(e.message);
        } finally {
            if (!isPolling) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(false);
        const intervalId = setInterval(() => fetchResults(true), 30000);
        return () => clearInterval(intervalId);
    }, []);

    const sortedMatches = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());
    }, [data]);

    return (
        <div className="space-y-6">
             <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Results</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Live scores from around the world, updated automatically</p>
            </div>
            
            {isLoading && <Loader />}
            
            {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">Error fetching results: {error}</div>}

            {!isLoading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedMatches.length > 0 ? sortedMatches.map(match => (
                          <li key={match.fixture.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-3 w-2/5 justify-end">
                                      <span className="font-semibold text-right hidden sm:inline">{match.teams.home.name}</span>
                                      <span className="font-semibold text-right sm:hidden truncate">{match.teams.home.name}</span>
                                      <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-6 h-6 object-contain"/>
                                  </div>
                                  
                                  <div className="flex flex-col items-center">
                                      <span className="text-base font-bold text-blue-600 dark:text-blue-400 px-3">
                                        {match.goals.home ?? '-'} : {match.goals.away ?? '-'}
                                      </span>
                                      {(match.fixture.status.short !== 'FT' && match.fixture.status.short !== 'PST') && (
                                        <LiveIndicator elapsed={match.fixture.status.elapsed} />
                                      )}
                                  </div>

                                  <div className="flex items-center space-x-3 w-2/5 justify-start">
                                      <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-6 h-6 object-contain"/>
                                      <span className="font-semibold hidden sm:inline">{match.teams.away.name}</span>
                                      <span className="font-semibold sm:hidden truncate">{match.teams.away.name}</span>
                                  </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center truncate">
                                  {match.league.name} - {new Date(match.fixture.date).toLocaleDateString()}
                              </div>
                          </li>
                      )) : <li className="p-4 text-center text-gray-500">No live matches currently.</li>}
                  </ul>
              </div>
            )}
        </div>
    );
};

export default Results;
