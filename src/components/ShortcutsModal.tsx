import React from 'react';
import { X, Command } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const shortcuts = [
    { key: language === 'es' ? 'Espacio' : 'Space', action: t.shortcuts.space },
    { key: 'Ctrl + Z / ⌘Z', action: t.shortcuts.undo },
    { key: 'Ctrl + Y / ⌘⇧Z', action: t.shortcuts.redo },
    { key: 'Ctrl + E / ⌘E', action: t.shortcuts.export },
    { key: 'Tab', action: t.shortcuts.styleCycle },
    { key: '?', action: t.shortcuts.help },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-studio-900 border border-studio-700 rounded-2xl shadow-studio overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-studio-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-white">{t.shortcuts.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-studio-800/60 last:border-0">
              <span className="text-xs text-studio-300">{sc.action}</span>
              <kbd className="px-2 py-1 rounded bg-studio-950 border border-studio-700/80 text-[11px] font-mono text-accent">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
