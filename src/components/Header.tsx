import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onBuyNowClick: () => void;
  onNavigateSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onBuyNowClick, onNavigateSection }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#5D0A11]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Marathi Title */}
        <div 
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-header-logo"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E5A93C] via-[#FFD700] to-[#F5D77F] flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#7A0C16] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#FFD700]">ॐ</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white font-serif">
              गणेशोत्सव <span className="text-[#FFD700]">शुभेच्छा</span>
            </h1>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-amber-100/90">
          <button 
            onClick={() => onNavigateSection('hero')}
            className="hover:text-[#FFD700] transition-colors"
            id="nav-link-home"
          >
            गृह (Home)
          </button>
          <button 
            onClick={() => onNavigateSection('features')}
            className="hover:text-[#FFD700] transition-colors"
            id="nav-link-features"
          >
            वैशिष्ट्ये (Features)
          </button>
          <button 
            onClick={() => onNavigateSection('samples')}
            className="hover:text-[#FFD700] transition-colors"
            id="nav-link-samples"
          >
            सॅम्पल कार्ड्स (11 Templates)
          </button>
          <button 
            onClick={() => onNavigateSection('pricing')}
            className="hover:text-[#FFD700] transition-colors"
            id="nav-link-pricing"
          >
            किंमत (Pricing)
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBuyNowClick}
            id="header-buy-now-btn"
            className="relative group overflow-hidden rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] p-[2px] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-md hover:scale-105 transition-all"
          >
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A0C16] text-[#FFD700] font-bold text-sm tracking-wide group-hover:bg-opacity-90 transition-all">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>आत्ताच बनवा ₹49</span>
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
