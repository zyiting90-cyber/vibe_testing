export type MarketCategory =
  | 'Overview'
  | 'Indices'
  | 'Stocks'
  | 'Crypto'
  | 'Forex'
  | 'Futures'
  | 'Bonds';

export type ScreenerFilter =
  | 'Most Active'
  | 'Top Gainers'
  | 'Top Losers'
  | 'High Volume';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface StockItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  change: number;
  volume: string;
  marketCap: string;
  technicalRating: TechnicalRating;
  iconText?: string;
  iconBg: string;
  iconColor: string;
  isAppleEmoji?: boolean;
  sector: string;
  peRatio?: number;
  high52w: number;
  low52w: number;
  dayHigh: number;
  dayLow: number;
  openPrice: number;
  sparklinePath: string;
  chartPoints: number[];
}

export interface IndexItem {
  id: string;
  symbol: string;
  name: string;
  subName: string;
  badgeText: string;
  badgeBg: string;
  price: number;
  changePercent: number;
  change: number;
  sparklinePath: string;
  isPositive: boolean;
  chartPoints: number[];
  high: number;
  low: number;
  open: number;
}

export interface QuickGlanceItem {
  symbol: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  price: string;
  changePercent: number;
  isPositive: boolean;
}

export interface NewsItem {
  id: string;
  source: string;
  timeAgo: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  relatedSymbols: string[];
}

export interface EconomicEvent {
  id: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  title: string;
  time: string;
  country: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impactDescription: string;
}

export interface TickerTapeItem {
  symbol: string;
  price: string;
  changePercent: string;
  isPositive: boolean;
  changeValue?: string;
}
