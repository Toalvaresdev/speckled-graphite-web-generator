import React from 'react';
import { Compass, Maximize2 } from 'lucide-react';
import { GraphiteConfig, AspectRatio, GradientType } from '../../types/graphite';
import { useLanguage } from '../../i18n/LanguageContext';

interface DimensionControlsProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
}

const RATIOS: { id: AspectRatio; label: string }[] = [
  { id: '16:9', label: '16:9' },
  { id: '1:1', label: '1:1' },
  { id: '9:16', label: '9:16' },
  { id: '4:3', label: '4:3' },
  { id: 'fill', label: 'Fill' },
];

export const DimensionControls: React.FC<DimensionControlsProps> = ({ config, updateConfig }) => {
  const { t } = useLanguage();

  const gradientTypes: { id: GradientType; label: string }[] = [
    { id: 'linear', label: t.blend.gradientLinear },
    { id: 'radial', label: t.blend.gradientRadial },
    { id: 'conic', label: t.blend.gradientConic },
    { id: 'solid', label: 'Solid' },
  ];

  return (
    <div className="space-y-4">
      {/* Aspect Ratio */}
      <div className="space-y-1.5">
        <label className="text-xs text-studio-300 font-medium flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-studio-400" />
          <span>{t.dimensions.aspectRatio}</span>
        </label>
        <div className="grid grid-cols-5 gap-1 p-1 bg-studio-950/80 rounded-lg border border-studio-800">
          {RATIOS.map((r) => (
            <button
              key={r.id}
              onClick={() => updateConfig({ aspectRatio: r.id })}
              className={`py-1.5 px-1 text-center rounded-md transition ${
                config.aspectRatio === r.id
                  ? 'bg-studio-800 text-white font-semibold shadow-sm'
                  : 'text-studio-400 hover:text-studio-200'
              }`}
            >
              <div className="text-[11px] font-mono">{r.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Gradient Type */}
      <div className="space-y-1.5">
        <label className="text-xs text-studio-300 font-medium flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-studio-400" />
          <span>{t.blend.gradientType}</span>
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-studio-950/80 rounded-lg border border-studio-800">
          {gradientTypes.map((g) => (
            <button
              key={g.id}
              onClick={() => updateConfig({ gradientType: g.id })}
              className={`py-1.5 px-1 text-center rounded-md text-xs transition ${
                config.gradientType === g.id
                  ? 'bg-studio-800 text-white font-medium shadow-sm'
                  : 'text-studio-400 hover:text-studio-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Angle (if linear or conic) */}
      {(config.gradientType === 'linear' || config.gradientType === 'conic') && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-studio-300 font-medium">{t.blend.gradientAngle}</span>
            <span className="text-studio-400 font-mono">{config.gradientAngle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={config.gradientAngle}
            onChange={(e) => updateConfig({ gradientAngle: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-studio-800 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      )}
    </div>
  );
};
