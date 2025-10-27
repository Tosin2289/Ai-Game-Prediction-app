import { useState, useEffect } from 'react';
import { API_FOOTBALL_URL, API_FOOTBALL_KEY } from '../constants';

const cache = new Map<string, any>();

const useApiFootball = <T,>(endpoint: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Do not fetch if the API key is a placeholder
        if (API_FOOTBALL_KEY === 'YOUR_API_KEY_HERE') {
            setError('Please provide your API-Football key in constants.ts');
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            const fullUrl = `${API_FOOTBALL_URL}${endpoint}`;
            if (cache.has(fullUrl)) {
                setData(cache.get(fullUrl));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(fullUrl, {
                    headers: {
                        'x-rapidapi-key': API_FOOTBALL_KEY,
                        'x-rapidapi-host': 'v3.football.api-sports.io'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                if (json.response && json.response.length > 0) {
                    setData(json.response);
                    cache.set(fullUrl, json.response);
                } else if (json.response && json.response.length === 0) {
                    setData([]);
                    cache.set(fullUrl, []);
                } else {
                    const errorMessage = json.errors?.requests || 'API error occurred.';
                    throw new Error(errorMessage);
                }
                
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    return { data, isLoading, error };
};

export default useApiFootball;