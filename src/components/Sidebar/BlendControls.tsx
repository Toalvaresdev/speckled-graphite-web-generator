import React from 'react';
import { Eye, Droplets, Sparkles, Layers } from 'lucide-react';
import { GraphiteConfig, BlendMode } from '../../types/graphite';

interface BlendControlsProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
}

const BLEND_MODES: { label: string; value: BlendMode }[] = [
  { label: 'Overlay (Recomendado)', value: 'overlay' },
  { label: 'Multiply (Profundo)', value: 'multiply' },
  { label: 'Soft Light (Sutil)', value: 'soft-light' },
  { label: 'Screen (Luminoso)', value: 'screen' },
  { label: 'Color Dodge (Vibrante)', value: 'color-dodge' },
  { label: 'Hard Light (Intenso)', value: 'hard-light' },
  { label: 'Normal', value: 'normal' },
];

export const BlendControls: React.FC<BlendControlsProps> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      {/* Blend Mode */}
      <div className="space-y-1.5">
        <label className="text-xs text-studio-300 font-medium flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-studio-400" />
          <span>Modo de Mezcla (Blend Mode)</span>
        </label>
        <select
          value={config.blendMode}
          onChange={(e) => updateConfig({ blendMode: e.target.value as BlendMode })}
          className="w-full bg-studio-950 border border-studio-800 rounded-lg px-3 py-2 text-xs text-white focus:border-accent outline-none font-sans"
        >
          {BLEND_MODES.map((mode) => (
            <option key={mode.value} value={mode.value} className="bg-studio-900">
              {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grain Opacity */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-studio-400" />
            <span>Opacidad de la Textura</span>
          </span>
          <span className="text-studio-400 font-mono">{config.grainOpacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={config.grainOpacity}
          onChange={(e) => updateConfig({ grainOpacity: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Blur / Desenfocado */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-studio-400" />
            <span>Difuminado Óptico (Blur)</span>
          </span>
          <span className="text-studio-400 font-mono">{config.blur.toFixed(1)}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          step="0.2"
          value={config.blur}
          onChange={(e) => updateConfig({ blur: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[10px] text-studio-500 font-mono">
          <span>0 (Grano puro)</span>
          <span>Difuso / Grafito emborronado</span>
        </div>
      </div>

      {/* Surface Lighting (Metallic Sheen) */}
      <div className="space-y-2 pt-1 border-t border-studio-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <div className="flex flex-col">
              <span className="text-xs text-studio-200 font-medium">Brillo Especular de Grafito</span>
              <span className="text-[10px] text-studio-500">Simula el reflejo metálico bajo la luz</span>
            </div>
          </div>
          <button
            onClick={() => updateConfig({ surfaceLighting: !config.surfaceLighting })}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
              config.surfaceLighting ? 'bg-accent justify-end' : 'bg-studio-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {config.surfaceLighting && (
          <div className="pl-5 pt-1 space-y-1">
            <div className="flex justify-between text-[11px] text-studio-400 font-mono">
              <span>Intensidad de Luz</span>
              <span>{(config.lightIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={config.lightIntensity}
              onChange={(e) => updateConfig({ lightIntensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        )}
      </div>
    </div>
  );
};
