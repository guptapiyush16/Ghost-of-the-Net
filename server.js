import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runIngestion } from './ingest.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = createServer(async (req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const requestPath = reqUrl.pathname;

  // Production API: Ingest real website info from the Wayback Machine
  if (req.method === 'POST' && requestPath === '/api/ingest') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const world = await runIngestion({
          url: payload.url || 'info.cern.ch/*',
          from: payload.from || '1997',
          to: payload.to || '2003',
          limit: Math.min(payload.limit || 5, 15),
          worldId: 'wayback_' + Date.now().toString(36),
          worldName: payload.name || payload.url
        });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, world }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Health check endpoint
  if (requestPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', service: 'GhostOfTheInternet-Server', time: new Date().toISOString() }));
    return;
  }

  const safePath = normalize(requestPath).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = join(root, safePath === '/' ? 'index.html' : safePath === '/manus-routes.json' ? 'public/manus-routes.json' : safePath);
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    if (requestPath !== '/manus-routes.json' && !extname(requestPath)) {
      const data = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': types['.html'] });
      res.end(data);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`GHOST.NET listening on http://0.0.0.0:${port}`);
});
