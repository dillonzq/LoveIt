import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { root } from '../scripts/tools.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const match = url.pathname.match(/^\/(fuse|lunr|pagefind|algolia)\/blog(?:\/|$)(.*)/);
    if (!match) { response.writeHead(404).end(); return; }
    const directory = path.join(root, 'build/browser', match[1]);
    let file = path.resolve(directory, decodeURIComponent(match[2]));
    if (file !== directory && !file.startsWith(`${directory}${path.sep}`)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch { response.writeHead(404).end(); }
}).listen(48137, '127.0.0.1');
