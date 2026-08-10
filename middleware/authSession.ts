import { Request, Response, NextFunction } from 'express';
import { getSessionByToken } from '../utils/sessions';

export interface AuthenticatedRequest extends Request {
  paymentToken?: string;
  orderId?: string;
}

export function requirePaidSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token =
    (req.headers['x-payment-token'] as string) ||
    (req.query.token as string) ||
    (req.params.token as string) ||
    req.body?.paymentToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'अनधिकृत प्रवेश. कृपया प्रथम रु. ४९ चे पेमेंट पूर्ण करा.',
    });
  }

  const session = getSessionByToken(token);

  if (!session || !session.isPaid) {
    return res.status(403).json({
      success: false,
      message: 'पेमेंट सत्र अवैध किंवा कालबाह्य झाले आहे. कृपया पुन्हा प्रयत्न करा.',
    });
  }

  req.paymentToken = token;
  req.orderId = session.orderId;
  next();
}
