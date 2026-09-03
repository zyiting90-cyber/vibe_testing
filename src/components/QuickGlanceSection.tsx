import React from 'react';
import { QuickGlanceItem } from '../types';

interface QuickGlanceSectionProps {
  items: QuickGlanceItem[];
  onSelectItem: (item: QuickGlanceItem) => void;
}

export const QuickGlanceSection: React.FC<QuickGlanceSectionProps> = ({
  items,
  onSelectItem,
}) => {
  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      data-purpose="crypto-forex-summary"
    >
      {items.map((item) => {
        const isPositive = item.changePercent >= 0;
        const formattedPercent = (isPositive ? '+' : '') + item.changePercent.toFixed(2) + '%';

        return (
          <div
            key={item.symbol}
            onClick={() => onSelectItem(item)}
            className="bg-[#1e222d] hover:bg-[#242834] border border-[#2a2e39] hover:border-[#363a45] rounded-xl p-4 flex items-center justify-between transition duration-150 cursor-pointer group shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  backgroundColor: item.iconBg,
                  color: item.iconColor,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-white leading-tight group-hover:text-[#2962ff] transition">
                  {item.symbol}
                </div>
                <div className="text-xs text-[#787b86]">{item.name}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-white text-sm sm:text-base">
                {item.price}
              </div>
              <div
                className={`text-xs font-semibold ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {formattedPercent}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
