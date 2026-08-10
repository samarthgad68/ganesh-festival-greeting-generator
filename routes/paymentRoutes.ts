import { Router } from 'express';
import { createPaymentOrder, verifyPayment, checkPaymentStatus } from '../controllers/paymentController';

const router = Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/status/:token', checkPaymentStatus);

export default router;
