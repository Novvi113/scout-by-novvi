import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  LineChart, 
  Trophy, 
  ArrowRightLeft,
  Activity,
  ChevronRight,
  Menu,
  X,
  BrainCircuit,
  Filter,
  BarChart3
} from 'lucide-react';
import { AppView, PlayerStats } from './types';
import { PLAYERS, MOCK_MATCH, MATCH_PREDICTIONS } from './constants';
import { generateScoutingReport } from './services/geminiService';
import { PitchVisualizer } from './components/PitchVisualizer';
import { RadarComparison } from './components/RadarComparison';
import { ScatterMetrics } from './components/ScatterMetrics';
import { PercentileProfile } from './components/PercentileProfile';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [comparisonPlayers, setComparisonPlayers] = useState<{ p1: PlayerStats | null, p2: PlayerStats | null }>({ p1: PLAYERS[0], p2: PLAYERS[1] });
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Filters
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('23/24');

  // Derived Data
  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter(p => {
      if (selectedLeague !== 'All' && p.league !== selectedLeague) return false;
      if (p.season !== selectedSeason) return false;
      return true;
    });
  }, [selectedLeague, selectedSeason]);

  const uniqueLeagues = useMemo(() => ['All', ...Array.from(new Set(PLAYERS.map(p => p.league)))], []);
  const uniqueSeasons = useMemo(() => Array.from(new Set(PLAYERS.map(p => p.season))), []);

  // --- Handlers ---

  const handleGenerateReport = async (player: PlayerStats) => {
    setIsGeneratingReport(true);
    setAiReport('');
    const report = await generateScoutingReport(player);
    setAiReport(report);
    setIsGeneratingReport(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        currentView === view 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      <Icon size={20} className={currentView === view ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-200'} />
      <span className="font-medium">{label}</span>
      {currentView === view && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex overflow-hidden font-sans">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-200 border border-slate-700"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ScoutVision<span className="text-blue-500">Pro</span></h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider">STATS & AI</p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Filter size={12} /> Data Filters
             </div>
             <div className="space-y-2">
                <select 
                  value={selectedLeague} 
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs text-white px-3 py-2 focus:ring-1 focus:ring-blue-500"
                >
                   {uniqueLeagues.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs text-white px-3 py-2 focus:ring-1 focus:ring-blue-500"
                >
                   {uniqueSeasons.map(s => <option key={s} value={s}>Season {s}</option>)}
                </select>
             </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-4">Modules</div>
            <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={AppView.PLAYER_PERFORMANCE} icon={BarChart3} label="Player Performance" />
            <NavItem view={AppView.SCOUTING} icon={Search} label="Scouting Network" />
            <NavItem view={AppView.COMPARISON} icon={ArrowRightLeft} label="Player Comparison" />
            
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-4 mt-6">Intelligence</div>
            <NavItem view={AppView.MATCH_ANALYSIS} icon={LineChart} label="Match Analysis" />
            <NavItem view={AppView.PREDICTIONS} icon={BrainCircuit} label="AI Predictions" />
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-800">
             <div className="flex items-center gap-2 text-[10px] text-slate-600 justify-center">
                <span>Powered by</span>
                <span className="font-bold text-slate-500">StatsBomb</span>
                <span>•</span>
                <span className="font-bold text-slate-500">Wyscout</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-950/50 scroll-smooth">
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentView === AppView.DASHBOARD && 'Executive Dashboard'}
              {currentView === AppView.PLAYER_PERFORMANCE && 'Player Performance Analysis'}
              {currentView === AppView.SCOUTING && 'Scouting Reports'}
              {currentView === AppView.COMPARISON && 'Compare Players'}
              {currentView === AppView.MATCH_ANALYSIS && 'Match Day Analytics'}
              {currentView === AppView.PREDICTIONS && 'Deep Learning Models'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-sm text-slate-500">Season {selectedSeason}</span>
               {selectedLeague !== 'All' && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">{selectedLeague}</span>}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <BrainCircuit size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-400">ML Model v4.2 Active</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold hover:bg-slate-700 cursor-pointer">
               JS
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-24">
          
          {/* DASHBOARD VIEW */}
          {currentView === AppView.DASHBOARD && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Players', val: filteredPlayers.length, change: 'Filtered', color: 'blue' },
                { label: 'Avg xG (League)', val: (filteredPlayers.reduce((a,b) => a + b.xG, 0) / filteredPlayers.length || 0).toFixed(2), change: '+0.12', color: 'emerald' },
                { label: 'Avg SCA (League)', val: (filteredPlayers.reduce((a,b) => a + b.sca, 0) / filteredPlayers.length || 0).toFixed(1), change: '-1.4', color: 'purple' },
                { label: 'High Potential (>90)', val: filteredPlayers.filter(p => p.potential_score > 90).length, change: 'Targets', color: 'orange' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
                  <p className="text-slate-500 text-sm font-medium mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-white">{stat.val}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-400`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="col-span-1 lg:col-span-4 mt-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Elite Performers (OBV & xG)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-xs text-slate-500 border-b border-slate-800">
                          <th className="py-3 font-semibold uppercase tracking-wider">Player</th>
                          <th className="py-3 font-semibold uppercase tracking-wider">Team</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-right">xG</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-right">xA</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-right">Potential</th>
                          <th className="py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredPlayers.sort((a,b) => b.potential_score - a.potential_score).map(p => (
                          <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/50 group">
                            <td className="py-4 font-medium text-white">{p.name}</td>
                            <td className="py-4 text-slate-400">{p.team}</td>
                            <td className="py-4 text-right text-slate-300">{p.xG}</td>
                            <td className="py-4 text-right text-slate-300">{p.xA}</td>
                            <td className="py-4 text-right">
                               <span className={`px-2 py-1 rounded font-bold text-xs ${p.potential_score >= 95 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                                 {p.potential_score}
                               </span>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedPlayer(p);
                                  setCurrentView(AppView.SCOUTING);
                                }}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLAYER PERFORMANCE VIEW */}
          {currentView === AppView.PLAYER_PERFORMANCE && (
             <div className="space-y-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                   <h3 className="text-lg font-bold text-white mb-2">Attacking Efficiency</h3>
                   <p className="text-sm text-slate-500 mb-6">Comparing Expected Goals (xG) vs Actual Goals scored. Players above the line are overperforming.</p>
                   <ScatterMetrics 
                      players={filteredPlayers} 
                      xKey="xG" 
                      yKey="goals" 
                      xLabel="Expected Goals (xG)" 
                      yLabel="Actual Goals" 
                   />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                   <h3 className="text-lg font-bold text-white mb-2">Creative Output</h3>
                   <p className="text-sm text-slate-500 mb-6">Shot-Creating Actions (SCA) vs Progressive Passes.</p>
                   <ScatterMetrics 
                      players={filteredPlayers} 
                      xKey="progressive_passes" 
                      yKey="sca" 
                      xLabel="Progressive Passes" 
                      yLabel="Shot Creating Actions (SCA)" 
                   />
                </div>
             </div>
          )}

          {/* SCOUTING VIEW */}
          {currentView === AppView.SCOUTING && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* List */}
              <div className="lg:col-span-1 space-y-4">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                   />
                 </div>
                 <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredPlayers.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setSelectedPlayer(p);
                          setAiReport('');
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedPlayer?.id === p.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                      >
                         <div className="flex justify-between items-start">
                           <div>
                             <h4 className={`font-bold ${selectedPlayer?.id === p.id ? 'text-blue-400' : 'text-slate-200'}`}>{p.name}</h4>
                             <p className="text-xs text-slate-500">{p.position} • {p.team}</p>
                           </div>
                           <div className="text-right">
                              <div className="text-xs font-mono text-emerald-400">{(p.goals + p.assists)} G+A</div>
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Detail */}
              <div className="lg:col-span-2">
                {selectedPlayer ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h2 className="text-3xl font-bold text-white">{selectedPlayer.name}</h2>
                             <span className="px-2 py-1 bg-slate-700 rounded text-xs text-white font-bold">{selectedPlayer.position}</span>
                             <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs font-bold">Potential: {selectedPlayer.potential_score}</span>
                          </div>
                          <p className="text-slate-400 text-lg">{selectedPlayer.team} • {selectedPlayer.league}</p>
                        </div>
                        <button 
                          onClick={() => handleGenerateReport(selectedPlayer)}
                          disabled={isGeneratingReport}
                          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-purple-900/20"
                        >
                          {isGeneratingReport ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Users size={18} />
                          )}
                          Generate Report
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-8">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                           <span className="text-xs text-slate-500 uppercase">xG / 90</span>
                           <div className="text-2xl font-bold text-emerald-400">{(selectedPlayer.xG / selectedPlayer.matches_played).toFixed(2)}</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                           <span className="text-xs text-slate-500 uppercase">SCA</span>
                           <div className="text-2xl font-bold text-blue-400">{selectedPlayer.sca}</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                           <span className="text-xs text-slate-500 uppercase">Prog Carries</span>
                           <div className="text-2xl font-bold text-orange-400">{selectedPlayer.progressive_carries}</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                           <span className="text-xs text-slate-500 uppercase">Def Actions</span>
                           <div className="text-2xl font-bold text-red-400">{selectedPlayer.tackles + selectedPlayer.interceptions}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* NEW SECTION: Percentile Rank */}
                    <div className="p-8 border-b border-slate-800">
                        <PercentileProfile player={selectedPlayer} allPlayers={filteredPlayers} />
                    </div>

                    <div className="p-8">
                       {aiReport ? (
                         <div className="prose prose-invert max-w-none animate-fadeIn">
                            <div className="flex items-center gap-2 mb-4 text-purple-400">
                               <BrainCircuit size={20} />
                               <h3 className="text-lg font-bold m-0">Gemini Scout Analysis</h3>
                            </div>
                            <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50 text-slate-300 leading-relaxed whitespace-pre-wrap">
                               {aiReport}
                            </div>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                            <Activity size={48} className="mb-4 opacity-20" />
                            <p>Select a player and click "Generate Report" for AI analysis.</p>
                         </div>
                       )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                    Select a player to view details
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPARISON VIEW */}
          {currentView === AppView.COMPARISON && (
            <div className="space-y-6">
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 w-full">
                     <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Player A</label>
                     <select 
                       className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                       value={comparisonPlayers.p1?.id}
                       onChange={(e) => setComparisonPlayers(prev => ({ ...prev, p1: PLAYERS.find(p => p.id === e.target.value) || null }))}
                     >
                       {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-full border border-slate-700">
                    <ArrowRightLeft className="text-slate-400" size={20} />
                  </div>
                  <div className="flex-1 w-full">
                     <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Player B</label>
                     <select 
                       className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                       value={comparisonPlayers.p2?.id}
                       onChange={(e) => setComparisonPlayers(prev => ({ ...prev, p2: PLAYERS.find(p => p.id === e.target.value) || null }))}
                     >
                       {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                  </div>
               </div>

               {comparisonPlayers.p1 && comparisonPlayers.p2 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                       <RadarComparison player1={comparisonPlayers.p1} player2={comparisonPlayers.p2} />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6">Head-to-Head Metrics</h3>
                        <div className="space-y-4">
                           {[
                             { label: 'Goals', k: 'goals' },
                             { label: 'xG', k: 'xG' },
                             { label: 'Assists', k: 'assists' },
                             { label: 'SCA', k: 'sca' },
                             { label: 'Prog Carries', k: 'progressive_carries' },
                             { label: 'Tackles', k: 'tackles' },
                             { label: 'Potential Score', k: 'potential_score' },
                           ].map((metric) => {
                             const v1 = comparisonPlayers.p1![metric.k as keyof PlayerStats] as number;
                             const v2 = comparisonPlayers.p2![metric.k as keyof PlayerStats] as number;
                             const sum = v1 + v2;
                             const p1Pct = (v1 / sum) * 100;
                             
                             return (
                               <div key={metric.label}>
                                 <div className="flex justify-between text-sm mb-1">
                                    <span className={`font-bold ${v1 > v2 ? 'text-blue-400' : 'text-slate-400'}`}>{v1}</span>
                                    <span className="text-slate-500 uppercase text-xs tracking-wider font-semibold">{metric.label}</span>
                                    <span className={`font-bold ${v2 > v1 ? 'text-emerald-400' : 'text-slate-400'}`}>{v2}</span>
                                 </div>
                                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                                    <div style={{ width: `${p1Pct}%` }} className="bg-blue-600 h-full"></div>
                                    <div style={{ width: `${100 - p1Pct}%` }} className="bg-emerald-600 h-full"></div>
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* MATCH ANALYSIS VIEW */}
          {currentView === AppView.MATCH_ANALYSIS && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                 {/* Pitch */}
                 <div className="lg:w-2/3 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white">{MOCK_MATCH.homeTeam} vs {MOCK_MATCH.awayTeam}</h3>
                            <p className="text-slate-500 text-sm">{MOCK_MATCH.date} • Matchday 23</p>
                          </div>
                          <div className="text-3xl font-mono font-bold text-white tracking-widest bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                             {MOCK_MATCH.homeScore} - {MOCK_MATCH.awayScore}
                          </div>
                       </div>
                       
                       <PitchVisualizer shots={MOCK_MATCH.shots} />
                       
                       <div className="mt-4 flex gap-4 text-sm text-slate-400 justify-center">
                          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Goal</div>
                          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Saved</div>
                          <span>•</span>
                          <span>xG Total: {MOCK_MATCH.shots.reduce((acc, curr) => acc + curr.xg, 0).toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 {/* Momentum */}
                 <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex-1">
                       <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Match Momentum (Attack Index)</h4>
                       <div className="h-[200px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={MOCK_MATCH.momentum}>
                             <defs>
                               <linearGradient id="colorSplit" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="50%" stopColor="#ef4444" stopOpacity={0.7}/>
                                 <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.7}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                             <XAxis dataKey="minute" hide />
                             <YAxis hide domain={[-60, 60]} />
                             <Tooltip 
                               contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                               labelStyle={{ color: '#94a3b8' }}
                             />
                             <Area type="monotone" dataKey="value" stroke="#000" fill="url(#colorSplit)" />
                           </AreaChart>
                         </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex-1">
                      <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Shot Timeline</h4>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                         {MOCK_MATCH.shots.sort((a,b) => b.minute - a.minute).map(shot => (
                           <div key={shot.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 transition-colors">
                              <span className="text-xs font-mono text-slate-500 w-6">{shot.minute}'</span>
                              <div className={`w-2 h-2 rounded-full ${shot.outcome === 'Goal' ? 'bg-yellow-500' : 'bg-slate-600'}`}></div>
                              <div className="flex-1">
                                 <div className="text-sm font-medium text-slate-200">{shot.player}</div>
                                 <div className="text-xs text-slate-500">{shot.outcome} • {shot.xg.toFixed(2)} xG</div>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* PREDICTIONS VIEW */}
          {currentView === AppView.PREDICTIONS && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="col-span-full mb-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <BrainCircuit className="text-purple-400" size={24} />
                       <div>
                         <h3 className="text-lg font-bold text-white">Neural Network Predictions</h3>
                         <p className="text-xs text-slate-400">Results generated by Deep Learning Model trained on 10k+ matches</p>
                       </div>
                     </div>
                     <div className="text-right">
                        <span className="block text-xs text-purple-300 font-mono">ACCURACY</span>
                        <span className="text-xl font-bold text-white">87.4%</span>
                     </div>
                  </div>
               </div>
               
               {MATCH_PREDICTIONS.map(prediction => (
                 <div key={prediction.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl">
                       CONFIDENCE: {(prediction.confidence * 100).toFixed(0)}%
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 mt-2">
                       <div className="text-center w-1/3">
                          <div className="font-bold text-lg text-white">{prediction.homeTeam}</div>
                          <div className="text-xs text-slate-500">Home</div>
                       </div>
                       <div className="text-2xl font-bold text-purple-400">
                          {prediction.predictedScore}
                       </div>
                       <div className="text-center w-1/3">
                          <div className="font-bold text-lg text-white">{prediction.awayTeam}</div>
                          <div className="text-xs text-slate-500">Away</div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="flex items-center text-xs text-slate-400 justify-between">
                          <span>Win Probability</span>
                       </div>
                       <div className="h-4 bg-slate-800 rounded-full flex overflow-hidden">
                          <div style={{width: `${prediction.homeWinProb * 100}%`}} className="bg-blue-600 hover:bg-blue-500 transition-colors" title={`Home Win: ${(prediction.homeWinProb*100).toFixed(0)}%`}></div>
                          <div style={{width: `${prediction.drawProb * 100}%`}} className="bg-slate-600 hover:bg-slate-500 transition-colors" title={`Draw: ${(prediction.drawProb*100).toFixed(0)}%`}></div>
                          <div style={{width: `${prediction.awayWinProb * 100}%`}} className="bg-red-600 hover:bg-red-500 transition-colors" title={`Away Win: ${(prediction.awayWinProb*100).toFixed(0)}%`}></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>{(prediction.homeWinProb * 100).toFixed(0)}%</span>
                          <span>{(prediction.drawProb * 100).toFixed(0)}%</span>
                          <span>{(prediction.awayWinProb * 100).toFixed(0)}%</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;