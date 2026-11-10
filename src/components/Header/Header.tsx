import React, { useState } from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  Download, 
  Share2, 
  HelpCircle, 
  Monitor, 
  Layers,
  Check
} from 'lucide-react';
import { ViewMode } from '../../types/graphite';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenExport,
  onOpenShortcuts,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="h-14 border-b border-studio-800 bg-studio-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand / Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-studio-700 to-studio-900 border border-studio-600/50 flex items-center justify-center shadow-inner">
          <div className="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide text-white font-mono">
              Speckled<span className="text-accent">Graphite</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-studio-800 text-studio-400 border border-studio-700/60">
              v1.0 • Native SVG/CSS
            </span>
          </div>
        </div>
      </div>

      {/* Center View Mode Switcher (Canvas vs Mockups) */}
      <div className="flex items-center p-1 bg-studio-950/80 rounded-lg border border-studio-800">
        <button
          onClick={() => setViewMode('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === 'canvas'
              ? 'bg-studio-800 text-white shadow-sm'
              : 'text-studio-400 hover:text-studio-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setViewMode('mockup')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === 'mockup'
              ? 'bg-studio-800 text-white shadow-sm'
              : 'text-studio-400 hover:text-studio-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>UI Mockups</span>
        </button>
      </div>

      {/* Right Controls: Undo/Redo, Shortcuts, Share & Export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-studio-950/60 rounded-md border border-studio-800 p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
            className="p-1.5 rounded text-studio-400 hover:text-white disabled:opacity-30 disabled:hover:text-studio-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Rehacer (Ctrl+Y)"
            className="p-1.5 rounded text-studio-400 hover:text-white disabled:opacity-30 disabled:hover:text-studio-400 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onOpenShortcuts}
          title="Atajos de teclado (?)"
          className="p-2 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition border border-transparent hover:border-studio-700"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={handleShare}
          title="Copiar enlace con diseño actual"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-studio-300 hover:text-white bg-studio-850 hover:bg-studio-800 border border-studio-700/60 transition"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartir</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent hover:bg-accent-hover text-white shadow-glow transition group"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-mono text-white/90">
            PNG • 1080p
          </span>
        </button>
      </div>
    </header>
  );
};
