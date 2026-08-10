import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, X, ArrowRight } from 'lucide-react';
import { TemplateSample } from '../types';

interface SampleTemplatesProps {
  onBuyNowClick: () => void;
}

const FALLBACK_SAMPLES: TemplateSample[] = [
  { id: 1, name: 'Royal Velvet Red & Gold', marathiName: 'शाही लाल-सुवर्ण', badgeText: 'हार्दिक शुभेच्छा', mainGreeting: 'गणेशोत्सवाच्या हार्दिक शुभेच्छा', previewUrl: '/assets/Images/Page 1.jpg' },
  { id: 2, name: 'Saffron Golden Sun', marathiName: 'केसरी सुवर्ण प्रभा', badgeText: 'गणपती बाप्पा मोरया', mainGreeting: 'श्री गणेश चतुर्थीच्या मनःपूर्वक शुभेच्छा', previewUrl: '/assets/Images/Page 2.jpg' },
  { id: 3, name: 'Siddhivinayak Palace', marathiName: 'सिद्धिविनायक राज दरबार', badgeText: 'शुभ गणेशोत्सव', mainGreeting: 'गणेशोत्सव पर्वाच्या अनंत शुभेच्छा', previewUrl: '/assets/Images/Page 3.jpg' },
  { id: 4, name: 'Royal Midnight Gold Dust', marathiName: 'शाही निळा सुवर्ण', badgeText: 'विघ्नहर्त्याचे आगमन', mainGreeting: 'अष्टविनायक कृपाप्रसाद', previewUrl: '/assets/Images/Page 4.jpg' },
  { id: 5, name: 'Marathmola Heritage Orange', marathiName: 'मराठमोळा पारंपारिक', badgeText: 'उत्सव आनंदाचा', mainGreeting: 'आनंदमय गणेशोत्सव', previewUrl: '/assets/Images/Page 5.jpg' },
  { id: 6, name: 'Golden Shrine & Diyas', marathiName: 'सुवर्ण दीपम उत्सव', badgeText: 'दीप्त गणेशोत्सव', mainGreeting: 'मंगलमय गणेश चतुर्थी', previewUrl: '/assets/Images/Page 6.jpg' },
  { id: 7, name: 'Royal Silk Maroon', marathiName: 'रेशमी मरून राजेशाही', badgeText: 'मंगलमूर्ती मोरया', mainGreeting: 'चिंतामणी चरणी नतमस्तक', previewUrl: '/assets/Images/Page 7.jpg' },
  { id: 8, name: 'Royal Gold Rangoli', marathiName: 'सुवर्ण रांगोळी वैभव', badgeText: 'वैभवशाली गणेशोत्सव', mainGreeting: 'गणेशोत्सवानिमित्त मंगलमय शुभेच्छा', previewUrl: '/assets/Images/Page 8.jpg' },
  { id: 9, name: 'Majestic Saffron Silk', marathiName: 'वैभवशाली केसरी रेशीम', badgeText: 'बाप्पा मोरया', mainGreeting: 'भाद्रपद गणेशोत्सव पर्व', previewUrl: '/assets/Images/Page 9.jpg' },
  { id: 10, name: 'Royal Purple Velvet', marathiName: 'शाही जांभळा सुवर्ण', badgeText: 'वरदविनायक कृपा', mainGreeting: 'श्री गणेशाचा दिव्य आशीर्वाद', previewUrl: '/assets/Images/Page 10.jpg' },
  { id: 11, name: 'Golden Festive Festoon', marathiName: 'सुवर्ण तोरण उत्सव', badgeText: 'मंगलमूर्ती मोरया', mainGreeting: 'गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या!', previewUrl: '/assets/Images/Page 11.jpg' },
];

