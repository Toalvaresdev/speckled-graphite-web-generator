import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Star } from 'lucide-react';
import { GraphiteConfig, MockupType } from '../../types/graphite';
import { generateCssBackground, generateSvgFilterMarkup } from '../../utils/svgGenerator';

interface MockupViewerProps {
  config: GraphiteConfig;
}

export const MockupViewer: React.FC<MockupViewerProps> = ({ config }) => {
  const [mockupType, setMockupType] = useState<MockupType>('card');

  const backgroundCss = generateCssBackground(config);
  
  const filterId = useMemo(() => {
    return `mockup-g-${config.seed}-${config.baseFrequencyX.toFixed(3)}-${config.baseFrequencyY.toFixed(3)}-${config.grainScale.toFixed(2)}-${config.numOctaves}-${config.blur.toFixed(1)}-${config.speckleDensity}-${config.speckleContrast.toFixed(1)}-${config.speckleSharpness}-${config.speckleTone}-${config.grainOpacity}-${config.noiseType}`;
  }, [
    config.seed,
    config.baseFrequencyX,
    config.baseFrequencyY,
    config.grainScale,
    config.numOctaves,
    config.blur,
    config.speckleDensity,
    config.speckleContrast,
    config.speckleSharpness,
    config.speckleTone,
    config.grainOpacity,
    config.noiseType,
  ]);

  const filterMarkup = useMemo(() => {
    return generateSvgFilterMarkup(config, filterId);
  }, [config, filterId]);

  return (
    <div className="relative flex-1 h-full min-h-0 flex flex-col items-center justify-start p-6 overflow-y-auto custom-scrollbar bg-studio-950/60">
      {/* Dynamic SVG Filter definition rendered in DOM */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: filterMarkup }} />
      </svg>

      {/* Top Mockup Selector */}
      <div className="mb-6 flex items-center p-1 bg-studio-900/90 backdrop-blur-md rounded-xl border border-studio-800 shadow-studio shrink-0">
        {[
          { id: 'card', label: 'Tarjeta SaaS' },
          { id: 'hero', label: 'Hero Landing' },
          { id: 'button', label: 'Botones & Badges' },
          { id: 'poster', label: 'Póster Minimalista' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMockupType(tab.id as MockupType)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              mockupType === tab.id
                ? 'bg-studio-800 text-white shadow-sm font-semibold'
                : 'text-studio-400 hover:text-studio-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mockup Display Area */}
      <div className="w-full max-w-3xl flex items-center justify-center animate-in fade-in duration-300 pb-12">
        
        {/* 1. SaaS Card Mockup */}
        {mockupType === 'card' && (
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-studio-900/80 border border-studio-700/60 shadow-2xl backdrop-blur-xl">
            {/* Header with Graphite Texture */}
            <div
              className="relative h-44 w-full overflow-hidden p-6 flex flex-col justify-between"
              style={{ background: backgroundCss }}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none block" key={filterId}>
                <rect
                  width="100%"
                  height="100%"
                  filter={`url(#${filterId})`}
                  style={{
                    mixBlendMode: config.blendMode,
                    opacity: config.grainOpacity / 100,
                  }}
                />
              </svg>
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20">
                  Enterprise Node
                </span>
                <Sparkles className="w-4 h-4 text-white/80" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white tracking-tight">Cifrado de Alta Densidad</h3>
                <p className="text-xs text-white/75 mt-0.5">Seguridad mineral con textura granular nativa</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-studio-400">
                <span>Rendimiento del Cluster</span>
                <span className="font-mono text-emerald-400 font-semibold">99.98%</span>
              </div>
              <div className="w-full bg-studio-950 rounded-full h-2 overflow-hidden border border-studio-800">
                <div className="bg-accent h-full rounded-full w-[84%]" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-studio-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verificado con CSS feTurbulence</span>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-700 transition">
                  Explorar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Hero Landing Page Mockup */}
        {mockupType === 'hero' && (
          <div
            className="relative w-full rounded-2xl overflow-hidden p-12 text-center border border-studio-700/80 shadow-2xl"
            style={{ background: backgroundCss }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none block" key={filterId}>
              <rect
                width="100%"
                height="100%"
                filter={`url(#${filterId})`}
                style={{
                  mixBlendMode: config.blendMode,
                  opacity: config.grainOpacity / 100,
                }}
              />
            </svg>

            {/* Content */}
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-md border border-white/20">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span>Textura ultraligera &lt; 1KB de peso</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Texturas orgánicas de grafito con CSS y SVG nativos
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Reemplaza pesados fondos JPG/PNG con filtros procedurales en tiempo real. Máximo rendimiento para experiencias web de nueva generación.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-accent hover:bg-accent-hover text-white shadow-glow transition">
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">
                  Ver Documentación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Buttons & Badges Mockup */}
        {mockupType === 'button' && (
          <div className="w-full max-w-lg p-8 rounded-2xl bg-studio-900/90 border border-studio-800 shadow-2xl space-y-6">
            <h4 className="text-sm font-semibold text-white">Componentes con Textura de Grafito</h4>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Button with textured surface */}
              <button
                className="relative overflow-hidden p-4 rounded-xl text-center group border border-white/15 shadow-lg"
                style={{ background: backgroundCss }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none block" key={filterId}>
                  <rect
                    width="100%"
                    height="100%"
                    filter={`url(#${filterId})`}
                    style={{
                      mixBlendMode: config.blendMode,
                      opacity: config.grainOpacity / 100,
                    }}
                  />
                </svg>
                <span className="relative z-10 text-xs font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Botón Premium
                </span>
              </button>

              {/* Status Badge */}
              <div
                className="relative overflow-hidden p-4 rounded-xl text-center border border-white/15 flex items-center justify-center gap-2"
                style={{ background: backgroundCss }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none block" key={filterId}>
                  <rect
                    width="100%"
                    height="100%"
                    filter={`url(#${filterId})`}
                    style={{
                      mixBlendMode: config.blendMode,
                      opacity: config.grainOpacity / 100,
                    }}
                  />
                </svg>
                <Activity className="relative z-10 w-4 h-4 text-emerald-400" />
                <span className="relative z-10 text-xs font-semibold text-white">Status: Activo</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Minimalist Poster Mockup */}
        {mockupType === 'poster' && (
          <div
            className="relative w-80 h-[480px] rounded-2xl overflow-hidden p-8 flex flex-col justify-between border border-studio-700/80 shadow-2xl"
            style={{ background: backgroundCss }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none block" key={filterId}>
              <rect
                width="100%"
                height="100%"
                filter={`url(#${filterId})`}
                style={{
                  mixBlendMode: config.blendMode,
                  opacity: config.grainOpacity / 100,
                }}
              />
            </svg>
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/60">COLLECTION 01</span>
              <h2 className="text-2xl font-black text-white mt-1">GRAFITO PURO</h2>
            </div>
            <div className="relative z-10 space-y-1">
              <div className="w-12 h-1 bg-accent rounded" />
              <p className="text-[10px] font-mono text-white/50 pt-2">SEED #{config.seed} // OCTAVES {config.numOctaves}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
