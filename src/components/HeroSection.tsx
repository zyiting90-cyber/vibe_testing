import React, { useState } from 'react';
import { ChevronDown, Check, MessageSquare, Sparkles } from 'lucide-react';
import { MarketCategory } from '../types';

interface HeroSectionProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onOpenTalkToUs?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  onOpenTalkToUs,
}) => {
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);

  const categories: MarketCategory[] = [
    'Overview',
    'Indices',
    'Stocks',
    'Crypto',
    'Forex',
    'Futures',
    'Bonds',
  ];

  const regions = [
    { id: 'everywhere', label: 'Markets, everywhere' },
    { id: 'us', label: 'Markets in United States' },
    { id: 'europe', label: 'Markets in Europe' },
    { id: 'asia', label: 'Markets in Asia-Pacific' },
    { id: 'americas', label: 'Markets in Americas' },
  ];

  return (
    <section className="space-y-6" data-purpose="hero-section">
      {/* Title & Dropdown + Prominent Talk to Us Header Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3 relative">
          <h1
            onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3 cursor-pointer group select-none"
          >
            <span>{selectedRegion}</span>
            <ChevronDown
              className={`w-7 h-7 text-[#787b86] group-hover:text-white transition duration-150 transform ${
                isRegionMenuOpen ? 'rotate-180 text-white' : 'group-hover:translate-y-0.5'
              }`}
            />
          </h1>

          {isRegionMenuOpen && (
            <div
              className="absolute top-full left-0 mt-3 w-72 bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl py-2 z-30"
              onMouseLeave={() => setIsRegionMenuOpen(false)}
            >
              <div className="px-4 py-2 text-[11px] font-semibold text-[#787b86] uppercase tracking-wider border-b border-[#2a2e39]">
                Filter by Market Region
              </div>
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegion(reg.label);
                    setIsRegionMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition flex items-center justify-between ${
                    selectedRegion === reg.label
                      ? 'text-[#2962ff] bg-[#2962ff]/10 font-bold'
                      : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                  }`}
                >
                  <span>{reg.label}</span>
                  {selectedRegion === reg.label && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prominent Hero Callout Button for Talk to Us */}
        {onOpenTalkToUs && (
          <button
            onClick={onOpenTalkToUs}
            className="self-start sm:self-auto flex items-center gap-2.5 bg-gradient-to-r from-[#1e222d] to-[#252936] hover:from-[#252936] hover:to-[#2a2e39] border border-[#2962ff]/70 hover:border-[#2962ff] text-white px-4 py-2 rounded-2xl text-xs font-bold transition shadow-lg shadow-[#2962ff]/15 cursor-pointer group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <MessageSquare className="w-4 h-4 text-[#2962ff] group-hover:scale-110 transition" />
            <div className="text-left">
              <div className="text-white font-extrabold flex items-center gap-1.5">
                <span>Talk to Us</span>
                <span className="bg-[#2962ff] text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-black">
                  DISQUS
                </span>
              </div>
              <div className="text-[10px] text-[#787b86] font-normal">
                Join Community Discussions
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <nav
        aria-label="Market Categories"
        className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1 text-sm font-semibold"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black shadow'
                  : 'bg-[#1e222d] text-[#d1d4dc] hover:bg-[#2a2e39]'
              }`}
            >
              {category}
            </button>
          );
        })}

        {/* Dedicated Highlighted Pill for Talk to Us in Category Bar */}
        {onOpenTalkToUs && (
          <button
            onClick={onOpenTalkToUs}
            className="flex items-center space-x-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white px-4 py-2 rounded-full font-bold transition cursor-pointer whitespace-nowrap shadow-md shadow-[#2962ff]/30 shrink-0 ml-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Talk to Us</span>
            <span className="bg-white/20 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold">
              FORUM
            </span>
          </button>
        )}
      </nav>
    </section>
  );
};
