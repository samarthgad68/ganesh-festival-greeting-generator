import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_ganesh_festival_2026';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_1234567890';

export const isTestMode = RAZORPAY_KEY_ID.startsWith('rzp_test');

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } catch (err) {
      console.warn('Razorpay initialization warning:', err);
    }
  }
  return razorpayInstance;
}
