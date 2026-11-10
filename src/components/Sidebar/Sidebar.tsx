import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Sparkles, 
  Waves, 
  CircleDot, 
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { GraphiteConfig, DesignPreset } from '../../types/graphite';
import { NoiseControls } from './NoiseControls';
import { SpeckleControls } from './SpeckleControls';
import { BlendControls } from './BlendControls';
import { DimensionControls } from './DimensionControls';
import { StylePicker } from './StylePicker';

interface SidebarProps {
  config: GraphiteConfig;
  updateConfig: (updates: Partial<GraphiteConfig>) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type SectionKey = 'speckles' | 'noise' | 'blend' | 'layout';

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  updateConfig,
  isOpen,
  setIsOpen,
}) => {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    speckles: true,
    noise: true,
    blend: true,
    layout: false,
  });

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyPreset = (preset: DesignPreset) => {
    updateConfig({
      ...preset.config,
    });
  };

  return (
    <>
      {/* Floating Toggle Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Abrir Controles"
          className="absolute left-4 top-4 z-20 p-2.5 rounded-xl bg-studio-900 border border-studio-700 text-studio-200 hover:text-white shadow-studio hover:border-accent transition flex items-center gap-2"
        >
          <Sliders className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold">Controles</span>
          <ChevronRight className="w-3.5 h-3.5 text-studio-400" />
        </button>
      )}

      {/* Main Sidebar */}
      <aside
        className={`w-80 h-full min-h-0 bg-studio-900/95 backdrop-blur-xl border-r border-studio-800 flex flex-col transition-all duration-300 z-20 shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full absolute'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-12 px-4 border-b border-studio-800 flex items-center justify-between bg-studio-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-studio-400 font-semibold">
              CONTROLES & SHADERS
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            title="Contraer panel"
            className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Control Sections */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-studio-800/80 custom-scrollbar p-3 pb-16 space-y-4">
          
          {/* Top Style Picker matching InstantGradient */}
          <div className="pb-1">
            <StylePicker config={config} onSelectPreset={handleApplyPreset} />
          </div>

          {/* Section: Puntos, Motas & Stippling (High Priority) */}
          <div className="pt-3">
            <button
              onClick={() => toggleSection('speckles')}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white hover:text-accent transition"
            >
              <div className="flex items-center gap-2">
                <CircleDot className="w-3.5 h-3.5 text-accent" />
                <span>Puntos, Motas & Stippling</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-studio-400 transition-transform ${
                  openSections.speckles ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.speckles && (
              <div className="pt-2 pb-1">
                <SpeckleControls config={config} updateConfig={updateConfig} />
              </div>
            )}
          </div>

          {/* Section: feTurbulence (Noise) */}
          <div className="pt-3">
            <button
              onClick={() => toggleSection('noise')}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white hover:text-accent transition"
            >
              <div className="flex items-center gap-2">
                <Waves className="w-3.5 h-3.5 text-accent" />
                <span>Ruido feTurbulence</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-studio-400 transition-transform ${
                  openSections.noise ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.noise && (
              <div className="pt-2 pb-1">
                <NoiseControls config={config} updateConfig={updateConfig} />
              </div>
            )}
          </div>

          {/* Section: Optics & Blending */}
          <div className="pt-3">
            <button
              onClick={() => toggleSection('blend')}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white hover:text-accent transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Fusión & Óptica</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-studio-400 transition-transform ${
                  openSections.blend ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.blend && (
              <div className="pt-2 pb-1">
                <BlendControls config={config} updateConfig={updateConfig} />
              </div>
            )}
          </div>

          {/* Section: Dimensions & Geometry */}
          <div className="pt-3">
            <button
              onClick={() => toggleSection('layout')}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white hover:text-accent transition"
            >
              <div className="flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5 text-accent" />
                <span>Lienzo & Geometría</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-studio-400 transition-transform ${
                  openSections.layout ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.layout && (
              <div className="pt-2 pb-1">
                <DimensionControls config={config} updateConfig={updateConfig} />
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};
