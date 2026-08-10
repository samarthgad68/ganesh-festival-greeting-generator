export interface TemplateSample {
  id: number;
  name: string;
  marathiName: string;
  badgeText: string;
  mainGreeting: string;
  previewUrl: string;
}

export interface UserFormData {
  name: string;
  designation: string;
  address: string;
  mobile: string;
  photo: File | null;
  photoPreviewUrl: string | null;
}

export interface GeneratedGreeting {
  id: number;
  name: string;
  marathiName: string;
  url: string;
  downloadUrl: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
}

export type AppStep = 'HOME' | 'PAYMENT_MODAL' | 'GENERATOR_FORM' | 'GENERATING' | 'RESULTS';
