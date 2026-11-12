import React, { useState } from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  Download, 
  Share2, 
  HelpCircle, 
  Monitor, 
  Layers,
  Check,
  MessageSquare
} from 'lucide-react';
import { ViewMode } from '../../types/graphite';
import { useLanguage } from '../../i18n/LanguageContext';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
  onOpenFeedback: () => void;
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
  onOpenFeedback,
}) => {
  const { t, language, setLanguage } = useLanguage();
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
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-studio-800 text-studio-400 border border-studio-700/60 hidden sm:inline-block">
              {t.header.subtitle}
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
          <span>{t.header.canvas}</span>
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
          <span>{t.header.mockups}</span>
        </button>
      </div>

      {/* Right Controls: Language, Undo/Redo, Feedback, GitHub, Shortcuts, Share & Export */}
      <div className="flex items-center gap-2">
        {/* Language Switcher Pill */}
        <div className="flex items-center bg-studio-950/80 rounded-lg border border-studio-800 p-0.5 text-xs font-mono">
          <button
            onClick={() => setLanguage('es')}
            title="Cambiar a Español"
            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
              language === 'es'
                ? 'bg-accent/20 text-accent font-extrabold border border-accent/30'
                : 'text-studio-400 hover:text-white'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            title="Switch to English"
            className={`px-2 py-1 rounded text-[11px] font-bold transition ${
              language === 'en'
                ? 'bg-accent/20 text-accent font-extrabold border border-accent/30'
                : 'text-studio-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-studio-950/60 rounded-md border border-studio-800 p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title={t.header.undo}
            className="p-1.5 rounded text-studio-400 hover:text-white disabled:opacity-30 disabled:hover:text-studio-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title={t.header.redo}
            className="p-1.5 rounded text-studio-400 hover:text-white disabled:opacity-30 disabled:hover:text-studio-400 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feedback Button */}
        <button
          onClick={onOpenFeedback}
          title={t.feedbackModal.title}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-studio-300 hover:text-white bg-studio-850 hover:bg-studio-800 border border-studio-700/60 transition group"
        >
          <MessageSquare className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">{t.header.feedback}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </button>

        {/* GitHub Repository & Contribute Link */}
        <a
          href="https://github.com/Toalvaresdev/speckled-graphite-web-generator"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub - Speckled Graphite"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-studio-300 hover:text-white bg-studio-850 hover:bg-studio-800 border border-studio-700/60 transition"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>

        {/* Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          title={t.header.shortcuts}
          className="p-2 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition border border-transparent hover:border-studio-700"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Share link */}
        <button
          onClick={handleShare}
          title={t.header.share}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-studio-300 hover:text-white bg-studio-850 hover:bg-studio-800 border border-studio-700/60 transition"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t.header.copied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.header.share}</span>
            </>
          )}
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent hover:bg-accent-hover text-white shadow-glow transition group"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.header.export}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-mono text-white/90">
            {t.header.exportBadge}
          </span>
        </button>
      </div>
    </header>
  );
};
