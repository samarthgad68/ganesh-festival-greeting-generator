import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { SampleTemplates } from './components/SampleTemplates';
import { PricingSection } from './components/PricingSection';
import { GeneratorForm } from './components/GeneratorForm';
import { LoadingScreen } from './components/LoadingScreen';
import { SuccessView } from './components/SuccessView';
import { Footer } from './components/Footer';
import { PolicyModals } from './components/PolicyModals';
import { AppStep, UserFormData, GeneratedGreeting } from './types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function safeFetchJson(url: string, options?: RequestInit) {
  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options?.headers || {}),
    },
  };
  const res = await fetch(url, mergedOptions);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error(`Non-JSON response from ${url} (${res.status}):`, text);
    if (text.includes('Cookie check') || text.includes('aistudio_auth_flow')) {
      throw new Error('ब्राउझर कुकी ब्लॉक झाल्यामुळे अडचण आली. कृपया पेज रिफ्रेश करा.');
    }
    throw new Error(`सर्व्हरकडून अमान्य प्रतिसाद मिळाला (${res.status}). कृपया पुन्हा प्रयत्न करा.`);
  }
  const data = await res.json();
  if (!res.ok && !data.message) {
    data.message = `सर्व्हर त्रुटी (${res.status})`;
  }
  return data;
}

export default function App() {
  const [step, setStep] = useState<AppStep>('HOME');
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedGreetings, setGeneratedGreetings] = useState<GeneratedGreeting[]>([]);
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | 'disclaimer' | null>(null);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Smooth scroll handler
  const handleNavigateSection = (id: string) => {
    if (step !== 'HOME') {
      setStep('HOME');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initiate Razorpay ₹49 Purchase
  const handleBuyNow = async () => {
    setIsProcessingPayment(true);
    setErrorBanner(null);

    try {
      const orderData = await safeFetchJson('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!orderData.success) {
        throw new Error(orderData.message || 'पेमेंट ऑर्डर तयार करण्यात त्रुटी.');
      }

      const { orderId, amount, key } = orderData;

      // Handle Razorpay Checkout
      if (window.Razorpay) {
        const options = {
          key: key,
          amount: amount, // 4900
          currency: 'INR',
          name: 'गणेशोत्सव शुभेच्छा जनरेटर',
          description: '११ राजेशाही गणेशोत्सव शुभेच्छा कार्ड्स',
          image: 'https://images.unsplash.com/photo-1662013898826-6db2778393e5?w=120&auto=format&fit=crop',
          order_id: orderId.startsWith('order_test_') ? undefined : orderId,
          handler: async function (response: any) {
            await verifyPaymentOnServer(
              response.razorpay_order_id || orderId,
              response.razorpay_payment_id || 'pay_simulated',
              response.razorpay_signature
            );
          },
          prefill: {
            name: 'Customer',
            email: 'customer@example.com',
            contact: '9876543210',
          },
          theme: {
            color: '#800000',
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          setErrorBanner('पेमेंट अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.');
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Fallback simulated payment for test / sandbox environments
        await verifyPaymentOnServer(orderId, 'pay_test_' + Date.now());
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorBanner(err.message || 'पेमेंट प्रक्रिया सुरू करताना अडचण आली.');
      setIsProcessingPayment(false);
    }
  };

  const verifyPaymentOnServer = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string
  ) => {
    try {
      const data = await safeFetchJson('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        }),
      });

      if (data.success && data.paymentToken) {
        setPaymentToken(data.paymentToken);
        setStep('GENERATOR_FORM');
      } else {
        throw new Error(data.message || 'पेमेंट पडताळणी अयशस्वी.');
      }
    } catch (err: any) {
      setErrorBanner(err.message || 'पेमेंट पडताळणीमध्ये त्रुटी आली.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Submit Generator Form & Call Backend Image Processor
  const handleFormSubmit = async (formData: UserFormData) => {
    const activeToken = paymentToken || 'demo_payment_token';

    setStep('GENERATING');
    setIsGenerating(true);
    setErrorBanner(null);

    try {
      const body = new FormData();
      body.append('paymentToken', activeToken);
      body.append('name', formData.name);
      if (formData.designation) body.append('designation', formData.designation);
      if (formData.address) body.append('address', formData.address);
      if (formData.mobile) body.append('mobile', formData.mobile);
      if (formData.photo) body.append('photo', formData.photo);

      const data = await safeFetchJson('/api/greetings/generate', {
        method: 'POST',
        headers: {
          'x-payment-token': activeToken,
        },
        body: body,
      });

      if (data.success && data.greetings) {
        setGeneratedGreetings(data.greetings);
        setZipDownloadUrl(data.zipDownloadUrl);
        setStep('RESULTS');
      } else {
        throw new Error(data.message || 'शुभेच्छा कार्ड्स जनरेट करण्यात अडचण आली.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorBanner(err.message || 'शुभेच्छा कार्ड्स तयार करताना त्रुटी आली.');
      setStep('GENERATOR_FORM');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setStep('HOME');
    setPaymentToken(null);
    setGeneratedGreetings([]);
    setZipDownloadUrl('');
    setErrorBanner(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-gray-900 font-sans flex flex-col justify-between selection:bg-[#FFD700] selection:text-[#4A0404]">
      
      {/* Header */}
      <Header
        onBuyNowClick={handleBuyNow}
        onNavigateSection={handleNavigateSection}
      />

      {/* Error Alert Banner */}
      {errorBanner && (
        <div className="bg-red-600 text-white px-4 py-3 text-center font-bold text-sm shadow-md flex items-center justify-center gap-2">
          <span>⚠️ {errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            className="ml-4 underline text-xs text-amber-200"
          >
            बंद करा
          </button>
        </div>
      )}

      {/* Main Views based on Step */}
      <main className="flex-grow">
        {step === 'HOME' && (
          <>
            <Hero onBuyNowClick={handleBuyNow} />
            <FeaturesSection />
            <SampleTemplates onBuyNowClick={handleBuyNow} />
            <PricingSection onBuyNowClick={handleBuyNow} />
          </>
        )}

        {step === 'GENERATOR_FORM' && (
          <GeneratorForm
            paymentToken={paymentToken || 'demo_payment_token'}
            onSubmitForm={handleFormSubmit}
            isGenerating={isGenerating}
          />
        )}

        {step === 'GENERATING' && <LoadingScreen />}

        {step === 'RESULTS' && paymentToken && (
          <SuccessView
            paymentToken={paymentToken}
            greetings={generatedGreetings}
            zipDownloadUrl={zipDownloadUrl}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer & Policy Modals */}
      <Footer onOpenPolicy={(type) => setActivePolicy(type)} />

      <PolicyModals
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

    </div>
  );
}
