import React from 'react';

interface FooterProps {
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  return (
    <footer className="bg-[#4A0404] text-amber-100/90 border-t border-[#FFD700]/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Brand & Note */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#FFD700] font-serif">
            गणेशोत्सव शुभेच्छा जनरेटर २०२६
          </h3>
          <p className="text-xs text-amber-200/80 max-w-md mx-auto">
            "ही सेवा केवळ डिजिटल शुभेच्छा तयार करण्यासाठी आहे."
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-amber-200">
          <button
            onClick={() => onOpenPolicy('terms')}
            className="hover:text-[#FFD700] transition-colors underline decoration-amber-200/30"
          >
            Terms &amp; Conditions
          </button>
          <button
            onClick={() => onOpenPolicy('privacy')}
            className="hover:text-[#FFD700] transition-colors underline decoration-amber-200/30"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenPolicy('refund')}
            className="hover:text-[#FFD700] transition-colors underline decoration-amber-200/30"
          >
            Refund Policy
          </button>
          <button
            onClick={() => onOpenPolicy('disclaimer')}
            className="hover:text-[#FFD700] transition-colors underline decoration-amber-200/30"
          >
            Disclaimer
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-amber-200/60 pt-4 border-t border-amber-200/10">
          © 2026 Ganesh Festival Greeting Generator. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};
