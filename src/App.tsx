import React, { useState } from 'react';
import { ViewMode } from './types/graphite';
import { useGraphiteState } from './hooks/useGraphiteState';
import { useUrlSync } from './hooks/useUrlSync';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PreviewCanvas } from './components/Preview/PreviewCanvas';
import { MockupViewer } from './components/Preview/MockupViewer';
import { BottomBar } from './components/BottomBar/BottomBar';
import { ExportModal } from './components/Header/ExportModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { FeedbackModal } from './components/Header/FeedbackModal';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const App: React.FC = () => {
  const {
    config,
    updateConfig,
    setConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    randomize,
    randomizePalette,
  } = useGraphiteState();

  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Sync state with URL hash
  useUrlSync(config, setConfig);

  // Keyboard shortcuts (Space, Undo/Redo, Export, etc.)
  useKeyboardShortcuts({
    onGenerate: randomize,
    onUndo: undo,
    onRedo: redo,
    onToggleExport: () => setIsExportOpen((prev) => !prev),
    onToggleHelp: () => setIsShortcutsOpen((prev) => !prev),
    onCloseModals: () => {
      setIsExportOpen(false);
      setIsShortcutsOpen(false);
      setIsFeedbackOpen(false);
    },
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-950 font-sans">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Main Workspace */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar Controls */}
        <Sidebar
          config={config}
          updateConfig={updateConfig}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Center Preview Stage */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {viewMode === 'canvas' ? (
            <PreviewCanvas config={config} />
          ) : (
            <MockupViewer config={config} />
          )}
        </main>
      </div>

      {/* Bottom Control Bar & Palette Strip */}
      <BottomBar
        config={config}
        updateConfig={updateConfig}
        onGenerate={randomize}
        onRandomizePalette={randomizePalette}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      {/* Shortcuts Cheat Sheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Community Feedback & Comments Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Vercel Web Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
