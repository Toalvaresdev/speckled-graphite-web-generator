import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleExport: () => void;
  onToggleHelp: () => void;
}

export function useKeyboardShortcuts({
  onGenerate,
  onUndo,
  onRedo,
  onToggleExport,
  onToggleHelp,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Space: Generate / Randomize Seed
      if (e.code === 'Space') {
        e.preventDefault();
        onGenerate();
        return;
      }

      // Undo: Cmd+Z or Ctrl+Z (without Shift)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        onRedo();
        return;
      }

      // Export: Cmd+E or Ctrl+E
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onToggleExport();
        return;
      }

      // Help: ?
      if (e.key === '?') {
        e.preventDefault();
        onToggleHelp();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGenerate, onUndo, onRedo, onToggleExport, onToggleHelp]);
}
