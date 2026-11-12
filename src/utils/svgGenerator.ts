import { GraphiteConfig } from '../types/graphite';

/**
 * Builds an advanced SVG filter with pure monochromatic saturation (0% RGB color distortion)
 * and true high-pass stippling/speckle thresholding.
 */
export function generateSvgFilterMarkup(
  config: GraphiteConfig,
  filterId: string = 'graphite-filter'
): string {
  const {
    baseFrequencyX,
    baseFrequencyY,
    grainScale = 1.0,
    numOctaves,
    noiseType,
    stitchTiles,
    seed,
    speckleContrast,
    speckleDensity,
    speckleBrightness,
    speckleTone,
    speckleSharpness = 12,
    blur,
    surfaceLighting,
    lightIntensity,
    grainOpacity,
  } = config;

  const stitch = stitchTiles ? 'stitch' : 'noStitch';

  // Procedural grain scale: modulates frequency mathematically
  // Avoids CSS transform clipping and enables grain to scale seamlessly up to 3x without vanishing
  const scale = Math.max(0.2, grainScale || 1.0);
  const freqX = (baseFrequencyX / scale).toFixed(4);
  const freqY = (baseFrequencyY / scale).toFixed(4);

  // 1. Threshold calculation for crisp stipples / dots
  const coverage = (speckleDensity / 100) * 0.45 + 0.05;
  const threshold = Math.max(0.40, Math.min(0.96, 1.0 - coverage - (speckleBrightness * 0.15)));
  
  // Sharpness controls the steepness of the cutoff slope
  const slope = (speckleSharpness * (speckleContrast / 4) * 5.5).toFixed(1);
  const intercept = (-Number(slope) * threshold).toFixed(2);

  // Tone color values (100% Monochromatic - NO green/red/blue artifacts)
  let matrixR = '0 0 0 0 1';
  let matrixG = '0 0 0 0 1';
  let matrixB = '0 0 0 0 1';
  let matrixA = '1 0 0 0 0';

  if (speckleTone === 'silver') {
    // Pure silver/white sparkling flakes (Kilowatty style)
    matrixR = '0 0 0 0 1';
    matrixG = '0 0 0 0 1';
    matrixB = '0 0 0 0 1';
    matrixA = '1 0 0 0 0';
  } else if (speckleTone === 'dark') {
    // Deep black charcoal / carbon pits
    matrixR = '0 0 0 0 0';
    matrixG = '0 0 0 0 0';
    matrixB = '0 0 0 0 0';
    matrixA = '1 0 0 0 0';
  } else {
    // Balanced monochrome mineral
    matrixR = '0 0 0 0 0.85';
    matrixG = '0 0 0 0 0.85';
    matrixB = '0 0 0 0 0.85';
    matrixA = '1 0 0 0 0';
  }

  const alphaOpacity = (grainOpacity / 100).toFixed(2);

  return `
<filter id="${filterId}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
  <!-- 1. Organic Base Turbulence with Scaled Grain -->
  <feTurbulence 
    type="${noiseType}" 
    baseFrequency="${freqX} ${freqY}" 
    numOctaves="${numOctaves}" 
    seed="${seed}" 
    stitchTiles="${stitch}" 
    result="rawNoise" 
  />

  <!-- 2. Pure Monochromatic Desaturation: Eliminates all red/green/blue Perlin artifacts -->
  <feColorMatrix in="rawNoise" type="saturate" values="0" result="grayNoise" />

  ${blur > 0 ? `<feGaussianBlur in="grayNoise" stdDeviation="${(blur * 0.5).toFixed(1)}" result="blurredNoise" />` : ''}

  <!-- 3. High-pass Stippling Threshold (Creates isolated, crisp dots/motas) -->
  <feComponentTransfer in="${blur > 0 ? 'blurredNoise' : 'grayNoise'}" result="thresholdSpeckles">
    <feFuncR type="linear" slope="${slope}" intercept="${intercept}" />
    <feFuncG type="linear" slope="${slope}" intercept="${intercept}" />
    <feFuncB type="linear" slope="${slope}" intercept="${intercept}" />
  </feComponentTransfer>

  <!-- 4. Monochromatic Stipple Mapping (Silver Sparkles vs Dark Charcoal) -->
  <feColorMatrix 
    in="thresholdSpeckles" 
    type="matrix" 
    values="${matrixR}
            ${matrixG}
            ${matrixB}
            ${matrixA}" 
    result="tintedSpeckles" 
  />

  ${
    surfaceLighting
      ? `<!-- 5. Specular Lighting (Reflective Graphite Sheen) -->
  <feSpecularLighting in="grayNoise" surfaceScale="${(lightIntensity * 2.5).toFixed(1)}" specularConstant="${(lightIntensity * 2.0).toFixed(1)}" specularExponent="24" lighting-color="#ffffff" result="sheen">
    <feDistantLight azimuth="55" elevation="65" />
  </feSpecularLighting>
  <feComposite in="sheen" in2="tintedSpeckles" operator="over" result="litSpeckles" />`
      : ''
  }

  <!-- 6. Final Opacity Composite -->
  <feComponentTransfer in="${surfaceLighting ? 'litSpeckles' : 'tintedSpeckles'}" result="finalGraphite">
    <feFuncA type="linear" slope="${alphaOpacity}" intercept="0" />
  </feComponentTransfer>
</filter>
`.trim();
}

/**
 * Builds a standalone, self-contained SVG element that can be downloaded or rendered.
 */
export function generateFullSvg(
  config: GraphiteConfig,
  width: number = 1920,
  height: number = 1080
): string {
  const filterId = `graphite-${config.seed}`;
  const filterMarkup = generateSvgFilterMarkup(config, filterId);
  const backgroundGradient = generateCssBackground(config);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${filterMarkup}
    <style>
      .bg-rect {
        background: ${backgroundGradient};
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${config.colors[0]?.color || '#090a0d'}" />
  <rect width="100%" height="100%" style="background: ${backgroundGradient};" class="bg-rect" />
  <rect width="100%" height="100%" filter="url(#${filterId})" style="mix-blend-mode: ${config.blendMode};" />
</svg>
`.trim();
}

/**
 * Generates the CSS background string for the gradient layer.
 */
export function generateCssBackground(config: GraphiteConfig): string {
  const { gradientType, gradientAngle, colors } = config;

  if (colors.length === 0) return '#090a0d';
  if (colors.length === 1 || gradientType === 'solid') return colors[0].color;

  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  const stops = sortedColors.map((c) => `${c.color} ${c.position}%`).join(', ');

  switch (gradientType) {
    case 'linear':
      return `linear-gradient(${gradientAngle}deg, ${stops})`;
    case 'radial':
      return `radial-gradient(ellipse at center, ${stops})`;
    case 'conic':
      return `conic-gradient(from ${gradientAngle}deg at 50% 50%, ${stops})`;
    default:
      return `radial-gradient(circle at center, ${stops})`;
  }
}

/**
 * Generates an optimized, URL-safe SVG Data URI for direct use in CSS background-image.
 */
export function generateSvgDataUri(config: GraphiteConfig): string {
  const filterId = 'g';
  const filterMarkup = generateSvgFilterMarkup(config, filterId);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%"><defs>${filterMarkup}</defs><rect width="100%" height="100%" filter="url(%23${filterId})"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
