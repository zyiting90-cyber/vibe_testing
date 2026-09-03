import React, { useState, useEffect, useMemo } from 'react';
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
import {
  MarketCategory,
  ScreenerFilter,
  StockItem,
  IndexItem,
  QuickGlanceItem,
  NewsItem,
  EconomicEvent,
  TickerTapeItem,
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

export default function App() {
  // Navigation & Category states
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('Markets, everywhere');
  const [screenerTab, setScreenerTab] = useState<ScreenerFilter>('Most Active');

  // Live market data states
  const [tickerItems, setTickerItems] = useState<TickerTapeItem[]>(INITIAL_TICKER_ITEMS);
  const [indices, setIndices] = useState<IndexItem[]>(MAJOR_INDICES);
  const [quickGlanceItems, setQuickGlanceItems] = useState<QuickGlanceItem[]>(QUICK_GLANCE_ITEMS);
  const [stocksMap, setStocksMap] = useState<Record<string, StockItem[]>>(STOCKS_DATA);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'BTC/USD', 'AAPL'];
    } catch {
      return ['NVDA', 'BTC/USD', 'AAPL'];
    }
  });

  // Modal states
  const [selectedSymbolItem, setSelectedSymbolItem] = useState<StockItem | IndexItem | QuickGlanceItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [isFullScreenerOpen, setIsFullScreenerOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);

  // Persist watchlist
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Simulated live ticker fluctuations (like real market ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random ticker item and slightly adjust price
      setTickerItems((prev) => {
        const randIndex = Math.floor(Math.random() * prev.length);
        const item = prev[randIndex];
        const numVal = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (isNaN(numVal)) return prev;

        const delta = (Math.random() - 0.49) * 0.002 * numVal;
        const newNum = numVal + delta;
        const isUp = delta >= 0;

        const updated = [...prev];
        updated[randIndex] = {
          ...item,
          price: item.price.startsWith('$')
            ? `$${newNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : item.price.includes('%')
            ? `${newNum.toFixed(3)}%`
            : newNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          isPositive: isUp,
        };
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

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

  // Handler to open symbol detail by symbol name
  const handleSelectSymbolByName = (symbolName: string) => {
    // 1. Check in stocks
    const foundStock = allSearchSymbols.find(
      (s) => s.symbol.toLowerCase() === symbolName.toLowerCase()
    );
    if (foundStock) {
      setSelectedSymbolItem(foundStock);
      return;
    }
    // 2. Check in indices
    const foundIndex = indices.find(
      (i) =>
        i.symbol.toLowerCase() === symbolName.toLowerCase() ||
        i.name.toLowerCase().includes(symbolName.toLowerCase())
    );
    if (foundIndex) {
      setSelectedSymbolItem(foundIndex);
      return;
    }
    // 3. Check in quick glance
    const foundGlance = quickGlanceItems.find(
      (g) => g.symbol.toLowerCase() === symbolName.toLowerCase()
    );
    if (foundGlance) {
      setSelectedSymbolItem(foundGlance);
      return;
    }

    // Default fallback mock item so modal opens gracefully
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
  };

  // Get current active stock list based on active category
  const currentStocksList = useMemo(() => {
    if (activeCategory === 'Crypto') return CRYPTO_LIST;
    if (activeCategory === 'Forex') return FOREX_LIST;
    if (activeCategory === 'Futures') return FUTURES_LIST;
    if (activeCategory === 'Bonds') return BONDS_LIST;
    return stocksMap[screenerTab] || stocksMap['Most Active'];
  }, [activeCategory, screenerTab, stocksMap]);

  return (
    <div className="bg-[#131722] text-[#d1d4dc] font-sans antialiased min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white">
      {/* Top Navigation Bar with live ticker */}
      <Header
        tickerItems={tickerItems}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        onSelectSymbol={handleSelectSymbolByName}
      />

      {/* Main Content Layout */}
      <main
        className="flex-grow max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-8 space-y-10"
        id="main-content"
      >
        {/* Hero Title & Category Filter Pills */}
        <HeroSection
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
        />

        {/* Section 1: Major Indices Cards (Visible in Overview and Indices category) */}
        {(activeCategory === 'Overview' || activeCategory === 'Indices') && (
          <IndicesCards
            indices={indices}
            onSelectIndex={(indexItem) => setSelectedSymbolItem(indexItem)}
            onViewAllIndices={() => setActiveCategory('Indices')}
          />
        )}

        {/* Section 2: Quick Glance FX & Crypto (Visible in Overview, Crypto, Forex) */}
        {(activeCategory === 'Overview' || activeCategory === 'Crypto' || activeCategory === 'Forex') && (
          <QuickGlanceSection
            items={quickGlanceItems}
            onSelectItem={(item) => setSelectedSymbolItem(item)}
          />
        )}

        {/* Section 3: Main Data Feed Split Section */}
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
      </main>

      {/* Footer */}
      <Footer onOpenLegal={(title) => setLegalModalTitle(title)} />

      {/* Interactive Modals */}
      {selectedSymbolItem && (
        <SymbolModal
          item={selectedSymbolItem}
          onClose={() => setSelectedSymbolItem(null)}
          isWatchlisted={watchlist.includes(selectedSymbolItem.symbol)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allSymbols={allSearchSymbols}
        onSelectSymbol={(stock) => setSelectedSymbolItem(stock)}
      />

      {selectedNews && (
        <NewsModal
          article={selectedNews}
          onClose={() => setSelectedNews(null)}
          onSelectSymbol={handleSelectSymbolByName}
        />
      )}

      {selectedEvent && (
        <EconomicEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <FullScreenerModal
        isOpen={isFullScreenerOpen}
        onClose={() => setIsFullScreenerOpen(false)}
        stocks={allSearchSymbols}
        onSelectStock={(stock) => setSelectedSymbolItem(stock)}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      <LegalModal
        title={legalModalTitle}
        onClose={() => setLegalModalTitle(null)}
      />
    </div>
  );
}
