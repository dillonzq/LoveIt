import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const toolDir = path.resolve(process.env.LOVEIT_TOOLS_DIR || path.join(root, 'node_modules/.cache/loveit'));
export const toolEnv = {
  ...process.env,
  XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || path.join(toolDir, 'config'),
  XDG_CACHE_HOME: process.env.XDG_CACHE_HOME || path.join(toolDir, 'cache'),
  PATH: `${path.join(root, 'node_modules/.bin')}${path.delimiter}${process.env.PATH}`,
};

export function pagefindSearches(config) {
  const base = config.params?.search || {};
  const languages = Object.values(config.languages || {});
  return (languages.length ? languages.map(language => language.params?.search || {}) : [{}])
    .map(search => ({ ...base, ...search, pagefind: { ...base.pagefind, ...search.pagefind } }))
    .filter(search => search.enable && search.type === 'pagefind');
}

// Accepts Hugo's long and short spellings: `--name value`, `--name=value`, `-n value`, `-n=value`.
export function takeOption(args, ...names) {
  const index = args.findIndex(arg => names.some(name => arg === name || arg.startsWith(`${name}=`)));
  if (index < 0) return undefined;
  const arg = args[index];
  return arg.includes('=') ? args.splice(index, 1)[0].split(/=(.*)/s)[1] : args.splice(index, 2)[1];
}

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`Download failed: ${url} (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}

async function getHvm() {
  if (process.env.HVM_BIN) return path.resolve(process.env.HVM_BIN);
  const version = '1.0.0';
  const platform = { linux: 'linux', darwin: 'darwin', win32: 'windows' }[process.platform];
  const arch = { x64: 'amd64', arm64: 'arm64' }[process.arch];
  if (!platform || !arch) throw new Error('Install hvm for this platform and set HVM_BIN to its executable.');
  const directory = path.join(toolDir, `hvm-${version}`);
  const executable = path.join(directory, process.platform === 'win32' ? 'hvm.exe' : 'hvm');
  if (existsSync(executable)) return executable;
  mkdirSync(toolDir, { recursive: true });
  const staging = mkdtempSync(path.join(toolDir, 'hvm-download-'));
  try {
    const name = `hvm-${platform}-${arch}.${process.platform === 'win32' ? 'zip' : 'tar.gz'}`;
    const release = `https://github.com/jmooring/hvm/releases/download/v${version}`;
    const archive = await download(`${release}/${name}`);
    const checksums = (await download(`${release}/checksums.txt`)).toString();
    const expected = checksums.split('\n').find(line => line.trim().split(/\s+/).at(-1) === name)?.split(/\s+/)[0];
    if (createHash('sha256').update(archive).digest('hex') !== expected) throw new Error('hvm checksum mismatch');
    const archivePath = path.join(staging, name);
    writeFileSync(archivePath, archive);
    execFileSync('tar', ['-xf', archivePath, '-C', staging]);
    rmSync(archivePath);
    try { renameSync(staging, directory); } catch (error) {
      if (!existsSync(executable)) throw error;
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  return executable;
}

// Serializes work on the shared tool cache across processes: `node --test` runs test files in
// parallel, and on a cold cache each would otherwise download Hugo into the same path while another
// runs it (ETXTBSY) or reads a .hvm file that is being rewritten.
async function withToolLock(fn) {
  mkdirSync(toolDir, { recursive: true });
  const lock = path.join(toolDir, 'hugo.lock');
  const start = Date.now();
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    let age = 0;
    try { age = Date.now() - statSync(lock).mtimeMs; } catch { continue; /* Released meanwhile. */ }
    // A lock left behind by a killed process expires; a Hugo download takes far less.
    if (age > 10 * 60_000) {
      rmSync(lock, { recursive: true, force: true });
      continue;
    }
    if (Date.now() - start > 20 * 60_000) throw new Error(`Timed out waiting for ${lock}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  try {
    return await fn();
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
}

export async function getHugo() {
  const hvm = await getHvm();
  const requested = process.env.LOVEIT_HUGO_VERSION;
  const reference = requested === 'minimum'
    ? readFileSync(path.join(root, 'hugo.toml'), 'utf8').match(/\bmin\s*=\s*"([\d.]+)"/)[1]
    : (!requested || requested === 'locked' ? readFileSync(path.join(root, '.hvm'), 'utf8').trim() : requested);
  let spec = reference.includes('/') ? reference : `${reference}/extended`;
  if (/^\d/.test(spec)) spec = `v${spec}`;
  if (!/^(?:v?\d+\.\d+\.\d+|latest)\/(?:standard|extended|extended\/deploy)$/.test(spec)) {
    throw new Error(`Invalid Hugo version/edition: ${spec}`);
  }
  // An override gets its own directory: the checked-in .hvm is never rewritten by CI.
  const cwd = requested && requested !== 'locked' ? path.join(toolDir, 'versions', spec.replaceAll('/', '-')) : root;
  return withToolLock(() => resolveHugo(hvm, spec, cwd));
}

function resolveHugo(hvm, spec, cwd) {
  mkdirSync(cwd, { recursive: true });
  const dotFile = path.join(cwd, '.hvm');
  if (cwd !== root && !spec.startsWith('latest/') && !(existsSync(dotFile) && readFileSync(dotFile, 'utf8') === spec)) {
    writeFileSync(dotFile, spec);
  }
  const options = { cwd, env: toolEnv, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
  let binary;
  if (!spec.startsWith('latest/')) {
    try { binary = execFileSync(hvm, ['status', '--printExecPathCached'], options).trim(); } catch { /* Download below. */ }
  }
  if (!binary || !existsSync(binary)) {
    execFileSync(hvm, ['use', ...(spec.startsWith('latest/') ? [spec] : ['--useVersionInDotFile'])], { ...options, stdio: 'inherit' });
    binary = execFileSync(hvm, ['status', '--printExecPathCached'], options).trim();
  }
  const version = execFileSync(binary, ['version'], options).trim();
  return { binary, version };
}
