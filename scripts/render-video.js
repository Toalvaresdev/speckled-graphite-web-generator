import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Iniciando renderizador programático de video...');
  
  const templatePath = path.resolve(__dirname, 'video-template.html');
  const outputPath = path.resolve(__dirname, '../speckled-graphite-promo.mp4');

  const fps = 30;
  const durationSec = 14;
  const totalFrames = fps * durationSec;

  console.log(`📹 Configuración: 1080x1920 (Vertical 9:16) • ${fps} FPS • ${durationSec}s • Total: ${totalFrames} frames`);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });

  // Spawn ffmpeg
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(fps),
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '19',
    outputPath,
  ];

  console.log('🎬 Conectando pipeline a ffmpeg...');
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    // Optional: console.log(data.toString());
  });

  ffmpeg.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ ¡Video generado con éxito! Guardado en:\n📁 ${outputPath}`);
    } else {
      console.error(`❌ ffmpeg terminó con código de error ${code}`);
    }
  });

  // Render loop
  for (let f = 0; f < totalFrames; f++) {
    const sec = f / fps;
    await page.evaluate((s) => window.renderFrame(s), sec);

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 95,
      optimizeForSpeed: true,
    });

    ffmpeg.stdin.write(screenshot);

    if (f % 30 === 0 || f === totalFrames - 1) {
      const pct = Math.round((f / totalFrames) * 100);
      process.stdout.write(`⏳ Progreso: ${pct}% (Segundo ${sec.toFixed(1)}s / ${durationSec}s)\r`);
    }
  }

  ffmpeg.stdin.end();
  await browser.close();
}

main().catch((err) => {
  console.error('Error renderizando video:', err);
  process.exit(1);
});
