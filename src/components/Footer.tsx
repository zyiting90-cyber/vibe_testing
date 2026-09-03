import React from 'react';

interface FooterProps {
  onOpenLegal: (title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer
      className="mt-16 border-t border-[#2a2e39] bg-[#131722] py-8 text-xs text-[#787b86]"
      data-purpose="page-footer"
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-center md:text-left">
          <svg className="w-6 h-6 text-[#787b86] fill-current flex-shrink-0" viewBox="0 0 36 28">
            <path d="M14 22H7V11H14V22Z"></path>
            <path d="M22 22H15V6H22V22Z"></path>
            <path d="M2 17.5L5.5 14L9 17.5L5.5 21L2 17.5Z"></path>
            <path d="M29.5 6L33 9.5L29.5 13L26 9.5L29.5 6Z"></path>
          </svg>
          <span>© 2024 TradingView, Inc. All quotes delayed by at least 15 minutes unless specified.</span>
        </div>

        <div className="flex items-center space-x-5">
          <button
            onClick={() => onOpenLegal('Terms of Use')}
            className="hover:text-white transition cursor-pointer"
          >
            Terms of use
          </button>
          <button
            onClick={() => onOpenLegal('Privacy Policy')}
            className="hover:text-white transition cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenLegal('Cookies Policy')}
            className="hover:text-white transition cursor-pointer"
          >
            Cookies
          </button>
          <button
            onClick={() => onOpenLegal('Help Center')}
            className="hover:text-white transition cursor-pointer"
          >
            Help Center
          </button>
        </div>
      </div>
    </footer>
  );
};
