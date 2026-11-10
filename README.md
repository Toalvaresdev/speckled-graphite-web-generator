# Speckled Graphite — Procedural SVG & CSS Texture Studio

Un generador web profesional, moderno y ultraligero inspirado en **InstantGradient**, diseñado específicamente para generar texturas orgánicas de **grafito moteado, carboncillo y grano mineral** mediante filtros SVG nativos (`feTurbulence`, `feColorMatrix`, `feComponentTransfer`, `feBlend`) combinados con gradientes CSS.

![Speckled Graphite Studio](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

## ✨ Características

- ⚡ **100% Nativo & Ultraligero**: Genera código CSS puro con SVG en Data URI de menos de **1 KB**, eliminando la necesidad de pesadas imágenes de fondo JPG o PNG.
- 🎨 **Estética Studio Dark**: Interfaz profesional inspirada en herramientas de diseño de alto nivel (como InstantGradient).
- 🎛️ **Control Total de Parámetros**:
  - `feTurbulence`: Frecuencia base X e Y independientes o enlazadas, número de octavas (1 a 6), tipo de ruido (`fractalNoise` vs `turbulence`), semilla aleatoria y costura continua (`stitchTiles`).
  - **Puntos & Motas (Stippling)**: Umbral de corte matemático de alta frecuencia para motas nítidas, control de agudeza, contraste, densidad de puntos y tonos de motas (Plateado/Sparkles, Carbón oscuro y Mixto).
  - **Fusión & Brillo**: Modos de mezcla (`overlay`, `screen`, `multiply`, `soft-light`, etc.), opacidad, desenfoque óptico (`blur`) y reflejo especular metálico.
  - **Paleta y Geometría**: Degradados lineales con ángulo interactivo, radiales, cónicos o sólidos con selector de color multi-parada en tiempo real.
- 🖼️ **Visor de Mockups UI**: Previsualiza en tiempo real la textura aplicada en componentes reales (Tarjetas SaaS, Secciones Hero de landing pages, Botones y Pósteres).
- 📦 **Exportador Multi-formato**:
  - **Imagen Rasterizada**: Descarga en PNG, WebP o JPG en resoluciones estándar o Retina 4K (3840×2160).
  - **CSS Puro**: Código `background-image` en Data URI listo para pegar en cualquier hoja de estilos.
  - **SVG Nativo**: Archivo vectorial descargable o código inline.
  - **Tailwind CSS & React**: Componente autónomo y snippet de configuración.
- ⌨️ **Atajos de Teclado**:
  - `Espacio`: Generar nueva semilla, variación orgánica y paleta de colores.
  - `Tab`: Ciclar entre estilos y presets de diseño.
  - `Ctrl + Z` / `⌘Z`: Deshacer.
  - `Ctrl + Y` / `⌘⇧Z`: Rehacer.
  - `Ctrl + E` / `⌘E`: Abrir panel de exportación.
  - `?`: Ver lista de atajos.
- 🔗 **Persistencia en URL**: Todo el estado del diseño se codifica automáticamente en el hash de la URL para compartir tus texturas con un solo clic.

---

## 🚀 Inicio Rápido

### Requisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd speckled-graphite-web-generator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador `http://localhost:5173/` para comenzar a crear texturas de grafito.

### Compilación para Producción

```bash
npm run build
```

Los archivos optimizados para producción se generarán en la carpeta `dist/`.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Motor de Renderizado**: Filtros SVG nativos (`feTurbulence`, `feColorMatrix`, `feComponentTransfer`) y HTML5 Canvas para rasterizado 4K.

---

## 📄 Licencia

MIT © 2026 Speckled Graphite Studio.
