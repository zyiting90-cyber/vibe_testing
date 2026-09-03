import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart2,
  Activity,
  Maximize2,
  Sliders,
  Layers,
  ChevronDown,
  Eye,
  EyeOff,
  Crosshair,
  Minus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { StockItem, IndexItem, QuickGlanceItem } from '../types';
import { tradingAudio } from '../utils/audio';

interface SymbolModalProps {
  item: StockItem | IndexItem | QuickGlanceItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onExecuteTrade?: (symbol: string, name: string, side: 'BUY' | 'SELL', shares: number, price: number, stopLoss?: number, takeProfit?: number) => void;
}

type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';
type ChartStyle = 'candles' | 'line' | 'area';
type DrawingTool = 'crosshair' | 'trendline' | 'ray' | 'measure' | null;

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export const SymbolModal: React.FC<SymbolModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [activeTab, setActiveTab] = useState<'trade' | 'depth' | 'stats'>('trade');

  // Technical Indicators
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  // Drawing tools
  const [activeTool, setActiveTool] = useState<DrawingTool>('crosshair');
  const [drawnLines, setDrawnLines] = useState<Array<{ y: number; label: string }>>([]);

  // Trading Ticket state
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [orderShares, setOrderShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Hover states
  const [hoverCandle, setHoverCandle] = useState<Candle | null>(null);

  if (!item) return null;

  const symbol = item.symbol;
  const name = 'name' in item ? item.name : symbol;
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
  const changePercent = item.changePercent;
  const isPositive = changePercent >= 0;

  // Generate realistic candles based on timeframe
  const candles: Candle[] = useMemo(() => {
    let count = 28;
    let volatility = 0.007;
    if (timeframe === '1m' || timeframe === '5m') { count = 30; volatility = 0.003; }
    else if (timeframe === '15m' || timeframe === '1h') { count = 32; volatility = 0.008; }
    else if (timeframe === '4h' || timeframe === '1D') { count = 28; volatility = 0.012; }
    else { count = 35; volatility = 0.025; }

    const list: Candle[] = [];
    let curOpen = isPositive ? price * (1 - (changePercent / 100) * 0.8) : price * (1 + (Math.abs(changePercent) / 100) * 0.8);

    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      const curClose = isLast ? price : curOpen + (Math.random() - 0.48) * volatility * price;
      const high = Math.max(curOpen, curClose) + Math.random() * volatility * price * 0.9;
      const low = Math.min(curOpen, curClose) - Math.random() * volatility * price * 0.9;
      const vol = Math.floor(100000 + Math.random() * 450000);

      const d = new Date();
      d.setMinutes(d.getMinutes() - (count - i) * 15);
      const timestamp = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      list.push({
        open: curOpen,
        high,
        low,
        close: curClose,
        volume: vol,
        timestamp,
      });

      curOpen = curClose;
    }

    return list;
  }, [timeframe, price, isPositive, changePercent]);

  // Calculations for layout
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume));

  // Compute SMA 20
  const sma20 = useMemo(() => {
    return candles.map((_, idx) => {
      if (idx < 5) return null;
      const window = candles.slice(Math.max(0, idx - 10), idx + 1);
      const sum = window.reduce((acc, c) => acc + c.close, 0);
      return sum / window.length;
    });
  }, [candles]);

  // Compute EMA 50
  const ema50 = useMemo(() => {
    return candles.map((_, idx) => {
      if (idx < 8) return null;
      const window = candles.slice(Math.max(0, idx - 15), idx + 1);
      const sum = window.reduce((acc, c) => acc + c.close, 0);
      return (sum / window.length) * 0.998;
    });
  }, [candles]);

  // Compute simulated RSI (14)
  const rsiValues = useMemo(() => {
    return candles.map((c, i) => {
      const base = 50 + ((c.close - minPrice) / priceRange - 0.5) * 40;
      return Math.min(88, Math.max(18, base + Math.sin(i) * 6));
    });
  }, [candles, minPrice, priceRange]);

  const svgWidth = 720;
  const svgHeight = 270;
  const padLeft = 10;
  const padRight = 55;
  const padTop = 15;
  const padBottom = 25;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const getX = (index: number) => padLeft + (index / (candles.length - 1)) * chartWidth;
  const getY = (val: number) => padTop + (1 - (val - minPrice) / priceRange) * chartHeight;

  // Order Execution
  const handleExecute = (side: 'BUY' | 'SELL') => {
    const execPrice = orderType === 'LIMIT' && parseFloat(limitPrice) ? parseFloat(limitPrice) : price;
    const sl = parseFloat(stopLoss) || undefined;
    const tp = parseFloat(takeProfit) || undefined;

    if (onExecuteTrade) {
      onExecuteTrade(symbol, name, side, orderShares, execPrice, sl, tp);
    }
    tradingAudio.playOrderFill(side);

    setOrderSuccess(`${side} order filled for ${orderShares} shares of ${symbol} @ $${execPrice.toFixed(2)}`);
    setTimeout(() => setOrderSuccess(null), 3500);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'ray') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const calculatedPrice = maxPrice - (clickY / svgHeight) * priceRange;
      setDrawnLines((prev) => [...prev, { y: clickY, label: `$${calculatedPrice.toFixed(2)}` }]);
      tradingAudio.playTick(true);
    }
  };

  const activeCandle = hoverCandle || candles[candles.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-5xl max-h-[94vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Top SuperChart Header Bar */}
        <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-[#2a2e39] gap-3 bg-[#131722]">
          <div className="flex items-center space-x-3">
            {/* Symbol identification */}
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {symbol}
              </span>
              <span className="text-[11px] font-semibold text-[#787b86] border border-[#2a2e39] px-2 py-0.5 rounded bg-[#1e222d]">
                {'sector' in item ? item.sector : 'Benchmark'}
              </span>
              <button
                onClick={() => onToggleWatchlist(symbol)}
                className={`p-1.5 rounded-lg border transition ${
                  isWatchlisted
                    ? 'border-[#f7931a] bg-[#f7931a]/15 text-[#f7931a]'
                    : 'border-[#2a2e39] text-[#787b86] hover:text-white'
                }`}
                title="Toggle Watchlist"
              >
                <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#f7931a]' : ''}`} />
              </button>
            </div>

            <div className="hidden sm:block text-xs text-[#787b86] truncate max-w-[180px]">
              {name}
            </div>
          </div>

          {/* Real-time Price & Badges */}
          <div className="flex items-center space-x-4">
            <div className="text-right font-mono">
              <div className="text-xl sm:text-2xl font-black text-white">
                ${price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4)}
              </div>
              <div
                className={`text-xs font-bold flex items-center justify-end gap-1 ${
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
              className="p-2 rounded-xl text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar: Timeframes, Indicators, Chart Styles */}
        <div className="px-4 py-2 border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#1e222d] text-xs">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1">
            {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  tradingAudio.playTick(true);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type */}
          <div className="flex items-center space-x-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setChartStyle('candles')}
              className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1 ${
                chartStyle === 'candles' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setChartStyle('line')}
              className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1 ${
                chartStyle === 'line' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Line</span>
            </button>
          </div>

          {/* Indicators Toggles */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                showSMA20
                  ? 'border-[#ffb74d] bg-[#ffb74d]/15 text-[#ffb74d] font-bold'
                  : 'border-[#2a2e39] text-[#787b86]'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                showEMA50
                  ? 'border-[#26c6da] bg-[#26c6da]/15 text-[#26c6da] font-bold'
                  : 'border-[#2a2e39] text-[#787b86]'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                showBollinger
                  ? 'border-[#ab47bc] bg-[#ab47bc]/15 text-[#ab47bc] font-bold'
                  : 'border-[#2a2e39] text-[#787b86]'
              }`}
            >
              BB(20,2)
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                showRSI
                  ? 'border-[#2962ff] bg-[#2962ff]/15 text-[#2962ff] font-bold'
                  : 'border-[#2a2e39] text-[#787b86]'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* OHLC Bar */}
        <div className="px-4 py-1.5 bg-[#131722] border-b border-[#2a2e39] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#787b86]">
          <div className="flex items-center space-x-3">
            <span>
              O: <strong className="text-white">${activeCandle.open.toFixed(2)}</strong>
            </span>
            <span>
              H: <strong className="text-[#089981]">${activeCandle.high.toFixed(2)}</strong>
            </span>
            <span>
              L: <strong className="text-[#f23645]">${activeCandle.low.toFixed(2)}</strong>
            </span>
            <span>
              C: <strong className="text-white">${activeCandle.close.toFixed(2)}</strong>
            </span>
            <span>
              Vol:{' '}
              <strong className="text-white">
                {(activeCandle.volume / 1000).toFixed(1)}K
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span className="text-[10px] text-[#089981] font-bold">BATS Real-Time Feed</span>
          </div>
        </div>

        {/* Order Notification banner */}
        {orderSuccess && (
          <div className="bg-[#089981]/20 border-b border-[#089981]/40 px-4 py-2 text-xs text-[#089981] font-bold flex items-center justify-between animate-in slide-in-from-top duration-150">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{orderSuccess}</span>
            </div>
            <button onClick={() => setOrderSuccess(null)} className="text-white hover:opacity-75">
              ✕
            </button>
          </div>
        )}

        {/* Main Chart Area with Left Tools Rail */}
        <div className="flex flex-1 overflow-hidden relative min-h-[300px] bg-[#131722]">
          {/* Left Drawing Rail */}
          <div className="w-10 border-r border-[#2a2e39] bg-[#1e222d] flex flex-col items-center py-2 space-y-1 text-[#787b86]">
            <button
              onClick={() => setActiveTool('crosshair')}
              title="Crosshair Cursor"
              className={`p-2 rounded-lg transition cursor-pointer ${
                activeTool === 'crosshair' ? 'bg-[#2962ff] text-white' : 'hover:text-white hover:bg-[#252936]'
              }`}
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTool('ray')}
              title="Horizontal Support/Resistance Ray (Click chart to place)"
              className={`p-2 rounded-lg transition cursor-pointer ${
                activeTool === 'ray' ? 'bg-[#2962ff] text-white' : 'hover:text-white hover:bg-[#252936]'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDrawnLines([]);
                tradingAudio.playTick(false);
              }}
              title="Clear Drawing Rays"
              className="p-2 rounded-lg hover:text-[#f23645] hover:bg-[#252936] transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive SVG Chart Canvas */}
          <div className="flex-1 flex flex-col p-2 overflow-hidden relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full flex-1 overflow-visible cursor-crosshair select-none"
              onClick={handleCanvasClick}
              onMouseLeave={() => setHoverCandle(null)}
            >
              <defs>
                <linearGradient id="proAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines & Price Labels on right axis */}
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((ratio, i) => {
                const gridY = padTop + ratio * chartHeight;
                const gridPrice = maxPrice - ratio * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1={padLeft}
                      y1={gridY}
                      x2={svgWidth - padRight}
                      y2={gridY}
                      stroke="#2a2e39"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                    />
                    <text
                      x={svgWidth - padRight + 6}
                      y={gridY + 4}
                      fill="#787b86"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      ${gridPrice.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* User drawn Horizontal Rays */}
              {drawnLines.map((line, idx) => (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={line.y}
                    x2={svgWidth - padRight}
                    y2={line.y}
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <rect
                    x={svgWidth - padRight + 2}
                    y={line.y - 8}
                    width={48}
                    height={16}
                    rx={4}
                    fill="#2962ff"
                  />
                  <text
                    x={svgWidth - padRight + 6}
                    y={line.y + 4}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {line.label}
                  </text>
                </g>
              ))}

              {/* Bollinger Bands Shaded Area */}
              {showBollinger && (
                <path
                  d={candles
                    .map((c, i) => {
                      const x = getX(i);
                      const upperY = getY(c.high * 1.008);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${upperY}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#ab47bc"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              )}

              {/* SMA 20 Line (Yellow) */}
              {showSMA20 && (
                <polyline
                  fill="none"
                  stroke="#ffb74d"
                  strokeWidth="1.8"
                  points={sma20
                    .map((val, idx) => (val !== null ? `${getX(idx)},${getY(val)}` : ''))
                    .filter(Boolean)
                    .join(' ')}
                />
              )}

              {/* EMA 50 Line (Cyan) */}
              {showEMA50 && (
                <polyline
                  fill="none"
                  stroke="#26c6da"
                  strokeWidth="1.8"
                  points={ema50
                    .map((val, idx) => (val !== null ? `${getX(idx)},${getY(val)}` : ''))
                    .filter(Boolean)
                    .join(' ')}
                />
              )}

              {/* Candlesticks or Line */}
              {chartStyle === 'candles' ? (
                candles.map((c, idx) => {
                  const x = getX(idx);
                  const isUp = c.close >= c.open;
                  const candleColor = isUp ? '#089981' : '#f23645';

                  const openY = getY(c.open);
                  const closeY = getY(c.close);
                  const highY = getY(c.high);
                  const lowY = getY(c.low);

                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.max(3, Math.abs(closeY - openY));
                  const candleWidth = Math.max(4, chartWidth / candles.length - 3);

                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoverCandle(c)}
                      className="cursor-pointer"
                    >
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />
                      {/* Candle Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={bodyTop}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={candleColor}
                        rx={1}
                      />
                    </g>
                  );
                })
              ) : (
                /* Line / Area View */
                <g>
                  <polygon
                    points={`${getX(0)},${chartHeight + padTop} ${candles
                      .map((c, i) => `${getX(i)},${getY(c.close)}`)
                      .join(' ')} ${getX(candles.length - 1)},${chartHeight + padTop}`}
                    fill="url(#proAreaGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#089981' : '#f23645'}
                    strokeWidth="2.5"
                    points={candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
                  />
                </g>
              )}

              {/* Volume Bars at Bottom */}
              {showVolume &&
                candles.map((c, idx) => {
                  const x = getX(idx);
                  const isUp = c.close >= c.open;
                  const volHeight = (c.volume / maxVolume) * 45;
                  const volY = svgHeight - padBottom - volHeight;
                  const barWidth = Math.max(3, chartWidth / candles.length - 4);

                  return (
                    <rect
                      key={idx}
                      x={x - barWidth / 2}
                      y={volY}
                      width={barWidth}
                      height={volHeight}
                      fill={isUp ? '#089981' : '#f23645'}
                      opacity="0.35"
                    />
                  );
                })}
            </svg>

            {/* Sub-panel: RSI Indicator */}
            {showRSI && (
              <div className="h-16 border-t border-[#2a2e39] mt-1 pt-1 flex items-center relative">
                <span className="absolute left-2 top-1 text-[10px] font-mono text-[#2962ff] font-bold">
                  RSI (14): {rsiValues[rsiValues.length - 1]?.toFixed(1)}
                </span>
                <svg viewBox={`0 0 ${svgWidth} 45`} className="w-full h-full overflow-visible">
                  {/* 70 Overbought & 30 Oversold dashed lines */}
                  <line x1={padLeft} y1={10} x2={svgWidth - padRight} y2={10} stroke="#f23645" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />
                  <line x1={padLeft} y1={35} x2={svgWidth - padRight} y2={35} stroke="#089981" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />

                  {/* RSI Polyline */}
                  <polyline
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    points={rsiValues
                      .map((val, idx) => {
                        const x = getX(idx);
                        const y = 45 - (val / 100) * 40;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pro Multi-Tab Module: Paper Trade Terminal, DOM Depth, Key Stats */}
        <div className="border-t border-[#2a2e39] bg-[#1e222d] p-3 sm:p-4">
          <div className="flex items-center space-x-3 mb-3 border-b border-[#2a2e39] pb-2 text-xs">
            <button
              onClick={() => setActiveTab('trade')}
              className={`font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'trade'
                  ? 'border-[#2962ff] text-white'
                  : 'border-transparent text-[#787b86] hover:text-white'
              }`}
            >
              Order Execution Ticket
            </button>
            <button
              onClick={() => setActiveTab('depth')}
              className={`font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'depth'
                  ? 'border-[#2962ff] text-white'
                  : 'border-transparent text-[#787b86] hover:text-white'
              }`}
            >
              Level 2 Depth (DOM)
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === 'stats'
                  ? 'border-[#2962ff] text-white'
                  : 'border-transparent text-[#787b86] hover:text-white'
              }`}
            >
              Fundamental Stats & 52W
            </button>
          </div>

          {/* TAB 1: Quick Trade Execution Ticket */}
          {activeTab === 'trade' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Type & Shares */}
              <div className="flex items-center gap-2">
                <div className="bg-[#131722] p-1 rounded-xl border border-[#2a2e39] flex text-xs">
                  <button
                    onClick={() => setOrderType('MARKET')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      orderType === 'MARKET' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('LIMIT')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      orderType === 'LIMIT' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'
                    }`}
                  >
                    Limit
                  </button>
                </div>

                <div className="flex-1">
                  <div className="text-[10px] text-[#787b86] mb-0.5">Shares</div>
                  <div className="flex items-center bg-[#131722] border border-[#2a2e39] rounded-xl px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={orderShares}
                      onChange={(e) => setOrderShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-transparent text-white font-mono font-bold text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stop Loss & Take Profit */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-[10px] text-[#787b86] mb-0.5">Stop Loss ($)</div>
                  <input
                    type="number"
                    placeholder={`$${(price * 0.95).toFixed(2)}`}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-[#787b86] mb-0.5">Take Profit ($)</div>
                  <input
                    type="number"
                    placeholder={`$${(price * 1.10).toFixed(2)}`}
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Order Est Value */}
              <div className="text-xs font-mono">
                <div className="text-[#787b86] text-[10px]">Estimated Total Value</div>
                <div className="text-white font-bold text-sm">
                  ${(price * orderShares).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Instant Buy / Sell Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExecute('SELL')}
                  className="flex-1 py-2.5 bg-[#f23645] hover:bg-[#d32f2f] text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>SELL ${price.toFixed(2)}</span>
                </button>
                <button
                  onClick={() => handleExecute('BUY')}
                  className="flex-1 py-2.5 bg-[#089981] hover:bg-[#077d69] text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>BUY ${price.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Level 2 Depth */}
          {activeTab === 'depth' && (
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[10px] text-[#089981] font-bold uppercase">Buyers (Bids)</div>
                {[1, 2, 3].map((b) => (
                  <div key={b} className="flex justify-between bg-[#131722] p-1.5 rounded">
                    <span className="text-[#089981] font-bold">${(price - b * 0.04).toFixed(2)}</span>
                    <span className="text-[#787b86]">{b * 320} shs</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[#f23645] font-bold uppercase">Sellers (Asks)</div>
                {[1, 2, 3].map((a) => (
                  <div key={a} className="flex justify-between bg-[#131722] p-1.5 rounded">
                    <span className="text-[#f23645] font-bold">${(price + a * 0.04).toFixed(2)}</span>
                    <span className="text-[#787b86]">{a * 280} shs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Fundamental Stats & 52W Range Slider */}
          {activeTab === 'stats' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#131722] p-2 rounded-xl border border-[#2a2e39]">
                  <div className="text-[#787b86] text-[10px]">Market Cap</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {'marketCap' in item ? item.marketCap : '$1.94T'}
                  </div>
                </div>
                <div className="bg-[#131722] p-2 rounded-xl border border-[#2a2e39]">
                  <div className="text-[#787b86] text-[10px]">P/E Ratio</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {'peRatio' in item && item.peRatio ? item.peRatio : '32.4'}
                  </div>
                </div>
                <div className="bg-[#131722] p-2 rounded-xl border border-[#2a2e39]">
                  <div className="text-[#787b86] text-[10px]">Consensus</div>
                  <div className="font-bold text-[#089981] mt-0.5">Strong Buy</div>
                </div>
                <div className="bg-[#131722] p-2 rounded-xl border border-[#2a2e39]">
                  <div className="text-[#787b86] text-[10px]">24h Volume</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {'volume' in item ? item.volume : '48.2M'}
                  </div>
                </div>
              </div>

              {/* 52-Week Slider */}
              <div className="bg-[#131722] p-2.5 rounded-xl border border-[#2a2e39]">
                <div className="flex justify-between text-[10px] text-[#787b86] font-mono mb-1.5">
                  <span>52W Low: ${(price * 0.72).toFixed(2)}</span>
                  <span className="text-white font-bold">Current: ${price.toFixed(2)}</span>
                  <span>52W High: ${(price * 1.15).toFixed(2)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#2a2e39] rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                    style={{ left: '20%', width: '55%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
