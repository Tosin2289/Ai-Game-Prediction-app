export interface FixtureResponse {
  fixture: {
    id: number;
    date: string;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    round: string;
    logo: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface PredictionResult {
  prediction: {
    winner: string; // 'home', 'away', or 'draw'
    confidence: {
      home: number;
      draw: number;
      away: number;
    };
    reasoning: string;
  };
}

export type Screen = 'home' | 'results' | 'about';
