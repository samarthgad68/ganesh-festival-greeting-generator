import { Request, Response } from 'express';
import crypto from 'crypto';
import { getRazorpay, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../config/razorpay';
import { createOrderSession, markOrderPaid, getSessionByToken } from '../utils/sessions';

export async function createPaymentOrder(req: Request, res: Response) {
  try {
    const razorpay = getRazorpay();
    const amountInPaise = 4900; // ₹49
    let orderId = '';

    if (razorpay && RAZORPAY_KEY_ID !== 'rzp_test_ganesh_festival_2026') {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_ganesh_${Date.now()}`,
          notes: {
            purpose: '11 Ganesh Festival Greeting Cards',
          },
        });
        orderId = order.id;
      } catch (rzpErr) {
        console.warn('Razorpay API error, falling back to instant test order mode:', rzpErr);
        orderId = 'order_test_' + crypto.randomBytes(8).toString('hex');
      }
    } else {
      orderId = 'order_test_' + crypto.randomBytes(8).toString('hex');
    }

    const session = createOrderSession(orderId);

    return res.json({
      success: true,
      orderId: session.orderId,
      amount: amountInPaise,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      paymentToken: session.paymentToken,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return res.status(500).json({
      success: false,
      message: 'पेमेंट आर्डर तयार करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.',
    });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isTestMode } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'अवैध ऑर्डर आयडी.',
      });
    }

    const paymentId = razorpay_payment_id || 'pay_test_' + crypto.randomBytes(8).toString('hex');

    // Signature verification if keys are live
    if (razorpay_signature && RAZORPAY_KEY_SECRET !== 'test_secret_key_1234567890') {
      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${paymentId}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'पेमेंट पडताळणी अयशस्वी झाली (Invalid Signature).',
        });
      }
    }

    const session = markOrderPaid(razorpay_order_id, paymentId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'पेमेंट सत्र सापडले नाही.',
      });
    }

    return res.json({
      success: true,
      message: 'पेमेंट यशस्वीरित्या पूर्ण झाले!',
      paymentToken: session.paymentToken,
      orderId: session.orderId,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'पेमेंट पडताळणीमध्ये अडचण आली.',
    });
  }
}

export async function checkPaymentStatus(req: Request, res: Response) {
  const token = req.params.token;
  const session = getSessionByToken(token);

  if (!session) {
    return res.status(404).json({ success: false, isPaid: false });
  }

  return res.json({
    success: true,
    isPaid: session.isPaid,
    paymentToken: session.paymentToken,
  });
}
