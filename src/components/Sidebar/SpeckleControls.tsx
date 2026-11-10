import React from 'react';
import { Dot, Contrast, SunMedium, ZoomIn, Sparkles, Flame, Layers } from 'lucide-react';
import { GraphiteConfig, SpeckleTone } from '../../types/graphite';

interface SpeckleControlsProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
}

const TONES: { id: SpeckleTone; label: string; icon: any; desc: string }[] = [
  { id: 'silver', label: 'Plateado (Foto)', icon: Sparkles, desc: 'Destellos blancos/plata' },
  { id: 'dark', label: 'Carbón', icon: Flame, desc: 'Puntos negros de grafito' },
  { id: 'mixed', label: 'Mixto', icon: Layers, desc: 'Mineral híbrido' },
];

export const SpeckleControls: React.FC<SpeckleControlsProps> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      {/* Speckle Tone (Silver Sparkles vs Dark Charcoal vs Mixed) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-studio-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Tono de Motas y Puntos</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-studio-950/80 rounded-lg border border-studio-800">
          {TONES.map((t) => {
            const Icon = t.icon;
            const isSelected = config.speckleTone === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  // When switching to silver, recommend blendMode screen for intense pop
                  if (t.id === 'silver') {
                    updateConfig({ speckleTone: 'silver', blendMode: 'screen', grainOpacity: Math.max(75, config.grainOpacity) });
                  } else if (t.id === 'dark') {
                    updateConfig({ speckleTone: 'dark', blendMode: 'overlay' });
                  } else {
                    updateConfig({ speckleTone: 'mixed', blendMode: 'overlay' });
                  }
                }}
                className={`py-2 px-1 text-center rounded-md transition flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-accent/20 border border-accent text-white shadow-sm'
                    : 'text-studio-400 hover:text-studio-200 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-studio-400'}`} />
                <span className="text-[11px] font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speckle Sharpness (Agudeza de puntos / thresholding) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Agudeza de Puntos (Stippling)</span>
          </span>
          <span className="text-accent font-mono font-semibold">{config.speckleSharpness}</span>
        </div>
        <input
          type="range"
          min="4"
          max="20"
          step="1"
          value={config.speckleSharpness}
          onChange={(e) => updateConfig({ speckleSharpness: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[10px] text-studio-500 font-mono">
          <span>Difuminado</span>
          <span>Motas Nítidas (Kilowatty)</span>
        </div>
      </div>

      {/* Speckle Density (Cantidad de puntos) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Dot className="w-4 h-4 text-accent" />
            <span>Cantidad de Puntos / Densidad</span>
          </span>
          <span className="text-studio-400 font-mono">{config.speckleDensity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="95"
          step="1"
          value={config.speckleDensity}
          onChange={(e) => updateConfig({ speckleDensity: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[10px] text-studio-500 font-mono">
          <span>Esparcido</span>
          <span>Denso / Asfalto</span>
        </div>
      </div>

      {/* Speckle Contrast */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Contrast className="w-3.5 h-3.5 text-studio-400" />
            <span>Contraste & Intensidad</span>
          </span>
          <span className="text-studio-400 font-mono">{config.speckleContrast.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="2.0"
          max="15.0"
          step="0.5"
          value={config.speckleContrast}
          onChange={(e) => updateConfig({ speckleContrast: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Grain Scale / Zoom */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-studio-400" />
            <span>Escala del Grano</span>
          </span>
          <span className="text-studio-400 font-mono">{config.grainScale.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={config.grainScale}
          onChange={(e) => updateConfig({ grainScale: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Brightness Compensation */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-studio-400" />
            <span>Compensación de Brillo</span>
          </span>
          <span className="text-studio-400 font-mono">{(config.speckleBrightness * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="-0.5"
          max="0.5"
          step="0.02"
          value={config.speckleBrightness}
          onChange={(e) => updateConfig({ speckleBrightness: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>
    </div>
  );
};
