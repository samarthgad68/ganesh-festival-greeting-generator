import React from 'react';
import { LayoutGrid, User, Camera, Building2, Zap, Download } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <LayoutGrid className="w-8 h-8 text-[#FFD700]" />,
      title: '११ एचडी शुभेच्छा',
    },
    {
      icon: <User className="w-8 h-8 text-[#FFD700]" />,
      title: 'आपले नाव',
    },
    {
      icon: <Camera className="w-8 h-8 text-[#FFD700]" />,
      title: 'आपला फोटो',
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#FFD700]" />,
      title: 'व्यवसाय माहिती',
    },
    {
      icon: <Zap className="w-8 h-8 text-[#FFD700]" />,
      title: 'झटपट कार्ड्स तयार',
    },
    {
      icon: <Download className="w-8 h-8 text-[#FFD700]" />,
      title: 'हाय क्वालिटी डाऊनलोड',
    },
  ];

  return (
    <section id="features" className="py-16 bg-[#FDFBF7] text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7A0C16] font-serif">
            आमची प्रीमियम वैशिष्ट्ये
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            गणेशोत्सवाच्या या शुभ प्रसंगी आपल्या हितचिंतकांना पाठवण्यासाठी सर्वोत्तम डिजिटल सेवा.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm hover:shadow-xl hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#7A0C16] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-serif group-hover:text-[#7A0C16] transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
