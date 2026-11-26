import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getHugo, root, toolEnv } from '../scripts/tools.mjs';
import { partial, render } from '../scripts/version.mjs';

// package.json is the source of the theme version; the partial is generated from it.
const readJSON = (directory, file) => JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
const { version } = readJSON(root, 'package.json');
const footerTitle = html => html.match(/title="LoveIt (\d[^"]*)"/)?.[1];

function files(directory) {
  return readdirSync(directory, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath, entry.name));
}

test('package-lock.json and the generated partial match the package.json version', () => {
  const lock = readJSON(root, 'package-lock.json');
  assert.equal(lock.version, version);
  assert.equal(lock.packages[''].version, version);
  // Line endings may follow the checkout's core.autocrlf setting.
  const generated = readFileSync(path.join(root, partial), 'utf8').replaceAll('\r\n', '\n');
  assert.equal(generated, render(version), `${partial} is stale: run "npm run version"`);
});

test('templates do not hardcode the theme version', () => {
  for (const file of files(path.join(root, 'layouts'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /Scratch\.Set\s+"version"\s+"/, `${path.relative(root, file)} hardcodes the version`);
  }
});

test('npm version updates the generated partial and the rendered footer', async () => {
  const { binary } = await getHugo();
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'loveit-version-'));
  try {
    const theme = path.join(temporary, 'themes/LoveIt');
    for (const entry of ['archetypes', 'assets', 'i18n', 'layouts', 'scripts/version.mjs', 'go.mod', 'hugo.toml', 'package.json', 'package-lock.json', 'theme.toml']) {
      cpSync(path.join(root, entry), path.join(theme, entry), { recursive: true });
    }
    // The documented release-prep step, with empty npm configuration so that the caller's
    // settings (such as ignore-scripts) do not apply.
    const npmConfig = ['npmrc-user', 'npmrc-global'].map(name => path.join(temporary, name));
    for (const file of npmConfig) writeFileSync(file, '');
    const env = {
      ...Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^npm_/i.test(name))),
      npm_config_userconfig: npmConfig[0], npm_config_globalconfig: npmConfig[1],
    };
    const bumped = `${version}-test.1`;
    execFileSync('npm', ['version', bumped, '--no-git-tag-version'], { cwd: theme, env, stdio: 'pipe', shell: process.platform === 'win32' });
    assert.equal(readJSON(theme, 'package.json').version, bumped);
    assert.equal(readJSON(theme, 'package-lock.json').version, bumped);
    assert.equal(readFileSync(path.join(theme, partial), 'utf8'), render(bumped));

    // Hugo itself, without the repository's Node wrapper: a site using the theme from a themes
    // directory, one importing it as a Hugo Module, and one importing it with explicit mounts,
    // including one per directory under assets. Each site has its own function/version.html,
    // which a generic partial name would collide with.
    const module = 'themesDir = "../themes"\n[module]\nreplacements = "github.com/dillonzq/LoveIt -> LoveIt"\n[[module.imports]]\npath = "github.com/dillonzq/LoveIt"\n';
    const assets = readdirSync(path.join(theme, 'assets'), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => `assets/${entry.name}`);
    const mounts = ['archetypes', 'i18n', 'layouts', ...assets].map(directory => `[[module.imports.mounts]]\nsource = "${directory}"\ntarget = "${directory}"\n`).join('');
    const sites = {
      theme: 'theme = "LoveIt"\nthemesDir = "../themes"\n',
      module,
      mounts: module + mounts,
    };
    for (const [name, config] of Object.entries(sites)) {
      const site = path.join(temporary, name);
      mkdirSync(path.join(site, 'layouts/_partials/function'), { recursive: true });
      writeFileSync(path.join(site, 'hugo.toml'), `baseURL = "https://example.org/"\n${config}`);
      writeFileSync(path.join(site, 'layouts/_partials/function/version.html'), '{{- return "9.9.9" -}}\n');
      // Warnings fail the build.
      execFileSync(binary, ['--source', site, '--environment', 'production', '--panicOnWarning', '--noBuildLock'], { cwd: site, env: toolEnv, stdio: 'pipe' });
      assert.equal(footerTitle(readFileSync(path.join(site, 'public/index.html'), 'utf8')), bumped, `${name} site`);
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
