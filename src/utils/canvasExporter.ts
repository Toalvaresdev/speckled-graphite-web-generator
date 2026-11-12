import { GraphiteConfig } from '../types/graphite';

/**
 * Maps CSS blend modes to Canvas globalCompositeOperation
 */
function mapBlendModeToComposite(blendMode: string): GlobalCompositeOperation {
  switch (blendMode) {
    case 'multiply':
      return 'multiply';
    case 'screen':
      return 'screen';
    case 'overlay':
      return 'overlay';
    case 'soft-light':
      return 'soft-light';
    case 'hard-light':
      return 'hard-light';
    case 'color-dodge':
      return 'color-dodge';
    case 'color-burn':
      return 'color-burn';
    case 'difference':
      return 'difference';
    default:
      return 'source-over';
  }
}

/**
 * Renders the full procedural texture onto an HTML5 Canvas at exact resolution
 * and triggers a clean image download.
 */
export async function exportToCanvas(
  config: GraphiteConfig,
  width: number = 1920,
  height: number = 1080,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  filename: string = 'speckled-graphite.png'
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // 1. Render Base Background Gradient
  const sortedColors = [...config.colors].sort((a, b) => a.position - b.position);

  if (sortedColors.length === 1 || config.gradientType === 'solid') {
    ctx.fillStyle = sortedColors[0]?.color || '#111318';
    ctx.fillRect(0, 0, width, height);
  } else if (config.gradientType === 'linear') {
    const angleRad = ((config.gradientAngle - 90) * Math.PI) / 180;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.sqrt(cx * cx + cy * cy);
    const x0 = cx - Math.cos(angleRad) * r;
    const y0 = cy - Math.sin(angleRad) * r;
    const x1 = cx + Math.cos(angleRad) * r;
    const y1 = cy + Math.sin(angleRad) * r;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    sortedColors.forEach((stop) => {
      grad.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (config.gradientType === 'radial') {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.max(width, height) / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    sortedColors.forEach((stop) => {
      grad.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Conic or fallback
    const grad = ctx.createLinearGradient(0, 0, width, height);
    sortedColors.forEach((stop) => {
      grad.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. High-precision procedural noise & speckle simulation for 4K rasterization
  // We combine SVG raster drawing with fine particle stippling for crisp grain
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Simple pseudo-random seeded generator
  let seed = config.seed;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const density = config.speckleDensity / 100;
  const contrast = config.speckleContrast;
  const opacity = (config.grainOpacity / 100) * 0.9;
  const tone = config.speckleTone;

  // Loop through pixels in subsampled step for high performance on 4K
  const totalPixels = width * height;
  const speckleCount = Math.floor(totalPixels * density * 0.45);

  for (let i = 0; i < speckleCount; i++) {
    const px = Math.floor(random() * width);
    const py = Math.floor(random() * height);
    const idx = (py * width + px) * 4;

    const grainVal = random();
    // High contrast cutoff creates stippled graphite grains
    if (grainVal > (1.08 - density * 0.75)) {
      const intensity = Math.pow(grainVal, contrast * 0.6);
      let factor = 255;

      if (tone === 'silver') {
        factor = Math.min(255, Math.round(200 + intensity * 55));
      } else if (tone === 'dark') {
        factor = Math.max(0, Math.round((1 - intensity) * 60));
      } else {
        factor = random() > 0.5 ? Math.round(200 + intensity * 55) : Math.round((1 - intensity) * 60);
      }

      data[idx] = Math.round(data[idx] * (1 - opacity) + factor * opacity);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - opacity) + factor * opacity);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - opacity) + factor * opacity);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 3. Render SVG filter overlay for the organic feTurbulence cloudy/fibrous texture
  const scale = Math.max(0.2, config.grainScale || 1.0);
  const freqX = (config.baseFrequencyX / scale).toFixed(4);
  const freqY = (config.baseFrequencyY / scale).toFixed(4);

  const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <filter id="f">
    <feTurbulence type="${config.noiseType}" baseFrequency="${freqX} ${freqY}" numOctaves="${config.numOctaves}" seed="${config.seed}" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 ${opacity * 0.7} 0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#f)"/>
</svg>`.trim();

  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  await new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.globalCompositeOperation = mapBlendModeToComposite(config.blendMode);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(); // Proceed with base speckles
    };
    img.src = url;
  });

  // 4. Download file
  const dataUrl = canvas.toDataURL(format, format === 'image/jpeg' ? 0.92 : undefined);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
