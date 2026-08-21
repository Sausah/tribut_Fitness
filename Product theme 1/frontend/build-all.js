import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Build root theme 1
console.log('Building Theme 1 (Root)...');
execSync('npm run build-only', { stdio: 'inherit' });

const distPath = path.resolve('dist');

// Themes to build
const themes = [
  { name: 'product theme 2', path: '../product theme 2/frontend', out: 'v2' },
  { name: 'product theme 3', path: '../product theme 3/frontend', out: 'v3' },
  { name: 'product theme 4', path: '../product theme 4/frontend', out: 'v4' }
];

for (const theme of themes) {
  console.log(`\n===================================`);
  console.log(`Building ${theme.name}...`);
  console.log(`===================================`);
  const themePath = path.resolve(theme.path);
  
  // Install dependencies in theme folder
  console.log(`Installing dependencies in ${themePath}...`);
  execSync('npm install', { cwd: themePath, stdio: 'inherit' });
  
  // Build theme
  console.log(`Building theme assets in ${themePath}...`);
  execSync('npm run build', { cwd: themePath, stdio: 'inherit' });
  
  // Copy build output
  const themeDist = path.join(themePath, 'dist');
  const targetDist = path.join(distPath, theme.out);
  
  console.log(`Copying ${theme.name} dist to ${targetDist}...`);
  if (fs.existsSync(targetDist)) {
    fs.rmSync(targetDist, { recursive: true, force: true });
  }
  fs.cpSync(themeDist, targetDist, { recursive: true });
}

console.log('\nAll themes built and copied successfully!');
