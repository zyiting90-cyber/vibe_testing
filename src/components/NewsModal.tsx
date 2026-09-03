import React from 'react';
import { X, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsModalProps {
  article: NewsItem | null;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  article,
  onClose,
  onSelectSymbol,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2e39]">
          <div className="flex items-center space-x-2 text-xs text-[#787b86]">
            <span className="font-bold text-white bg-[#2a2e39] px-2.5 py-1 rounded-md">
              {article.source}
            </span>
            <span>•</span>
            <span>{article.timeAgo}</span>
            <span>•</span>
            <span>By {article.author}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }}
              className="p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {article.title}
          </h2>

          <div className="p-3.5 bg-[#131722] rounded-xl border border-[#2a2e39] text-xs text-[#d1d4dc] leading-relaxed italic">
            "{article.summary}"
          </div>

          <div className="text-sm text-[#d1d4dc] leading-relaxed space-y-3 whitespace-pre-line font-sans">
            {article.content}
          </div>

          {/* Related Symbols */}
          <div className="pt-4 border-t border-[#2a2e39]">
            <div className="text-xs font-semibold text-[#787b86] mb-2">Related Symbols:</div>
            <div className="flex flex-wrap gap-2">
              {article.relatedSymbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    onClose();
                    onSelectSymbol(sym);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#131722] hover:bg-[#2962ff] hover:text-white border border-[#2a2e39] text-xs font-bold font-mono text-[#2962ff] transition cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
