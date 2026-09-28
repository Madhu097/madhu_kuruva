import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const FRAMES_DIR = path.join(ROOT_DIR, 'public', 'frames');

async function main() {
  console.log('\n--- Cinematic Intro: Optimizing Frame Images ---');
  
  if (!fs.existsSync(FRAMES_DIR)) {
    console.error(`[Error] Frames directory not found at ${FRAMES_DIR}`);
    process.exit(0);
  }

  const files = fs.readdirSync(FRAMES_DIR);
  const pngFiles = files
    .filter(f => f.endsWith('.png') && f.startsWith('ezgif-frame-'))
    .sort();

  // Immediately remove obsolete PNG frames when corresponding WebP already exists
  let cleaned = 0;
  for (const file of pngFiles) {
    const inputPath = path.join(FRAMES_DIR, file);
    const webpPath = path.join(FRAMES_DIR, file.replace(/\.png$/, '.webp'));
    if (fs.existsSync(webpPath)) {
      try {
        fs.unlinkSync(inputPath);
        cleaned++;
      } catch (e) {}
    }
  }
  if (cleaned > 0) {
    console.log(`Successfully removed ${cleaned} obsolete PNG frames.`);
  }

  const remainingPngs = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.png') && f.startsWith('ezgif-frame-'));
  if (remainingPngs.length === 0) {
    console.log('All frames are WebP. No PNG frames remaining.');
    return;
  }

  console.log(`Found ${pngFiles.length} PNG frames to process.`);
  
  let processed = 0;
  let skipped = 0;
  
  for (const file of pngFiles) {
    const inputPath = path.join(FRAMES_DIR, file);
    const outputPath = path.join(FRAMES_DIR, file.replace(/\.png$/, '.webp'));
    
    if (fs.existsSync(outputPath)) {
      skipped++;
      try {
        fs.unlinkSync(inputPath);
      } catch (e) {}
      continue;
    }
    
    try {
      // Quality 75: Excellent quality, extremely small file size
      await sharp(inputPath)
        .webp({ quality: 75 })
        .toFile(outputPath);
      
      processed++;
      if (processed % 30 === 0 || processed === 1 || processed === pngFiles.length) {
        console.log(`  Optimized ${processed}/${pngFiles.length} frames...`);
      }
    } catch (err) {
      console.error(`[Error] Failed to optimize ${file}:`, err.message);
    }
  }
  
  console.log('--- Frame Optimization Complete ---');
  console.log(`* WebP files generated: ${processed}`);
  console.log(`* Skipped (already exist): ${skipped}`);
  console.log(`* Total WebP frames available: ${processed + skipped}\n`);
}

main().catch(err => {
  console.error('[Fatal Error] Optimization script failed:', err);
  process.exit(1);
});
