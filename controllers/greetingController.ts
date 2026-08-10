import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { AuthenticatedRequest } from '../middleware/authSession';
import { TEMPLATE_DEFS } from '../templates/templateDefs';
import { generateGreetingImage, generateSampleThumbnail, generateBlankThumbnail, UserGreetingData } from '../utils/imageProcessor';
import { createGreetingsZipBuffer } from '../utils/zipArchiver';
import { getSessionByToken, updateSessionPaths, clearSession } from '../utils/sessions';

// Multer storage configuration
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `photo_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('कृपया फक्त इमेज फाईल (JPG, PNG, WEBP) अपलोड करा.'));
    }
  },
});

export async function generateGreetings(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.paymentToken!;
    const session = getSessionByToken(token);

    if (!session || !session.isPaid) {
      return res.status(403).json({
        success: false,
        message: 'अवैध किंवा विना-पेमेंट सत्र.',
      });
    }

    const { name, designation, address, mobile } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'कृपया आपले नाव किंवा व्यवसायाचे नाव प्रविष्ट करा.',
      });
    }

    const uploadedPhotoPath = req.file ? req.file.path : undefined;

    const userData: UserGreetingData = {
      name: name.trim(),
      designation: designation ? designation.trim() : '',
      address: address ? address.trim() : '',
      mobile: mobile ? mobile.trim() : '',
      photoPath: uploadedPhotoPath,
    };

    const sessionDirPath = path.join(process.cwd(), 'generated', token);
    if (!fs.existsSync(sessionDirPath)) {
      fs.mkdirSync(sessionDirPath, { recursive: true });
    }

    const generatedImagePaths: string[] = [];
    const generatedUrls: { id: number; name: string; marathiName: string; url: string; downloadUrl: string }[] = [];

    // Generate all 11 greetings using Sharp
    for (const template of TEMPLATE_DEFS) {
      const fileName = `greeting_template_${template.id}.jpg`;
      const filePath = path.join(sessionDirPath, fileName);

      await generateGreetingImage(template.id, userData, filePath);
      generatedImagePaths.push(filePath);

      generatedUrls.push({
        id: template.id,
        name: template.name,
        marathiName: template.marathiName,
        url: `/api/greetings/view/${token}/${template.id}`,
        downloadUrl: `/api/greetings/download/${token}/${template.id}`,
      });
    }

    // Update session state with output paths
    updateSessionPaths(token, {
      uploadedPhotoPath,
      generatedImagePaths,
      sessionDirPath,
    });

    return res.json({
      success: true,
      message: 'आपल्या ११ शुभेच्छा यशस्वीरित्या तयार झाल्या!',
      count: TEMPLATE_DEFS.length,
      greetings: generatedUrls,
      zipDownloadUrl: `/api/greetings/download-zip/${token}`,
    });
  } catch (error) {
    console.error('Error generating greetings:', error);
    return res.status(500).json({
      success: false,
      message: 'शुभेच्छा कार्ड तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    });
  }
}

export async function viewGreetingImage(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.params.token || (req.query.token as string) || req.paymentToken || (req.headers['x-payment-token'] as string);
    const { id } = req.params;
    const templateId = parseInt(id, 10);

    let filePath: string | null = null;
    const session = getSessionByToken(token);

    if (session && session.generatedImagePaths && session.generatedImagePaths.length > 0) {
      const matched = session.generatedImagePaths.find(p =>
        p.endsWith(`greeting_template_${templateId}.jpg`) ||
        p.endsWith(`greeting_${templateId}.jpg`) ||
        p.includes(`template_${templateId}.jpg`)
      );
      if (matched && fs.existsSync(matched)) {
        filePath = matched;
      } else if (session.generatedImagePaths[templateId - 1] && fs.existsSync(session.generatedImagePaths[templateId - 1])) {
        filePath = session.generatedImagePaths[templateId - 1];
      }
    }

    if (!filePath) {
      const searchDirs = [
        path.join(process.cwd(), 'generated', token),
        path.join(process.cwd(), 'public', 'generated', token),
      ];
      for (const dir of searchDirs) {
        if (fs.existsSync(dir)) {
          const possibleFiles = [
            `greeting_template_${templateId}.jpg`,
            `greeting_${templateId}.jpg`,
            `template_${templateId}.jpg`,
          ];
          for (const pf of possibleFiles) {
            const fullP = path.join(dir, pf);
            if (fs.existsSync(fullP)) {
              filePath = fullP;
              break;
            }
          }
          if (filePath) break;
        }
      }
    }

    if (filePath && fs.existsSync(filePath)) {
      const absolutePath = path.resolve(filePath);
      res.setHeader('Content-Type', 'image/jpeg');
      return res.sendFile(absolutePath);
    }

    return res.status(404).send('इमेज सापडली नाही.');
  } catch (err) {
    console.error('viewGreetingImage error:', err);
    return res.status(500).send('सर्व्हर त्रुटी.');
  }
}

export async function downloadSingleGreeting(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.params.token || (req.query.token as string) || req.paymentToken || (req.headers['x-payment-token'] as string);
    const { id } = req.params;
    const templateId = parseInt(id, 10);

    let filePath: string | null = null;
    const session = getSessionByToken(token);

    if (session && session.generatedImagePaths && session.generatedImagePaths.length > 0) {
      const matched = session.generatedImagePaths.find(p =>
        p.endsWith(`greeting_template_${templateId}.jpg`) ||
        p.endsWith(`greeting_${templateId}.jpg`) ||
        p.includes(`template_${templateId}.jpg`)
      );
      if (matched && fs.existsSync(matched)) {
        filePath = matched;
      } else if (session.generatedImagePaths[templateId - 1] && fs.existsSync(session.generatedImagePaths[templateId - 1])) {
        filePath = session.generatedImagePaths[templateId - 1];
      }
    }

    if (!filePath) {
      const searchDirs = [
        path.join(process.cwd(), 'generated', token),
        path.join(process.cwd(), 'public', 'generated', token),
      ];
      for (const dir of searchDirs) {
        if (fs.existsSync(dir)) {
          const possibleFiles = [
            `greeting_template_${templateId}.jpg`,
            `greeting_${templateId}.jpg`,
            `template_${templateId}.jpg`,
          ];
          for (const pf of possibleFiles) {
            const fullP = path.join(dir, pf);
            if (fs.existsSync(fullP)) {
              filePath = fullP;
              break;
            }
          }
          if (filePath) break;
        }
      }
    }

    if (filePath && fs.existsSync(filePath)) {
      const filename = `Ganesh_Greeting_${templateId}.jpg`;
      const absolutePath = path.resolve(filePath);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.sendFile(absolutePath);
    }

    return res.status(404).send('इमेज फाईल सापडली नाही.');
  } catch (err) {
    console.error('downloadSingleGreeting error:', err);
    return res.status(500).send('डाऊनलोड अयशस्वी.');
  }
}

export async function downloadAllZip(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.params.token || (req.query.token as string) || req.paymentToken || (req.headers['x-payment-token'] as string);
    const session = getSessionByToken(token);

    let imagePaths: string[] = [];
    if (session && session.generatedImagePaths && session.generatedImagePaths.length > 0) {
      imagePaths = session.generatedImagePaths.filter(p => fs.existsSync(p));
    }

    if (imagePaths.length === 0) {
      const genDirs = [
        path.join(process.cwd(), 'generated', token),
        path.join(process.cwd(), 'public', 'generated', token),
      ];
      for (const dir of genDirs) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          imagePaths = files
            .filter(f => f.endsWith('.jpg'))
            .map(f => path.join(dir, f));
          if (imagePaths.length > 0) break;
        }
      }
    }

    if (imagePaths.length === 0) {
      return res.status(404).send('डाऊनलोड करण्यासाठी कोणत्याही फाईल्स सापडल्या नाहीत.');
    }

    const zipBuffer = await createGreetingsZipBuffer(imagePaths);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="Ganesh_Festival_Greetings_11.zip"');
    return res.send(zipBuffer);
  } catch (err) {
    console.error('downloadAllZip error:', err);
    return res.status(500).send('झिप फाईल तयार करताना त्रुटी आली.');
  }
}

export async function cleanupUserSession(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.params.token || req.paymentToken;
    if (token) {
      clearSession(token);
    }
    return res.json({
      success: true,
      message: 'सर्व डेटा आणि फाईल्स यशस्वीरित्या सुरक्षितपणे हटवल्या गेल्या.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'क्लीनअप अयशस्वी.' });
  }
}

export async function getTemplateSamples(req: AuthenticatedRequest, res: Response) {
  try {
    const customThumbnailDir = path.join(process.cwd(), 'public', 'Thumbnail');
    const assetsImagesDir = path.join(process.cwd(), 'assets', 'Images');
    const pagesDir = path.join(process.cwd(), 'public', 'Pages');

    [customThumbnailDir, assetsImagesDir, pagesDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Determine all-in-one poster image URL (from public/Thumbnail folder)
    let allInOneUrl = '/Thumbnail/all-in-one.jpg';
    if (fs.existsSync(path.join(customThumbnailDir, 'all-in-one.jpg'))) {
      allInOneUrl = '/Thumbnail/all-in-one.jpg';
    } else if (fs.existsSync(path.join(customThumbnailDir, 'all in one.jpg'))) {
      allInOneUrl = '/Thumbnail/all in one.jpg';
    } else if (fs.existsSync(path.join(customThumbnailDir, 'all in one-1.jpg'))) {
      allInOneUrl = '/Thumbnail/all in one-1.jpg';
    }

    const sampleList = [];

    for (const template of TEMPLATE_DEFS) {
      // Check for user-provided image first in assets/Images, Pages, or Thumbnail folder
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const padId = template.id.toString().padStart(2, '0');
      const possibleNames = [
        `Page ${template.id}`,
        `Page ${padId}`,
        `Page  ${padId}`,
        `sample_${template.id}`,
        `${template.id}`,
        `page_${padId}`,
        `page_${template.id}`
      ];

      let customFile = '';

      for (const ext of extensions) {
        for (const name of possibleNames) {
          if (fs.existsSync(path.join(assetsImagesDir, `${name}${ext}`))) {
            customFile = `/assets/Images/${name}${ext}`;
            break;
          } else if (fs.existsSync(path.join(pagesDir, `${name}${ext}`))) {
            customFile = `/Pages/${name}${ext}`;
            break;
          } else if (fs.existsSync(path.join(customThumbnailDir, `${name}${ext}`))) {
            customFile = `/Thumbnail/${name}${ext}`;
            break;
          }
        }
        if (customFile) break;
      }

      let previewUrl = customFile || allInOneUrl;

      sampleList.push({
        id: template.id,
        name: template.name,
        marathiName: template.marathiName,
        badgeText: template.badgeText,
        mainGreeting: template.mainGreeting,
        previewUrl,
      });
    }

    return res.json({
      success: true,
      allInOneUrl,
      templates: sampleList,
    });
  } catch (error) {
    console.error('Error fetching template samples:', error);
    return res.status(500).json({ success: false, message: 'सॅम्पल लोड करण्यात त्रुटी.' });
  }
}
