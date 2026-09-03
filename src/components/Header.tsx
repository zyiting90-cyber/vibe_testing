import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Wallet, Bookmark, Sparkles, MessageSquare } from 'lucide-react';
import { TickerTapeItem, ProSidebarTab, MainViewMode } from '../types';

interface HeaderProps {
  tickerItems: TickerTapeItem[];
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onSelectSymbol: (symbol: string) => void;
  onOpenSidebarTab?: (tab: ProSidebarTab) => void;
  watchlistCount?: number;
  paperBalance?: number;
  currentViewMode?: MainViewMode;
  onSelectViewMode?: (mode: MainViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  tickerItems,
  onOpenSearch,
  onOpenGetStarted,
  onSelectSymbol,
  onOpenSidebarTab,
  watchlistCount = 3,
  paperBalance = 100000,
  currentViewMode = 'standard',
  onSelectViewMode,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ES' | 'DE' | 'FR' | 'JA' | 'ZH'>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  // Keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const languages: Array<'EN' | 'ES' | 'DE' | 'FR' | 'JA' | 'ZH'> = ['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'];

  return (
    <header className="sticky top-0 z-40 bg-[#131722]/95 backdrop-blur-md border-b border-[#2a2e39]" data-purpose="main-header">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Primary Nav */}
        <div className="flex items-center space-x-5">
          {/* Logo & PRO Badge */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="TradingView Home"
              className="flex items-center gap-1.5 focus:outline-none hover:opacity-85 transition"
            >
              <svg className="w-8 h-8 text-white fill-current" fill="none" viewBox="0 0 36 28">
                <path d="M14 22H7V11H14V22Z" fill="currentColor"></path>
                <path d="M22 22H15V6H22V22Z" fill="currentColor"></path>
                <path d="M2 17.5L5.5 14L9 17.5L5.5 21L2 17.5Z" fill="currentColor"></path>
                <path d="M29.5 6L33 9.5L29.5 13L26 9.5L29.5 6Z" fill="currentColor"></path>
              </svg>
              <span className="font-extrabold text-white tracking-tight text-lg hidden sm:inline-block">
                TradingView
              </span>
            </button>

            {/* PRO+ Pill Badge */}
            <span className="hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>PRO+ TERMINAL</span>
            </span>
          </div>

          {/* Quick Search (Ctrl+K) */}
          <div className="flex items-center relative" data-purpose="search-box">
            <button
              onClick={onOpenSearch}
              className="flex items-center bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] rounded-full px-3 py-1.5 text-sm text-[#787b86] w-40 sm:w-56 lg:w-64 transition cursor-pointer text-left group"
            >
              <Search className="w-4 h-4 mr-2 text-[#787b86] group-hover:text-white transition" />
              <span className="truncate flex-1 text-xs sm:text-sm">Search markets...</span>
              <kbd className="hidden sm:inline-block bg-[#131722] border border-[#2a2e39] text-[10px] text-[#787b86] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-5 text-xs font-semibold uppercase tracking-wider text-[#d1d4dc]">
            <button
              onClick={() => onSelectViewMode?.('standard')}
              className={`py-4 transition cursor-pointer ${
                currentViewMode === 'standard' || currentViewMode === 'heatmap'
                  ? 'text-[#2962ff] font-bold border-b-2 border-[#2962ff] -mb-[2px]'
                  : 'hover:text-white'
              }`}
            >
              Markets
            </button>
            <a className="hover:text-white transition py-4" href="#supercharts" onClick={() => onOpenSidebarTab?.('orderbook')}>
              SuperCharts
            </a>
            <a className="hover:text-white transition py-4" href="#screener">
              Screener
            </a>
            <a className="hover:text-white transition py-4" href="#calendar" onClick={() => onOpenSidebarTab?.('calendar')}>
              Calendar
            </a>
            <button
              onClick={() => onSelectViewMode?.('talkToUs')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-2 font-bold text-xs ${
                currentViewMode === 'talkToUs'
                  ? 'bg-[#2962ff] text-white shadow-lg shadow-[#2962ff]/30 ring-2 ring-[#2962ff]/40'
                  : 'bg-[#1e222d] text-white hover:bg-[#252936] border border-[#2962ff]/60 hover:border-[#2962ff] shadow-sm'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2962ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2962ff]"></span>
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>Talk to Us</span>
              <span className="bg-[#2962ff]/20 text-[#2962ff] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                FORUM
              </span>
            </button>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Prominent Talk to Us button for quick access across screen sizes */}
          <button
            onClick={() => onSelectViewMode?.('talkToUs')}
            title="Open Talk to Us Community Forum"
            className={`flex items-center space-x-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 transition cursor-pointer text-xs font-bold ${
              currentViewMode === 'talkToUs'
                ? 'bg-[#2962ff] text-white shadow-md shadow-[#2962ff]/40 ring-1 ring-white/30'
                : 'bg-gradient-to-r from-[#2962ff]/20 to-[#2962ff]/10 text-white border border-[#2962ff]/60 hover:border-[#2962ff] hover:from-[#2962ff]/30 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="font-bold">Talk to Us</span>
          </button>
          {/* Paper Trading Balance Chip */}
          <button
            onClick={() => onOpenSidebarTab?.('paperTrading')}
            title="Open Paper Trading Terminal ($100K Sim)"
            className="hidden sm:flex items-center space-x-2 bg-[#1e222d] hover:bg-[#252936] border border-[#089981]/40 rounded-xl px-2.5 py-1.5 transition cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-[#089981]" />
            <div className="text-left">
              <div className="text-[9px] text-[#787b86] uppercase font-bold tracking-wider leading-none">
                Paper Sim
              </div>
              <div className="text-xs font-mono font-bold text-[#089981] leading-tight">
                ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
          </button>

          {/* Watchlist Quick Access Button */}
          <button
            onClick={() => onOpenSidebarTab?.('watchlist')}
            title="Open Watchlist (Alt+W)"
            className="flex items-center space-x-1.5 bg-[#1e222d] hover:bg-[#252936] border border-[#2a2e39] rounded-xl px-2.5 py-1.5 transition cursor-pointer text-[#d1d4dc] hover:text-white text-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#f7931a]" />
            <span className="hidden md:inline text-[11px] font-semibold">Watchlist</span>
            <span className="bg-[#2a2e39] text-[#f7931a] font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {watchlistCount}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-label="Language Selector"
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-[#1e222d] text-[#d1d4dc] transition border border-transparent hover:border-[#2a2e39]"
            >
              <Globe className="w-3.5 h-3.5 text-[#787b86]" />
              <span>{selectedLanguage}</span>
            </button>
            {isLangMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl py-1 z-50 text-xs"
                onMouseLeave={() => setIsLangMenuOpen(false)}
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 transition flex items-center justify-between ${
                      selectedLanguage === lang ? 'text-[#2962ff] bg-[#2962ff]/10 font-bold' : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                    }`}
                  >
                    <span>{lang}</span>
                    {selectedLanguage === lang && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Avatar */}
          <button
            onClick={onOpenGetStarted}
            aria-label="User account"
            className="p-1.5 rounded-xl hover:bg-[#1e222d] text-[#d1d4dc] transition border border-transparent hover:border-[#2a2e39] cursor-pointer"
          >
            <User className="w-4 h-4 text-[#787b86] hover:text-white" />
          </button>

          {/* Upgrade / Account CTA */}
          <button
            onClick={onOpenGetStarted}
            className="tv-btn-gradient text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer"
          >
            Go Pro
          </button>
        </div>
      </div>

      {/* Live Ticker Tape Bar */}
      <div className="w-full bg-[#1e222d]/70 border-t border-b border-[#2a2e39] overflow-hidden whitespace-nowrap text-xs font-mono select-none" data-purpose="live-ticker-tape">
        <div className="animate-ticker py-1.5 flex items-center">
          {/* Loop twice for seamless scroll */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`inline-flex items-center space-x-2 px-3.5 border-r border-[#2a2e39] cursor-pointer hover:bg-[#2a2e39] transition py-0.5 ${
                item.flash === 'green' ? 'flash-green' : item.flash === 'red' ? 'flash-red' : ''
              }`}
            >
              <span className="font-bold text-white">{item.symbol}</span>
              <span className="text-[#d1d4dc]">{item.price}</span>
              <span
                className={`flex items-center font-sans font-semibold text-[11px] ${
                  item.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {item.changePercent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
