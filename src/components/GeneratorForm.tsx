import React, { useState, useRef } from 'react';
import { Upload, Camera, Trash2, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Eye } from 'lucide-react';
import { UserFormData } from '../types';
import { Page445x1080 } from './Page445x1080';

interface GeneratorFormProps {
  paymentToken: string;
  onSubmitForm: (formData: UserFormData) => void;
  isGenerating: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  paymentToken,
  onSubmitForm,
  isGenerating,
}) => {
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (file: File | null) => {
    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMsg('कृपया फक्त इमेज फाईल (JPG, PNG) निवडा.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('फोटोची साईज १० MB पेक्षा कमी असावी.');
      return;
    }

    setErrorMsg(null);
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length === 0) {
      setErrorMsg('कृपया आपले नाव किंवा व्यवसायाचे नाव प्रविष्ट करा.');
      return;
    }

    setErrorMsg(null);
    onSubmitForm({
      name: name.trim(),
      designation: designation.trim(),
      address: address.trim(),
      mobile: mobile.trim(),
      photo,
      photoPreviewUrl: photoPreview,
    });
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      
      {/* Header Banner - Clean and Spacious */}
      <div className="text-center space-y-2 mb-8 bg-amber-50/80 rounded-2xl p-6 border border-amber-200/90 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>पेमेंट यशस्वी (₹४९)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#7A0C16] font-serif">
          आपली माहिती भरून लाईव्ह प्रीव्ह्यू पहा
        </h2>
        <p className="text-gray-600 text-sm font-medium">
          खालील फॉर्ममध्ये नाव, हुद्दा, पत्ता, मोबाईल व फोटो प्रविष्ट करा.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* Grid Layout: Left = Form Inputs, Right = 445px x 1080px Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Inputs Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200/80 shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Name */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-800 font-serif">
                  नाव / व्यवसायाचे नाव <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">{name.length}/50</span>
              </div>
              <input
                type="text"
                required
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. सचिन तांबोळी / तांबोळी ज्वेलर्स"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7A0C16] focus:border-[#7A0C16] text-gray-900 placeholder-gray-400 font-medium text-base transition-all"
                id="form-input-name"
              />
            </div>

            {/* Field 2: Designation */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-800 font-serif">
                  प्रोप्रायटर / हुद्दा (ऐच्छिक)
                </label>
                <span className="text-xs text-gray-400">{designation.length}/50</span>
              </div>
              <input
                type="text"
                maxLength={50}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="उदा. प्रोप्रायटर / अध्यक्ष, समाज मंडळ"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7A0C16] focus:border-[#7A0C16] text-gray-900 placeholder-gray-400 font-medium text-base transition-all"
                id="form-input-designation"
              />
            </div>

            {/* Field 3: Address */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-800 font-serif">
                  पत्ता (ऐच्छिक)
                </label>
                <span className="text-xs text-gray-400">{address.length}/50</span>
              </div>
              <input
                type="text"
                maxLength={50}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा.लक्ष्मी रोड, पुणे"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7A0C16] focus:border-[#7A0C16] text-gray-900 placeholder-gray-400 font-medium text-base transition-all"
                id="form-input-address"
              />
            </div>

            {/* Field 4: Mobile Number */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-800 font-serif">
                  मोबाईल नंबर (ऐच्छिक)
                </label>
                <span className="text-xs text-gray-400">{mobile.length}/30</span>
              </div>
              <input
                type="tel"
                maxLength={30}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="उदा. +91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7A0C16] focus:border-[#7A0C16] text-gray-900 placeholder-gray-400 font-medium text-base transition-all"
                id="form-input-mobile"
              />
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5 font-serif">
                तुमचा फोटो अपलोड करा (ऐच्छिक)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                className="hidden"
                id="form-input-photo-file"
              />

              {!photoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handlePhotoChange(e.dataTransfer.files?.[0] || null);
                  }}
                  className="border-2 border-dashed border-amber-300 hover:border-[#7A0C16] rounded-2xl p-5 text-center bg-amber-50/40 hover:bg-amber-50/90 cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7A0C16] text-[#FFD700] flex items-center justify-center shadow-md">
                    <Camera className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    फोटो निवडण्यासाठी येथे क्लिक करा किंवा ड्रॅग-ड्रॉप करा
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    JPG, PNG फाईल (जास्तीत जास्त १० MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FFD700] shrink-0 shadow-md">
                    <img
                      src={photoPreview}
                      alt="Customer Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {photo?.name}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> फोटो निवडला
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePhotoChange(null)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition-colors"
                    title="फोटो हटवा"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              id="form-submit-generate-btn"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFA751] to-[#FFD700] text-[#540813] font-black text-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 fill-[#540813]" />
              <span>११ शुभेच्छा तयार करा</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>
        </div>

        {/* Live Preview Column (1080x1920 HD Preview) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-6 w-full flex flex-col items-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D0A11] text-[#FFD700] text-xs font-bold shadow-md border border-[#FFD700]/30">
              <Eye className="w-4 h-4 text-[#FFD700]" />
              <span>१०८०px × १९२०px एचडी लाईव्ह प्रीव्ह्यू</span>
            </div>

            {/* Container scaling wrapper */}
            <div className="w-full flex justify-center overflow-x-auto">
              <div className="transform scale-[0.72] sm:scale-[0.8] md:scale-[0.85] origin-top my-0">
                <Page445x1080
                  name={name}
                  designation={designation}
                  address={address}
                  mobile={mobile}
                  photoUrl={photoPreview}
                  bgImageUrl="/assets/images/Page 1.jpg"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

