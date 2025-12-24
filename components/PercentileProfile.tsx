import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { PlayerStats } from '../types';

interface PercentileProfileProps {
  player: PlayerStats;
  allPlayers: PlayerStats[];
}

export const PercentileProfile: React.FC<PercentileProfileProps> = ({ player, allPlayers }) => {
  // Filter for players in similar position for fair comparison
  const peerGroup = allPlayers.filter(p => p.position === player.position);

  const calculatePercentile = (key: keyof PlayerStats, value: number) => {
    if (peerGroup.length <= 1) return 100;
    const values = peerGroup.map(p => p[key] as number).sort((a, b) => a - b);
    const rank = values.findIndex(v => v >= value);
    return Math.round(((rank + 1) / values.length) * 100);
  };

  // Metrics to analyze based on position
  const metrics = [
    { label: 'npxG', key: 'npxG' },
    { label: 'xA', key: 'xA' },
    { label: 'SCA', key: 'sca' },
    { label: 'Prog Passes', key: 'progressive_passes' },
    { label: 'Prog Carries', key: 'progressive_carries' },
    { label: 'Touches Box', key: 'touches_att_pen' },
    { label: 'Tackles', key: 'tackles' },
    { label: 'Interceptions', key: 'interceptions' },
    { label: 'Aerial %', key: 'aerials_won_pct' },
    { label: 'Pressures', key: 'pressures' },
  ];

  const data = metrics.map(m => ({
    name: m.label,
    percentile: calculatePercentile(m.key as keyof PlayerStats, player[m.key as keyof PlayerStats] as number),
    value: player[m.key as keyof PlayerStats]
  }));

  return (
    <div className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4 px-2">
         <h3 className="font-bold text-slate-200">Percentile Rank vs {player.position}s</h3>
         <span className="text-xs text-slate-500">Sample: {peerGroup.length} players</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip 
             cursor={{fill: '#1e293b'}}
             content={({ active, payload }) => {
                if (active && payload && payload.length) {
                   const d = payload[0].payload;
                   return (
                      <div className="bg-slate-800 border border-slate-700 p-2 rounded text-xs text-white z-50 shadow-xl">
                         <span className="font-bold block mb-1">{d.name}</span>
                         Raw Value: {d.value}<br/>
                         Percentile: <span className="text-emerald-400 font-bold">{d.percentile}th</span>
                      </div>
                   )
                }
                return null;
             }}
          />
          <Bar dataKey="percentile" barSize={12} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                   entry.percentile >= 90 ? '#10b981' : // Emerald
                   entry.percentile >= 70 ? '#3b82f6' : // Blue
                   entry.percentile >= 40 ? '#f59e0b' : // Amber
                   '#ef4444' // Red
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};