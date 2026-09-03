import React from 'react';
import { NewsItem, EconomicEvent } from '../types';

interface NewsAndCalendarProps {
  news: NewsItem[];
  economicEvents: EconomicEvent[];
  onSelectNews: (news: NewsItem) => void;
  onSelectEvent: (event: EconomicEvent) => void;
  onViewAllNews: () => void;
}

export const NewsAndCalendar: React.FC<NewsAndCalendarProps> = ({
  news,
  economicEvents,
  onSelectNews,
  onSelectEvent,
  onViewAllNews,
}) => {
  return (
    <aside className="space-y-6" data-purpose="news-and-calendar">
      {/* Breaking Market News */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f23645] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f23645]"></span>
            </span>
            <span>Market News</span>
          </h2>
          <button
            onClick={onViewAllNews}
            className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
          >
            All news
          </button>
        </div>

        <div className="space-y-3.5">
          {news.slice(0, 3).map((article, idx) => (
            <article
              key={article.id}
              onClick={() => onSelectNews(article)}
              className={`group cursor-pointer ${
                idx > 0 ? 'border-t border-[#2a2e39]/50 pt-3' : ''
              }`}
            >
              <div className="text-xs text-[#787b86] flex items-center gap-2">
                <span className="font-semibold text-[#d1d4dc]">{article.source}</span>
                <span>•</span>
                <span>{article.timeAgo}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#d1d4dc] group-hover:text-[#2962ff] leading-snug mt-1 transition line-clamp-2">
                {article.title}
              </h3>
            </article>
          ))}
        </div>
      </div>

      {/* Upcoming Economic Calendar Widget */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
          <h2 className="font-bold text-white text-base">Economic Calendar</h2>
          <span className="text-xs text-[#787b86]">Today (EST)</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {economicEvents.map((event, idx) => {
            const isHigh = event.priority === 'HIGH';
            const isMed = event.priority === 'MED';

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`flex items-center justify-between py-1.5 cursor-pointer hover:bg-[#252936] -mx-2 px-2 rounded-lg transition ${
                  idx < economicEvents.length - 1 ? 'border-b border-[#2a2e39]/40' : ''
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                      isHigh
                        ? 'bg-[#f23645]/20 text-[#f23645]'
                        : isMed
                        ? 'bg-[#f7931a]/20 text-[#f7931a]'
                        : 'bg-[#787b86]/20 text-[#787b86]'
                    }`}
                  >
                    {event.priority}
                  </span>
                  <span className="font-sans font-medium text-white truncate hover:text-[#2962ff] transition">
                    {event.title}
                  </span>
                </div>
                <span className="text-[#787b86] flex-shrink-0">{event.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
