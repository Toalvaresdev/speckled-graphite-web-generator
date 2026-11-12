import React, { useState } from 'react';
import { X, Copy, Check, Download, Image as ImageIcon, Code2 } from 'lucide-react';
import { track } from '@vercel/analytics';
import { GraphiteConfig, AspectRatio } from '../../types/graphite';
import { generateCssSnippet, generateTailwindSnippet, generateReactJsxSnippet } from '../../utils/cssGenerator';
import { generateFullSvg } from '../../utils/svgGenerator';
import { exportToCanvas } from '../../utils/canvasExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GraphiteConfig;
}

type MainTab = 'image' | 'code';
type ImageFormat = 'png' | 'webp' | 'jpeg';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, config }) => {
  const [mainTab, setMainTab] = useState<MainTab>('image');
  const [imgFormat, setImgFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState<'1x' | '2x'>('1x');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('16:9');
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [codeType, setCodeType] = useState<'css' | 'svg' | 'tailwind' | 'react'>('css');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRatioChange = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    if (ratio === '16:9') {
      setWidth(1920);
      setHeight(1080);
    } else if (ratio === '1:1') {
      setWidth(1200);
      setHeight(1200);
    } else if (ratio === '9:16') {
      setWidth(1080);
      setHeight(1920);
    } else if (ratio === '4:3') {
      setWidth(1600);
      setHeight(1200);
    }
  };

  const finalWidth = quality === '2x' ? width * 2 : width;
  const finalHeight = quality === '2x' ? height * 2 : height;

  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);
      const mime =
        imgFormat === 'webp'
          ? 'image/png' // standard canvas fallback
          : imgFormat === 'jpeg'
          ? 'image/jpeg'
          : 'image/png';

      // Track event with Vercel Analytics
      try {
        track('download_image', {
          format: imgFormat,
          resolution: `${finalWidth}x${finalHeight}`,
          ratio: selectedRatio,
          quality: quality,
          tone: config.speckleTone,
          seed: config.seed,
        });

        // Also increment local count for in-app tracking
        const currentCount = parseInt(localStorage.getItem('speckled_downloads_count') || '0', 10);
        localStorage.setItem('speckled_downloads_count', String(currentCount + 1));
      } catch (err) {
        // Analytics non-blocking
      }

      await exportToCanvas(
        config,
        finalWidth,
        finalHeight,
        mime,
        `speckled-graphite-${config.seed}-${finalWidth}x${finalHeight}.${imgFormat === 'jpeg' ? 'jpg' : imgFormat}`
      );
    } catch (err) {
      console.error('Error during image export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track code copy with Vercel Analytics
    try {
      track('copy_code', {
        type: codeType,
        tone: config.speckleTone,
      });
      const currentCopies = parseInt(localStorage.getItem('speckled_copies_count') || '0', 10);
      localStorage.setItem('speckled_copies_count', String(currentCopies + 1));
    } catch (err) {
      // Non-blocking
    }
  };

  const handleDownloadSvg = () => {
    // Track SVG download
    try {
      track('download_svg', {
        resolution: `${finalWidth}x${finalHeight}`,
        tone: config.speckleTone,
      });
      const currentCount = parseInt(localStorage.getItem('speckled_downloads_count') || '0', 10);
      localStorage.setItem('speckled_downloads_count', String(currentCount + 1));
    } catch (err) {
      // Non-blocking
    }

    const svgContent = generateFullSvg(config, finalWidth, finalHeight);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `graphite-${config.seed}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-studio-900 border border-studio-700/80 rounded-2xl shadow-studio overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mode Switcher matching InstantGradient */}
        <div className="p-4 border-b border-studio-800 flex items-center justify-between bg-studio-950/50">
          {/* Tabs: Image vs Code */}
          <div className="flex p-1 bg-studio-950 rounded-xl border border-studio-800">
            <button
              onClick={() => setMainTab('image')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mainTab === 'image'
                  ? 'bg-studio-800 text-white shadow-sm'
                  : 'text-studio-400 hover:text-studio-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imagen</span>
            </button>
            <button
              onClick={() => setMainTab('code')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mainTab === 'code'
                  ? 'bg-studio-800 text-white shadow-sm'
                  : 'text-studio-400 hover:text-studio-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código Web</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 1: Image Export (Matches Screenshot Image 2) */}
        {mainTab === 'image' && (
          <div className="p-6 space-y-5">
            {/* FORMAT */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono tracking-wider text-studio-400 uppercase font-semibold">
                FORMAT
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'png', label: 'PNG' },
                  { id: 'webp', label: 'WebP' },
                  { id: 'jpeg', label: 'JPG' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setImgFormat(fmt.id as ImageFormat)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                      imgFormat === fmt.id
                        ? 'bg-accent/15 border-accent text-white shadow-sm'
                        : 'bg-studio-950/70 border-studio-800 text-studio-400 hover:text-white hover:border-studio-700'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QUALITY */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono tracking-wider text-studio-400 uppercase font-semibold">
                QUALITY
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1x', label: '1x Standard' },
                  { id: '2x', label: '2x Retina / 4K' },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                      quality === q.id
                        ? 'bg-accent/15 border-accent text-white shadow-sm'
                        : 'bg-studio-950/70 border-studio-800 text-studio-400 hover:text-white hover:border-studio-700'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono tracking-wider text-studio-400 uppercase font-semibold">
                  SIZE
                </label>
                <span className="font-mono text-[11px] text-accent font-semibold">
                  {finalWidth} × {finalHeight} px
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '16:9', label: '16:9' },
                  { id: '1:1', label: '1:1' },
                  { id: '9:16', label: '9:16' },
                  { id: '4:3', label: '4:3' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRatioChange(r.id as AspectRatio)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                      selectedRatio === r.id
                        ? 'bg-accent/15 border-accent text-white'
                        : 'bg-studio-950/70 border-studio-800 text-studio-400 hover:text-white hover:border-studio-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Exact dimension inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center bg-studio-950 border border-studio-800 rounded-xl px-3 py-1.5 text-xs">
                  <span className="text-studio-500 font-mono mr-2">W</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                    className="w-full bg-transparent text-white font-mono outline-none"
                  />
                </div>
                <div className="flex items-center bg-studio-950 border border-studio-800 rounded-xl px-3 py-1.5 text-xs">
                  <span className="text-studio-500 font-mono mr-2">H</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                    className="w-full bg-transparent text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Primary Action Button (Matches Screenshot: Export PNG • 1920x1080) */}
            <div className="pt-2">
              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-accent hover:bg-accent-hover text-white shadow-glow transition active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting
                    ? 'Renderizando imagen...'
                    : `Export ${imgFormat.toUpperCase()} • ${finalWidth}×${finalHeight}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Code Export (CSS, SVG, Tailwind, React) */}
        {mainTab === 'code' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-4 gap-1 p-1 bg-studio-950 rounded-xl border border-studio-800">
              {[
                { id: 'css', label: 'CSS Data URI' },
                { id: 'svg', label: 'SVG Nativo' },
                { id: 'tailwind', label: 'Tailwind' },
                { id: 'react', label: 'React' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCodeType(c.id as any)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition text-center ${
                    codeType === c.id
                      ? 'bg-studio-800 text-white shadow-sm'
                      : 'text-studio-400 hover:text-studio-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {codeType === 'css' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-studio-400">
                  <span>CSS puro con filtro SVG incrustado</span>
                  <span className="font-mono text-emerald-400">&lt; 1 KB</span>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-studio-950 rounded-xl border border-studio-800 font-mono text-xs text-studio-200 overflow-x-auto max-h-56 leading-relaxed">
                    {generateCssSnippet(config)}
                  </pre>
                  <button
                    onClick={() => copyCode(generateCssSnippet(config))}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-600 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar CSS'}</span>
                  </button>
                </div>
              </div>
            )}

            {codeType === 'svg' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-studio-400">Archivo SVG vectorial independiente</span>
                  <button
                    onClick={handleDownloadSvg}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-accent hover:bg-accent-hover text-white transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .svg</span>
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-4 bg-studio-950 rounded-xl border border-studio-800 font-mono text-xs text-studio-200 overflow-x-auto max-h-56 leading-relaxed">
                    {generateFullSvg(config)}
                  </pre>
                  <button
                    onClick={() => copyCode(generateFullSvg(config))}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-600 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar SVG'}</span>
                  </button>
                </div>
              </div>
            )}

            {codeType === 'tailwind' && (
              <div className="space-y-3">
                <span className="text-xs text-studio-400">Configuración para Tailwind CSS</span>
                <div className="relative">
                  <pre className="p-4 bg-studio-950 rounded-xl border border-studio-800 font-mono text-xs text-studio-200 overflow-x-auto max-h-56 leading-relaxed">
                    {generateTailwindSnippet(config)}
                  </pre>
                  <button
                    onClick={() => copyCode(generateTailwindSnippet(config))}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-600 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}

            {codeType === 'react' && (
              <div className="space-y-3">
                <span className="text-xs text-studio-400">Componente autónomo para React y Next.js</span>
                <div className="relative">
                  <pre className="p-4 bg-studio-950 rounded-xl border border-studio-800 font-mono text-xs text-studio-200 overflow-x-auto max-h-56 leading-relaxed">
                    {generateReactJsxSnippet(config)}
                  </pre>
                  <button
                    onClick={() => copyCode(generateReactJsxSnippet(config))}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-600 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
