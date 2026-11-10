import { GraphiteConfig } from '../types/graphite';
import { generateCssBackground, generateSvgDataUri, generateSvgFilterMarkup } from './svgGenerator';

export function generateCssSnippet(config: GraphiteConfig): string {
  const bgGradient = generateCssBackground(config);
  const dataUri = generateSvgDataUri(config);

  return `/* Speckled Graphite Native CSS Texture (< 1KB) */
.speckled-graphite {
  background-color: ${config.colors[0]?.color || '#111318'};
  background-image: 
    url("${dataUri}"),
    ${bgGradient};
  background-repeat: repeat, no-repeat;
  background-size: ${config.grainScale !== 1.0 ? `${Math.round(config.grainScale * 250)}px` : 'auto'}, cover;
  background-blend-mode: ${config.blendMode}, normal;
}`;
}

export function generateTailwindSnippet(config: GraphiteConfig): string {
  const bgGradient = generateCssBackground(config);
  const dataUri = generateSvgDataUri(config);

  return `// Tailwind CSS Custom Plugin or Utility Class
// In tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'speckled-graphite': 'url("${dataUri}"), ${bgGradient}',
      }
    }
  }
}

// Or inline className in React/Next.js:
<div className="bg-repeat [background-image:url('${dataUri}'),_${bgGradient}] [background-blend-mode:${config.blendMode},_normal]" />`;
}

export function generateReactJsxSnippet(config: GraphiteConfig): string {
  const bgGradient = generateCssBackground(config);
  const filterMarkup = generateSvgFilterMarkup(config, 'my-graphite-filter');

  return `import React from 'react';

export const SpeckledGraphiteSurface = ({ children, className = '' }) => {
  return (
    <div 
      className={\`relative overflow-hidden \${className}\`}
      style={{
        background: '${bgGradient}',
      }}
    >
      {/* Invisible SVG Filter Primitive */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          ${filterMarkup.split('\n').join('\n          ')}
        </defs>
      </svg>

      {/* Graphite Overlay Layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          filter: 'url(#my-graphite-filter)',
          mixBlendMode: '${config.blendMode}',
          opacity: ${config.grainOpacity / 100},
        }}
      />

      {/* Children Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};`;
}
