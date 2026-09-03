import React, { useState } from 'react';
import {
  Bookmark,
  Bell,
  Newspaper,
  Calendar,
  Layers,
  Wallet,
  Keyboard,
  X,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import {
  ProSidebarTab,
  StockItem,
  PriceAlert,
  PaperAccount,
  EconomicEvent,
  NewsItem,
} from '../types';
import { tradingAudio } from '../utils/audio';

interface ProSidebarProps {
  activeTab: ProSidebarTab | null;
  onSelectTab: (tab: ProSidebarTab | null) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  allStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  alerts: PriceAlert[];
  onAddAlert: (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (id: string) => void;
  paperAccount: PaperAccount;
  onClosePosition: (positionId: string) => void;
  onResetPaperAccount: () => void;
  economicEvents: EconomicEvent[];
  news: NewsItem[];
  onOpenTalkToUs?: () => void;
  isTalkToUsActive?: boolean;
}

export const ProSidebar: React.FC<ProSidebarProps> = ({
  activeTab,
  onSelectTab,
  watchlist,
  onToggleWatchlist,
  allStocks,
  onSelectStock,
  alerts,
  onAddAlert,
  onRemoveAlert,
  paperAccount,
  onClosePosition,
  onResetPaperAccount,
  economicEvents,
  news,
  onOpenTalkToUs,
  isTalkToUsActive = false,
}) => {
  // Alert form state
  const [newAlertSymbol, setNewAlertSymbol] = useState('NVDA');
  const [newAlertPrice, setNewAlertPrice] = useState('800.00');
  const [newAlertCondition, setNewAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  // DOM depth simulator for active stock
  const activeStock = allStocks.find((s) => s.symbol === newAlertSymbol) || allStocks[0];

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newAlertPrice);
    if (!isNaN(price) && price > 0) {
      onAddAlert(newAlertSymbol, price, newAlertCondition);
      tradingAudio.playAlert();
    }
  };

  // Watchlist stock objects
  const watchlistStocks = allStocks.filter((s) => watchlist.includes(s.symbol));

  // Compute portfolio equity
  const positionsValue = paperAccount.positions.reduce((acc, pos) => {
    const curr = allStocks.find((s) => s.symbol === pos.symbol)?.price || pos.currentPrice;
    return acc + curr * pos.shares;
  }, 0);

  const totalEquity = paperAccount.cash + positionsValue;
  const totalUnrealizedPnL = positionsValue - paperAccount.positions.reduce((acc, p) => acc + p.entryPrice * p.shares, 0);

  return (
    <aside className="fixed top-14 right-0 bottom-0 z-30 flex select-none pointer-events-auto" data-purpose="pro-sidebar">
      {/* Expanded Content Drawer */}
      {activeTab && (
        <div className="w-80 sm:w-96 bg-[#1e222d] border-l border-[#2a2e39] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Panel Header */}
          <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2962ff]"></span>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                {activeTab === 'watchlist' && 'Watchlist & Quotes'}
                {activeTab === 'alerts' && 'Price Alerts'}
                {activeTab === 'orderbook' && 'Level 2 DOM Book'}
                {activeTab === 'paperTrading' && 'Paper Trading Account'}
                {activeTab === 'news' && 'Live News Stream'}
                {activeTab === 'calendar' && 'Economic Events'}
                {activeTab === 'shortcuts' && 'Keyboard Shortcuts'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab(null)}
              className="p-1 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
            {/* 1. WATCHLIST TAB */}
            {activeTab === 'watchlist' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[#787b86] font-semibold text-[11px] pb-1 border-b border-[#2a2e39]">
                  <span>{watchlistStocks.length} Tracked Symbols</span>
                  <span>Click symbol to chart</span>
                </div>

                {watchlistStocks.length === 0 ? (
                  <div className="text-center py-8 text-[#787b86]">
                    Your watchlist is empty. Click the star icon on any asset to pin it here.
                  </div>
                ) : (
                  watchlistStocks.map((stock) => {
                    const isUp = stock.changePercent >= 0;
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => onSelectStock(stock)}
                        className="bg-[#131722] hover:bg-[#252936] p-2.5 rounded-xl border border-[#2a2e39] flex items-center justify-between transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWatchlist(stock.symbol);
                            }}
                            className="text-[#f7931a] hover:opacity-75 transition"
                          >
                            ★
                          </button>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#2962ff] transition">
                              {stock.symbol}
                            </div>
                            <div className="text-[10px] text-[#787b86] truncate max-w-[110px]">
                              {stock.name}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-white">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div
                            className={`font-mono text-[11px] font-bold ${
                              isUp ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isUp ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. ALERTS TAB */}
            {activeTab === 'alerts' && (
              <div className="space-y-4">
                {/* Create Alert Form */}
                <form
                  onSubmit={handleCreateAlert}
                  className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] space-y-2.5"
                >
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#2962ff]" />
                    <span>Create Price Alert</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#787b86] block mb-1">Symbol</label>
                      <select
                        value={newAlertSymbol}
                        onChange={(e) => setNewAlertSymbol(e.target.value)}
                        className="w-full bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg p-1.5 font-bold outline-none"
                      >
                        {allStocks.slice(0, 15).map((s) => (
                          <option key={s.symbol} value={s.symbol}>
                            {s.symbol}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#787b86] block mb-1">Condition</label>
                      <select
                        value={newAlertCondition}
                        onChange={(e) => setNewAlertCondition(e.target.value as 'ABOVE' | 'BELOW')}
                        className="w-full bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg p-1.5 font-bold outline-none"
                      >
                        <option value="ABOVE">Crossing Above</option>
                        <option value="BELOW">Crossing Below</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#787b86] block mb-1">Target Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAlertPrice}
                      onChange={(e) => setNewAlertPrice(e.target.value)}
                      className="w-full bg-[#1e222d] border border-[#2a2e39] text-white rounded-lg px-2.5 py-1.5 font-mono font-bold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2962ff] hover:bg-[#1e53e5] text-white font-bold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Alert</span>
                  </button>
                </form>

                {/* Alerts List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
                    Active Alerts ({alerts.length})
                  </div>

                  {alerts.length === 0 ? (
                    <div className="text-center py-6 text-[#787b86]">No active alerts set.</div>
                  ) : (
                    alerts.map((a) => (
                      <div
                        key={a.id}
                        className="bg-[#131722] p-2.5 rounded-xl border border-[#2a2e39] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{a.symbol}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#2962ff]">
                              {a.condition}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#d1d4dc] mt-0.5">
                            Target: ${a.targetPrice.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveAlert(a.id)}
                          className="p-1.5 text-[#787b86] hover:text-[#f23645] hover:bg-[#2a2e39] rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. ORDER BOOK / LEVEL 2 DOM */}
            {activeTab === 'orderbook' && (
              <div className="space-y-3">
                <div className="bg-[#131722] p-2 rounded-xl border border-[#2a2e39] flex items-center justify-between">
                  <span className="font-bold text-white">{activeStock?.symbol} Depth</span>
                  <span className="font-mono text-[11px] text-[#089981]">
                    Spread: $0.02
                  </span>
                </div>

                {/* Asks (Red) */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#f23645] tracking-wider">
                    Asks / Sells
                  </div>
                  {[4, 3, 2, 1].map((step) => {
                    const price = (activeStock?.price || 100) + step * 0.05;
                    const size = Math.floor(250 + step * 180 + Math.random() * 50);
                    return (
                      <div
                        key={step}
                        className="relative flex items-center justify-between px-2 py-1 rounded bg-[#131722] font-mono text-[11px] overflow-hidden"
                      >
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-[#f23645]/15 pointer-events-none"
                          style={{ width: `${(size / 1000) * 100}%` }}
                        />
                        <span className="text-[#f23645] font-bold z-10">${price.toFixed(2)}</span>
                        <span className="text-[#d1d4dc] z-10">{size}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Current Mid price */}
                <div className="py-2 text-center bg-[#252936] rounded-xl border border-[#2a2e39] font-mono font-bold text-white text-sm">
                  ${(activeStock?.price || 100).toFixed(2)}
                </div>

                {/* Bids (Green) */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#089981] tracking-wider">
                    Bids / Buys
                  </div>
                  {[1, 2, 3, 4].map((step) => {
                    const price = (activeStock?.price || 100) - step * 0.05;
                    const size = Math.floor(300 + step * 210 + Math.random() * 50);
                    return (
                      <div
                        key={step}
                        className="relative flex items-center justify-between px-2 py-1 rounded bg-[#131722] font-mono text-[11px] overflow-hidden"
                      >
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-[#089981]/15 pointer-events-none"
                          style={{ width: `${(size / 1000) * 100}%` }}
                        />
                        <span className="text-[#089981] font-bold z-10">${price.toFixed(2)}</span>
                        <span className="text-[#d1d4dc] z-10">{size}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. PAPER TRADING ACCOUNT */}
            {activeTab === 'paperTrading' && (
              <div className="space-y-4">
                {/* Account Summary Card */}
                <div className="bg-gradient-to-br from-[#1e222d] to-[#131722] p-4 rounded-2xl border border-[#2962ff]/40 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#787b86]">
                      Paper Account Balance
                    </div>
                    <span className="text-[10px] font-bold text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded border border-[#089981]/30">
                      LIVE SIMULATOR
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black font-mono text-white">
                      ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-[#787b86] mt-0.5 flex items-center gap-1.5">
                      <span>Cash Available:</span>
                      <span className="font-mono text-white font-bold">
                        ${paperAccount.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2e39] text-[11px]">
                    <div>
                      <span className="text-[#787b86]">Open P&L:</span>
                      <div
                        className={`font-mono font-bold ${
                          totalUnrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#787b86]">Realized P&L:</span>
                      <div
                        className={`font-mono font-bold ${
                          paperAccount.realizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {paperAccount.realizedPnL >= 0 ? '+' : ''}${paperAccount.realizedPnL.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  onClick={onResetPaperAccount}
                  className="w-full py-1.5 bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#787b86] hover:text-white rounded-xl transition text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to $100,000 Starting Cash</span>
                </button>

                {/* Open Positions List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
                    Open Positions ({paperAccount.positions.length})
                  </div>

                  {paperAccount.positions.length === 0 ? (
                    <div className="text-center py-6 text-[#787b86]">
                      No active open positions. Click Buy or Sell in any chart modal to execute orders!
                    </div>
                  ) : (
                    paperAccount.positions.map((pos) => {
                      const currentPrice = allStocks.find((s) => s.symbol === pos.symbol)?.price || pos.currentPrice;
                      const pnl = (currentPrice - pos.entryPrice) * pos.shares;
                      const pnlPct = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
                      const isProfit = pnl >= 0;

                      return (
                        <div
                          key={pos.id}
                          className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                                  pos.side === 'BUY'
                                    ? 'bg-[#089981]/20 text-[#089981]'
                                    : 'bg-[#f23645]/20 text-[#f23645]'
                                }`}
                              >
                                {pos.side}
                              </span>
                              <span className="font-bold text-white">{pos.symbol}</span>
                              <span className="text-[#787b86]">({pos.shares} shs)</span>
                            </div>

                            <button
                              onClick={() => onClosePosition(pos.id)}
                              className="px-2 py-0.5 rounded bg-[#2a2e39] hover:bg-[#f23645] text-white text-[10px] font-bold transition"
                            >
                              Close
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-[#787b86]">Avg: ${pos.entryPrice.toFixed(2)}</span>
                            <span
                              className={`font-bold ${isProfit ? 'text-[#089981]' : 'text-[#f23645]'}`}
                            >
                              {isProfit ? '+' : ''}${pnl.toFixed(2)} ({isProfit ? '+' : ''}
                              {pnlPct.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 5. LIVE NEWS TAB */}
            {activeTab === 'news' && (
              <div className="space-y-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] hover:border-[#363a45] transition cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#787b86]">
                      <span className="font-bold text-[#2962ff]">{item.source}</span>
                      <span>{item.timeAgo}</span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug hover:text-[#2962ff] transition">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#787b86] line-clamp-2">{item.summary}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. ECONOMIC CALENDAR TAB */}
            {activeTab === 'calendar' && (
              <div className="space-y-2.5">
                {economicEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#131722] p-3 rounded-xl border border-[#2a2e39] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          evt.priority === 'HIGH'
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-[#f7931a]/20 text-[#f7931a]'
                        }`}
                      >
                        {evt.priority}
                      </span>
                      <span className="font-mono text-[10px] text-[#787b86]">{evt.time} EST</span>
                    </div>
                    <div className="font-bold text-white text-xs">{evt.title}</div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-[#787b86]">
                      <span>Act: {evt.actual || '--'}</span>
                      <span>Fcst: {evt.forecast || '--'}</span>
                      <span>Prev: {evt.previous || '--'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. KEYBOARD SHORTCUTS TAB */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-3">
                <div className="text-[#787b86] text-xs">
                  Boost your trading speed with TradingView pro key combinations:
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    { key: '⌘K / Ctrl+K', desc: 'Instant Symbol Search' },
                    { key: 'Space', desc: 'Cycle Next Symbol in Watchlist' },
                    { key: 'Alt+W', desc: 'Toggle Watchlist Drawer' },
                    { key: 'Alt+P', desc: 'Open Paper Trading Terminal' },
                    { key: 'Alt+A', desc: 'Create Price Alert' },
                    { key: 'Esc', desc: 'Close Active Modal / Panel' },
                    { key: '1 - 9', desc: 'Switch Chart Timeframe' },
                  ].map((sc, i) => (
                    <div
                      key={i}
                      className="bg-[#131722] p-2 rounded-lg border border-[#2a2e39] flex items-center justify-between"
                    >
                      <kbd className="bg-[#2a2e39] px-2 py-0.5 rounded text-white font-bold text-[10px]">
                        {sc.key}
                      </kbd>
                      <span className="text-[#d1d4dc] font-sans">{sc.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vertical Docking Rail Icons */}
      <div className="w-12 bg-[#1e222d] border-l border-[#2a2e39] flex flex-col items-center py-3 space-y-2">
        <button
          onClick={() => onSelectTab(activeTab === 'watchlist' ? null : 'watchlist')}
          title="Watchlist & Details (Alt+W)"
          className={`p-2.5 rounded-xl transition cursor-pointer relative ${
            activeTab === 'watchlist'
              ? 'bg-[#2962ff] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          {watchlist.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f7931a]"></span>
          )}
        </button>

        <button
          onClick={() => onSelectTab(activeTab === 'alerts' ? null : 'alerts')}
          title="Price Alerts"
          className={`p-2.5 rounded-xl transition cursor-pointer relative ${
            activeTab === 'alerts'
              ? 'bg-[#2962ff] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f23645]"></span>
          )}
        </button>

        <button
          onClick={() => onSelectTab(activeTab === 'orderbook' ? null : 'orderbook')}
          title="Level 2 DOM Order Book"
          className={`p-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'orderbook'
              ? 'bg-[#2962ff] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectTab(activeTab === 'paperTrading' ? null : 'paperTrading')}
          title="Paper Trading Portfolio ($100K)"
          className={`p-2.5 rounded-xl transition cursor-pointer relative ${
            activeTab === 'paperTrading'
              ? 'bg-[#089981] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          {paperAccount.positions.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#089981]"></span>
          )}
        </button>

        <div className="w-6 h-[1px] bg-[#2a2e39] my-1" />

        <button
          onClick={() => onSelectTab(activeTab === 'news' ? null : 'news')}
          title="Market News Wire"
          className={`p-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#2962ff] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Newspaper className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectTab(activeTab === 'calendar' ? null : 'calendar')}
          title="Economic Calendar"
          className={`p-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-[#2962ff] text-white shadow-lg'
              : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
          }`}
        >
          <Calendar className="w-4 h-4" />
        </button>

        {onOpenTalkToUs && (
          <>
            <div className="w-6 h-[1px] bg-[#2a2e39] my-1" />
            <button
              onClick={onOpenTalkToUs}
              title="Talk to Us (Disqus Community Forum)"
              className={`p-2.5 rounded-xl transition cursor-pointer relative group ${
                isTalkToUsActive
                  ? 'bg-[#2962ff] text-white shadow-lg ring-2 ring-[#2962ff]/40'
                  : 'text-white bg-[#2962ff]/20 hover:bg-[#2962ff] hover:text-white border border-[#2962ff]/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#131722]"></span>
              </span>
            </button>
          </>
        )}

        <div className="mt-auto pb-2">
          <button
            onClick={() => onSelectTab(activeTab === 'shortcuts' ? null : 'shortcuts')}
            title="Keyboard Shortcuts (?)"
            className={`p-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'bg-[#2962ff] text-white shadow-lg'
                : 'text-[#787b86] hover:text-white hover:bg-[#252936]'
            }`}
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
