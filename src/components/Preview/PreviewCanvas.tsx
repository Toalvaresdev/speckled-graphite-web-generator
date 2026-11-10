import React, { useRef, useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { GraphiteConfig } from '../../types/graphite';
import { generateCssBackground, generateSvgFilterMarkup } from '../../utils/svgGenerator';

interface PreviewCanvasProps {
  config: GraphiteConfig;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ config }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const backgroundCss = generateCssBackground(config);

  // Dynamic filter ID containing all reactive visual parameters
  // This guarantees browsers (Chrome & Safari WebKit) re-render immediately on slider drag
  const filterId = useMemo(() => {
    return `live-g-${config.seed}-${config.baseFrequencyX.toFixed(3)}-${config.baseFrequencyY.toFixed(3)}-${config.numOctaves}-${config.blur.toFixed(1)}-${config.speckleDensity}-${config.speckleContrast.toFixed(1)}-${config.speckleSharpness}-${config.speckleTone}-${config.grainOpacity}-${config.noiseType}-${config.surfaceLighting ? 'lit' : 'flat'}`;
  }, [
    config.seed,
    config.baseFrequencyX,
    config.baseFrequencyY,
    config.numOctaves,
    config.blur,
    config.speckleDensity,
    config.speckleContrast,
    config.speckleSharpness,
    config.speckleTone,
    config.grainOpacity,
    config.noiseType,
    config.surfaceLighting,
  ]);

  const filterMarkup = useMemo(() => {
    return generateSvgFilterMarkup(config, filterId);
  }, [config, filterId]);

  // Aspect ratio classes
  const getAspectRatioStyle = () => {
    switch (config.aspectRatio) {
      case '16:9':
        return { aspectRatio: '16 / 9', maxWidth: '960px' };
      case '1:1':
        return { aspectRatio: '1 / 1', maxWidth: '620px' };
      case '9:16':
        return { aspectRatio: '9 / 16', maxWidth: '420px', maxHeight: '720px' };
      case '4:3':
        return { aspectRatio: '4 / 3', maxWidth: '820px' };
      case 'fill':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative flex-1 h-full min-h-0 flex items-center justify-center p-6 overflow-hidden bg-studio-950/60">
      {/* Main Canvas Viewport with Shadow & Border */}
      <div
        ref={containerRef}
        style={{
          transform: `scale(${zoom})`,
          transition: 'transform 0.15s ease-out',
        }}
        className="w-full flex items-center justify-center"
      >
        <div
          style={{
            ...getAspectRatioStyle(),
            background: backgroundCss,
          }}
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/40 transition-colors duration-200"
        >
          {/* Hardware-Accelerated SVG Layer: Updates in real-time on every slider input */}
          <svg
            key={filterId}
            className="absolute inset-0 w-full h-full pointer-events-none select-none block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs dangerouslySetInnerHTML={{ __html: filterMarkup }} />
            <rect
              width="100%"
              height="100%"
              filter={`url(#${filterId})`}
              style={{
                mixBlendMode: config.blendMode,
                opacity: config.grainOpacity / 100,
                transform: config.grainScale !== 1 ? `scale(${config.grainScale})` : undefined,
                transformOrigin: 'center center',
              }}
            />
          </svg>

          {/* Subtle Organic Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-transparent to-black/15"
          />

          {/* Seed indicator watermark */}
          <div className="absolute bottom-3 right-4 pointer-events-none font-mono text-[10px] text-white/50 tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>SEED: {config.seed}</span>
            <span className="text-white/30">•</span>
            <span>{config.noiseType}</span>
            <span className="text-white/30">•</span>
            <span className="uppercase text-accent font-semibold">{config.speckleTone}</span>
          </div>
        </div>
      </div>

      {/* Floating Zoom & Viewport Bar */}
      <div className="absolute bottom-4 right-6 flex items-center gap-1.5 p-1 bg-studio-900/90 backdrop-blur-md rounded-xl border border-studio-800 shadow-studio">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
          title="Alejar"
          className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono text-studio-300 px-1 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
          title="Acercar"
          className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          title="Restablecer Zoom (100%)"
          className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <div className="w-[1px] h-4 bg-studio-800 mx-0.5" />
        <button
          onClick={handleFullscreen}
          title="Pantalla Completa"
          className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
