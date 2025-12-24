import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Label } from 'recharts';
import { PlayerStats } from '../types';

interface ScatterMetricsProps {
  players: PlayerStats[];
  xKey: keyof PlayerStats;
  yKey: keyof PlayerStats;
  xLabel: string;
  yLabel: string;
}

export const ScatterMetrics: React.FC<ScatterMetricsProps> = ({ players, xKey, yKey, xLabel, yLabel }) => {
  const data = players.map(p => ({
    x: p[xKey] as number,
    y: p[yKey] as number,
    name: p.name,
    team: p.team,
    position: p.position
  }));

  return (
    <div className="w-full h-[500px] bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h3 className="text-center text-slate-300 font-semibold mb-4">{yLabel} vs {xLabel}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" dataKey="x" name={xLabel} stroke="#94a3b8" tick={{fill: '#94a3b8'}}>
            <Label value={xLabel} offset={-10} position="insideBottom" fill="#94a3b8" />
          </XAxis>
          <YAxis type="number" dataKey="y" name={yLabel} stroke="#94a3b8" tick={{fill: '#94a3b8'}}>
             <Label value={yLabel} angle={-90} position="insideLeft" fill="#94a3b8" offset={10} />
          </YAxis>
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 border border-slate-700 p-2 rounded text-xs text-white shadow-xl">
                    <p className="font-bold">{data.name}</p>
                    <p className="text-slate-400">{data.team} ({data.position})</p>
                    <p>{xLabel}: {data.x}</p>
                    <p>{yLabel}: {data.y}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Players" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.position === 'FW' ? '#ef4444' : entry.position === 'MF' ? '#3b82f6' : '#10b981'} 
                fillOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> FW</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> MF</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> DF</div>
      </div>
    </div>
  );
};