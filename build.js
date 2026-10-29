import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/api', { recursive: true });
await Promise.all([
  cp('index.html', 'dist/index.html'),
  cp('styles.css', 'dist/styles.css'),
  cp('app.js', 'dist/app.js'),
  cp('archiveData.js', 'dist/archiveData.js'),
  cp('logo.png', 'dist/logo.png'),
  cp('public', 'dist/public', { recursive: true }),
  cp('public/manus-routes.json', 'dist/manus-routes.json'),
  writeFile('dist/api/health', JSON.stringify({ status: 'ok', service: 'GhostOfTheInternet-Edge' }))
]);
console.log('Built GHOST.NET into dist/');
