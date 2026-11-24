// Minimal static server for a built site. Compressible responses are gzipped so
// transfer sizes measured against it are comparable to a real host.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.wasm': 'application/wasm', '.mp3': 'audio/mpeg',
};
const compressible = /^(text\/|application\/(json|xml|manifest\+json|wasm)|image\/svg)/;

async function resolveFile(directory, pathname) {
  let file = path.resolve(directory, `.${decodeURIComponent(pathname)}`);
  if (file !== directory && !file.startsWith(`${directory}${path.sep}`)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

export function serve(directory, port, host = '127.0.0.1') {
  const base = path.resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const { pathname } = new URL(request.url, 'http://localhost');
      let status = 200;
      let file = await resolveFile(base, pathname);
      if (!file) {
        status = 404;
        file = await resolveFile(base, '/404.html');
        if (!file) { response.writeHead(404).end(); return; }
      }
      const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
      let body = await readFile(file);
      const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' };
      if (compressible.test(type) && /\bgzip\b/.test(request.headers['accept-encoding'] || '')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      headers['Content-Length'] = body.length;
      response.writeHead(status, headers);
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      if (!response.headersSent) response.writeHead(500);
      response.end();
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}
