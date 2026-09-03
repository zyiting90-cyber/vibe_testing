import React from 'react';
import { X, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

interface LegalModalProps {
  title: string | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ title, onClose }) => {
  if (!title) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 text-white">
            {title.includes('Help') ? (
              <HelpCircle className="w-6 h-6 text-[#2962ff]" />
            ) : title.includes('Privacy') ? (
              <ShieldCheck className="w-6 h-6 text-[#089981]" />
            ) : (
              <FileText className="w-6 h-6 text-[#ff9900]" />
            )}
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          <div className="text-xs text-[#d1d4dc] leading-relaxed space-y-3 font-sans">
            <p>
              TradingView is a charting platform and social network used by 60M+ traders and investors worldwide to spot opportunities across global markets.
            </p>
            <p>
              Market data is delayed by at least 15 minutes unless real-time market feeds have been activated. All financial metrics and quotes displayed are for informational and educational simulation purposes only.
            </p>
            <p className="text-[#787b86]">
              For official support and documentation, visit our 24/7 knowledgebase or contact customer success.
            </p>
          </div>

          <div className="pt-3 border-t border-[#2a2e39] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#2a2e39] hover:bg-[#363a45] text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
