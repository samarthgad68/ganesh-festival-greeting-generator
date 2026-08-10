import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState<number>(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 12) + 5;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md w-full bg-[#800000] rounded-3xl p-8 border-2 border-[#FFD700] shadow-2xl space-y-6 animate-pulse">
        
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FFD700] opacity-20 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF9933] via-[#FFD700] to-[#E65100] flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-[#4A0404]">ॐ</span>
          </div>
        </div>

        {/* Marathi Title & Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-[#FFD700] font-serif">
            आपल्या ११ शुभेच्छा तयार होत आहेत...
          </h3>
          <p className="text-[#FEF9E7] text-sm">
            Sharp एचडी इमेज प्रोसेसरद्वारे सर्व टेम्पलेट्स कॉम्पोझ होत आहेत.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-[#4A0404] rounded-full overflow-hidden border border-[#FFD700]/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#FF9933] via-[#FFD700] to-[#E65100] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#FEF9E7] font-bold">
            <span>इमेज जनरेशन सुरू आहे</span>
            <span>{progress}%</span>
          </div>
        </div>

        <p className="text-xs text-[#FEF9E7]/80 font-medium">
          ⚠️ कृपया हे पान रिफ्रेश किंवा बंद करू नका.
        </p>

      </div>
    </div>
  );
};
