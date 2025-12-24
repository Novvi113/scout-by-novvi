import { GoogleGenAI } from "@google/genai";
import { PlayerStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateScoutingReport = async (player: PlayerStats): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key missing. Please configure the environment.";
  }

  const prompt = `
    Act as a world-class football scout (StatsBomb/Wyscout expert).
    Analyze the player: ${player.name} (${player.position}, ${player.team}, ${player.age}yo, Season: ${player.season}).
    
    DEEP METRICS PROVIDED:
    - Attacking: Goals ${player.goals} (xG ${player.xG}, npxG ${player.npxG}, PSxG ${player.psxG}).
    - Creation: Assists ${player.assists} (xA ${player.xA}), SCA ${player.sca}, GCA ${player.gca}.
    - Possession: Prog Passes ${player.progressive_passes}, Prog Carries ${player.progressive_carries}, Prog Received ${player.progressive_received}.
    - Box Presence: Touches in Box ${player.touches_att_pen}.
    - Defense/Workrate: Pressures ${player.pressures} (Regains ${player.pressure_regains}), Tackles ${player.tackles} (Win% ${player.tackles_won_pct}), Int ${player.interceptions}.
    - Technique: Pass % ${player.pass_completion_rate}, Dribble % ${player.dribbles_completed_pct}.
    
    Provide a professional scouting report in Markdown:
    1. **Archetype Analysis**: Define his specific role (e.g. "Mezzala", "Target Man", "Inverted Wingback") using the metrics.
    2. **Elite Traits**: What separates him? (e.g., if PSxG > xG -> "Elite Finisher").
    3. **Areas for Improvement**: Statistical weaknesses.
    4. **Tactical Fit**: Best system/formation for him.
    
    Keep it analytical, concise, and use the data provided to justify points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate report.";
  } catch (error) {
    console.error("Error generating scouting report:", error);
    return "Error connecting to AI Scout service. Please check your API key.";
  }
};