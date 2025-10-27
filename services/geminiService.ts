import { GoogleGenAI, Type } from "@google/genai";
import type { FixtureResponse, PredictionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
        prediction: {
            type: Type.OBJECT,
            properties: {
                winner: {
                    type: Type.STRING,
                    description: "The predicted winner. Must be 'home', 'away', or 'draw'."
                },
                confidence: {
                    type: Type.OBJECT,
                    properties: {
                        home: { type: Type.NUMBER, description: "Win probability for the home team (0-100)." },
                        draw: { type: Type.NUMBER, description: "Draw probability (0-100)." },
                        away: { type: Type.NUMBER, description: "Win probability for the away team (0-100)." }
                    },
                    required: ['home', 'draw', 'away']
                },
                reasoning: {
                    type: Type.STRING,
                    description: "A brief, one-sentence explanation for the prediction."
                }
            },
            required: ['winner', 'confidence', 'reasoning']
        }
    },
    required: ['prediction']
};

function formatMatchHistoryForPrompt(teamName: string, history: FixtureResponse[]): string {
    if (!history || history.length === 0) {
        return `${teamName} has no recent match data available.`;
    }
    const historyStrings = history.slice(0, 5).map(match => {
        const isHome = match.teams.home.name === teamName;
        const opponent = isHome ? match.teams.away.name : match.teams.home.name;
        const homeScore = match.score.fulltime.home;
        const awayScore = match.score.fulltime.away;

        if (homeScore === null || awayScore === null) {
            return `  - Incomplete data vs ${opponent}`;
        }

        let outcome: 'W' | 'D' | 'L';
        if (homeScore === awayScore) {
            outcome = 'D';
        } else if ((isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore)) {
            outcome = 'W';
        } else {
            outcome = 'L';
        }
        return `  - ${outcome} vs ${opponent} (${homeScore} - ${awayScore})`;
    });

    return `${teamName}'s Last ${historyStrings.length} Matches:\n${historyStrings.join('\n')}`;
}


export const getMatchPrediction = async (
    fixture: FixtureResponse,
    homeTeamHistory: FixtureResponse[],
    awayTeamHistory: FixtureResponse[]
): Promise<PredictionResult | null> => {
    try {
        const homeTeamName = fixture.teams.home.name;
        const awayTeamName = fixture.teams.away.name;
        const homeHistoryPrompt = formatMatchHistoryForPrompt(homeTeamName, homeTeamHistory);
        const awayHistoryPrompt = formatMatchHistoryForPrompt(awayTeamName, awayTeamHistory);

        const prompt = `
You are PriFoot, a sophisticated football match prediction expert. Analyze the provided data to predict the outcome of the upcoming match.

Match Details:
- Home Team: ${homeTeamName}
- Away Team: ${awayTeamName}
- Competition: ${fixture.league.name}

Recent Form:
${homeHistoryPrompt}

${awayHistoryPrompt}

Based on this recent form, team names, and the home advantage for ${homeTeamName}, predict the outcome. The sum of probabilities for home, draw, and away must be 100.
Return your prediction in the specified JSON format.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: predictionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText) as PredictionResult;
        return parsedJson;

    } catch (error) {
        console.error("Error getting prediction from Gemini:", error);
        return null;
    }
};
