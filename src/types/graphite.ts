export type NoiseType = 'fractalNoise' | 'turbulence';

export type BlendMode = 
  | 'multiply' 
  | 'overlay' 
  | 'soft-light' 
  | 'screen' 
  | 'color-dodge' 
  | 'color-burn' 
  | 'hard-light' 
  | 'difference' 
  | 'normal';

export type SpeckleTone = 'silver' | 'dark' | 'mixed';

export type GradientType = 'linear' | 'radial' | 'conic' | 'solid';

export type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | 'fill';

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0 to 100%
}

export interface GraphiteConfig {
  // SVG feTurbulence controls
  baseFrequencyX: number; // e.g. 0.04 to 1.5
  baseFrequencyY: number; // e.g. 0.04 to 1.5
  linkFrequencies: boolean;
  numOctaves: number; // 1 to 6
  noiseType: NoiseType;
  stitchTiles: boolean;
  seed: number;

  // Speckle & Grain controls (feColorMatrix & feComponentTransfer)
  grainScale: number; // Zoom/scaling multiplier (0.5 to 4.0)
  speckleDensity: number; // 0 to 100 (modulates threshold/points amount)
  speckleSize: number; // 0.1 to 3.0
  speckleContrast: number; // 1.0 to 15.0
  speckleBrightness: number; // -1.0 to 1.0
  speckleTone: SpeckleTone; // 'silver' (white/silver sparkles like Kilowatty), 'dark' (charcoal), 'mixed'
  speckleSharpness: number; // 1 to 20 (sharp thresholding)
  invertGrain: boolean; // Dark speckles vs Light dust particles

  // Optical blending & Surface lighting
  blendMode: BlendMode;
  grainOpacity: number; // 0 to 100%
  blur: number; // 0 to 5px (feGaussianBlur)
  surfaceLighting: boolean; // feSpecularLighting / feDiffuseLighting effect
  lightIntensity: number; // 0 to 2.0

  // Background & Palette
  gradientType: GradientType;
  gradientAngle: number; // 0 to 360 deg
  colors: ColorStop[];

  // Canvas / Output settings
  aspectRatio: AspectRatio;
  customWidth: number;
  customHeight: number;
}

export type ViewMode = 'canvas' | 'mockup';
export type MockupType = 'card' | 'hero' | 'button' | 'poster';

export interface DesignPreset {
  id: string;
  name: string;
  tag: string;
  description: string;
  config: Partial<GraphiteConfig>;
}
