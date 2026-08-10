import sharp, { OverlayOptions } from 'sharp';
import fs from 'fs';
import path from 'path';
import { TEMPLATE_DEFS, TemplateDef } from '../templates/templateDefs';

export interface UserGreetingData {
  name: string;
  designation?: string;
  address?: string;
  mobile?: string;
  photoPath?: string;
}

// Pre-load Noto Sans Devanagari font as base64 for embedding in SVG overlays
let fontStyleCss = '';
try {
  const boldFontPath = path.join(process.cwd(), 'fonts', 'NotoSansDevanagari-Bold.ttf');
  const regFontPath = path.join(process.cwd(), 'fonts', 'NotoSansDevanagari-Regular.ttf');
  if (fs.existsSync(boldFontPath) && fs.existsSync(regFontPath)) {
    const boldBase64 = fs.readFileSync(boldFontPath).toString('base64');
    const regBase64 = fs.readFileSync(regFontPath).toString('base64');
    fontStyleCss = `
      @font-face {
        font-family: 'Noto Sans Devanagari';
        font-style: normal;
        font-weight: bold;
        src: url('data:font/ttf;charset=utf-8;base64,${boldBase64}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;charset=utf-8;base64,${boldBase64}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        font-style: normal;
        font-weight: normal;
        src: url('data:font/ttf;charset=utf-8;base64,${regBase64}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Devanagari';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;charset=utf-8;base64,${regBase64}') format('truetype');
      }
    `;
  }
} catch (e) {
  console.error('Error reading font files for base64 embedding:', e);
}

// Escapes special characters for XML/SVG rendering
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Crops and frames customer photo into a clean square frame with a thin golden border
 */
