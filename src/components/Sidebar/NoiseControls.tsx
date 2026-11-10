import React from 'react';
import { Link, Unlink, Dices } from 'lucide-react';
import { GraphiteConfig, NoiseType } from '../../types/graphite';

interface NoiseControlsProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
}

export const NoiseControls: React.FC<NoiseControlsProps> = ({ config, updateConfig }) => {
  const handleFreqXChange = (val: number) => {
    if (config.linkFrequencies) {
      updateConfig({ baseFrequencyX: val, baseFrequencyY: val });
    } else {
      updateConfig({ baseFrequencyX: val });
    }
  };

  const handleFreqYChange = (val: number) => {
    if (config.linkFrequencies) {
      updateConfig({ baseFrequencyX: val, baseFrequencyY: val });
    } else {
      updateConfig({ baseFrequencyY: val });
    }
  };

  const toggleLink = () => {
    const newLink = !config.linkFrequencies;
    if (newLink) {
      updateConfig({ linkFrequencies: true, baseFrequencyY: config.baseFrequencyX });
    } else {
      updateConfig({ linkFrequencies: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Noise Type & Seamless */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-studio-400 uppercase tracking-wider">
          Tipo de Ruido feTurbulence
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-studio-950/80 rounded-lg border border-studio-800">
          {(['fractalNoise', 'turbulence'] as NoiseType[]).map((type) => (
            <button
              key={type}
              onClick={() => updateConfig({ noiseType: type })}
              className={`py-1.5 px-2 text-xs font-medium rounded-md capitalize transition ${
                config.noiseType === type
                  ? 'bg-studio-800 text-white shadow-sm'
                  : 'text-studio-400 hover:text-studio-200'
              }`}
            >
              {type === 'fractalNoise' ? 'Fractal (Grafito)' : 'Turbulencia (Carbón)'}
            </button>
          ))}
        </div>
      </div>

      {/* Base Frequency */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-studio-300 font-medium">Frecuencia Base</span>
          <button
            onClick={toggleLink}
            title={config.linkFrequencies ? 'Desvincular ejes X/Y' : 'Vincular ejes X/Y'}
            className={`p-1 rounded transition border ${
              config.linkFrequencies
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-studio-900 border-studio-800 text-studio-400 hover:text-white'
            }`}
          >
            {config.linkFrequencies ? <Link className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="space-y-2 bg-studio-950/60 p-2.5 rounded-lg border border-studio-800/80">
          <div>
            <div className="flex justify-between text-[11px] text-studio-400 font-mono mb-1">
              <span>Freq X</span>
              <span>{config.baseFrequencyX.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.95"
              step="0.01"
              value={config.baseFrequencyX}
              onChange={(e) => handleFreqXChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {!config.linkFrequencies && (
            <div>
              <div className="flex justify-between text-[11px] text-studio-400 font-mono mb-1">
                <span>Freq Y (Estiramiento de veta)</span>
                <span>{config.baseFrequencyY.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.95"
                step="0.01"
                value={config.baseFrequencyY}
                onChange={(e) => handleFreqYChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Octaves */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium">Octavas (Rugosidad/Detalle)</span>
          <span className="text-studio-400 font-mono">{config.numOctaves}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={config.numOctaves}
          onChange={(e) => updateConfig({ numOctaves: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-[10px] text-studio-500 font-mono">
          <span>1 (Suave)</span>
          <span>4 (Grafito estándar)</span>
          <span>6 (Ultra rugoso)</span>
        </div>
      </div>

      {/* Seed */}
      <div className="space-y-1.5">
        <label className="text-xs text-studio-300 font-medium flex items-center justify-between">
          <span>Semilla (Seed)</span>
          <span className="text-[10px] text-studio-500 font-mono">Variación procedural</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={config.seed}
            onChange={(e) => updateConfig({ seed: parseInt(e.target.value) || 0 })}
            className="flex-1 bg-studio-950 border border-studio-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-accent outline-none"
          />
          <button
            onClick={() => updateConfig({ seed: Math.floor(Math.random() * 999999) })}
            title="Generar nueva semilla"
            className="px-2.5 py-1.5 bg-studio-850 hover:bg-studio-800 border border-studio-700 rounded-lg text-studio-300 hover:text-white transition"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stitch Tiles */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-studio-300 font-medium">Patrón Continuo (Seamless)</span>
        <button
          onClick={() => updateConfig({ stitchTiles: !config.stitchTiles })}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
            config.stitchTiles ? 'bg-accent justify-end' : 'bg-studio-800 justify-start'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>
    </div>
  );
};
