import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesCards } from './components/IndicesCards';
import { QuickGlanceSection } from './components/QuickGlanceSection';
import { MoversScreener } from './components/MoversScreener';
import { NewsAndCalendar } from './components/NewsAndCalendar';
import { Footer } from './components/Footer';
import { SymbolModal } from './components/SymbolModal';
import { SearchModal } from './components/SearchModal';
import { NewsModal } from './components/NewsModal';
import { EconomicEventModal } from './components/EconomicEventModal';
import { FullScreenerModal } from './components/FullScreenerModal';
import { GetStartedModal } from './components/GetStartedModal';
import { LegalModal } from './components/LegalModal';
import { MarketStatusBar } from './components/MarketStatusBar';
import { SectorHeatmap } from './components/SectorHeatmap';
import { TalkToUs } from './components/TalkToUs';
import { ProSidebar } from './components/ProSidebar';
import {
  MarketCategory,
  ScreenerFilter,
  StockItem,
  IndexItem,
  QuickGlanceItem,
  NewsItem,
  EconomicEvent,
  TickerTapeItem,
  MainViewMode,
  ProSidebarTab,
  PaperAccount,
  PaperPosition,
  PriceAlert,
} from './types';
import {
  INITIAL_TICKER_ITEMS,
  MAJOR_INDICES,
  QUICK_GLANCE_ITEMS,
  STOCKS_DATA,
  NEWS_ARTICLES,
  ECONOMIC_EVENTS,
  CRYPTO_LIST,
  FOREX_LIST,
  FUTURES_LIST,
  BONDS_LIST,
} from './data/marketData';
import { tradingAudio } from './utils/audio';

