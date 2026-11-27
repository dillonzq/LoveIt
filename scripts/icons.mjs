// Font Awesome icons that the theme renders as inline SVG at build time.
//
// The theme's own icons (layouts and the social link defaults) are copied
// from the Font Awesome Free package with the same version as the bundled
// webfonts into assets/lib/fontawesome-free/svgs, keeping each file's license
// comment. Refresh them after changing an icon or upgrading Font Awesome:
//
//   npm pack @fortawesome/fontawesome-free@<version>
//   tar -xzf fortawesome-fontawesome-free-<version>.tgz
//   node scripts/icons.mjs package
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './tools.mjs';

export const svgDir = path.join(root, 'assets/lib/fontawesome-free/svgs');
const styles = { fas: 'solid', 'fa-solid': 'solid', fa: 'solid', far: 'regular', 'fa-regular': 'regular', fab: 'brands', 'fa-brands': 'brands' };
const classRE = /(?<![\w-])(fa-solid|fa-regular|fa-brands|fas|far|fab|fa)\s+fa-([a-z0-9-]+)/g;

// Every "<style> fa-<name>" pair in the theme's templates and social data.
export function themeIcons() {
  const files = readdirSync(path.join(root, 'layouts'), { recursive: true })
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(root, 'layouts', file));
  files.push(path.join(root, 'assets/data/social.yml'));
  const icons = new Map();
  for (const file of files) {
    // Template comments only document the syntax, e.g. function/fontawesome.html.
    const source = readFileSync(file, 'utf8').replace(/\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/g, '');
    for (const [, prefix, name] of source.matchAll(classRE)) {
      icons.set(`${styles[prefix]}/${name}`, { style: styles[prefix], name });
    }
  }
  return [...icons.values()].sort((a, b) => `${a.style}/${a.name}`.localeCompare(`${b.style}/${b.name}`));
}

// Maps legacy names (e.g. "search") to the canonical file name ("magnifying-glass").
export function readAliases() {
  return JSON.parse(readFileSync(path.join(svgDir, 'aliases.json'), 'utf8'));
}

export function vendoredFile({ style, name }, aliases = readAliases()) {
  return path.join(svgDir, style, `${aliases[name] || name}.svg`);
}

function vendor(packageDir) {
  const families = JSON.parse(readFileSync(path.join(packageDir, 'metadata/icon-families.json'), 'utf8'));
  const canonical = {};
  for (const [name, icon] of Object.entries(families)) {
    for (const alias of icon.aliases?.names || []) canonical[alias] = name;
  }
  rmSync(svgDir, { recursive: true, force: true });
  const aliases = {};
  for (const icon of themeIcons()) {
    const name = families[icon.name] ? icon.name : canonical[icon.name];
    const source = name && path.join(packageDir, 'svgs', icon.style, `${name}.svg`);
    if (!source || !existsSync(source)) throw new Error(`Font Awesome has no ${icon.style} icon "${icon.name}"`);
    mkdirSync(path.join(svgDir, icon.style), { recursive: true });
    copyFileSync(source, path.join(svgDir, icon.style, `${name}.svg`));
    if (name !== icon.name) aliases[icon.name] = name;
  }
  // Also accept the other legacy names of every vendored icon, so sites can keep them.
  for (const [alias, name] of Object.entries(canonical)) {
    if (['solid', 'regular', 'brands'].some(style => existsSync(path.join(svgDir, style, `${name}.svg`)))) aliases[alias] = name;
  }
  const sorted = Object.fromEntries(Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path.join(svgDir, 'aliases.json'), `${JSON.stringify(sorted, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('Usage: node scripts/icons.mjs <extracted @fortawesome/fontawesome-free package>');
  vendor(path.resolve(process.argv[2]));
}
