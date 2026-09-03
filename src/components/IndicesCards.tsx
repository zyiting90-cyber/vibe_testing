import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexItem } from '../types';

interface IndicesCardsProps {
  indices: IndexItem[];
  onSelectIndex: (indexItem: IndexItem) => void;
  onViewAllIndices?: () => void;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices,
}) => {
  return (
    <section className="space-y-4" data-purpose="major-indices-cards">
      <div className="flex items-center justify-between">
        <button
          onClick={onViewAllIndices}
          className="inline-flex items-center text-xl font-bold text-white hover:text-[#2962ff] transition group cursor-pointer"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 ml-1 text-[#787b86] group-hover:text-[#2962ff] transform group-hover:translate-x-1 transition" />
        </button>
        <div className="text-xs text-[#787b86] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse"></span>
          <span>Real-time index quotes</span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {indices.map((item) => {
          const isPositive = item.changePercent >= 0;
          const formattedPrice = item.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedChange = (isPositive ? '+' : '') + item.change.toFixed(2);
          const formattedPercent = (isPositive ? '+' : '') + item.changePercent.toFixed(2) + '%';

          return (
            <div
              key={item.id}
              onClick={() => onSelectIndex(item)}
              className="bg-[#1e222d] hover:bg-[#242834] border border-[#2a2e39] hover:border-[#363a45] rounded-xl p-4 flex flex-col justify-between transition duration-200 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0"
                    style={{ backgroundColor: item.badgeBg }}
                  >
                    {item.badgeText}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#2962ff] transition">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#787b86]">{item.subName}</div>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    isPositive
                      ? 'text-[#089981] bg-[#089981]/10'
                      : 'text-[#f23645] bg-[#f23645]/10'
                  }`}
                >
                  {formattedPercent}
                </span>
              </div>

              {/* Sparkline & Price */}
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <div className="text-lg font-bold font-mono text-white leading-tight">
                    {formattedPrice}
                  </div>
                  <div
                    className={`text-xs font-mono font-medium ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {formattedChange}
                  </div>
                </div>

                {/* SVG Sparkline */}
                <svg
                  className={`w-20 h-9 overflow-visible flex-shrink-0 ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                  fill="none"
                  viewBox="0 0 100 35"
                >
                  <path
                    d={item.sparklinePath}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path
                    d={`${item.sparklinePath} L100,35 L0,35 Z`}
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
