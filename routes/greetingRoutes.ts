import { Router } from 'express';
import {
  generateGreetings,
  viewGreetingImage,
  downloadSingleGreeting,
  downloadAllZip,
  cleanupUserSession,
  getTemplateSamples,
  upload,
} from '../controllers/greetingController';
import { requirePaidSession } from '../middleware/authSession';

const router = Router();

// Public sample templates
router.get('/samples', getTemplateSamples);

// View generated image (valid token)
router.get('/view/:token/:id', viewGreetingImage);

// Protected routes (require paid token)
router.post('/generate', upload.single('photo'), requirePaidSession, generateGreetings);
router.get('/download/:token/:id', requirePaidSession, downloadSingleGreeting);
router.get('/download-zip/:token', requirePaidSession, downloadAllZip);
router.post('/cleanup/:token', cleanupUserSession);

export default router;