async function processCustomerPhoto(photoPath: string, size = 370): Promise<Buffer> {
  let photoBuffer: Buffer;

  if (photoPath && fs.existsSync(photoPath)) {
    photoBuffer = await sharp(photoPath)
      .resize(size, size, { fit: 'cover', position: 'center' })
      .toBuffer();
  } else {
    // Generate a default royal avatar placeholder in a square frame
    const defaultAvatarSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="18" fill="#7A0C16"/>
        <rect x="5" y="5" width="${size - 10}" height="${size - 10}" rx="14" fill="none" stroke="#FFD700" stroke-width="4"/>
        <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.22}" fill="#FFD700"/>
        <path d="M ${size * 0.15} ${size * 0.88} Q ${size / 2} ${size * 0.55} ${size * 0.85} ${size * 0.88} Z" fill="#FFD700"/>
        <text x="${size / 2}" y="${size * 0.94}" font-family="'Arial', 'Noto Sans Devanagari', sans-serif" font-size="18" font-weight="bold" fill="#FFD700" text-anchor="middle">फोटो स्थान</text>
      </svg>
    `;
    photoBuffer = await sharp(Buffer.from(defaultAvatarSvg)).toBuffer();
  }

  // Create rounded square mask with clean border
  const maskSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="18" fill="#FFF"/>
    </svg>
  `;

  const squaredPhoto = await sharp(photoBuffer)
    .resize(size, size)
    .composite([{
      input: Buffer.from(maskSvg),
      blend: 'dest-in'
    }])
    .toBuffer();

  // Thin golden & burgundy border frame overlay
  const borderFrameSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="16" fill="none" stroke="#FFD700" stroke-width="6"/>
      <rect x="7" y="7" width="${size - 14}" height="${size - 14}" rx="11" fill="none" stroke="#7A0C16" stroke-width="2" opacity="0.8"/>
    </svg>
  `;

  return await sharp(squaredPhoto)
    .composite([{ input: Buffer.from(borderFrameSvg), top: 0, left: 0 }])
    .toBuffer();
}

/**
 * Helper to check for a non-empty template background image in public/Pages or public/Thumbnail
 */
function findBackgroundPageImage(templateId: number): string | null {
  const padId = templateId.toString().padStart(2, '0');
  const numStr = templateId.toString();

  const searchPaths = [
    path.join(process.cwd(), 'assets', 'Images', `Page ${numStr}.jpg`),
    path.join(process.cwd(), 'assets', 'Images', `Page ${padId}.jpg`),
    path.join(process.cwd(), 'assets', 'Images', `Page  ${padId}.jpg`),
    path.join(process.cwd(), 'assets', 'images', `Page ${numStr}.jpg`),
    path.join(process.cwd(), 'assets', 'images', `Page ${padId}.jpg`),
    path.join(process.cwd(), 'assets', 'images', `Page  ${padId}.jpg`),
    path.join(process.cwd(), 'public', 'Pages', `Page ${numStr}.jpg`),
    path.join(process.cwd(), 'public', 'Pages', `Page ${padId}.jpg`),
    path.join(process.cwd(), 'assets', 'image', `Page ${numStr}.jpg`),
    path.join(process.cwd(), 'assets', 'image', `Page ${padId}.jpg`),
  ];

  for (const p of searchPaths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
      return p;
    }
  }
  return null;
}

/**
 * Renders full 1080x1920 SVG template layout overlay
 */
function generateTemplateSvg(
  template: TemplateDef,
  userData: UserGreetingData,
  hasPhoto: boolean,
  isOverlay = false
): string {
  const line1 = (userData.name && userData.name.trim()) || 'श्री गणेश ज्वेलर्स';
  const line2 = (userData.designation && userData.designation.trim()) || 'श्री महेश जोशी';
  const line3 = (userData.address && userData.address.trim()) || 'दादर पूर्व, मुंबई';
  const line4 = (userData.mobile && userData.mobile.trim()) || 'मोबाईल: ९८७६५ ४३२१०';

  const line1Escaped = escapeXml(line1);
  const line2Escaped = escapeXml(line2);
  const line3Escaped = escapeXml(line3);
  const line4Escaped = escapeXml(line4);

  const line1Len = line1.length;
  const maxOtherLen = Math.max(line2.length, line3.length, line4.length);
  const maxCharLen = Math.max(line1Len, maxOtherLen);

  let fontScale = 1;
  if (maxCharLen > 14) {
    fontScale = Math.max(0.48, 1 - (maxCharLen - 14) * 0.018);
  }

  const fontSizeL1 = Math.max(44, Math.round(86 * fontScale));
  const fontSizeL2 = Math.max(36, Math.round(fontSizeL1 * 0.82));
  const fontSizeL3 = Math.max(30, Math.round(fontSizeL1 * 0.72));
  const fontSizeL4 = Math.max(30, Math.round(fontSizeL1 * 0.72));

  const lineGap1 = Math.round(fontSizeL1 * 1.25);
  const lineGap2 = Math.round(fontSizeL2 * 1.25);
  const lineGap3 = Math.round(fontSizeL3 * 1.55);

  const totalTextHeight = (fontSizeL1 * 0.8) + lineGap1 + lineGap2 + lineGap3 + (fontSizeL4 * 0.2);
  const textTopTarget = 1697 - (totalTextHeight / 2);

  const y1 = Math.round(textTopTarget + (fontSizeL1 * 0.8));
  const y2 = y1 + lineGap1;
  const y3 = y2 + lineGap2;
  const y4 = y3 + lineGap3;

  // Ganesha Silhouette SVG Vector paths
  const ganeshaSilhouette = `
    <g transform="translate(540, 480) scale(1.6)">
      <!-- Crown -->
      <path d="M -40 -120 L 0 -180 L 40 -120 L 25 -90 L -25 -90 Z" fill="${template.accentGold}"/>
      <circle cx="0" cy="-190" r="10" fill="#FFF"/>
      <!-- Ears & Head -->
      <path d="M -80 -80 Q -110 -20 -60 10 Q -20 20 0 10 Q 20 20 60 10 Q 110 -20 80 -80 Z" fill="${template.accentGold}" opacity="0.95"/>
      <!-- Trunk -->
      <path d="M 0 0 C -20 40 20 80 -30 110 C -45 120 -30 135 -15 125 C 30 90 -10 30 10 0 Z" fill="${template.accentGold}"/>
      <!-- Modak in hand -->
      <path d="M 45 40 Q 60 20 75 40 Q 60 65 45 40 Z" fill="#FFF"/>
      <!-- Tilak -->
      <path d="M -15 -60 L 15 -60 L 10 -40 L -10 -40 Z" fill="#D32F2F"/>
      <circle cx="0" cy="-30" r="6" fill="#D32F2F"/>
    </g>
  `;

  // Decorative border corners
  const borderCorners = `
    <g stroke="${template.accentGold}" stroke-width="6" fill="none">
      <path d="M 50 120 L 50 50 L 120 50" />
      <path d="M 1030 120 L 1030 50 L 960 50" />
      <path d="M 50 1800 L 50 1870 L 120 1870" />
      <path d="M 1030 1800 L 1030 1870 L 960 1870" />
      <rect x="35" y="35" width="1010" height="1850" rx="15" stroke="${template.accentGold}" stroke-width="3" opacity="0.6"/>
    </g>
  `;

  const bgRect = isOverlay
    ? ''
    : `<rect width="1080" height="1920" fill="url(#bgGrad)"/>`;

  const artworkSection = isOverlay ? '' : `
      <!-- Decorative Background Ornaments -->
      <circle cx="540" cy="450" r="380" fill="none" stroke="${template.accentGold}" stroke-width="2" opacity="0.25" stroke-dasharray="8 8"/>
      <circle cx="540" cy="450" r="280" fill="none" stroke="${template.accentGold}" stroke-width="4" opacity="0.3"/>
      
      ${borderCorners}

      <!-- Top Header Blessing -->
      <g text-anchor="middle">
        <rect x="240" y="80" width="600" height="60" rx="30" fill="${template.accentGold}" opacity="0.9"/>
        <text x="540" y="122" font-family="'Noto Sans Devanagari', 'Arial', sans-serif" font-size="32" font-weight="bold" fill="#540813" text-anchor="middle">
          ${template.headerBlessing}
        </text>
      </g>

      <!-- Ganesha Motif -->
      ${ganeshaSilhouette}

      <!-- Main Greetings Section -->
      <g text-anchor="middle">
        <!-- Badge -->
        <rect x="360" y="740" width="360" height="50" rx="25" fill="url(#goldGrad)" />
        <text x="540" y="775" font-family="'Noto Sans Devanagari', 'Arial', sans-serif" font-size="26" font-weight="bold" fill="#380B4A" text-anchor="middle">
          ✨ ${template.badgeText} ✨
        </text>

        <!-- Main Title -->
        <text x="540" y="870" font-family="'Noto Sans Devanagari', 'Arial', sans-serif" font-size="52" font-weight="bold" fill="#FFD700" filter="url(#shadow)" text-anchor="middle">
          ${template.mainGreeting}
        </text>

        <!-- Sub Greeting / Wishes -->
        <text x="540" y="940" font-family="'Noto Sans Devanagari', 'Arial', sans-serif" font-size="28" fill="#FFFFFF" opacity="0.95" text-anchor="middle">
          ${template.subGreeting}
        </text>
      </g>
  `;

  return `
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style type="text/css">
          ${fontStyleCss}
        </style>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${template.themeColor}" />
          <stop offset="50%" stop-color="${template.secondaryColor}" />
          <stop offset="100%" stop-color="${template.themeColor}" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE259"/>
          <stop offset="100%" stop-color="#FFA751"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Background -->
      ${bgRect}

      ${artworkSection}

      <!-- Bottom Personalization Section directly on the blank 1080x445 bottom area -->
      <g text-anchor="middle">
        <!-- Line 1: Bold Reddish-Maroon (#c00000) -->
        <text x="330" y="${y1}" font-family="Noto Sans Devanagari, sans-serif" font-size="${fontSizeL1}" font-weight="bold" fill="#c00000" text-anchor="middle">
          ${line1Escaped}
        </text>

        <!-- Line 2: Black (#000000) -->
        <text x="330" y="${y2}" font-family="Noto Sans Devanagari, sans-serif" font-size="${fontSizeL2}" font-weight="bold" fill="#000000" text-anchor="middle">
          ${line2Escaped}
        </text>

        <!-- Line 3: Black (#000000) -->
        <text x="330" y="${y3}" font-family="Noto Sans Devanagari, sans-serif" font-size="${fontSizeL3}" font-weight="normal" fill="#000000" text-anchor="middle">
          ${line3Escaped}
        </text>

        <!-- Line 4: Black (#000000) -->
        <text x="330" y="${y4}" font-family="Noto Sans Devanagari, sans-serif" font-size="${fontSizeL4}" font-weight="normal" fill="#000000" text-anchor="middle">
          ${line4Escaped}
        </text>
      </g>
    </svg>
  `;
}

/**
 * Generates single greeting image for template ID
 */
export async function generateGreetingImage(
  templateId: number,
  userData: UserGreetingData,
  outputFilePath: string
): Promise<string> {
  const template = TEMPLATE_DEFS.find((t) => t.id === templateId) || TEMPLATE_DEFS[0];
  const hasPhoto = !!(userData.photoPath && fs.existsSync(userData.photoPath));
  const bgImagePath = findBackgroundPageImage(templateId);

  let baseBuffer: Buffer;
  if (bgImagePath) {
    const bgBuffer = await sharp(bgImagePath)
      .resize(1080, 1920, { fit: 'cover' })
      .toBuffer();

    const svgOverlay = generateTemplateSvg(template, userData, hasPhoto, true);
    baseBuffer = await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .toBuffer();
  } else {
    const svgContent = generateTemplateSvg(template, userData, hasPhoto, false);
    baseBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();
  }

  const compositables: OverlayOptions[] = [];

  // Overlay customer photo or default placeholder on right side of bottom 1080x445 area
  const photoBuffer = await processCustomerPhoto(hasPhoto ? userData.photoPath! : '', 370);
  compositables.push({
    input: photoBuffer,
    top: 1512,
    left: 665,
  });

  // Final compositing and saving 1080x1920 HD PNG
  let imagePipeline = sharp(baseBuffer);
  if (compositables.length > 0) {
    imagePipeline = imagePipeline.composite(compositables);
  }

  // Ensure target folder exists
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await imagePipeline
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(outputFilePath);

  return outputFilePath;
}

/**
 * Pre-generates or renders sample thumbnail images for templates
 */
export async function generateSampleThumbnail(
  templateId: number,
  outputFilePath: string
): Promise<string> {
  const sampleData: UserGreetingData = {
    name: 'संजय पाटील',
    designation: 'संजय ट्रेडर्स, मुंबई',
    address: 'दादर पूर्व, मुंबई',
    mobile: '+91 98765 43210',
  };

  const template = TEMPLATE_DEFS.find((t) => t.id === templateId) || TEMPLATE_DEFS[0];
  const bgImagePath = findBackgroundPageImage(templateId);

  let baseBuffer: Buffer;
  if (bgImagePath) {
    const bgBuffer = await sharp(bgImagePath)
      .resize(1080, 1920, { fit: 'cover' })
      .toBuffer();

    const svgOverlay = generateTemplateSvg(template, sampleData, false, true);
    baseBuffer = await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .toBuffer();
  } else {
    const svgContent = generateTemplateSvg(template, sampleData, false, false);
    baseBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();
  }

  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await sharp(baseBuffer)
    .resize(360, 640) // Thumbnail size 360x640 vertical format
    .jpeg({ quality: 85 })
    .toFile(outputFilePath);

  return outputFilePath;
}

/**
 * Renders a blank card thumbnail template
 */
export async function generateBlankThumbnail(
  templateId: number,
  outputFilePath: string
): Promise<string> {
  const template = TEMPLATE_DEFS.find((t) => t.id === templateId) || TEMPLATE_DEFS[0];

  const svgContent = `
    <svg width="360" height="640" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${template.themeColor || '#7A0C16'}" />
          <stop offset="100%" stop-color="${template.secondaryColor || '#380B4A'}" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE885" />
          <stop offset="50%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FFA751" />
        </linearGradient>
      </defs>

      <!-- Royal Background -->
      <rect width="360" height="640" fill="url(#bgGrad)" />

      <!-- Outer Gold Border Frame -->
      <rect x="12" y="12" width="336" height="616" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
      <rect x="18" y="18" width="324" height="604" rx="12" fill="none" stroke="#FFD700" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />

      <!-- Center Blank Card Placeholder Icon & Label -->
      <g transform="translate(180, 280)" text-anchor="middle">
        <circle cx="0" cy="-20" r="36" fill="#FFD700" opacity="0.15" />
        <text x="0" y="-12" font-family="'Noto Sans Devanagari', sans-serif" font-size="28" font-weight="bold" fill="#FFD700">#${template.id}</text>
        <text x="0" y="32" font-family="'Noto Sans Devanagari', sans-serif" font-size="20" font-weight="bold" fill="#FFD700">${template.marathiName}</text>
        <text x="0" y="60" font-family="'Noto Sans Devanagari', sans-serif" font-size="13" fill="#FFDF6D" opacity="0.8">ब्लँक टेम्पलेट फाईल</text>
      </g>
    </svg>
  `;

  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await sharp(Buffer.from(svgContent))
    .resize(360, 640)
    .jpeg({ quality: 90 })
    .toFile(outputFilePath);

  return outputFilePath;
}

