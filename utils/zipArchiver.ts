import JSZip from 'jszip';
import fs from 'fs';

export async function createGreetingsZipBuffer(imagePaths: string[]): Promise<Buffer> {
  const zip = new JSZip();

  for (let i = 0; i < imagePaths.length; i++) {
    const filePath = imagePaths[i];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      const filename = `Ganesh_Greeting_Template_${i + 1}.jpg`;
      zip.file(filename, fileData);
    }
  }

  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
