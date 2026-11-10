import React from 'react';
import { ColorStop } from '../../types/graphite';
import { Plus, Trash2 } from 'lucide-react';

interface PaletteStripProps {
  colors: ColorStop[];
  onUpdateColor: (id: string, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (id: string) => void;
}

export const PaletteStrip: React.FC<PaletteStripProps> = ({
  colors,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
}) => {
  return (
    <div className="w-full h-8 flex border-t border-studio-800 divide-x divide-white/10 select-none bg-studio-950">
      {colors.map((stop) => (
        <div
          key={stop.id}
          style={{ backgroundColor: stop.color }}
          className="relative flex-1 group transition-all duration-200 flex items-center justify-between px-3 cursor-pointer"
        >
          {/* Native Color Picker overlay */}
          <input
            type="color"
            value={stop.color}
            onChange={(e) => onUpdateColor(stop.id, e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />

          {/* Hex label */}
          <span className="font-mono text-[10px] tracking-wider text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-semibold uppercase group-hover:scale-105 transition-transform pointer-events-none">
            {stop.color}
          </span>

          {/* Quick Remove button (visible on hover if > 2 colors) */}
          {colors.length > 2 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveColor(stop.id);
              }}
              title="Eliminar parada de color"
              className="z-20 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-black/60 hover:bg-black/90 text-white/80 hover:text-red-400 transition"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      ))}

      {/* Add Color Button (if less than 8) */}
      {colors.length < 8 && (
        <button
          onClick={onAddColor}
          title="Agregar color"
          className="w-9 h-full flex items-center justify-center bg-studio-900 hover:bg-studio-850 text-studio-400 hover:text-white transition shrink-0 border-l border-studio-800"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
