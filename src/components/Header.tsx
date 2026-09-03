import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown } from 'lucide-react';
import { TickerTapeItem } from '../types';

interface HeaderProps {
  tickerItems: TickerTapeItem[];
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  tickerItems,
  onOpenSearch,
  onOpenGetStarted,
  onSelectSymbol,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ES' | 'DE' | 'FR' | 'JA' | 'ZH'>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  // Close menus on outside click
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
        <div className="flex items-center space-x-6">
          {/* Logo */}
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
            <span className="font-bold text-white tracking-tight text-lg hidden sm:inline-block">TradingView</span>
          </button>

          {/* Quick Search (Ctrl+K) */}
          <div className="flex items-center relative" data-purpose="search-box">
            <button
              onClick={onOpenSearch}
              className="flex items-center bg-[#1e222d] border border-[#2a2e39] hover:border-[#363a45] rounded-full px-3.5 py-1.5 text-sm text-[#787b86] w-48 sm:w-64 lg:w-72 transition cursor-pointer text-left group"
            >
              <Search className="w-4 h-4 mr-2 text-[#787b86] group-hover:text-white transition" />
              <span className="truncate flex-1">Search (Ctrl+K)</span>
              <kbd className="hidden sm:inline-block bg-[#131722] border border-[#2a2e39] text-[10px] text-[#787b86] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium">
            <div className="relative">
              <button
                onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}
                className="text-[#d1d4dc] hover:text-white transition flex items-center gap-1 py-1"
              >
                <span>Products</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              {isProductsMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setIsProductsMenuOpen(false)}
                >
                  <a href="#supercharts" onClick={() => setIsProductsMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    SuperCharts
                  </a>
                  <a href="#screener" onClick={() => setIsProductsMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Stock & Crypto Screener
                  </a>
                  <a href="#economic-calendar" onClick={() => setIsProductsMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Economic Calendar
                  </a>
                  <a href="#heatmaps" onClick={() => setIsProductsMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Market Heatmaps
                  </a>
                </div>
              )}
            </div>

            <a className="text-[#d1d4dc] hover:text-white transition" href="#community">
              Community
            </a>
            <a className="text-[#2962ff] font-semibold border-b-2 border-[#2962ff] py-4 -mb-[2px]" href="#markets">
              Markets
            </a>
            <a className="text-[#d1d4dc] hover:text-white transition" href="#brokers">
              Brokers
            </a>

            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center gap-1 text-[#d1d4dc] hover:text-white py-1"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              {isMoreMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  <a href="#pricing" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Pricing & Plans
                  </a>
                  <a href="#mobile" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Desktop & Mobile App
                  </a>
                  <a href="#api" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2 text-[#d1d4dc] hover:bg-[#2a2e39] hover:text-white">
                    Trading API & Widgets
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-label="Language Selector"
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-[#1e222d] text-[#d1d4dc] transition border border-transparent hover:border-[#2a2e39]"
            >
              <Globe className="w-4 h-4 text-[#787b86]" />
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

          {/* User Profile Avatar Icon */}
          <button
            onClick={onOpenGetStarted}
            aria-label="User account"
            className="p-1.5 rounded-full hover:bg-[#1e222d] text-[#d1d4dc] transition border border-transparent hover:border-[#2a2e39]"
          >
            <User className="w-5 h-5 text-[#787b86] hover:text-white" />
          </button>

          {/* Get Started Button */}
          <button
            onClick={onOpenGetStarted}
            className="tv-btn-gradient text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>

      {/* Live Ticker Tape Bar */}
      <div className="w-full bg-[#1e222d]/60 border-t border-b border-[#2a2e39] overflow-hidden whitespace-nowrap text-xs font-mono select-none" data-purpose="live-ticker-tape">
        <div className="animate-ticker py-2 flex items-center">
          {/* Loop twice for continuous scroll */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectSymbol(item.symbol)}
              className="inline-flex items-center space-x-2 px-4 border-r border-[#2a2e39] cursor-pointer hover:bg-[#2a2e39]/60 transition py-0.5"
            >
              <span className="font-bold text-white">{item.symbol}</span>
              <span className="text-[#d1d4dc]">{item.price}</span>
              <span
                className={`flex items-center font-sans font-medium ${
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
