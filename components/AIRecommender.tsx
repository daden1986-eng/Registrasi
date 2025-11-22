import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { getPlanRecommendation } from '../services/geminiService';
import { AIRecommendation } from '../types';

interface AIRecommenderProps {
  onRecommendation: (rec: AIRecommendation) => void;
}

export const AIRecommender: React.FC<AIRecommenderProps> = ({ onRecommendation }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPlanRecommendation(input);
      if (result) {
        onRecommendation(result);
      } else {
        setError('Maaf, AI sedang sibuk. Silakan pilih paket secara manual.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-brand-800 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-10 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-300 animate-pulse" />
          <h2 className="text-xl font-bold">Bingung Pilih Paket? Tanya AI Damar Global Network!</h2>
        </div>
        
        <p className="text-indigo-100 mb-6 max-w-2xl">
          Ceritakan kebutuhan internetmu (contoh: "Saya sering main game online dan ada 3 orang di rumah yang suka nonton YouTube"). Kami akan pilihkan yang terbaik.
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Jelaskan penggunaan internetmu..."
            className="flex-grow bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
          />
          <button
            onClick={handleRecommend}
            disabled={isLoading || !input.trim()}
            className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} />
                <span>Analisa</span>
              </>
            )}
          </button>
        </div>
        {error && (
            <p className="mt-3 text-red-300 text-sm bg-red-900/30 p-2 rounded inline-block">{error}</p>
        )}
      </div>
    </div>
  );
};