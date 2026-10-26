import { CanvasElement, Product } from '@/types';

/**
 * Render canvas elements onto an HTML5 Canvas context
 * Supports images, stickers, frames, texts, with rotation, opacity, and layering.
 */
export async function renderElementsToCanvas(
  ctx: CanvasRenderingContext2D,
  elements: CanvasElement[],
  widthPx: number,
  heightPx: number,
  background: string
): Promise<void> {
  // Clear and paint background
  ctx.clearRect(0, 0, widthPx, heightPx);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Sort elements by zIndex
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sorted) {
    ctx.save();

    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;

    ctx.translate(centerX, centerY);
    if (el.rotation !== 0) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = el.opacity ?? 1;

    if (el.type === 'text') {
      const fontSize = el.fontSize || 16;
      const fontFamily = el.fontFamily || 'sans-serif';
      const fontWeight = el.fontWeight || 'normal';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = el.color || '#FFFFFF';
      ctx.textAlign = el.textAlign || 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(el.text || '', 0, 0);
    } else if (el.src) {
      // Load image asynchronously and draw
      try {
        const img = await loadImage(el.src);
        ctx.drawImage(img, -el.width / 2, -el.height / 2, el.width, el.height);
      } catch {
        // Image draw error fallback
      }
    }

    ctx.restore();
  }
}

/**
 * Load HTMLImageElement promise wrapper
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Generate 300 DPI high-resolution export data URL
 */
export async function exportHighResPrintFile(
  elements: CanvasElement[],
  product: Product,
  background: string
): Promise<string> {
  // Calculate pixel size at 300 DPI: mm * 300 / 25.4
  const scaleDpi = 300 / 25.4;
  const printWidthPx = Math.round(product.widthMm * scaleDpi);
  const printHeightPx = Math.round(product.heightMm * scaleDpi);

  const offscreen = document.createElement('canvas');
  offscreen.width = printWidthPx;
  offscreen.height = printHeightPx;
  const ctx = offscreen.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Scale elements proportionally to high-res resolution
  // Assuming default preview editor canvas is width 340px
  const basePreviewWidth = 340;
  const scaleRatio = printWidthPx / basePreviewWidth;

  const scaledElements: CanvasElement[] = elements.map((el) => ({
    ...el,
    x: el.x * scaleRatio,
    y: el.y * scaleRatio,
    width: el.width * scaleRatio,
    height: el.height * scaleRatio,
    fontSize: el.fontSize ? el.fontSize * scaleRatio : undefined,
  }));

  await renderElementsToCanvas(ctx, scaledElements, printWidthPx, printHeightPx, background);

  return offscreen.toDataURL('image/png', 1.0);
}
