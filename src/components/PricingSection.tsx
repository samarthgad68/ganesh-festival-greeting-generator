import React from 'react';
import { Check, ShieldCheck, Sparkles, CreditCard, Lock, Zap } from 'lucide-react';

interface PricingSectionProps {
  onBuyNowClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onBuyNowClick }) => {
  const points = [
    'संपूर्ण ११ राजेशाही गणेशोत्सव शुभेच्छा कार्ड्स',
    'आपला स्वतःचा फोटो आणि नाव जोडण्याची सोय',
    'व्यवसायाची माहिती, हुद्दा, पत्ता व मोबाईल नंबर',
    '१०८० × १९२० HD पोर्ट्रेट फॉरमॅट डाउनलोड',
    'Single PNG किंवा All In One ZIP डाउनलोड पर्याय',
    'कोणतेही लपलेले शुल्क नाही (100% पारदर्शक)',
    'कोणताही पासवर्ड किंवा अकाउंट तयार करण्याची गरज नाही',
    'डाऊनलोडनंतर तुमचा डेटा सुरक्षितपणे आपोआप हटवला जातो',
  ];

  return (
    <section id="pricing" className="py-16 bg-[#FDFBF7] text-gray-900 border-b border-amber-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7A0C16] font-serif">
            फक्त ₹४९ मध्ये सर्व ११ कार्ड्स
          </h2>
          <p className="text-gray-600 text-base">
            एकदाच भरणा करा आणि मिळवा ११ आकर्षक हाय-डेफिनिशन शुभेच्छा पत्रे.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl border-2 border-[#FFD700] shadow-2xl overflow-hidden relative">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#540813] via-[#7A0C16] to-[#540813] text-white p-6 sm:p-8 text-center space-y-3 relative">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-2xl font-bold text-amber-200 line-through opacity-75">₹१९९</span>
              <span className="text-5xl sm:text-6xl font-black text-[#FFD700] font-serif">₹४९</span>
              <span className="text-amber-100 text-sm font-medium">/ सर्व ११ कार्ड्स</span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium">
              (मर्यादित कालावधीसाठी सवलतीचा दर)
            </p>
          </div>

          {/* Points List */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7A0C16] text-[#FFD700] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 text-center space-y-3">
              <button
                onClick={onBuyNowClick}
                id="pricing-cta-buy-now-btn"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] text-[#540813] font-black text-xl shadow-xl hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-3 border-2 border-white/20"
              >
                <Zap className="w-6 h-6 fill-[#540813]" />
                <span>आत्ताच तयार करा</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL सुरक्षा
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" /> UPI / Cards / NetBanking
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