export default function App() {
  // Navigation & Category states
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('Markets, everywhere');
  const [screenerTab, setScreenerTab] = useState<ScreenerFilter>('Most Active');
  const [mainViewMode, setMainViewMode] = useState<MainViewMode>('standard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Pro Docking Sidebar state
  const [activeSidebarTab, setActiveSidebarTab] = useState<ProSidebarTab | null>(null);

  // Live market data states
  const [tickerItems, setTickerItems] = useState<TickerTapeItem[]>(INITIAL_TICKER_ITEMS);
  const [indices, setIndices] = useState<IndexItem[]>(MAJOR_INDICES);
  const [quickGlanceItems, setQuickGlanceItems] = useState<QuickGlanceItem[]>(QUICK_GLANCE_ITEMS);
  const [stocksMap, setStocksMap] = useState<Record<string, StockItem[]>>(STOCKS_DATA);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'BTC/USD', 'AAPL', 'MSFT'];
    } catch {
      return ['NVDA', 'BTC/USD', 'AAPL', 'MSFT'];
    }
  });

  // Paper Trading Account State
  const [paperAccount, setPaperAccount] = useState<PaperAccount>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_account');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      cash: 84250.00,
      startingBalance: 100000.00,
      realizedPnL: 1350.20,
      positions: [
        {
          id: 'pos-1',
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          side: 'BUY',
          shares: 20,
          entryPrice: 775.50,
          currentPrice: 788.17,
          openedAt: 'Today, 09:45 AM',
        },
      ],
    };
  });

  // Price Alerts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('tv_price_alerts');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'al-1',
        symbol: 'BTC/USD',
        targetPrice: 65000,
        condition: 'ABOVE',
        createdAt: 'Today, 08:30 AM',
        triggered: false,
      },
      {
        id: 'al-2',
        symbol: 'NVDA',
        targetPrice: 800,
        condition: 'ABOVE',
        createdAt: 'Today, 09:15 AM',
        triggered: false,
      },
    ];
  });

  // Modal states
  const [selectedSymbolItem, setSelectedSymbolItem] = useState<StockItem | IndexItem | QuickGlanceItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [isFullScreenerOpen, setIsFullScreenerOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);
  const [activeAlertToast, setActiveAlertToast] = useState<string | null>(null);

  // Synchronize audio state
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      tradingAudio.enabled = next;
      if (next) tradingAudio.playTick(true);
      return next;
    });
  };

  // Persist watchlist & paper trading
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('tv_paper_account', JSON.stringify(paperAccount));
    } catch {
      // ignore
    }
  }, [paperAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('tv_price_alerts', JSON.stringify(priceAlerts));
    } catch {
      // ignore
    }
  }, [priceAlerts]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Aggregate all symbols for search lookup
  const allSearchSymbols: StockItem[] = useMemo(() => {
    const map = new Map<string, StockItem>();
    (Object.values(stocksMap) as StockItem[][]).forEach((list) => {
      list.forEach((item) => map.set(item.symbol, item));
    });
    CRYPTO_LIST.forEach((item) => map.set(item.symbol, item));
    FOREX_LIST.forEach((item) => map.set(item.symbol, item));
    FUTURES_LIST.forEach((item) => map.set(item.symbol, item));
    BONDS_LIST.forEach((item) => map.set(item.symbol, item));
    return Array.from(map.values());
  }, [stocksMap]);

  // Handle Trade Execution from SuperChart
  const handleExecuteTrade = (
    symbol: string,
    name: string,
    side: 'BUY' | 'SELL',
    shares: number,
    price: number,
    stopLoss?: number,
    takeProfit?: number
  ) => {
    const orderCost = price * shares;

    setPaperAccount((prev) => {
      if (side === 'BUY' && prev.cash < orderCost) {
        alert('Insufficient cash in paper account to execute this order.');
        return prev;
      }

      const newCash = side === 'BUY' ? prev.cash - orderCost : prev.cash + orderCost;
      const newPos: PaperPosition = {
        id: `pos-${Date.now()}`,
        symbol,
        name,
        side,
        shares,
        entryPrice: price,
        currentPrice: price,
        stopLoss,
        takeProfit,
        openedAt: 'Just now',
      };

      return {
        ...prev,
        cash: newCash,
        positions: [newPos, ...prev.positions],
      };
    });
  };

  const handleClosePosition = (positionId: string) => {
    setPaperAccount((prev) => {
      const pos = prev.positions.find((p) => p.id === positionId);
      if (!pos) return prev;
      const currentPrice = allSearchSymbols.find((s) => s.symbol === pos.symbol)?.price || pos.currentPrice;
      const proceeds = currentPrice * pos.shares;
      const pnl = pos.side === 'BUY'
        ? (currentPrice - pos.entryPrice) * pos.shares
        : (pos.entryPrice - currentPrice) * pos.shares;

      tradingAudio.playOrderFill(pos.side === 'BUY' ? 'SELL' : 'BUY');

      return {
        ...prev,
        cash: prev.cash + proceeds,
        realizedPnL: prev.realizedPnL + pnl,
        positions: prev.positions.filter((p) => p.id !== positionId),
      };
    });
  };

  const handleResetPaperAccount = () => {
    setPaperAccount({
      cash: 100000.00,
      startingBalance: 100000.00,
      realizedPnL: 0.00,
      positions: [],
    });
  };

  const handleAddAlert = (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: PriceAlert = {
      id: `al-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: 'Just now',
      triggered: false,
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const handleRemoveAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Keyboard Navigation: Space = cycle watchlist; Alt+W = watchlist, Alt+P = paper trading, ? = shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' && !selectedSymbolItem && !isSearchOpen) {
        e.preventDefault();
        // Cycle through watchlist items
        if (watchlist.length > 0) {
          const randSym = watchlist[Math.floor(Math.random() * watchlist.length)];
          const found = allSearchSymbols.find((s) => s.symbol === randSym);
          if (found) {
            setSelectedSymbolItem(found);
            tradingAudio.playTick(true);
          }
        }
      } else if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setActiveSidebarTab((prev) => (prev === 'watchlist' ? null : 'watchlist'));
      } else if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setActiveSidebarTab((prev) => (prev === 'paperTrading' ? null : 'paperTrading'));
      } else if (e.key === '?') {
        e.preventDefault();
        setActiveSidebarTab('shortcuts');
      } else if (e.key === 'Escape') {
        setActiveSidebarTab(null);
        setSelectedSymbolItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [watchlist, allSearchSymbols, selectedSymbolItem, isSearchOpen]);

  // Real-time market tick simulation with sound & flashes
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Ticker fluctuation
      setTickerItems((prev) => {
        const randIndex = Math.floor(Math.random() * prev.length);
        const item = prev[randIndex];
        const numVal = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (isNaN(numVal)) return prev;

        const delta = (Math.random() - 0.49) * 0.0015 * numVal;
        const newNum = numVal + delta;
        const isUp = delta >= 0;

        if (soundEnabled && Math.random() > 0.6) {
          tradingAudio.playTick(isUp);
        }

        const updated = [...prev];
        updated[randIndex] = {
          ...item,
          price: item.price.startsWith('$')
            ? `$${newNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : item.price.includes('%')
            ? `${newNum.toFixed(3)}%`
            : newNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isPositive: isUp,
          flash: isUp ? 'green' : 'red',
        };
        return updated;
      });

      // 2. Micro fluctuation on active stocks
      setStocksMap((prev) => {
        const activeList = prev['Most Active'] || [];
        if (activeList.length === 0) return prev;
        const randStockIdx = Math.floor(Math.random() * activeList.length);
        const stock = activeList[randStockIdx];
        const delta = (Math.random() - 0.48) * 0.0012 * stock.price;
        const newPrice = stock.price + delta;

        // Check if any price alert triggered
        priceAlerts.forEach((alert) => {
          if (!alert.triggered && alert.symbol === stock.symbol) {
            const hit = alert.condition === 'ABOVE' ? newPrice >= alert.targetPrice : newPrice <= alert.targetPrice;
            if (hit) {
              tradingAudio.playAlert();
              setActiveAlertToast(`🔔 Alert Triggered: ${stock.symbol} reached $${newPrice.toFixed(2)} (${alert.condition} $${alert.targetPrice})`);
              setTimeout(() => setActiveAlertToast(null), 5000);
            }
          }
        });

        const updatedList = [...activeList];
        updatedList[randStockIdx] = {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          changePercent: parseFloat((stock.changePercent + (delta / stock.price) * 100).toFixed(2)),
        };

        return {
          ...prev,
          'Most Active': updatedList,
        };
      });
    }, 3600);

    return () => clearInterval(interval);
  }, [soundEnabled, priceAlerts]);

  // Handler to open symbol detail by symbol name
  const handleSelectSymbolByName = useCallback((symbolName: string) => {
    const foundStock = allSearchSymbols.find(
      (s) => s.symbol.toLowerCase() === symbolName.toLowerCase()
    );
    if (foundStock) {
      setSelectedSymbolItem(foundStock);
      return;
    }
    const foundIndex = indices.find(
      (i) =>
        i.symbol.toLowerCase() === symbolName.toLowerCase() ||
        i.name.toLowerCase().includes(symbolName.toLowerCase())
    );
    if (foundIndex) {
      setSelectedSymbolItem(foundIndex);
      return;
    }
    const foundGlance = quickGlanceItems.find(
      (g) => g.symbol.toLowerCase() === symbolName.toLowerCase()
    );
    if (foundGlance) {
      setSelectedSymbolItem(foundGlance);
      return;
    }

    setSelectedSymbolItem({
      symbol: symbolName,
      name: `${symbolName} Asset`,
      price: 150.0,
      changePercent: 1.25,
      change: 1.85,
      volume: '15.2M',
      marketCap: '120B',
      technicalRating: 'Buy',
      iconBg: '#2962ff',
      iconColor: '#ffffff',
      sector: 'Financial Instrument',
      high52w: 180.0,
      low52w: 110.0,
      dayHigh: 152.0,
      dayLow: 148.5,
      openPrice: 149.0,
      sparklinePath: 'M0,20 Q25,15 50,10 T80,3',
      chartPoints: [149.0, 149.5, 150.2, 150.0],
    });
  }, [allSearchSymbols, indices, quickGlanceItems]);

  // Current active stock list based on active category
  const currentStocksList = useMemo(() => {
    if (activeCategory === 'Crypto') return CRYPTO_LIST;
    if (activeCategory === 'Forex') return FOREX_LIST;
    if (activeCategory === 'Futures') return FUTURES_LIST;
    if (activeCategory === 'Bonds') return BONDS_LIST;
    return stocksMap[screenerTab] || stocksMap['Most Active'];
  }, [activeCategory, screenerTab, stocksMap]);

  return (
    <div className="bg-[#131722] text-[#d1d4dc] font-sans antialiased min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white relative">
      {/* Top Header */}
      <Header
        tickerItems={tickerItems}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        onSelectSymbol={handleSelectSymbolByName}
        onOpenSidebarTab={(tab) => setActiveSidebarTab(tab)}
        watchlistCount={watchlist.length}
        paperBalance={paperAccount.cash}
        currentViewMode={mainViewMode}
        onSelectViewMode={(mode) => setMainViewMode(mode)}
      />

      {/* Market Status & Global Hub Clocks Bar */}
      <MarketStatusBar
        currentMode={mainViewMode}
        onModeChange={(mode) => setMainViewMode(mode)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Global Alert Notification Toast */}
      {activeAlertToast && (
        <div className="fixed top-28 right-16 z-50 bg-[#1e222d] border border-[#f7931a] text-[#f7931a] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-200">
          <span className="font-bold text-xs">{activeAlertToast}</span>
          <button
            onClick={() => setActiveAlertToast(null)}
            className="text-[#787b86] hover:text-white font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Layout (with right margin for docking rail) */}
      <main
        className="flex-grow max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6 space-y-8 pr-14"
        id="main-content"
      >
        {/* VIEW 1: Talk to Us (Disqus Community Forum) */}
        {mainViewMode === 'talkToUs' ? (
          <TalkToUs onBackToDashboard={() => setMainViewMode('standard')} />
        ) : (
          <>
            {/* Hero Title & Category Filter Pills */}
            <HeroSection
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setMainViewMode('standard');
              }}
              selectedRegion={selectedRegion}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
              onOpenTalkToUs={() => setMainViewMode('talkToUs')}
            />

            {/* VIEW 2: Sector Heatmap */}
            {mainViewMode === 'heatmap' ? (
              <SectorHeatmap
                stocks={allSearchSymbols}
                onSelectStock={(stock) => setSelectedSymbolItem(stock)}
              />
            ) : (
              /* VIEW 3: Standard Professional Dashboard */
              <>
                {/* Major Indices Cards */}
                {(activeCategory === 'Overview' || activeCategory === 'Indices') && (
                  <IndicesCards
                    indices={indices}
                    onSelectIndex={(indexItem) => setSelectedSymbolItem(indexItem)}
                    onViewAllIndices={() => setActiveCategory('Indices')}
                  />
                )}

                {/* Quick Glance FX & Crypto */}
                {(activeCategory === 'Overview' || activeCategory === 'Crypto' || activeCategory === 'Forex') && (
                  <QuickGlanceSection
                    items={quickGlanceItems}
                    onSelectItem={(item) => setSelectedSymbolItem(item)}
                  />
                )}

                {/* Main Data Feed Split Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* LEFT 2 COLS: Active Movers Screener Table */}
                  <MoversScreener
                    activeTab={screenerTab}
                    onTabChange={(tab) => setScreenerTab(tab)}
                    stocks={currentStocksList}
                    onSelectStock={(stock) => setSelectedSymbolItem(stock)}
                    onOpenFullScreener={() => setIsFullScreenerOpen(true)}
                  />

                  {/* RIGHT 1 COL: News & Economic Calendar Feed */}
                  <NewsAndCalendar
                    news={NEWS_ARTICLES}
                    economicEvents={ECONOMIC_EVENTS}
                    onSelectNews={(article) => setSelectedNews(article)}
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    onViewAllNews={() => {
                      if (NEWS_ARTICLES[0]) setSelectedNews(NEWS_ARTICLES[0]);
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Pro Right-Side Docking Rail & Sidebar */}
      <ProSidebar
        activeTab={activeSidebarTab}
        onSelectTab={(tab) => setActiveSidebarTab(tab)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
        allStocks={allSearchSymbols}
        onSelectStock={(stock) => setSelectedSymbolItem(stock)}
        alerts={priceAlerts}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
        paperAccount={paperAccount}
        onClosePosition={handleClosePosition}
        onResetPaperAccount={handleResetPaperAccount}
        economicEvents={ECONOMIC_EVENTS}
        news={NEWS_ARTICLES}
        onOpenTalkToUs={() => setMainViewMode(mainViewMode === 'talkToUs' ? 'standard' : 'talkToUs')}
        isTalkToUsActive={mainViewMode === 'talkToUs'}
      />

      {/* Floating Quick "Talk to Us" Action Pill */}
      <div className="fixed bottom-6 right-16 z-40 hidden sm:block">
        <button
          onClick={() => setMainViewMode(mainViewMode === 'talkToUs' ? 'standard' : 'talkToUs')}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-2xl transition cursor-pointer duration-200 border ${
            mainViewMode === 'talkToUs'
              ? 'bg-[#1e222d] hover:bg-[#252936] text-white border-[#2a2e39]'
              : 'bg-gradient-to-r from-[#2962ff] to-[#1e53e5] text-white border-[#2962ff] hover:scale-105 shadow-[#2962ff]/30 ring-2 ring-[#2962ff]/20'
          }`}
          title="Toggle Talk to Us Community Forum"
        >
          {mainViewMode === 'talkToUs' ? (
            <span className="text-[11px] text-[#d1d4dc]">← Back to Dashboard</span>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span>Talk to Us</span>
              <span className="bg-white/20 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-black">
                DISQUS
              </span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenLegal={(title) => setLegalModalTitle(title)}
        onOpenTalkToUs={() => setMainViewMode('talkToUs')}
      />

      {/* SuperChart Symbol Modal */}
      {selectedSymbolItem && (
        <SymbolModal
          item={selectedSymbolItem}
          onClose={() => setSelectedSymbolItem(null)}
          isWatchlisted={watchlist.includes(selectedSymbolItem.symbol)}
          onToggleWatchlist={toggleWatchlist}
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allSymbols={allSearchSymbols}
        onSelectSymbol={(stock) => setSelectedSymbolItem(stock)}
      />

      {/* News Modal */}
      {selectedNews && (
        <NewsModal
          article={selectedNews}
          onClose={() => setSelectedNews(null)}
          onSelectSymbol={handleSelectSymbolByName}
        />
      )}

      {/* Economic Event Modal */}
      {selectedEvent && (
        <EconomicEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Full Screener Modal */}
      <FullScreenerModal
        isOpen={isFullScreenerOpen}
        onClose={() => setIsFullScreenerOpen(false)}
        stocks={allSearchSymbols}
        onSelectStock={(stock) => setSelectedSymbolItem(stock)}
      />

      {/* Get Started Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Legal & Info Modal */}
      <LegalModal
        title={legalModalTitle}
        onClose={() => setLegalModalTitle(null)}
      />
    </div>
  );
}
