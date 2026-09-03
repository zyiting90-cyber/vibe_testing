import React, { useState, useEffect } from 'react';
import { Clock, Volume2, VolumeX, Maximize, Gauge, Flame, Activity, MessageSquare } from 'lucide-react';
import { MainViewMode } from '../types';
import { tradingAudio } from '../utils/audio';

interface MarketStatusBarProps {
  currentMode: MainViewMode;
  onModeChange: (mode: MainViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MarketStatusBar: React.FC<MarketStatusBarProps> = ({
  currentMode,
  onModeChange,
  soundEnabled,
  onToggleSound,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format time for different market hubs
  const formatTimezone = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(time);
    } catch {
      return '--:--:--';
    }
  };

  const nyTime = formatTimezone('America/New_York');
  const londonTime = formatTimezone('Europe/London');
  const tokyoTime = formatTimezone('Asia/Tokyo');
  const sydneyTime = formatTimezone('Australia/Sydney');

  return (
    <div className="bg-[#1e222d] border-y border-[#2a2e39] py-2 px-4 lg:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Live Session Status & Hub Clocks */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center space-x-2 bg-[#131722] px-2.5 py-1 rounded-lg border border-[#2a2e39]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#089981]"></span>
          </span>
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            US Markets: Regular Session (Open)
          </span>
        </div>

        {/* Global Market Clocks */}
        <div className="hidden md:flex items-center space-x-3 text-[#787b86] font-mono">
          <div className="flex items-center gap-1.5 hover:text-white transition">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
            <span className="font-semibold text-[#d1d4dc]">NYC:</span>
            <span>{nyTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 hover:text-white transition">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]"></span>
            <span className="font-semibold text-[#d1d4dc]">LON:</span>
            <span>{londonTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 hover:text-white transition">
            <span className="w-1.5 h-1.5 rounded-full bg-[#787b86]"></span>
            <span className="font-semibold text-[#d1d4dc]">TYO:</span>
            <span>{tokyoTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 hover:text-white transition">
            <span className="w-1.5 h-1.5 rounded-full bg-[#787b86]"></span>
            <span className="font-semibold text-[#d1d4dc]">SYD:</span>
            <span>{sydneyTime}</span>
          </div>
        </div>
      </div>

      {/* Center / Right: Fear & Greed, VIX, View Switcher & Pro Controls */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* VIX Mini */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-[#131722] border border-[#2a2e39] px-2 py-0.5 rounded text-[11px] font-mono">
          <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
          <span className="text-[#787b86]">VIX:</span>
          <span className="text-white font-bold">13.82</span>
          <span className="text-[#089981] font-semibold">-0.42%</span>
        </div>

        {/* Fear & Greed */}
        <div className="hidden xl:flex items-center space-x-1.5 bg-[#131722] border border-[#2a2e39] px-2 py-0.5 rounded text-[11px]">
          <Flame className="w-3.5 h-3.5 text-[#f7931a]" />
          <span className="text-[#787b86]">Sentiment:</span>
          <span className="text-[#089981] font-bold">Greed (68)</span>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-[#131722] p-0.5 rounded-xl border border-[#2a2e39] flex items-center space-x-0.5">
          <button
            onClick={() => onModeChange('standard')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
              currentMode === 'standard'
                ? 'bg-[#2962ff] text-white shadow'
                : 'text-[#787b86] hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onModeChange('heatmap')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
              currentMode === 'heatmap'
                ? 'bg-[#2962ff] text-white shadow'
                : 'text-[#787b86] hover:text-white'
            }`}
          >
            <span>Sector Heatmap</span>
            <span className="text-[9px] bg-red-600 text-white font-mono px-1 rounded">HOT</span>
          </button>
          <button
            onClick={() => onModeChange('talkToUs')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'talkToUs'
                ? 'bg-[#2962ff] text-white shadow-md shadow-[#2962ff]/30 ring-1 ring-white/20'
                : 'text-white bg-[#2962ff]/20 hover:bg-[#2962ff]/30 border border-[#2962ff]/40'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="font-extrabold">Talk to Us</span>
            <span className="text-[9px] bg-[#2962ff] text-white font-mono font-bold px-1.5 py-0.2 rounded-full">
              LIVE
            </span>
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Disable terminal audio ticks' : 'Enable live terminal audio ticks'}
          className={`p-1.5 rounded-lg border transition cursor-pointer ${
            soundEnabled
              ? 'border-[#089981] bg-[#089981]/20 text-[#089981]'
              : 'border-[#2a2e39] text-[#787b86] hover:text-white bg-[#131722]'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-1.5 rounded-lg border border-[#2a2e39] text-[#787b86] hover:text-white bg-[#131722] transition cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
