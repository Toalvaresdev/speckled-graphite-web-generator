import { useState, useCallback, useRef } from 'react';
import { GraphiteConfig } from '../types/graphite';
import { DEFAULT_GRAPHITE_CONFIG, COLOR_PALETTES } from '../constants/presets';

const MAX_HISTORY = 30;

export function useGraphiteState() {
  const [config, setConfigInternal] = useState<GraphiteConfig>(DEFAULT_GRAPHITE_CONFIG);
  
  const historyRef = useRef<GraphiteConfig[]>([]);
  const futureRef = useRef<GraphiteConfig[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Updates history indicators
  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  // Update configuration with undo history support
  const updateConfig = useCallback((updates: Partial<GraphiteConfig>, commitToHistory = true) => {
    setConfigInternal((prev) => {
      if (commitToHistory) {
        historyRef.current.push(prev);
        if (historyRef.current.length > MAX_HISTORY) {
          historyRef.current.shift();
        }
        futureRef.current = []; // Clear redo stack on new action
        setCanUndo(true);
        setCanRedo(false);
      }
      return { ...prev, ...updates };
    });
  }, []);

  // Set entire config directly (e.g. from URL or Preset)
  const setConfig = useCallback((newConfig: GraphiteConfig) => {
    historyRef.current.push(config);
    futureRef.current = [];
    setConfigInternal(newConfig);
    updateHistoryFlags();
  }, [config, updateHistoryFlags]);

  // Undo action
  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const previous = historyRef.current.pop()!;
    futureRef.current.push(config);
    setConfigInternal(previous);
    updateHistoryFlags();
  }, [config, updateHistoryFlags]);

  // Redo action
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    historyRef.current.push(config);
    setConfigInternal(next);
    updateHistoryFlags();
  }, [config, updateHistoryFlags]);

  // Randomize Seed, Organic parameters AND Colors (Triggered by 'Generate' or Spacebar)
  const randomize = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 999999);
    // Subtle organic variation while retaining aesthetic
    const freqVariation = Number((0.55 + Math.random() * 0.4).toFixed(3));
    const angleVariation = Math.floor(Math.random() * 360);

    // Pick random palette from presets
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const newColors = randomPalette.colors.map((color, index) => ({
      id: String(Date.now() + index),
      color,
      position: Math.round((index / (randomPalette.colors.length - 1)) * 100),
    }));

    updateConfig({
      seed: newSeed,
      baseFrequencyX: freqVariation,
      baseFrequencyY: config.linkFrequencies ? freqVariation : Number((0.4 + Math.random() * 0.5).toFixed(3)),
      gradientAngle: angleVariation,
      colors: newColors,
    });
  }, [config.linkFrequencies, updateConfig]);

  // Pick random palette from presets
  const randomizePalette = useCallback(() => {
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const newColors = randomPalette.colors.map((color, index) => ({
      id: String(Date.now() + index),
      color,
      position: Math.round((index / (randomPalette.colors.length - 1)) * 100),
    }));

    updateConfig({
      colors: newColors,
    });
  }, [updateConfig]);

  return {
    config,
    updateConfig,
    setConfig,
    undo,
    redo,
    canUndo,
    canRedo,
    randomize,
    randomizePalette,
  };
}
