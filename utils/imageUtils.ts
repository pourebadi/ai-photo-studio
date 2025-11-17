import { AspectRatio } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const resizeImageToAspectRatio = (
  imageFile: File,
  targetAspectRatio: AspectRatio
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      const [widthRatio, heightRatio] = targetAspectRatio.split(':').map(Number);
      const targetRatio = widthRatio / heightRatio;
      const imageRatio = img.width / img.height;

      let canvasWidth, canvasHeight;

      if (targetRatio > imageRatio) {
        canvasHeight = img.height > 2048 ? 2048 : img.height;
        canvasWidth = canvasHeight * targetRatio;
      } else {
        canvasWidth = img.width > 2048 ? 2048 : img.width;
        canvasHeight = canvasWidth / targetRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.onerror = (error) => reject(error);
  });
};


export const base64ToFile = (base64: string, filename: string): File => {
  const parts = base64.split(',');
  if (parts.length !== 2) {
    throw new Error('Invalid base64 string format');
  }
  const mimeMatch = parts[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) {
    throw new Error('Could not determine MIME type from base64 string');
  }
  const mime = mimeMatch[1];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mime });
};
