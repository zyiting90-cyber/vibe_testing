import React, { useState } from 'react';
import { ScreenerFilter, StockItem, TechnicalRating } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface MoversScreenerProps {
  activeTab: ScreenerFilter;
  onTabChange: (tab: ScreenerFilter) => void;
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onOpenFullScreener: () => void;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume';
type SortOrder = 'asc' | 'desc' | null;

export const MoversScreener: React.FC<MoversScreenerProps> = ({
  activeTab,
  onTabChange,
  stocks,
  onSelectStock,
  onOpenFullScreener,
}) => {
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const tabs: ScreenerFilter[] = [
    'Most Active',
    'Top Gainers',
    'Top Losers',
    'High Volume',
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') setSortOrder('asc');
      else if (sortOrder === 'asc') setSortOrder(null);
      else setSortOrder('desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    if (!sortOrder) return 0;
    if (sortField === 'symbol') {
      return sortOrder === 'asc'
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }
    if (sortField === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    if (sortField === 'changePercent') {
      return sortOrder === 'asc'
        ? a.changePercent - b.changePercent
        : b.changePercent - a.changePercent;
    }
    if (sortField === 'volume') {
      const getVolNum = (v: string) => {
        const num = parseFloat(v);
        if (v.includes('B')) return num * 1e9;
        if (v.includes('M')) return num * 1e6;
        if (v.includes('K')) return num * 1e3;
        return num || 0;
      };
      return sortOrder === 'asc'
        ? getVolNum(a.volume) - getVolNum(b.volume)
        : getVolNum(b.volume) - getVolNum(a.volume);
    }
    return 0;
  });

  const getRatingBadge = (rating: TechnicalRating) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#089981]/20 text-[#089981]">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#089981]/20 text-[#089981]">
            Buy
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#787b86]/20 text-[#787b86]">
            Neutral
          </span>
        );
      case 'Sell':
        return (
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#f23645]/20 text-[#f23645]">
            Sell
          </span>
        );
      case 'Strong Sell':
        return (
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#f23645]/20 text-[#f23645]">
            Strong Sell
          </span>
        );
    }
  };

  return (
    <section className="xl:col-span-2 space-y-4" data-purpose="movers-screener">
      {/* Header controls & tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-3">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 text-sm font-semibold overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white hover:bg-[#1e222d]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Action Link */}
        <button
          onClick={onOpenFullScreener}
          className="text-xs font-semibold text-[#2962ff] hover:underline flex items-center self-end sm:self-auto cursor-pointer"
        >
          Open full Screener →
        </button>
      </div>

      {/* Screener Table Container */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs" data-purpose="market-screener-table">
          <thead>
            <tr className="text-[#787b86] border-b border-[#2a2e39] bg-[#1e222d] select-none uppercase tracking-wider font-semibold">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
                scope="col"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  {sortField === 'symbol' && sortOrder === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortField === 'symbol' && sortOrder === 'desc' && <ArrowDown className="w-3 h-3" />}
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  {sortField === 'price' && sortOrder === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortField === 'price' && sortOrder === 'desc' && <ArrowDown className="w-3 h-3" />}
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  {sortField === 'changePercent' && sortOrder === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortField === 'changePercent' && sortOrder === 'desc' && <ArrowDown className="w-3 h-3" />}
                </div>
              </th>
              <th className="py-3 px-3 text-right" scope="col">
                Change
              </th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3 px-3 text-right hidden sm:table-cell cursor-pointer hover:text-white transition"
                scope="col"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  {sortField === 'volume' && sortOrder === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortField === 'volume' && sortOrder === 'desc' && <ArrowDown className="w-3 h-3" />}
                </div>
              </th>
              <th className="py-3 px-3 text-right hidden md:table-cell" scope="col">
                Market Cap
              </th>
              <th className="py-3 px-3 text-center hidden lg:table-cell" scope="col">
                Technical Rating
              </th>
              <th className="py-3 px-4 text-center" scope="col">
                Chart
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39] font-mono">
            {sortedStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const formattedPrice =
                stock.price >= 1
                  ? `$${stock.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `$${stock.price.toFixed(4)}`;
              const formattedPercent =
                (isPositive ? '+' : '') + stock.changePercent.toFixed(2) + '%';
              const formattedChange =
                (isPositive ? '+' : '') +
                (stock.price >= 1 ? stock.change.toFixed(2) : stock.change.toFixed(5));

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className="hover:bg-[#252936] transition cursor-pointer group"
                >
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-7 h-7 rounded-md font-extrabold text-[10px] flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: stock.iconBg,
                          color: stock.iconColor,
                        }}
                      >
                        {stock.isAppleEmoji ? '🍎' : stock.iconText || stock.symbol.slice(0, 1)}
                      </div>
                      <div className="truncate max-w-[140px] sm:max-w-[200px]">
                        <div className="font-bold text-white group-hover:text-[#2962ff] transition flex items-center gap-1.5">
                          <span>{stock.symbol}</span>
                        </div>
                        <div className="text-[11px] text-[#787b86] truncate">{stock.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-white whitespace-nowrap">
                    {formattedPrice}
                  </td>

                  <td
                    className={`py-3 px-3 text-right font-semibold whitespace-nowrap ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {formattedPercent}
                  </td>

                  <td
                    className={`py-3 px-3 text-right whitespace-nowrap ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {formattedChange}
                  </td>

                  <td className="py-3 px-3 text-right text-[#d1d4dc] hidden sm:table-cell whitespace-nowrap">
                    {stock.volume}
                  </td>

                  <td className="py-3 px-3 text-right text-[#d1d4dc] hidden md:table-cell whitespace-nowrap">
                    {stock.marketCap}
                  </td>

                  <td className="py-3 px-3 text-center hidden lg:table-cell font-sans whitespace-nowrap">
                    {getRatingBadge(stock.technicalRating)}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <svg
                      className={`w-16 h-6 inline-block ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                      fill="none"
                      viewBox="0 0 80 25"
                    >
                      <path
                        d={stock.sparklinePath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
