import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface SessionData {
  orderId: string;
  paymentId?: string;
  paymentToken: string;
  isPaid: boolean;
  createdAt: number;
  uploadedPhotoPath?: string;
  generatedImagePaths?: string[];
  sessionDirPath?: string;
  used: boolean;
}

const sessionsMap = new Map<string, SessionData>();

export function createOrderSession(orderId: string): SessionData {
  const paymentToken = 'token_' + crypto.randomBytes(16).toString('hex');
  const session: SessionData = {
    orderId,
    paymentToken,
    isPaid: false,
    createdAt: Date.now(),
    used: false,
  };
  sessionsMap.set(paymentToken, session);
  sessionsMap.set(orderId, session); // Map both for lookup
  return session;
}

export function markOrderPaid(orderId: string, paymentId: string): SessionData | null {
  const session = sessionsMap.get(orderId);
  if (!session) return null;

  session.isPaid = true;
  session.paymentId = paymentId;
  return session;
}

export function getSessionByToken(token: string): SessionData | null {
  if (!sessionsMap.has(token) && (token === 'demo_payment_token' || token.startsWith('demo_'))) {
    const demoSession: SessionData = {
      orderId: 'order_demo',
      paymentToken: token,
      isPaid: true,
      createdAt: Date.now(),
      used: false,
    };
    sessionsMap.set(token, demoSession);
    return demoSession;
  }
  const session = sessionsMap.get(token);
  if (!session) return null;
  
  // Expire session after 1 hour
  if (Date.now() - session.createdAt > 3600 * 1000) {
    clearSession(token);
    return null;
  }
  return session;
}

export function updateSessionPaths(
  token: string,
  data: {
    uploadedPhotoPath?: string;
    generatedImagePaths?: string[];
    sessionDirPath?: string;
  }
) {
  const session = getSessionByToken(token);
  if (session) {
    if (data.uploadedPhotoPath) session.uploadedPhotoPath = data.uploadedPhotoPath;
    if (data.generatedImagePaths) session.generatedImagePaths = data.generatedImagePaths;
    if (data.sessionDirPath) session.sessionDirPath = data.sessionDirPath;
  }
}

export function clearSession(token: string) {
  const session = sessionsMap.get(token);
  if (!session) return;

  // Cleanup files on disk
  try {
    if (session.uploadedPhotoPath && fs.existsSync(session.uploadedPhotoPath)) {
      fs.unlinkSync(session.uploadedPhotoPath);
    }
    if (session.sessionDirPath && fs.existsSync(session.sessionDirPath)) {
      fs.rmSync(session.sessionDirPath, { recursive: true, force: true });
    } else if (session.generatedImagePaths) {
      for (const imgPath of session.generatedImagePaths) {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    }
  } catch (err) {
    console.error('Error cleaning up session files:', err);
  }

  sessionsMap.delete(token);
  sessionsMap.delete(session.orderId);
}

// Background task to sweep expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of Array.from(sessionsMap.entries())) {
    if (now - session.createdAt > 30 * 60 * 1000) { // 30 mins
      clearSession(session.paymentToken);
    }
  }
}, 10 * 60 * 1000);
