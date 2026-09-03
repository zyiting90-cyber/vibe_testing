import React, { useState, useMemo } from 'react';
import { X, Star, TrendingUp, TrendingDown, Clock, BarChart2, DollarSign, Activity } from 'lucide-react';
import { StockItem, IndexItem, QuickGlanceItem } from '../types';

interface SymbolModalProps {
  item: StockItem | IndexItem | QuickGlanceItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';
type ChartType = 'line' | 'candle';

export const SymbolModal: React.FC<SymbolModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [hoverPoint, setHoverPoint] = useState<{ index: number; value: number } | null>(null);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  if (!item) return null;

  const symbol = item.symbol;
  const name = 'name' in item ? item.name : symbol;
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
  const changePercent = item.changePercent;
  const isPositive = changePercent >= 0;

  // Generate synthetic chart data points based on timeframe and current price
  const chartPoints = useMemo(() => {
    let count = 24;
    let volatility = 0.008;
    if (timeframe === '1D') { count = 24; volatility = 0.006; }
    else if (timeframe === '5D') { count = 35; volatility = 0.015; }
    else if (timeframe === '1M') { count = 30; volatility = 0.025; }
    else if (timeframe === '6M') { count = 40; volatility = 0.05; }
    else if (timeframe === 'YTD') { count = 45; volatility = 0.07; }
    else if (timeframe === '1Y') { count = 52; volatility = 0.10; }
    else { count = 60; volatility = 0.15; }

    const points: number[] = [];
    let current = isPositive ? price * (1 - changePercent / 100) : price * (1 + Math.abs(changePercent) / 100);
    points.push(current);

    for (let i = 1; i < count - 1; i++) {
      const stepChange = (Math.random() - 0.48) * volatility * price;
      current = Math.max(current + stepChange, price * 0.5);
      points.push(current);
    }
    points.push(price);
    return points;
  }, [timeframe, price, isPositive, changePercent]);

  const minPrice = Math.min(...chartPoints);
  const maxPrice = Math.max(...chartPoints);
  const range = maxPrice - minPrice || 1;

  // Generate SVG coordinates
  const svgWidth = 700;
  const svgHeight = 240;
  const padding = 20;

  const polylineCoords = chartPoints
    .map((val, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((val - minPrice) / range) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaCoords = `${padding},${svgHeight} ${polylineCoords} ${svgWidth - padding},${svgHeight}`;

  const currentHoverValue = hoverPoint ? hoverPoint.value : price;

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`Order placed: ${type} 10 shares of ${symbol} at $${price.toFixed(2)}`);
    setTimeout(() => {
      setOrderNotification(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2e39]">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{symbol}</h2>
                <button
                  onClick={() => onToggleWatchlist(symbol)}
                  className={`p-1.5 rounded-lg border transition ${
                    isWatchlisted
                      ? 'border-[#2962ff] bg-[#2962ff]/20 text-[#2962ff]'
                      : 'border-[#2a2e39] text-[#787b86] hover:text-white'
                  }`}
                  title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#2962ff]' : ''}`} />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#787b86] mt-0.5">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                ${currentHoverValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? '+' : ''}
                  {changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {orderNotification && (
          <div className="bg-[#089981]/20 border-b border-[#089981]/40 px-6 py-2.5 text-xs text-[#089981] font-semibold flex items-center justify-between">
            <span>✓ {orderNotification}</span>
            <button onClick={() => setOrderNotification(null)} className="text-white hover:opacity-80">
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2e39] pb-3">
            <div className="flex items-center space-x-1">
              {(['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    timeframe === tf
                      ? 'bg-[#2962ff] text-white'
                      : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition flex items-center gap-1 ${
                  chartType === 'line'
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Line</span>
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition flex items-center gap-1 ${
                  chartType === 'candle'
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas/SVG */}
          <div className="relative bg-[#131722] rounded-xl border border-[#2a2e39] p-4 overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#787b86] mb-2 font-mono">
              <span>High: ${maxPrice.toFixed(2)}</span>
              <span>Low: ${minPrice.toFixed(2)}</span>
            </div>

            <div className="relative w-full h-64 flex items-center justify-center">
              {chartType === 'line' ? (
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible"
                  onMouseLeave={() => setHoverPoint(null)}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#089981' : '#f23645'}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#089981' : '#f23645'}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
                    <line
                      key={i}
                      x1={padding}
                      y1={svgHeight * ratio}
                      x2={svgWidth - padding}
                      y2={svgHeight * ratio}
                      stroke="#2a2e39"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area fill */}
                  <polygon points={areaCoords} fill="url(#chartGradient)" />

                  {/* Price Line */}
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#089981' : '#f23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineCoords}
                  />

                  {/* Interactive Crosshair & points */}
                  {chartPoints.map((val, idx) => {
                    const x = padding + (idx / (chartPoints.length - 1)) * (svgWidth - padding * 2);
                    const y = svgHeight - padding - ((val - minPrice) / range) * (svgHeight - padding * 2);

                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="5"
                        className="opacity-0 hover:opacity-100 cursor-crosshair transition duration-150"
                        fill={isPositive ? '#089981' : '#f23645'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        onMouseEnter={() => setHoverPoint({ index: idx, value: val })}
                      />
                    );
                  })}
                </svg>
              ) : (
                /* Simulated Candlestick Chart */
                <div className="w-full h-full flex items-center justify-between px-3 gap-1">
                  {chartPoints.slice(0, 20).map((pt, i) => {
                    const nextPt = chartPoints[i + 1] || pt * 1.002;
                    const isGreen = nextPt >= pt;
                    const heightPct = Math.max(8, Math.min(85, Math.abs(nextPt - pt) * 15 + 12));

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-center h-full group relative">
                        <div className={`w-[1px] h-full ${isGreen ? 'bg-[#089981]' : 'bg-[#f23645]'} opacity-40`} />
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full max-w-[12px] rounded-xs ${
                            isGreen ? 'bg-[#089981]' : 'bg-[#f23645]'
                          } transition group-hover:scale-110`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#787b86] mt-2 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Timezone: UTC-5 (EST)
              </span>
              <span>Data delayed 15m • TradingView Real-time</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[#787b86]">Day Range</div>
              <div className="font-mono font-bold text-white mt-1">
                ${(price * 0.985).toFixed(2)} - ${(price * 1.012).toFixed(2)}
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[#787b86]">52-Week Range</div>
              <div className="font-mono font-bold text-white mt-1">
                ${(price * 0.72).toFixed(2)} - ${(price * 1.15).toFixed(2)}
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[#787b86]">Technical Consensus</div>
              <div className="font-bold text-[#089981] mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
                Strong Buy
              </div>
            </div>

            <div className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39]">
              <div className="text-[#787b86]">Volume</div>
              <div className="font-mono font-bold text-white mt-1">
                {'volume' in item && item.volume ? item.volume : '32.4M'}
              </div>
            </div>
          </div>

          {/* Action Trading Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#787b86]">
              Simulated paper trading terminal
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleOrder('SELL')}
                className="px-5 py-2 rounded-xl bg-[#f23645] hover:bg-[#d32f2f] text-white font-bold text-xs transition cursor-pointer"
              >
                Sell ${price.toFixed(2)}
              </button>
              <button
                onClick={() => handleOrder('BUY')}
                className="px-5 py-2 rounded-xl bg-[#089981] hover:bg-[#077d69] text-white font-bold text-xs transition cursor-pointer"
              >
                Buy ${price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
