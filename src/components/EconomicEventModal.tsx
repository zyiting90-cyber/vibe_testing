import React from 'react';
import { X, Calendar, AlertCircle, Clock, Globe } from 'lucide-react';
import { EconomicEvent } from '../types';

interface EconomicEventModalProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export const EconomicEventModal: React.FC<EconomicEventModalProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  const isHigh = event.priority === 'HIGH';
  const isMed = event.priority === 'MED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2e39]">
          <div className="flex items-center space-x-2.5">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                isHigh
                  ? 'bg-[#f23645]/20 text-[#f23645]'
                  : isMed
                  ? 'bg-[#f7931a]/20 text-[#f7931a]'
                  : 'bg-[#787b86]/20 text-[#787b86]'
              }`}
            >
              {event.priority} IMPACT
            </span>
            <div className="text-xs text-[#787b86] flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{event.country}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
            <div className="flex items-center gap-2 text-xs text-[#787b86] mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Scheduled for {event.time} EST (Today)</span>
            </div>
          </div>

          {/* Actual vs Forecast vs Previous cards */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[11px] text-[#787b86] font-sans">Actual</div>
              <div className="text-base font-bold text-white mt-1">
                {event.actual || '--'}
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[11px] text-[#787b86] font-sans">Forecast</div>
              <div className="text-base font-bold text-[#2962ff] mt-1">
                {event.forecast || '--'}
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[11px] text-[#787b86] font-sans">Previous</div>
              <div className="text-base font-bold text-[#787b86] mt-1">
                {event.previous || '--'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#131722]/60 p-4 rounded-xl border border-[#2a2e39] space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#2962ff]" />
              <span>Significance to Financial Markets</span>
            </div>
            <p className="text-[#d1d4dc] leading-relaxed">
              {event.impactDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
