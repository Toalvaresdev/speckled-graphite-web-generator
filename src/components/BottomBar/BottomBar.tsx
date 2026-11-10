import React from 'react';
import { 
  Sparkles, 
  Dices, 
  Palette, 
  Plus, 
  Minus, 
  Command,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GraphiteConfig, ColorStop } from '../../types/graphite';
import { DESIGN_PRESETS } from '../../constants/presets';
import { PaletteStrip } from './PaletteStrip';

interface BottomBarProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
  onGenerate: () => void;
  onRandomizePalette: () => void;
  onOpenShortcuts: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  config,
  updateConfig,
  onGenerate,
  onRandomizePalette,
  onOpenShortcuts,
}) => {
  const handleUpdateColor = (id: string, color: string) => {
    const updated = config.colors.map((c) => (c.id === id ? { ...c, color } : c));
    updateConfig({ colors: updated });
  };

  const handleAddColor = () => {
    if (config.colors.length >= 8) return;
    const newStop: ColorStop = {
      id: String(Date.now()),
      color: '#3d4554',
      position: 100,
    };
    const all = [...config.colors, newStop];
    const redistributed = all.map((c, i) => ({
      ...c,
      position: Math.round((i / (all.length - 1)) * 100),
    }));
    updateConfig({ colors: redistributed });
  };

  const handleRemoveColor = (id: string) => {
    if (config.colors.length <= 2) return;
    const remaining = config.colors.filter((c) => c.id !== id);
    const redistributed = remaining.map((c, i) => ({
      ...c,
      position: Math.round((i / (remaining.length - 1)) * 100),
    }));
    updateConfig({ colors: redistributed });
  };

  // Find active preset or fallback
  const activePresetIndex = DESIGN_PRESETS.findIndex(
    (p) =>
      p.config.speckleTone === config.speckleTone &&
      Math.abs((p.config.baseFrequencyX || 0) - config.baseFrequencyX) < 0.08
  );
  const currentIndex = activePresetIndex >= 0 ? activePresetIndex : 0;
  const currentPreset = DESIGN_PRESETS[currentIndex];

  const handlePrevPreset = () => {
    const nextIdx = (currentIndex - 1 + DESIGN_PRESETS.length) % DESIGN_PRESETS.length;
    updateConfig(DESIGN_PRESETS[nextIdx].config);
  };

  const handleNextPreset = () => {
    const nextIdx = (currentIndex + 1) % DESIGN_PRESETS.length;
    updateConfig(DESIGN_PRESETS[nextIdx].config);
  };

  return (
    <footer className="shrink-0 z-30 bg-studio-900/95 backdrop-blur-xl border-t border-studio-800 flex flex-col select-none">
      {/* Top action row */}
      <div className="h-12 px-4 flex items-center justify-between">
        {/* Left: Color Counter, Style Carousel & Palettes */}
        <div className="flex items-center gap-2">
          {/* Colors count buttons */}
          <div className="flex items-center bg-studio-950/70 border border-studio-800 rounded-lg p-0.5 text-xs text-studio-300">
            <button
              onClick={() => handleRemoveColor(config.colors[config.colors.length - 1]?.id || '')}
              disabled={config.colors.length <= 2}
              className="p-1 rounded text-studio-400 hover:text-white disabled:opacity-30 transition"
              title="Quitar color"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 font-mono text-[11px] font-medium text-studio-200">
              {config.colors.length} colores
            </span>
            <button
              onClick={handleAddColor}
              disabled={config.colors.length >= 8}
              className="p-1 rounded text-studio-400 hover:text-white disabled:opacity-30 transition"
              title="Agregar color"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Style Carousel Switcher < Style > matching InstantGradient */}
          <div className="hidden sm:flex items-center bg-studio-950/70 border border-studio-800 rounded-lg p-0.5 text-xs text-studio-300">
            <button
              onClick={handlePrevPreset}
              className="p-1 rounded text-studio-400 hover:text-white transition"
              title="Estilo anterior"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="px-2 font-mono text-[11px] font-medium text-studio-200 truncate max-w-[130px]">
              {currentPreset?.name || 'Estilo'}
            </span>
            <button
              onClick={handleNextPreset}
              className="p-1 rounded text-studio-400 hover:text-white transition"
              title="Siguiente estilo"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={onRandomizePalette}
            title="Siguiente paleta de colores"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-studio-950/70 hover:bg-studio-800 border border-studio-800 text-xs text-studio-300 hover:text-white transition"
          >
            <Palette className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Paletas</span>
          </button>
        </div>

        {/* Center: Primary Generate [Space] Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerate}
            className="group relative flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-accent to-orange-500 hover:from-orange-500 hover:to-accent text-white font-semibold text-xs shadow-glow transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Generar</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/30 rounded border border-white/20 group-hover:bg-black/40">
              Espacio
            </kbd>
          </button>

          <button
            onClick={onGenerate}
            title="Generar nueva variación de diseño y color"
            className="p-2 rounded-xl bg-studio-950/70 hover:bg-studio-800 border border-studio-800 text-studio-300 hover:text-white transition"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Quick shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-studio-400 hover:text-studio-200 hover:bg-studio-800/60 transition"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Atajos</span>
          </button>
        </div>
      </div>

      {/* Bottom Color Swatch Bar */}
      <PaletteStrip
        colors={config.colors}
        onUpdateColor={handleUpdateColor}
        onAddColor={handleAddColor}
        onRemoveColor={handleRemoveColor}
      />
    </footer>
  );
};
