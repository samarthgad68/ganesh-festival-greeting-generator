import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import paymentRoutes from './routes/paymentRoutes';
import greetingRoutes from './routes/greetingRoutes';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static assets folder
  const publicDir = path.join(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // Ensure fonts directory and system font cache are synced
  try {
    const fontsDir = path.join(process.cwd(), 'fonts');
    const systemFontsDir = path.join(process.env.HOME || '/root', '.local', 'share', 'fonts');
    if (fs.existsSync(fontsDir)) {
      if (!fs.existsSync(systemFontsDir)) fs.mkdirSync(systemFontsDir, { recursive: true });
      const fontFiles = fs.readdirSync(fontsDir);
      for (const file of fontFiles) {
        if (file.endsWith('.ttf')) {
          fs.copyFileSync(path.join(fontsDir, file), path.join(systemFontsDir, file));
        }
      }
    }
  } catch (err) {
    console.error('Error syncing font files:', err);
  }
  const generatedDir = path.join(process.cwd(), 'generated');
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const rootAssetsDir = path.join(process.cwd(), 'assets');

  if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(rootAssetsDir)) fs.mkdirSync(rootAssetsDir, { recursive: true });

  app.use('/generated', express.static(generatedDir));
  app.use('/uploads', express.static(uploadsDir));
  app.use('/assets', express.static(rootAssetsDir));
  app.use('/assets/Images', express.static(path.join(rootAssetsDir, 'Images')));
  app.use('/assets/images', express.static(path.join(rootAssetsDir, 'Images')));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Ganesh Greeting Generator', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/payment', paymentRoutes);
  app.use('/api/greetings', greetingRoutes);

  // 404 handler for unmatched /api routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API मार्ग '${req.path}' सापडला नाही.`,
    });
  });

  // Global Error Handler for /api requests (e.g. Multer errors, route exceptions)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api') || req.url.startsWith('/api')) {
      console.error('API Error Handler:', err);
      const statusCode = err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500);
      return res.status(statusCode).json({
        success: false,
        message: err.message || 'सर्व्हरवर तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.',
      });
    }
    next(err);
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚩 Ganesh Greeting Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
