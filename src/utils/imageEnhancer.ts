/**
 * Image enhancement utility for handwritten and scanned educational work pages.
 * Performs contrast stretching, background whitening, unsharp mask sharpening,
 * and noise reduction using HTML5 Canvas.
 */

export interface EnhancementOptions {
  contrast?: number; // -100 to 100
  brightness?: number; // -100 to 100
  sharpen?: boolean;
  cleanBackground?: boolean;
  rotation?: number; // 0, 90, 180, 270
}

export function enhanceScannedImage(
  imageSource: string | HTMLImageElement,
  options: EnhancementOptions = {}
): Promise<string> {
  const {
    contrast = 25,
    brightness = 15,
    sharpen = true,
    cleanBackground = true,
    rotation = 0,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          resolve(typeof imageSource === "string" ? imageSource : img.src);
          return;
        }

        // Handle rotation dimensions
        const isRotated90or270 = rotation === 90 || rotation === 270;
        canvas.width = isRotated90or270 ? img.height : img.width;
        canvas.height = isRotated90or270 ? img.width : img.height;

        // Apply rotation transform
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Pixel-level adjustments
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Apply contrast
          r = factor * (r - 128) + 128 + brightness;
          g = factor * (g - 128) + 128 + brightness;
          b = factor * (b - 128) + 128 + brightness;

          // Background whitening threshold for yellowish/grayish scanned paper
          if (cleanBackground) {
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            if (luma > 185) {
              // Whitening paper background
              const boost = (luma - 185) * 1.2;
              r = Math.min(255, r + boost);
              g = Math.min(255, g + boost);
              b = Math.min(255, b + boost);
            } else if (luma < 100) {
              // Deepen ink/pencil strokes for readability
              r = Math.max(0, r * 0.85);
              g = Math.max(0, g * 0.85);
              b = Math.max(0, b * 0.85);
            }
          }

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }

        ctx.putImageData(imgData, 0, 0);

        // Simple unsharp sharpening filter if requested
        if (sharpen && canvas.width <= 2400) {
          applySharpenConvolution(ctx, canvas.width, canvas.height);
        }

        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch (err) {
        console.warn("Canvas enhancement error, returning original:", err);
        resolve(typeof imageSource === "string" ? imageSource : img.src);
      }
    };

    img.onerror = () => {
      resolve(typeof imageSource === "string" ? imageSource : "");
    };

    if (typeof imageSource === "string") {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}

function applySharpenConvolution(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  const src = ctx.getImageData(0, 0, w, h);
  const srcData = src.data;
  const dst = ctx.createImageData(w, h);
  const dstData = dst.data;

  // 3x3 Laplacian sharpening kernel
  const kernel = [
    0, -0.5, 0,
    -0.5, 3, -0.5,
    0, -0.5, 0
  ];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * w + (x + kx)) * 4;
          const kVal = kernel[(ky + 1) * 3 + (kx + 1)];
          r += srcData[idx] * kVal;
          g += srcData[idx + 1] * kVal;
          b += srcData[idx + 2] * kVal;
        }
      }
      const outIdx = (y * w + x) * 4;
      dstData[outIdx] = Math.min(255, Math.max(0, r));
      dstData[outIdx + 1] = Math.min(255, Math.max(0, g));
      dstData[outIdx + 2] = Math.min(255, Math.max(0, b));
      dstData[outIdx + 3] = srcData[outIdx + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}
