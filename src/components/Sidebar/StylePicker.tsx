import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, X } from 'lucide-react';
import { GraphiteConfig, DesignPreset } from '../../types/graphite';
import { DESIGN_PRESETS } from '../../constants/presets';
import { useLanguage } from '../../i18n/LanguageContext';

interface StylePickerProps {
  config: GraphiteConfig;
  onSelectPreset: (preset: DesignPreset) => void;
}

export const StylePicker: React.FC<StylePickerProps> = ({ config, onSelectPreset }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({ top: 80, left: 340 });
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Find currently active preset or default to first
  const activePreset = DESIGN_PRESETS.find(
    (p) =>
      p.config.speckleTone === config.speckleTone &&
      Math.abs((p.config.baseFrequencyX || 0) - config.baseFrequencyX) < 0.08
  ) || DESIGN_PRESETS[0];

  const getPresetName = (preset: DesignPreset) => {
    const localized = t.presets[preset.id as keyof typeof t.presets];
    return localized?.name || preset.name;
  };

  const getPresetTag = (preset: DesignPreset) => {
    const localized = t.presets[preset.id as keyof typeof t.presets];
    return localized?.tag || preset.tag;
  };

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setPopoverPos({
          top: rect.bottom + 8,
          left: 16,
        });
      } else {
        // Position right next to the sidebar floating over the canvas
        const top = Math.max(16, Math.min(rect.top, window.innerHeight - 520));
        setPopoverPos({
          top,
          left: rect.right + 12,
        });
      }
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Tab key cycles styles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const currentIndex = DESIGN_PRESETS.findIndex((p) => p.id === activePreset.id);
          const nextIndex = (currentIndex + 1) % DESIGN_PRESETS.length;
          onSelectPreset(DESIGN_PRESETS[nextIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePreset, onSelectPreset]);

  // Group presets
  const categories = [
    { title: t.stylePicker.shadersGroup, items: DESIGN_PRESETS.slice(0, 4) },
    { title: t.stylePicker.stipplingGroup, items: DESIGN_PRESETS.slice(4) },
  ];

  return (
    <div className="relative select-none">
      {/* Header Label matching InstantGradient */}
      <div className="flex items-center justify-between text-[11px] font-mono text-studio-400 mb-1.5 px-0.5">
        <span className="font-semibold uppercase tracking-wider">{t.sidebar.style}</span>
        <span className="text-[10px] text-studio-500 hover:text-accent cursor-pointer transition">
          {t.sidebar.tabToCycle}
        </span>
      </div>

      {/* Main Style Card Button in Sidebar */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`w-full p-2 bg-studio-950/80 hover:bg-studio-850 border rounded-xl transition flex items-center justify-between group shadow-sm ${
          isOpen ? 'border-accent ring-1 ring-accent/30' : 'border-studio-800 hover:border-studio-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Swatch Thumbnail */}
          <div className="w-12 h-9 rounded-lg overflow-hidden border border-white/10 relative shadow-inner bg-studio-900 shrink-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  activePreset.config.colors && activePreset.config.colors.length > 0
                    ? `linear-gradient(135deg, ${activePreset.config.colors.map((c) => c.color).join(', ')})`
                    : '#111419',
              }}
            />
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>

          <div className="text-left">
            <div className="text-xs font-semibold text-white group-hover:text-accent transition">
              {getPresetName(activePreset)}
            </div>
            <div className="text-[10px] font-mono text-studio-400">
              {getPresetTag(activePreset)} • InstantShader
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-studio-400 transition-transform ${isOpen ? 'rotate-180 text-accent' : ''}`}
        />
      </button>

      {/* Fixed Floating Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`,
          }}
          className="fixed z-[60] w-[360px] max-h-[82vh] overflow-y-auto custom-scrollbar bg-studio-900/95 backdrop-blur-2xl border border-studio-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.1)] p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header of the popover */}
          <div className="flex items-center justify-between pb-2 border-b border-studio-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold text-white font-mono tracking-wide">
                {t.stylePicker.allPresets}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {categories.map((cat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-[10px] font-mono tracking-wider text-studio-400 uppercase font-semibold">
                {cat.title}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {cat.items.map((preset) => {
                  const isSelected = preset.id === activePreset.id;
                  const bgColors =
                    preset.config.colors && preset.config.colors.length > 0
                      ? `linear-gradient(135deg, ${preset.config.colors.map((c) => c.color).join(', ')})`
                      : '#161922';

                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setIsOpen(false);
                      }}
                      className={`relative p-2 rounded-xl border text-left transition flex flex-col gap-2 group ${
                        isSelected
                          ? 'bg-accent/15 border-accent text-white shadow-md'
                          : 'bg-studio-950/80 border-studio-800 text-studio-300 hover:bg-studio-850 hover:border-studio-700'
                      }`}
                    >
                      {/* Mini Thumbnail with textured overlay */}
                      <div className="w-full h-14 rounded-lg overflow-hidden border border-white/10 relative shadow-inner">
                        <div
                          className="absolute inset-0"
                          style={{ background: bgColors }}
                        />
                        <div className="absolute inset-0 bg-white/15 mix-blend-overlay" />
                        
                        {/* Stipple indicator overlay */}
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)]" />

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-white shadow-sm">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-white group-hover:text-accent transition line-clamp-1">
                          {getPresetName(preset)}
                        </div>
                        <div className="text-[9px] text-studio-400 font-mono">
                          {getPresetTag(preset)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
