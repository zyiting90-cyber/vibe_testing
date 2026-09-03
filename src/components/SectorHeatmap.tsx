import React, { useState } from 'react';
import { StockItem } from '../types';
import { Layers, TrendingUp, TrendingDown, Maximize2, Filter } from 'lucide-react';

interface SectorHeatmapProps {
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

interface HeatmapGroup {
  sector: string;
  items: StockItem[];
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({
  stocks,
  onSelectStock,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  // Group stocks by sector
  const sectorGroups: HeatmapGroup[] = React.useMemo(() => {
    const map = new Map<string, StockItem[]>();
    stocks.forEach((s) => {
      const sec = s.sector || 'Other';
      if (!map.has(sec)) {
        map.set(sec, []);
      }
      map.get(sec)!.push(s);
    });

    return Array.from(map.entries()).map(([sector, items]) => ({
      sector,
      items: items.sort((a, b) => {
        // Sort by approximate market cap weight
        const capA = parseFloat(a.marketCap.replace(/[^0-9.-]/g, '')) * (a.marketCap.includes('T') ? 1000 : 1);
        const capB = parseFloat(b.marketCap.replace(/[^0-9.-]/g, '')) * (b.marketCap.includes('T') ? 1000 : 1);
        return capB - capA;
      }),
    }));
  }, [stocks]);

  const filteredGroups = sectorFilter === 'ALL'
    ? sectorGroups
    : sectorGroups.filter((g) => g.sector.toLowerCase().includes(sectorFilter.toLowerCase()));

  // Determine color based on performance
  const getCellBg = (pct: number) => {
    if (pct >= 4) return 'bg-[#089981] text-white shadow-sm';
    if (pct >= 2) return 'bg-[#0e7060] text-white';
    if (pct > 0.5) return 'bg-[#124d44] text-emerald-100';
    if (pct >= 0) return 'bg-[#183633] text-emerald-200';
    if (pct <= -4) return 'bg-[#f23645] text-white shadow-sm';
    if (pct <= -2) return 'bg-[#ad202d] text-white';
    if (pct < -0.5) return 'bg-[#731922] text-rose-100';
    return 'bg-[#40181d] text-rose-200';
  };

  return (
    <section className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2962ff] animate-pulse"></span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>S&P 500 & Global Sector Heatmap</span>
              <span className="text-[11px] font-mono font-semibold bg-[#131722] text-[#2962ff] px-2 py-0.5 rounded border border-[#2a2e39]">
                PRO TREEMAP
              </span>
            </h2>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time market capitalization weighted performance treemap
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Timeframe pill tabs */}
          <div className="bg-[#131722] p-1 rounded-xl border border-[#2a2e39] flex items-center space-x-1 text-xs">
            {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Sector Filter dropdown */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#131722] border border-[#2a2e39] text-white text-xs font-semibold rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-[#363a45] transition"
          >
            <option value="ALL">All Sectors</option>
            <option value="Semiconductors">Semiconductors</option>
            <option value="Software">Software & Cloud</option>
            <option value="Consumer">Consumer Electronics</option>
            <option value="Financial">Financials</option>
            <option value="Clean Tech">Automotive & Tech</option>
            <option value="Internet">Internet Services</option>
          </select>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <div key={group.sector} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#787b86] uppercase tracking-wider px-1">
              <span>{group.sector}</span>
              <span className="font-mono text-[11px] text-[#2962ff]">{group.items.length} Equities</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {group.items.map((stock) => {
                const isUp = stock.changePercent >= 0;
                const formattedPrice = stock.price >= 1
                  ? `$${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `$${stock.price.toFixed(4)}`;

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`rounded-xl p-3 flex flex-col justify-between min-h-[96px] cursor-pointer transition-all duration-150 transform hover:scale-[1.03] hover:z-10 hover:ring-2 hover:ring-white/40 ${getCellBg(
                      stock.changePercent
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-black text-sm tracking-tight">{stock.symbol}</div>
                        <div className="text-[10px] opacity-80 truncate max-w-[100px]">
                          {stock.name}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold opacity-75 bg-black/20 px-1 py-0.5 rounded">
                        {stock.marketCap}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-mono font-bold text-xs">{formattedPrice}</span>
                      <span className="font-mono font-black text-xs">
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between border-t border-[#2a2e39] pt-3 text-[11px] text-[#787b86]">
        <div className="flex items-center space-x-2 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#f23645]"></span>
          <span>-4%</span>
          <span className="w-2.5 h-2.5 rounded bg-[#ad202d]"></span>
          <span>-2%</span>
          <span className="w-2.5 h-2.5 rounded bg-[#2a2e39]"></span>
          <span>0%</span>
          <span className="w-2.5 h-2.5 rounded bg-[#0e7060]"></span>
          <span>+2%</span>
          <span className="w-2.5 h-2.5 rounded bg-[#089981]"></span>
          <span>+4%</span>
        </div>
        <div className="italic">Click any ticker block to launch interactive TradingView SuperChart</div>
      </div>
    </section>
  );
};
