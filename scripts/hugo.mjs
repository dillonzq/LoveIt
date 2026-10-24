import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getHugo, pagefindSearches, root, takeOption, toolDir, toolEnv } from './tools.mjs';

async function main() {
  const args = process.argv.slice(2);
  const command = !args[0]?.startsWith('-') && args[0] ? args.shift() : 'build';
  const { binary, version } = await getHugo();
  if (command === 'version') {
    console.log(version);
    return;
  }
  const source = path.resolve(takeOption(args, '--source', '-s') || path.join(root, 'exampleSite'));
  const configs = (takeOption(args, '--config') || path.join(source, 'hugo.toml')).split(',').map(p => path.resolve(p));
  const match = version.match(/v(\d+)\.(\d+)\./);
  if (!match) throw new Error(`Cannot read Hugo version: ${version}`);
  const legacy = Number(match[1]) === 0 && Number(match[2]) < 158;
  // Only the example site needs an overlay; downstream sites own their language config.
  if (legacy && source === path.join(root, 'exampleSite')) {
    configs.push(path.join(source, 'config-legacy.toml'));
  }
  mkdirSync(toolDir, { recursive: true });
  const temporary = mkdtempSync(path.join(toolDir, 'build-'));
  try {
    const themeConfig = path.join(temporary, 'theme.json');
    writeFileSync(themeConfig, JSON.stringify({ theme: path.basename(root), themesDir: path.dirname(root) }));
    configs.push(themeConfig);
    if (process.env.LOVEIT_SEARCH) {
      const initial = JSON.parse(execFileSync(binary, ['config', '--source', source, '--theme', path.basename(root), '--themesDir', path.dirname(root), '--config', configs.join(','), '--format', 'json'], { cwd: root, env: toolEnv, encoding: 'utf8' }));
      const search = { enable: true, type: process.env.LOVEIT_SEARCH };
      const file = path.join(temporary, 'search.json');
      writeFileSync(file, JSON.stringify({ params: { search }, languages: Object.fromEntries(Object.keys(initial.languages || {}).map(language => [language, { params: { search } }])) }));
      configs.push(file);
    }
    const common = ['--source', source, '--theme', path.basename(root), '--themesDir', path.dirname(root), '--config', configs.join(',')];
    if (command === 'config') {
      execFileSync(binary, ['config', ...common, ...args], { cwd: root, env: toolEnv, stdio: 'inherit' });
      return;
    }
    if (!['build', 'server'].includes(command)) throw new Error(`Unknown command: ${command}`);
    console.log(version);
    const child = spawn(binary, [...(command === 'server' ? ['server'] : []), ...common, ...args], { cwd: root, env: toolEnv, stdio: 'inherit' });
    const forward = signal => child.kill(signal);
    const onInt = () => forward('SIGINT');
    const onTerm = () => forward('SIGTERM');
    process.on('SIGINT', onInt);
    process.on('SIGTERM', onTerm);
    const code = await new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
    });
    process.off('SIGINT', onInt);
    process.off('SIGTERM', onTerm);
    if (code) { process.exitCode = code; return; }
    if (command === 'server') return;
    // Resolve Hugo's merged config, including language and environment overrides.
    const configArgs = [];
    for (const [option, short] of [['--environment', '-e'], ['--baseURL', '-b'], ['--destination', '-d']]) {
      const value = takeOption([...args], option, short);
      if (value) configArgs.push(option, value);
    }
    const config = JSON.parse(execFileSync(binary, ['config', ...common, ...configArgs, '--format', 'json'], { cwd: root, env: toolEnv, encoding: 'utf8' }));
    const searches = pagefindSearches(config);
    if (!searches.length) return;
    const output = path.resolve(source, config.publishdir || 'public');
    const pagefind = await import('pagefind');
    const { index, errors } = await pagefind.createIndex();
    const check = errors => { if (errors?.length) throw new Error(errors.join('\n')); };
    check(errors);
    try {
      check((await index.addDirectory({ path: output })).errors);
      for (const basePath of new Set(searches.map(search => search.pagefind?.basepath || '/_pagefind/'))) {
        const subdir = basePath.replace(/^\/+|\/+$/g, '');
        if (!subdir || subdir.split('/').some(part => !/^[\w.-]+$/.test(part) || part === '..' || part === '.')) {
          throw new Error('Pagefind basePath must be a directory inside the published site.');
        }
        check((await index.writeFiles({ outputPath: path.join(output, subdir) })).errors);
        console.log(`Pagefind index: ${path.join(output, subdir)}`);
      }
    } finally {
      await pagefind.close();
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