export const SampleTemplates: React.FC<SampleTemplatesProps> = ({ onBuyNowClick }) => {
  const [samples, setSamples] = useState<TemplateSample[]>(FALLBACK_SAMPLES);
  const [allInOneUrl, setAllInOneUrl] = useState<string>('/Thumbnail/all-in-one.jpg');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSample, setSelectedSample] = useState<TemplateSample | null>(null);
  const [showAllInOneModal, setShowAllInOneModal] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/greetings/samples', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          if (data.allInOneUrl) {
            setAllInOneUrl(data.allInOneUrl);
          }
          if (data.templates && data.templates.length > 0) {
            setSamples(data.templates);
          }
        }
      })
      .catch((err) => {
        console.warn('Using fallback template samples:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="samples" className="py-16 bg-gradient-to-b from-[#5D0A11] via-[#7A0C16] to-[#5D0A11] text-white border-t border-b border-[#FFD700]/30 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 text-[#FFDF6D] text-sm font-bold">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>सॅम्पल डिझाईन्स (११ पूर्ण कार्ड्स • All-In-One Poster)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFD700] font-serif">
            तुम्हाला मिळणारी 11 गणेशोत्सव Greetings
          </h2>
          <p className="text-amber-100/90 text-sm sm:text-base">
            खालील ऑल-इन-वन पोस्टरवर क्लिक करून ६००० × ३६०० पिक्सेल अल्ट्रा एचडी सॅम्पल पहा.
          </p>
        </div>

        {/* Loading Spinner or Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            <p className="text-amber-200 text-sm font-medium">११ सॅम्पल टेम्पलेट्स लोड होत आहेत...</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Master All-in-One 6000x3600 Poster Showcase */}
            <div className="relative group bg-[#4A0404] rounded-3xl border-2 border-[#FFD700] overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#FFD700] hover:shadow-amber-500/30">
              <div 
                className="relative aspect-[6000/3600] w-full bg-black/60 overflow-hidden cursor-pointer"
                onClick={() => setShowAllInOneModal(true)}
              >
                <img
                  src={allInOneUrl}
                  alt="11-in-1 Master Sample Greetings Poster (6000x3600)"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback if image fails
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('/Thumbnail/')) {
                      target.src = '/Thumbnail/all in one.jpg';
                    }
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-80 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 bg-[#FFD700] text-[#540813] text-xs sm:text-sm font-black px-4 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-[#540813]" />
                  <span>६००० × ३६०० px अल्ट्रा HD सॅम्पल कार्ड्स</span>
                </div>

                {/* Zoom Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD700] text-[#540813] font-black text-base shadow-2xl hover:scale-105 transition-transform">
                    <Eye className="w-5 h-5 text-[#540813]" />
                    <span>पूर्ण स्क्रीन वर पहा (Full HD View)</span>
                  </span>
                </div>
              </div>

              {/* Poster Footer Note */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-[#5D0A11] via-[#7A0C16] to-[#5D0A11] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#FFD700]/30">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-amber-100">
                    तुमचे नाव, फोटो, पद आणि पत्त्यासह सर्व ११ कार्ड्स तयार होतात.
                  </p>
                </div>
                <button
                  onClick={() => setShowAllInOneModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FFD700] text-[#540813] font-bold text-sm shadow-md hover:bg-amber-300 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>झूम करून पहा</span>
                </button>
              </div>
            </div>



          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#7A0C16] via-[#B81423] to-[#7A0C16] rounded-3xl p-6 sm:p-8 border-2 border-[#FFD700]/40 shadow-2xl text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFD700] font-serif">
            ही सर्व ११ कार्ड्स फक्त ₹४९ मध्ये मिळावा!
          </h3>
          <p className="text-amber-100 text-sm sm:text-base max-w-xl mx-auto">
            तुमचा फोटो आणि माहिती जोडून एकाच क्लिकवर सर्व ११ डिझाईन्स मिळवा. कोणतीही वेगळी फी नाही.
          </p>
          <div>
            <button
              onClick={onBuyNowClick}
              id="sample-section-buy-now-btn"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] text-[#540813] font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
            >
              <span>आत्ताच बनवा • ₹४९ घ्या</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for All-in-One Poster (6000x3600) */}
      {showAllInOneModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-auto">
          <div className="relative max-w-5xl w-full bg-[#5D0A11] rounded-3xl border-2 border-[#FFD700] p-4 sm:p-6 shadow-2xl flex flex-col items-center gap-4 my-auto">
            
            <button
              onClick={() => setShowAllInOneModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-[#FFD700] hover:bg-black transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#FFDF6D] font-bold uppercase tracking-widest">
                Ultra High Resolution (6000px × 3600px)
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white font-serif">
                ११-इन-१ राजेशाही गणेशोत्सव सॅम्पल पोस्टर
              </h4>
            </div>

            {/* Poster Image Container */}
            <div className="w-full max-h-[75vh] overflow-auto rounded-2xl border border-[#FFD700]/50 shadow-inner bg-black/80 flex items-center justify-center p-1">
              <img
                src={allInOneUrl}
                alt="Full 6000x3600 Poster Sample"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('/Thumbnail/')) {
                    target.src = '/Thumbnail/all in one.jpg';
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-2">
              <p className="text-xs sm:text-sm text-amber-200 text-center sm:text-left">
                💡 सर्व ११ कार्ड्समध्ये तुमचे नाव, फोटो आणि पद आपोआप जोडले जाते.
              </p>
              <button
                onClick={() => {
                  setShowAllInOneModal(false);
                  onBuyNowClick();
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FFD700] text-[#540813] font-black text-base shadow-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                <span>ही सर्व ११ डिझाईन्स आत्ताच तयार करा (₹४९)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Individual Lightbox Preview Modal */}
      {selectedSample && !showAllInOneModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-[#7A0C16] rounded-3xl border-2 border-[#FFD700] p-4 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedSample(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-[#FFD700] hover:bg-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#FFDF6D] font-bold">टेम्पलेट #{selectedSample.id}</span>
              <h4 className="text-lg font-bold text-white font-serif">{selectedSample.marathiName}</h4>
            </div>

            <div className="w-full aspect-[9/16] rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-inner">
              <img
                src={selectedSample.previewUrl || allInOneUrl}
                alt={selectedSample.marathiName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => {
                setSelectedSample(null);
                onBuyNowClick();
              }}
              className="w-full py-3 rounded-xl bg-[#FFD700] text-[#540813] font-bold text-base shadow-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
            >
              <span>ही डिझाईन आत्ताच तयार करा</span>
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
