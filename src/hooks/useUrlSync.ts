import { useEffect, useRef } from 'react';
import { GraphiteConfig } from '../types/graphite';

/**
 * Encodes a GraphiteConfig into a compact URL-safe base64 string
 */
export function encodeConfigToHash(config: GraphiteConfig): string {
  try {
    const json = JSON.stringify(config);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

/**
 * Decodes a base64 string from URL hash into a GraphiteConfig
 */
export function decodeConfigFromHash(hash: string): Partial<GraphiteConfig> | null {
  try {
    if (!hash || hash.length < 3) return null;
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const json = decodeURIComponent(atob(cleanHash));
    return JSON.parse(json) as Partial<GraphiteConfig>;
  } catch {
    return null;
  }
}

export function useUrlSync(
  config: GraphiteConfig,
  setConfig: (config: GraphiteConfig) => void
) {
  const isInitialMount = useRef(true);

  // Load from hash on initial mount
  useEffect(() => {
    if (window.location.hash) {
      const restored = decodeConfigFromHash(window.location.hash);
      if (restored) {
        setConfig({
          ...config,
          ...restored,
        });
      }
    }
  }, []);

  // Update hash when config changes (debounced to avoid history flooding)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const hash = encodeConfigToHash(config);
      if (hash) {
        window.history.replaceState(null, '', `#${hash}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [config]);
}
