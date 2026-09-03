import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { StockItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSymbols: StockItem[];
  onSelectSymbol: (symbol: StockItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allSymbols,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Stocks' | 'Crypto' | 'Forex' | 'Indices'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = allSymbols.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sector.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stocks') return !item.symbol.includes('/') && !item.symbol.includes('10Y') && !item.symbol.includes('02Y');
    if (activeFilter === 'Crypto') return item.symbol.includes('BTC') || item.symbol.includes('ETH') || item.symbol.includes('SOL') || item.symbol.includes('BNB');
    if (activeFilter === 'Forex') return item.symbol.includes('EUR') || item.symbol.includes('JPY') || item.symbol.includes('GBP') || item.symbol.includes('AUD');
    if (activeFilter === 'Indices') return item.symbol.includes('SPX') || item.symbol.includes('NDX') || item.symbol.includes('DJI') || item.symbol.includes('ES');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, forex..."
            className="w-full bg-transparent text-white placeholder-[#787b86] outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block bg-[#131722] border border-[#2a2e39] text-[10px] text-[#787b86] px-2 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 bg-[#131722]/50 border-b border-[#2a2e39] flex items-center space-x-2 overflow-x-auto hide-scrollbar text-xs">
          {(['All', 'Stocks', 'Crypto', 'Forex', 'Indices'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#1e222d] text-[#787b86] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-[#2a2e39]/50 p-2 flex-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-sm">
              No results found for "{query}".
            </div>
          ) : (
            filtered.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const formattedPrice =
                stock.price >= 1
                  ? `$${stock.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `$${stock.price.toFixed(4)}`;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    onSelectSymbol(stock);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#252936] transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: stock.iconBg,
                        color: stock.iconColor,
                      }}
                    >
                      {stock.isAppleEmoji ? '🍎' : stock.iconText || stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-[#2962ff] transition flex items-center gap-2">
                        <span>{stock.symbol}</span>
                        <span className="text-[10px] text-[#787b86] font-normal border border-[#2a2e39] px-1.5 py-0.2 rounded">
                          {stock.sector}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-xs">{stock.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-white text-sm">{formattedPrice}</div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
