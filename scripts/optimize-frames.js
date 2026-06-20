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

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.warn('\n[Warning] "sharp" library is not installed. Skipping WebP frame optimization.');
    console.warn('To run optimization locally, install sharp: npm install -D sharp');
    console.warn('Then run: npm run optimize-frames\n');
    process.exit(0);
  }

  const files = fs.readdirSync(FRAMES_DIR);
  const pngFiles = files
    .filter(f => f.endsWith('.png') && f.startsWith('ezgif-frame-'))
    .sort();
  
  if (pngFiles.length === 0) {
    console.log('No matching PNG frames found in public/frames/.');
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
