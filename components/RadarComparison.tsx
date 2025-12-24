import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { PlayerStats } from '../types';

interface RadarComparisonProps {
  player1: PlayerStats;
  player2: PlayerStats;
}

export const RadarComparison: React.FC<RadarComparisonProps> = ({ player1, player2 }) => {
  // Normalize data for the radar chart (rough approximation 0-100 scale for viz purposes)
  const normalize = (val: number, max: number) => Math.min(100, Math.max(0, (val / max) * 100));

  const data = [
    { subject: 'Goals', A: normalize(player1.goals, 30), B: normalize(player2.goals, 30), fullMark: 100 },
    { subject: 'xG', A: normalize(player1.xG, 30), B: normalize(player2.xG, 30), fullMark: 100 },
    { subject: 'Assists', A: normalize(player1.assists, 15), B: normalize(player2.assists, 15), fullMark: 100 },
    { subject: 'xA', A: normalize(player1.xA, 15), B: normalize(player2.xA, 15), fullMark: 100 },
    { subject: 'SCA', A: normalize(player1.sca, 150), B: normalize(player2.sca, 150), fullMark: 100 },
    { subject: 'Prog Passes', A: normalize(player1.progressive_passes, 350), B: normalize(player2.progressive_passes, 350), fullMark: 100 },
    { subject: 'Def Actions', A: normalize(player1.tackles + player1.interceptions, 120), B: normalize(player2.tackles + player2.interceptions, 120), fullMark: 100 },
    { subject: 'Aerial %', A: player1.aerials_won_pct, B: player2.aerials_won_pct, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[400px] bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">Statistical Overlap</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={player1.name}
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Radar
            name={player2.name}
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};