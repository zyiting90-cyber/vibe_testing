import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto" />
            <h3 className="text-xl font-bold text-white">Welcome to TradingView!</h3>
            <p className="text-xs text-[#787b86]">
              Your account demo is active. Real-time streaming charts and watchlists are ready.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 36 28">
                  <path d="M14 22H7V11H14V22Z"></path>
                  <path d="M22 22H15V6H22V22Z"></path>
                  <path d="M2 17.5L5.5 14L9 17.5L5.5 21L2 17.5Z"></path>
                  <path d="M29.5 6L33 9.5L29.5 13L26 9.5L29.5 6Z"></path>
                </svg>
                <span className="font-bold text-white text-lg">TradingView</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Where the world does markets</h2>
              <p className="text-xs text-[#787b86] mt-1">
                Join over 60 million traders and investors exploring financial markets worldwide.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#d1d4dc] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#131722] border border-[#2a2e39] focus:border-[#2962ff] rounded-xl px-3.5 py-2 text-sm text-white placeholder-[#787b86] outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full tv-btn-gradient text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[11px] text-[#787b86] text-center pt-2 border-t border-[#2a2e39]">
              By continuing, you agree to TradingView's Terms of Service and Privacy Policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
