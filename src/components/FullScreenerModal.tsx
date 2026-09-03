import React, { useState } from 'react';
import { X, Search, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { StockItem, TechnicalRating } from '../types';

interface FullScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export const FullScreenerModal: React.FC<FullScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'changePercent' | 'marketCap'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  const sectors = ['All', ...Array.from(new Set(stocks.map((s) => s.sector)))];
  const ratings = ['All', 'Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];

  const filtered = stocks
    .filter((s) => {
      const matchSearch =
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === 'All' || s.sector === sectorFilter;
      const matchRating = ratingFilter === 'All' || s.technicalRating === ratingFilter;
      return matchSearch && matchSector && matchRating;
    })
    .sort((a, b) => {
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
      return 0;
    });

  const exportCSV = () => {
    const headers = 'Symbol,Name,Price,ChangePercent,Change,Volume,MarketCap,Rating,Sector\n';
    const rows = filtered
      .map(
        (s) =>
          `"${s.symbol}","${s.name}",${s.price},${s.changePercent},${s.change},"${s.volume}","${s.marketCap}","${s.technicalRating}","${s.sector}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screener_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-5xl h-[88vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2e39]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Financial Screener</span>
              <span className="text-xs font-normal text-[#787b86] bg-[#131722] px-2 py-0.5 rounded border border-[#2a2e39]">
                {filtered.length} matches
              </span>
            </h2>
            <p className="text-xs text-[#787b86] mt-0.5">
              Filter by valuation, technical momentum, and sector allocation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#131722] border border-[#2a2e39] hover:bg-[#2a2e39] text-xs font-semibold text-[#d1d4dc] hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="p-4 bg-[#131722]/60 border-b border-[#2a2e39] flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center bg-[#1e222d] border border-[#2a2e39] rounded-lg px-3 py-1.5 flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#787b86] mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter symbol or company..."
              className="bg-transparent text-white placeholder-[#787b86] outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#787b86]">Sector:</span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#787b86]">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {ratings.map((rat) => (
                <option key={rat} value={rat}>
                  {rat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#1e222d] border-b border-[#2a2e39] text-[#787b86] font-semibold uppercase tracking-wider select-none z-10">
              <tr>
                <th
                  onClick={() => {
                    setSortField('symbol');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol</span>
                    {sortField === 'symbol' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3">Company & Sector</th>
                <th
                  onClick={() => {
                    setSortField('price');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    {sortField === 'price' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('changePercent');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    {sortField === 'changePercent' && (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Volume</th>
                <th className="py-3 px-3 text-right">Market Cap</th>
                <th className="py-3 px-3 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39] font-mono">
              {filtered.map((s) => {
                const isPositive = s.changePercent >= 0;
                return (
                  <tr
                    key={s.symbol}
                    onClick={() => {
                      onClose();
                      onSelectStock(s);
                    }}
                    className="hover:bg-[#252936] transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-white font-sans">{s.symbol}</td>
                    <td className="py-3 px-3 font-sans">
                      <div className="text-white font-medium">{s.name}</div>
                      <div className="text-[11px] text-[#787b86]">{s.sector}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      ${s.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {s.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-[#d1d4dc]">{s.volume}</td>
                    <td className="py-3 px-3 text-right text-[#d1d4dc]">{s.marketCap}</td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.technicalRating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : s.technicalRating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-[#787b86]/20 text-[#787b86]'
                        }`}
                      >
                        {s.technicalRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
