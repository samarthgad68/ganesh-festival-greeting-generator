import React, { useState } from 'react';
import { Download, CheckCircle2, RefreshCw, Archive, Eye, Trash2 } from 'lucide-react';
import { GeneratedGreeting } from '../types';

interface SuccessViewProps {
  paymentToken: string;
  greetings: GeneratedGreeting[];
  zipDownloadUrl: string;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  paymentToken,
  greetings,
  zipDownloadUrl,
  onReset,
}) => {
  const [downloadedZip, setDownloadedZip] = useState<boolean>(false);
  const [downloadedSingle, setDownloadedSingle] = useState<{ [key: number]: boolean }>({});
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [cleaned, setCleaned] = useState<boolean>(false);
  const [previewGreeting, setPreviewGreeting] = useState<GeneratedGreeting | null>(null);

  const handleDownloadZip = async () => {
    setDownloadedZip(true);
    const url = zipDownloadUrl.includes('?token=') ? zipDownloadUrl : `${zipDownloadUrl}?token=${paymentToken}`;
    try {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('ZIP Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Ganesh_Festival_Greetings_11.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error('ZIP blob download error:', err);
      window.location.href = url;
    }
  };

  const handleDownloadSingle = async (greeting: GeneratedGreeting) => {
    setDownloadedSingle((prev) => ({ ...prev, [greeting.id]: true }));

    const filename = `Ganesh_Greeting_${greeting.id}.jpg`;
    const downloadUrl = greeting.downloadUrl.includes('?token=')
      ? greeting.downloadUrl
      : `${greeting.downloadUrl}?token=${paymentToken}`;
    const viewUrl = greeting.url.includes('?token=')
      ? greeting.url
      : `${greeting.url}?token=${paymentToken}`;

    try {
      let res = await fetch(downloadUrl, { credentials: 'include' });
      if (!res.ok) {
        res = await fetch(viewUrl, { credentials: 'include' });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rawBlob = await res.blob();
      const jpegBlob = new Blob([rawBlob], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(jpegBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error(`Download error for card ${greeting.id}:`, err);
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = viewUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((b) => {
            if (b) {
              const bUrl = URL.createObjectURL(b);
              const a = document.createElement('a');
              a.href = bUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(bUrl), 10000);
            }
          }, 'image/jpeg', 0.95);
        }
      } catch (canvasErr) {
        console.error('Canvas download fallback failed:', canvasErr);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleTriggerCleanup = async () => {
    setIsCleaning(true);
    try {
      await fetch(`/api/greetings/cleanup/${paymentToken}`, { method: 'POST', credentials: 'include' });
      setCleaned(true);
    } catch (err) {
      console.error('Cleanup error:', err);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#540813] via-[#7A0C16] to-[#540813] rounded-3xl p-6 sm:p-10 border-2 border-[#FFD700] shadow-2xl text-center text-white space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>आपल्या ११ शुभेच्छा यशस्वीरित्या तयार झाल्या!</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD700] font-serif">
            गणपती बाप्पा मोरया!
          </h2>
          <p className="text-amber-100 text-base sm:text-lg max-w-2xl mx-auto">
            खालीलपैकी प्रत्येक कार्ड स्वतंत्रपणे डाउनलोड करा किंवा एकसाथ सर्व ११ कार्ड्सची ZIP फाईल मिळवा.
          </p>
        </div>

        {/* Big Primary ZIP Download Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleDownloadZip}
            id="success-download-all-zip-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] text-[#540813] font-black text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-2 border-white/20"
          >
            <Archive className="w-6 h-6 text-[#540813]" />
            <span>Download All 11 Greetings (ZIP)</span>
          </button>

          <button
            onClick={handleTriggerCleanup}
            disabled={cleaned || isCleaning}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#4A0404] text-amber-200 font-bold text-base border border-[#FFD700]/40 hover:bg-[#380B4A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 text-[#FFD700]" />
            <span>{cleaned ? 'माहिती सुरक्षितपणे हटवली ✓' : 'डेटा हटवा (Auto Cleanup)'}</span>
          </button>
        </div>

        {downloadedZip && (
          <p className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> झिप फाईल डाऊनलोड होत आहे...
          </p>
        )}

      </div>

      {/* Grid of 11 Generated Greeting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {greetings.map((item) => (
          <div
            key={item.id}
            className="bg-[#7A0C16] rounded-2xl border-2 border-[#FFD700]/40 overflow-hidden shadow-xl hover:border-[#FFD700] transition-all flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative aspect-[9/16] bg-black/50 overflow-hidden group">
              <img
                src={item.url}
                alt={item.marathiName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                  onClick={() => setPreviewGreeting(item)}
                  className="px-4 py-2 rounded-full bg-[#FFD700] text-[#540813] font-bold text-sm shadow-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>झूम करा (View HD)</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {previewGreeting && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-[#7A0C16] rounded-3xl border-2 border-[#FFD700] p-4 shadow-2xl flex flex-col items-center gap-4">
            <button
              onClick={() => setPreviewGreeting(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-[#FFD700] hover:bg-black"
            >
              ✕
            </button>

            <div className="w-full aspect-[9/16] rounded-xl overflow-hidden border border-[#FFD700] mt-2">
              <img
                src={previewGreeting.url}
                alt={previewGreeting.marathiName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => handleDownloadSingle(previewGreeting)}
              className="w-full py-3 rounded-xl bg-[#FFD700] text-[#540813] font-bold text-base shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download High Quality JPG</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Home Reset Button */}
      <div className="text-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-amber-200/30 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-[#FFD700]" />
          <span>मुख्य पानावर जा (Create New)</span>
        </button>
      </div>

    </div>
  );
};
