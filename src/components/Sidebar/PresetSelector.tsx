import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { GraphiteConfig, DesignPreset } from '../../types/graphite';
import { DESIGN_PRESETS } from '../../constants/presets';

interface PresetSelectorProps {
  config: GraphiteConfig;
  onSelectPreset: (preset: DesignPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ config, onSelectPreset }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-studio-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Presets de Diseño</span>
        </label>
        <span className="text-[10px] text-accent font-mono">1-Clic</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {DESIGN_PRESETS.map((preset) => {
          // Check if current config matches this preset tone and type
          const isSelected =
            config.speckleTone === preset.config.speckleTone &&
            Math.abs(config.baseFrequencyX - (preset.config.baseFrequencyX || 0)) < 0.05;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-accent/15 border-accent text-white shadow-sm'
                  : 'bg-studio-950/60 border-studio-800/80 text-studio-300 hover:bg-studio-850 hover:border-studio-700'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold group-hover:text-white transition">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-accent text-white'
                        : 'bg-studio-800 text-studio-400 border border-studio-700/60'
                    }`}
                  >
                    {preset.tag}
                  </span>
                </div>
                <span className="text-[10px] text-studio-400 line-clamp-1">
                  {preset.description}
                </span>
              </div>

              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-accent shrink-0 ml-2" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-studio-700 group-hover:bg-accent shrink-0 ml-2 transition" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
