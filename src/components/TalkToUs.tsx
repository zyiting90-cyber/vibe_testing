import React, { useEffect } from 'react';
import { MessageSquare, Sparkles, Send, HelpCircle, ShieldCheck, ArrowLeft, Users, Terminal } from 'lucide-react';

interface TalkToUsProps {
  onBackToDashboard: () => void;
}

// Fixed canonical values for Disqus configuration
const DISQUS_PAGE_URL = typeof window !== 'undefined' && window.location.origin
  ? `${window.location.origin}/talk-to-us`
  : 'https://yiting-tobiko.disqus.com/talk-to-us';

const DISQUS_PAGE_IDENTIFIER = 'tradingview-pro-talk-to-us-thread';
const DISQUS_PAGE_TITLE = 'Talk to Us - TradingView Pro Terminal';

export const TalkToUs: React.FC<TalkToUsProps> = ({ onBackToDashboard }) => {
  useEffect(() => {
    const initDisqus = () => {
      const threadContainer = document.getElementById('disqus_thread');
      if (!threadContainer) return;

      const disqusConfig = function (this: any) {
        this.page.url = DISQUS_PAGE_URL;
        this.page.identifier = DISQUS_PAGE_IDENTIFIER;
        this.page.title = DISQUS_PAGE_TITLE;
      };

      // If Disqus is already loaded in the SPA, trigger reset so comments reload inside the mounted container
      if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
        try {
          window.DISQUS.reset({
            reload: true,
            config: disqusConfig,
          });
        } catch (error) {
          console.warn('Disqus reset error:', error);
        }
      } else {
        // Initial setup: set global configuration
        window.disqus_config = disqusConfig;

        // Check if embed script is already injected in document
        const existingScript = document.querySelector<HTMLScriptElement>(
          'script[src="https://yiting-tobiko.disqus.com/embed.js"]'
        );

        if (!existingScript) {
          const d = document;
          const s = d.createElement('script');
          s.src = 'https://yiting-tobiko.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.async = true;
          (d.head || d.body).appendChild(s);
        } else {
          // If script tag already existed, wait for it or trigger reset once ready
          existingScript.onload = () => {
            if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
              window.DISQUS.reset({
                reload: true,
                config: disqusConfig,
              });
            }
          };
        }
      }

      // Ensure Disqus comment count script is also loaded
      if (!document.getElementById('dsq-count-scr')) {
        const countScript = document.createElement('script');
        countScript.id = 'dsq-count-scr';
        countScript.src = '//yiting-tobiko.disqus.com/count.js';
        countScript.async = true;
        (document.head || document.body).appendChild(countScript);
      }
    };

    // Small timeout ensures the DOM node #disqus_thread is fully rendered
    const timer = setTimeout(initDisqus, 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Navigation Header */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2962ff]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 text-xs text-[#787b86] hover:text-white transition font-medium bg-[#131722] border border-[#2a2e39] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Terminal</span>
              </button>

              <span className="inline-flex items-center gap-1 bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                <Users className="w-3 h-3" />
                <span>Live Community Forum</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 24/7</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-[#2962ff]" />
              <span>Talk to Us</span>
            </h1>

            <p className="text-sm text-[#787b86] mt-2 max-w-2xl leading-relaxed">
              Have feedback on our charts, ideas for new indicators, questions about paper trading, or want to discuss trade setups with fellow terminal users? Leave a comment below.
            </p>
          </div>

          {/* Quick Stats / Info Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-2 shrink-0">
            <div className="bg-[#131722] border border-[#2a2e39] rounded-xl px-3 py-2 text-xs">
              <div className="text-[#787b86] text-[10px] uppercase font-bold tracking-wider">Disqus Forum</div>
              <div className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>yiting-tobiko</span>
              </div>
            </div>

            <div className="bg-[#131722] border border-[#2a2e39] rounded-xl px-3 py-2 text-xs">
              <div className="text-[#787b86] text-[10px] uppercase font-bold tracking-wider">Fast Turnaround</div>
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dev Team Monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Suggestion Prompt Chips */}
        <div className="mt-6 pt-5 border-t border-[#2a2e39]/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#787b86] font-medium text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-[#2962ff]" />
            Popular Topics:
          </span>
          <span className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] px-2.5 py-1 rounded-lg">
            ⚡ New Candlestick Indicators (VWAP, MACD)
          </span>
          <span className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] px-2.5 py-1 rounded-lg">
            📈 Crypto / Forex Pair Additions
          </span>
          <span className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] px-2.5 py-1 rounded-lg">
            💼 Paper Trading Feedback
          </span>
          <span className="bg-[#131722] border border-[#2a2e39] text-[#d1d4dc] px-2.5 py-1 rounded-lg">
            🐛 Bug Reports & Latency
          </span>
        </div>
      </div>

      {/* Main Disqus Embed Container Card */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2962ff]"></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Community Discussion Thread
            </h2>
          </div>
          <span className="text-xs text-[#787b86] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Powered by Disqus</span>
          </span>
        </div>

        {/* Embedded Disqus Thread */}
        <div className="disqus-wrapper min-h-[420px] text-white">
          <div id="disqus_thread"></div>
          <noscript>
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              target="_blank"
              rel="noreferrer"
              className="text-[#2962ff] underline font-semibold"
            >
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </div>
  );
};
