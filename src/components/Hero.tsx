import React from 'react';
import { Sparkles, ShieldCheck, Zap, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface HeroProps {
  onBuyNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuyNowClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#5D0A11] via-[#7B0D16] to-[#40060B] text-white py-12 sm:py-20 border-b border-[#D4AF37]/30">
      
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E5A93C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-12 max-w-4xl mx-auto text-center space-y-6">
            
            {/* Top Festive Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFDF6D] text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>गणेशोत्सवानिमित्त खास डिजिटल भेट</span>
            </div>

            {/* Marathi Calligraphy & Title */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD700] tracking-wider font-serif drop-shadow-md">
                गणपती बाप्पा मोरया
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-100/95 tracking-wide">
                अवघ्या काही सेकंदात बनवा <span className="text-[#FFD700] underline decoration-[#FFD700]/50 underline-offset-8">११ आकर्षक HD</span> शुभेच्छा!
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onBuyNowClick}
                id="hero-cta-buy-now-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] text-[#540813] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/20"
              >
                <span>आत्ताच तयार करा • फक्त ₹४९</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                <span>Razorpay द्वारे १००% सुरक्षित पेमेंट</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
