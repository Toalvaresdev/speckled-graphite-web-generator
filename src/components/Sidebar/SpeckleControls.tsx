import React from 'react';
import { Dot, Contrast, SunMedium, ZoomIn, Sparkles, Flame, Layers } from 'lucide-react';
import { GraphiteConfig, SpeckleTone } from '../../types/graphite';
import { useLanguage } from '../../i18n/LanguageContext';

interface SpeckleControlsProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
}

export const SpeckleControls: React.FC<SpeckleControlsProps> = ({ config, updateConfig }) => {
  const { t } = useLanguage();

  const tones: { id: SpeckleTone; label: string; icon: any }[] = [
    { id: 'silver', label: t.speckles.toneSilver, icon: Sparkles },
    { id: 'dark', label: t.speckles.toneDark, icon: Flame },
    { id: 'mixed', label: t.speckles.toneMixed, icon: Layers },
  ];

  return (
    <div className="space-y-4">
      {/* Speckle Tone (Silver Sparkles vs Dark Charcoal vs Mixed) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-studio-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{t.speckles.tone}</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-studio-950/80 rounded-lg border border-studio-800">
          {tones.map((tone) => {
            const Icon = tone.icon;
            const isSelected = config.speckleTone === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => {
                  if (tone.id === 'silver') {
                    updateConfig({ speckleTone: 'silver', blendMode: 'screen', grainOpacity: Math.max(75, config.grainOpacity) });
                  } else if (tone.id === 'dark') {
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
                <span className="text-[10px] font-semibold truncate max-w-full">{tone.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speckle Sharpness (Stippling sharpness / thresholding) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{t.speckles.sharpness}</span>
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
      </div>

      {/* Speckle Density (Dot amount) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Dot className="w-4 h-4 text-accent" />
            <span>{t.speckles.density}</span>
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
      </div>

      {/* Speckle Contrast */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-studio-300 font-medium flex items-center gap-1.5">
            <Contrast className="w-3.5 h-3.5 text-studio-400" />
            <span>{t.speckles.contrast}</span>
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
            <span>{t.blend.scale}</span>
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
            <span>{t.speckles.brightness}</span>
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
