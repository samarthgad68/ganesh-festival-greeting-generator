import React from 'react';
import { X, ShieldCheck, FileText, RefreshCcw } from 'lucide-react';

interface PolicyModalProps {
  type: 'terms' | 'privacy' | 'refund' | 'disclaimer' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    terms: {
      title: 'नियम आणि अटी (Terms & Conditions)',
      body: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>१. ही सेवा केवळ वैयक्तिक आणि व्यावसायिक गणेशोत्सव शुभेच्छा पत्रे डिजिटल स्वरूपात तयार करण्यासाठी आहे.</p>
          <p>२. वापरकर्त्याने अपलोड केलेल्या फोटोंची आणि माहितीची सर्व जबाबदारी स्वतः वापरकर्त्याची असेल.</p>
          <p>३. कोणत्याही आक्षेपार्ह, बेकायदेशीर किंवा असभ्य मजकुराचा वापर करण्यास सक्त मनाई आहे.</p>
          <p>४. एकदा डिजिटल शुभेच्छा जनरेट झाल्यानंतर रु. ४९ चे भरलेले शुल्क परत केले जाणार नाही.</p>
        </div>
      ),
    },
    privacy: {
      title: 'गोपनीयता धोरण (Privacy Policy)',
      body: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>१. आम्ही वापरकर्त्याच्या गोपनीयतेचा पूर्ण आदर करतो.</p>
          <p>२. आपण अपलोड केलेला फोटो आणि माहिती केवळ ११ शुभेच्छा कार्ड्स तयार करण्यासाठीच वापरली जाते.</p>
          <p>३. डाऊनलोड पूर्ण झाल्यानंतर सर्व अपलोड केलेल्या फोटो व तयार झालेल्या फाईल्स सर्व्हरवरून आपोआप कायमस्वरूपी डिलीट होतात.</p>
          <p>४. आम्ही कोणतीही वैयक्तिक माहिती कोणत्याही तृतीय पक्षाला विकत नाही किंवा शेअर करत नाही.</p>
        </div>
      ),
    },
    refund: {
      title: 'परतावा धोरण (Refund Policy)',
      body: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>१. ही एक डिजिटल इन्स्टंट सेवा आहे जिथे पेमेंट होताच ११ एचडी ग्रीटिंग्स जनरेट होतात.</p>
          <p>२. जर तांत्रिक अडचणीमुळे तुमचे पेमेंट कापले गेले पण शुभेच्छा कार्ड्स तयार झाले नाहीत, तर कृपया आम्हाला संपर्क साधा. २४ तासांत रक्कम परत केली जाईल.</p>
          <p>३. कार्ड्स डाऊनलोड झाल्यानंतर कोणत्याही परिस्थितीत रिफंड दिला जाणार नाही.</p>
        </div>
      ),
    },
    disclaimer: {
      title: 'डिस्कलेमर (Disclaimer)',
      body: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>१. ही सेवा केवळ डिजिटल शुभेच्छा तयार करण्यासाठी आहे.</p>
          <p>२. या सेवेचा कोणत्याही राजकीय, धार्मिक किंवा व्यावसायिक वादाशी संबंध नाही.</p>
          <p>३. शुभेच्छा कार्ड्समधील मजकूर वापरकर्त्याने स्वतः प्रविष्ट केलेला असतो.</p>
        </div>
      ),
    },
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-white rounded-3xl border-2 border-[#FFD700] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#7A0C16] font-serif border-b pb-3">
          {current.title}
        </h3>

        <div className="max-h-80 overflow-y-auto pr-2">
          {current.body}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#7A0C16] text-[#FFD700] font-bold text-sm hover:bg-[#540813] transition-colors"
          >
            समजले (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
