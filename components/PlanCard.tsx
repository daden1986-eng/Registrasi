import React from 'react';
import { WifiPlan } from '../types';
import { Check, Zap, Wifi } from 'lucide-react';

interface PlanCardProps {
  plan: WifiPlan;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isRecommended?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect, isRecommended }) => {
  return (
    <div 
      className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer h-full
        ${isSelected 
          ? 'border-brand-600 shadow-lg scale-[1.02] bg-white ring-2 ring-brand-200' 
          : 'border-slate-100 hover:border-brand-300 hover:shadow-md bg-white'
        }
      `}
      onClick={() => onSelect(plan.id)}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Zap size={12} fill="currentColor" />
          REKOMENDASI AI
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
        </div>
        <div className={`p-2 rounded-full ${isSelected ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
          <Wifi size={24} />
        </div>
      </div>

      <div className="mb-6">
        <span className="text-sm text-slate-500">Mulai dari</span>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-slate-900">Rp {plan.price.toLocaleString('id-ID')}</span>
          <span className="text-slate-500 ml-1">/bulan</span>
        </div>
      </div>

      <div className="flex-grow space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button 
        className={`w-full py-2.5 rounded-xl font-semibold transition-colors text-sm
          ${isSelected 
            ? 'bg-brand-600 text-white shadow-brand-200 shadow-lg' 
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }
        `}
      >
        {isSelected ? 'Dipilih' : 'Pilih Paket'}
      </button>
    </div>
  );
};