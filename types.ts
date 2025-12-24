export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  league: string;
  position: 'FW' | 'MF' | 'DF' | 'GK';
  age: number;
  matches_played: number;
  minutes: number;
  // Attacking
  goals: number;
  assists: number;
  xG: number; // Expected Goals
  xA: number; // Expected Assists
  npxG: number; // Non-penalty xG
  psxG: number; // Post-Shot Expected Goals (Shooting skill)
  shots_total: number;
  shots_on_target: number;
  // Possession / Creation
  sca: number; // Shot-Creating Actions
  gca: number; // Goal-Creating Actions
  progressive_passes: number;
  progressive_carries: number;
  progressive_received: number; // Progressive Passes Received
  key_passes: number;
  pass_completion_rate: number;
  touches_att_pen: number; // Touches in attacking penalty area
  dribbles_completed_pct: number;
  // Defensive / Work Rate
  tackles: number;
  tackles_won_pct: number;
  interceptions: number;
  blocks: number;
  clearances: number;
  pressures: number;
  pressure_regains: number;
  aerials_won_pct: number;
  // ML / Advanced
  potential_score: number; // 0-99
  season: string;
}

export interface ShotEvent {
  id: number;
  x: number; // 0-100
  y: number; // 0-100
  outcome: 'Goal' | 'Saved' | 'Missed' | 'Blocked';
  xg: number;
  player: string;
  minute: number;
}

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  momentum: { minute: number; value: number }[]; // Value > 0 home dominance, < 0 away
  shots: ShotEvent[];
}

export interface MatchPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeWinProb: number; // 0-1
  drawProb: number; // 0-1
  awayWinProb: number; // 0-1
  predictedScore: string;
  confidence: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLAYER_PERFORMANCE = 'PLAYER_PERFORMANCE',
  COMPARISON = 'COMPARISON',
  SCOUTING = 'SCOUTING',
  MATCH_ANALYSIS = 'MATCH_ANALYSIS',
  PREDICTIONS = 'PREDICTIONS',
}