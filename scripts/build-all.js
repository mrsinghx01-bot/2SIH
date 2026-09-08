const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.resolve(rootDir, 'frontend');
const frontendDist = path.resolve(frontendDir, 'dist');
const rootDist = path.resolve(rootDir, 'dist');

console.log('🚀 [Cloudflare / CI Build] Starting Bhoomisetu build pipeline...');

try {
  // 1. Build frontend
  console.log('📦 Building frontend (Vite & TypeScript)...');
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

  // 2. Ensure root dist directory exists and sync assets
  console.log('📂 Syncing frontend/dist to root /dist for Cloudflare Pages compatibility...');
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(frontendDist, rootDist, { recursive: true });

  // 3. Ensure _redirects file is present in root dist
  const redirectsSrc = path.resolve(frontendDir, 'public', '_redirects');
  const redirectsDest = path.resolve(rootDist, '_redirects');
  if (fs.existsSync(redirectsSrc)) {
    fs.copyFileSync(redirectsSrc, redirectsDest);
    console.log('✅ Created _redirects for Cloudflare Single Page Application (SPA) routing.');
  }

  console.log('✨ Build pipeline completed successfully! Output ready in both frontend/dist and /dist.');
} catch (error) {
  console.error('❌ Build failed with error:', error);
  process.exit(1);
}
