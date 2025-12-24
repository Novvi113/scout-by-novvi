import React from 'react';
import { ShotEvent } from '../types';

interface PitchVisualizerProps {
  shots: ShotEvent[];
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ shots }) => {
  return (
    <div className="relative w-full aspect-[105/68] bg-emerald-800 rounded-lg border-2 border-slate-700 overflow-hidden shadow-2xl">
      {/* SVG Pitch */}
      <svg width="100%" height="100%" viewBox="0 0 105 68" className="absolute inset-0">
        {/* Grass Pattern (Optional) */}
        <defs>
          <pattern id="grass" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
             <rect width="10" height="10" fill="#065f46" />
             <path d="M0 10L10 0" stroke="#047857" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="105" height="68" fill="url(#grass)" />

        {/* Outline */}
        <rect x="0" y="0" width="105" height="68" fill="none" stroke="white" strokeWidth="0.5" />
        
        {/* Center Line */}
        <line x1="52.5" y1="0" x2="52.5" y2="68" stroke="white" strokeWidth="0.5" />
        <circle cx="52.5" cy="34" r="9.15" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="52.5" cy="34" r="0.5" fill="white" />

        {/* Penalty Areas */}
        <path d="M0 13.84h16.5v40.32H0" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M105 13.84h-16.5v40.32H105" fill="none" stroke="white" strokeWidth="0.5" />

        {/* Goal Areas */}
        <path d="M0 24.84h5.5v18.32H0" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M105 24.84h-5.5v18.32H105" fill="none" stroke="white" strokeWidth="0.5" />

        {/* Penalty Spots */}
        <circle cx="11" cy="34" r="0.4" fill="white" />
        <circle cx="94" cy="34" r="0.4" fill="white" />

        {/* Arcs */}
        <path d="M16.5 26.5a9.15 9.15 0 0 1 0 15" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M88.5 26.5a9.15 9.15 0 0 0 0 15" fill="none" stroke="white" strokeWidth="0.5" />
        
        {/* Goals */}
        <rect x="-2" y="30.34" width="2" height="7.32" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="105" y="30.34" width="2" height="7.32" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>

      {/* Render Shots */}
      {shots.map((shot) => (
        <div
          key={shot.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 cursor-pointer transition-all hover:scale-150 group`}
          style={{
            left: `${shot.x}%`,
            top: `${shot.y}%`,
            width: `${Math.max(8, shot.xg * 30)}px`,
            height: `${Math.max(8, shot.xg * 30)}px`,
            backgroundColor: shot.outcome === 'Goal' ? '#eab308' : 
                             shot.outcome === 'Saved' ? '#3b82f6' : 
                             shot.outcome === 'Blocked' ? '#a855f7' : '#ef4444',
            opacity: 0.8
          }}
          title={`${shot.player} - ${shot.outcome} (xG: ${shot.xg})`}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-lg border border-slate-700">
            <span className="font-bold">{shot.player}</span><br/>
            {shot.outcome} | {shot.minute}'<br/>
            xG: {shot.xg}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700 text-[10px] text-white flex gap-3">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Goal</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Saved</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Missed</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Blocked</div>
      </div>
    </div>
  );
};