import { GoogleGenAI, Type } from "@google/genai";
import { WIFI_PLANS } from '../constants';
import { AIRecommendation } from '../types';

// Initialize Gemini Client
// IMPORTANT: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPlanRecommendation = async (userDescription: string): Promise<AIRecommendation | null> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, skipping AI recommendation");
    return null;
  }

  const planDescriptions = WIFI_PLANS.map(p => {
    const speedInfo = p.speed ? `, ${p.speed}` : '';
    return `${p.id}: ${p.name} (Rp${p.price}${speedInfo}) - Cocok untuk: ${p.recommendedFor}`;
  }).join('\n');

  const prompt = `
    Kamu adalah asisten penjualan ISP (Internet Service Provider) yang cerdas.
    Analisis kebutuhan pengguna berikut: "${userDescription}".
    
    Berikut adalah daftar paket yang tersedia:
    ${planDescriptions}
    
    Tugasmu:
    1. Pilih SATU paket (id) yang paling cocok.
    2. Berikan alasan singkat dan meyakinkan (maksimal 2 kalimat) dalam bahasa Indonesia yang ramah.
    
    Jawab dalam format JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPlanId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["recommendedPlanId", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const result = JSON.parse(text) as AIRecommendation;
    return result;
  } catch (error) {
    console.error("Error getting recommendation:", error);
    return null;
  }
};