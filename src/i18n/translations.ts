export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Header
    header: {
      subtitle: 'v1.0 • SVG/CSS Nativo',
      canvas: 'Lienzo',
      mockups: 'Mockups UI',
      undo: 'Deshacer (Ctrl+Z)',
      redo: 'Rehacer (Ctrl+Y)',
      feedback: 'Feedback',
      shortcuts: 'Atajos (?)',
      share: 'Compartir',
      copied: '¡Copiado!',
      export: 'Exportar',
      exportBadge: 'PNG • 1080p',
      langToggle: 'Idioma',
    },

    // Sidebar & Control Titles
    sidebar: {
      title: 'CONTROLES & SHADERS',
      collapse: 'Contraer panel',
      open: 'Controles',
      style: 'ESTILO',
      tabToCycle: 'Tab para rotar',
      specklesSection: 'Puntos, Motas & Stippling',
      noiseSection: 'Ruido feTurbulence',
      blendSection: 'Fusión & Óptica',
      layoutSection: 'Lienzo & Geometría',
    },

    // Style Picker / Presets
    stylePicker: {
      shadersGroup: 'Grafito & Mineral (Shaders)',
      stipplingGroup: 'Papel, Stippling & Cósmico',
      allPresets: 'Todos los Estilos',
    },

    // Preset translations
    presets: {
      'kilowatty-silver': {
        name: 'Kilowatty Dark Sparkle',
        tag: 'Estilo Foto',
        desc: 'Fondo negro profundo con motas y stippling plateado de alta frecuencia, idéntico al video de referencia.',
      },
      'graphite-hb-classic': {
        name: 'Lápiz Grafito HB & Pizarra',
        tag: 'Clásico',
        desc: 'Sombreado orgánico de grafito con grano fino y motas de carboncillo oscuro.',
      },
      'charcoal-spatter': {
        name: 'Carbón Moteado Intenso',
        tag: 'Orgánico',
        desc: 'Turbulencia agresiva con salpicaduras y puntos nítidos de carboncillo.',
      },
      'metallic-sheen': {
        name: 'Grafito Metálico Especular',
        tag: 'Brillo Luz',
        desc: 'Textura con reflejo de luz incidente simulando grafito puro bruñido.',
      },
      'cosmic-stardust': {
        name: 'Polvo Cósmico Stippling',
        tag: 'Estelar',
        desc: 'Micro-motas violeta y plata sobre vacío estelar profundo.',
      },
      'instant-cyan': {
        name: 'Instant Ocean Graphite',
        tag: 'Vibrante',
        desc: 'Paleta cian oscuro y petróleo con polvo mineral nítido (estilo InstantGradient).',
      },
      'craft-paper': {
        name: 'Papel Kraft & Grafito 2B',
        tag: 'Físico',
        desc: 'Textura cálida de papel artesanal con motas de carbón y fibra vegetal.',
      },
    },

    // Speckle & Stippling Controls
    speckles: {
      density: 'Densidad de Motas',
      tone: 'Tono del Moteado',
      toneSilver: 'Plateado Brillante',
      toneDark: 'Grafito Oscuro',
      toneMixed: 'Carboncillo Mixto',
      contrast: 'Contraste Umbral',
      sharpness: 'Nitidez Stippling',
      brightness: 'Brillo de Partículas',
      invert: 'Invertir Color de Grano',
      invertNotice: 'Modo motas oscuras sobre fondo claro',
    },

    // Noise feTurbulence Controls
    noise: {
      type: 'Tipo de Ruido feTurbulence',
      fractal: 'Fractal (Grafito)',
      turbulence: 'Turbulencia (Carbón)',
      baseFreq: 'Frecuencia Base',
      freqX: 'Frec. X',
      freqY: 'Frec. Y',
      linkFreqs: 'Vincular frecuencias X/Y',
      octaves: 'Octavas de Detalle',
      octavesDesc: 'Mayor número añade microfibra fractal',
      stitch: 'Costura Continua (Stitch)',
      stitchDesc: 'Repite sin cortes en mosaico',
      seed: 'Semilla Procedural',
      randomSeed: 'Generar semilla',
    },

    // Blending & Optics Controls
    blend: {
      mode: 'Modo de Fusión (CSS Blend)',
      opacity: 'Opacidad del Grano',
      scale: 'Escala del Grano (Procedural)',
      scaleUnit: 'x tamaño',
      blur: 'Desenfoque Suave (feGaussianBlur)',
      blurNotice: '0px = Granulado nítido cristalino',
      lighting: 'Iluminación Especular 3D',
      lightingDesc: 'feSpecularLighting (Relieve físico metálico)',
      lightIntensity: 'Intensidad de Luz',
      gradientType: 'Tipo de Degradado Base',
      gradientLinear: 'Lineal',
      gradientRadial: 'Radial',
      gradientConic: 'Cónico',
      gradientAngle: 'Ángulo de Degradado',
    },

    // Dimensions Controls
    dimensions: {
      aspectRatio: 'Relación de Aspecto',
      customSize: 'Dimensiones Personalizadas',
      width: 'Ancho (px)',
      height: 'Alto (px)',
      socialPresets: 'Presets Populares',
      landscape: 'Horizontal (Desktop/YouTube)',
      portrait: 'Vertical (Stories/Reels/TikTok)',
      square: 'Cuadrado (Instagram/Avatar)',
      standard: 'Estándar 4:3 (Dribbble/Presentaciones)',
    },

    // Bottom Bar
    bottomBar: {
      removeColor: 'Quitar color',
      addColor: 'Añadir color',
      colorsCount: 'colores',
      prevStyle: 'Estilo anterior',
      nextStyle: 'Siguiente estilo',
      palettes: 'Paletas',
      generate: 'Generar',
      spaceKey: 'Espacio',
      shortcuts: 'Atajos',
      copyCss: 'Copiar CSS',
    },

    // Export Modal
    exportModal: {
      title: 'Exportar Fondo Moteado',
      downloadTab: 'Descargar Imagen',
      codeTab: 'Copiar Código',
      format: 'Formato de Salida',
      ratio: 'Relación de Aspecto',
      resolution: 'Resolución de Exportación',
      quality: 'Calidad de Imagen',
      codeType: 'Formato de Código',
      cssSnippet: 'CSS Puro',
      tailwindSnippet: 'Tailwind CSS v3/v4',
      reactSnippet: 'Componente React JSX',
      copyButton: 'Copiar al Portapapeles',
      copied: '¡Copiado!',
      downloadButton: 'Descargar Imagen',
      downloadSvgButton: 'Descargar SVG Vectorial',
      downloading: 'Renderizando...',
      specsNotice: 'Renderizado en alta fidelidad a escala 1:1 con filtro procedural SVG',
    },

    // Feedback Modal
    feedbackModal: {
      title: 'Feedback & Sugerencias',
      globalBadge: 'Comunidad',
      subtitle: 'Tus ideas nos ayudan a mejorar. ¡Déjanos tu opinión o textura favorita!',
      tabWrite: 'Dejar Feedback',
      tabList: 'Comentarios Recientes',
      category: 'Categoría',
      catIdea: 'Idea / Función',
      catTexture: 'Nueva Textura',
      catBug: 'Reportar Error',
      catPraise: 'Testimonio',
      experience: '¿Cómo ha sido tu experiencia?',
      nameLabel: 'Tu Nombre o Usuario',
      namePlaceholder: 'Ej: Alex Designer',
      emailLabel: 'Correo Electrónico (opcional)',
      emailPlaceholder: 'Para avisarte si implementamos tu sugerencia',
      messageLabel: 'Mensaje o Sugerencia',
      messagePlaceholder: 'Cuéntanos qué te pareció el generador, qué textura te gustaría ver o qué podríamos mejorar...',
      submitLocal: 'Guardar Comentario',
      submittedSuccess: '¡Gracias por tu feedback!',
      orGitHub: 'O publícalo en GitHub para que todos lo vean:',
      openGitHubIssue: 'Crear Issue en GitHub (Público y Permanente)',
      githubDesc: 'Se abrirá un Issue en el repositorio oficial para que quede guardado en la nube.',
      emptyTitle: 'Aún no hay comentarios',
      emptyDesc: '¡Sé la primera persona en dejar tu opinión, sugerir una textura o reportar un detalle!',
      vote: 'Me gusta',
      persistenceNotice: 'Los comentarios se guardan en tu navegador local. Para dejarnos un mensaje permanente que veamos los creadores, usa el botón de GitHub Issues.',
    },

    // Shortcuts Modal
    shortcuts: {
      title: 'Atajos de Teclado',
      subtitle: 'Trabaja a la velocidad de la luz en SpeckledGraphite',
      space: 'Generar nueva variación de ruido y semilla',
      undo: 'Deshacer último ajuste',
      redo: 'Rehacer ajuste',
      export: 'Abrir diálogo de exportación',
      help: 'Mostrar / ocultar esta ayuda',
      styleCycle: 'Rotar entre estilos predeterminados',
      close: 'Cerrar ventana',
    },

    // Mockups
    mockups: {
      title: 'Vista Previa en Interfaces Reales',
      subtitle: 'Comprueba cómo lucen tus motas de grafito en productos digitales',
      mobileApp: 'Aplicación Móvil iOS (Fintech / Crypto)',
      desktopHero: 'Hero Section Web (SaaS Dark Mode)',
      musicPlayer: 'Reproductor de Audio & Arte Minimalista',
      posterArt: 'Poster / Arte Editorial Fino',
    },
  },

  en: {
    // Header
    header: {
      subtitle: 'v1.0 • Native SVG/CSS',
      canvas: 'Canvas',
      mockups: 'UI Mockups',
      undo: 'Undo (Ctrl+Z)',
      redo: 'Redo (Ctrl+Y)',
      feedback: 'Feedback',
      shortcuts: 'Shortcuts (?)',
      share: 'Share',
      copied: 'Copied!',
      export: 'Export',
      exportBadge: 'PNG • 1080p',
      langToggle: 'Language',
    },

    // Sidebar & Control Titles
    sidebar: {
      title: 'CONTROLS & SHADERS',
      collapse: 'Collapse panel',
      open: 'Controls',
      style: 'STYLE',
      tabToCycle: 'Tab to cycle',
      specklesSection: 'Speckles, Grain & Stippling',
      noiseSection: 'feTurbulence Noise',
      blendSection: 'Blending & Optics',
      layoutSection: 'Canvas & Geometry',
    },

    // Style Picker / Presets
    stylePicker: {
      shadersGroup: 'Graphite & Mineral (Shaders)',
      stipplingGroup: 'Paper, Stippling & Cosmic',
      allPresets: 'All Styles',
    },

    // Preset translations
    presets: {
      'kilowatty-silver': {
        name: 'Kilowatty Dark Sparkle',
        tag: 'Photo Style',
        desc: 'Deep black background with high-frequency silver speckles and stippling, identical to the reference video.',
      },
      'graphite-hb-classic': {
        name: 'HB Graphite Pencil & Slate',
        tag: 'Classic',
        desc: 'Organic graphite shading with fine grain and dark charcoal stipples.',
      },
      'charcoal-spatter': {
        name: 'Intense Charcoal Spatter',
        tag: 'Organic',
        desc: 'Aggressive turbulence with sharp charcoal spatter and particles.',
      },
      'metallic-sheen': {
        name: 'Specular Metallic Graphite',
        tag: 'Light Sheen',
        desc: 'Specular surface lighting mimicking burnished pure graphite sheen.',
      },
      'cosmic-stardust': {
        name: 'Cosmic Stardust Stippling',
        tag: 'Stellar',
        desc: 'Micro violet and silver stipples floating over a deep space void.',
      },
      'instant-cyan': {
        name: 'Instant Ocean Graphite',
        tag: 'Vibrant',
        desc: 'Dark cyan and petrol oil palette with sharp mineral dust (InstantGradient style).',
      },
      'craft-paper': {
        name: 'Kraft Paper & 2B Graphite',
        tag: 'Physical',
        desc: 'Warm handcrafted paper texture with carbon dust and vegetable fiber.',
      },
    },

    // Speckle & Stippling Controls
    speckles: {
      density: 'Speckle Density',
      tone: 'Speckle Tone',
      toneSilver: 'Bright Silver',
      toneDark: 'Dark Graphite',
      toneMixed: 'Mixed Charcoal',
      contrast: 'Threshold Contrast',
      sharpness: 'Stippling Sharpness',
      brightness: 'Particle Brightness',
      invert: 'Invert Grain Color',
      invertNotice: 'Dark speckles on light backgrounds mode',
    },

    // Noise feTurbulence Controls
    noise: {
      type: 'feTurbulence Noise Type',
      fractal: 'Fractal (Graphite)',
      turbulence: 'Turbulence (Charcoal)',
      baseFreq: 'Base Frequency',
      freqX: 'Freq. X',
      freqY: 'Freq. Y',
      linkFreqs: 'Link X/Y frequencies',
      octaves: 'Detail Octaves',
      octavesDesc: 'Higher octaves add fractal micro-fiber',
      stitch: 'Seamless Tile (Stitch)',
      stitchDesc: 'Repeats seamlessly without seams',
      seed: 'Procedural Seed',
      randomSeed: 'Randomize seed',
    },

    // Blending & Optics Controls
    blend: {
      mode: 'Blend Mode (CSS Blend)',
      opacity: 'Grain Opacity',
      scale: 'Grain Scale (Procedural)',
      scaleUnit: 'x size',
      blur: 'Soft Blur (feGaussianBlur)',
      blurNotice: '0px = Crystal-sharp stippling',
      lighting: '3D Specular Lighting',
      lightingDesc: 'feSpecularLighting (Tactile metallic relief)',
      lightIntensity: 'Light Intensity',
      gradientType: 'Base Gradient Type',
      gradientLinear: 'Linear',
      gradientRadial: 'Radial',
      gradientConic: 'Conic',
      gradientAngle: 'Gradient Angle',
    },

    // Dimensions Controls
    dimensions: {
      aspectRatio: 'Aspect Ratio',
      customSize: 'Custom Dimensions',
      width: 'Width (px)',
      height: 'Height (px)',
      socialPresets: 'Popular Presets',
      landscape: 'Landscape (Desktop/YouTube)',
      portrait: 'Portrait (Stories/Reels/TikTok)',
      square: 'Square (Instagram/Avatar)',
      standard: 'Standard 4:3 (Dribbble/Slides)',
    },

    // Bottom Bar
    bottomBar: {
      removeColor: 'Remove color',
      addColor: 'Add color',
      colorsCount: 'colors',
      prevStyle: 'Previous style',
      nextStyle: 'Next style',
      palettes: 'Palettes',
      generate: 'Generate',
      spaceKey: 'Space',
      shortcuts: 'Shortcuts',
      copyCss: 'Copy CSS',
    },

    // Export Modal
    exportModal: {
      title: 'Export Speckled Background',
      downloadTab: 'Download Image',
      codeTab: 'Copy Code',
      format: 'Output Format',
      ratio: 'Aspect Ratio',
      resolution: 'Export Resolution',
      quality: 'Image Quality',
      codeType: 'Code Format',
      cssSnippet: 'Pure CSS',
      tailwindSnippet: 'Tailwind CSS v3/v4',
      reactSnippet: 'React JSX Component',
      copyButton: 'Copy to Clipboard',
      copied: 'Copied!',
      downloadButton: 'Download Image',
      downloadSvgButton: 'Download Vector SVG',
      downloading: 'Rendering...',
      specsNotice: 'High-fidelity 1:1 render with procedural SVG filter',
    },

    // Feedback Modal
    feedbackModal: {
      title: 'Feedback & Suggestions',
      globalBadge: 'Community',
      subtitle: 'Your ideas shape this tool. Share your thoughts or suggest a texture!',
      tabWrite: 'Leave Feedback',
      tabList: 'Recent Comments',
      category: 'Category',
      catIdea: 'Feature Idea',
      catTexture: 'New Texture',
      catBug: 'Report a Bug',
      catPraise: 'Testimonial',
      experience: 'How is your experience?',
      nameLabel: 'Your Name or Handle',
      namePlaceholder: 'e.g. Alex Designer',
      emailLabel: 'Email Address (optional)',
      emailPlaceholder: 'To notify you if we ship your idea',
      messageLabel: 'Message or Suggestion',
      messagePlaceholder: 'Share what you liked, which texture you need next, or what we can polish...',
      submitLocal: 'Save Comment',
      submittedSuccess: 'Thank you for your feedback!',
      orGitHub: 'Or share publicly on GitHub so everyone sees it:',
      openGitHubIssue: 'Open GitHub Issue (Public & Permanent)',
      githubDesc: 'Opens an issue in the official repo to be permanently saved in the cloud.',
      emptyTitle: 'No comments yet',
      emptyDesc: 'Be the first to share your thoughts, suggest a texture, or report an issue!',
      vote: 'Like',
      persistenceNotice: 'Comments are stored in your local browser. To send a permanent message to the creators, please use the GitHub Issues button.',
    },

    // Shortcuts Modal
    shortcuts: {
      title: 'Keyboard Shortcuts',
      subtitle: 'Work at the speed of light in SpeckledGraphite',
      space: 'Generate new noise variation and seed',
      undo: 'Undo last change',
      redo: 'Redo change',
      export: 'Open export modal',
      help: 'Toggle this cheat sheet',
      styleCycle: 'Cycle through design presets',
      close: 'Close modal',
    },

    // Mockups
    mockups: {
      title: 'Real World UI Mockups',
      subtitle: 'Preview how your speckled graphite looks in real digital products',
      mobileApp: 'iOS Mobile App (Fintech / Crypto)',
      desktopHero: 'Web Hero Section (SaaS Dark Mode)',
      musicPlayer: 'Audio Player & Minimalist Album Art',
      posterArt: 'Poster / Fine Editorial Art',
    },
  },
};
