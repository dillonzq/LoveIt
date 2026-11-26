// Writes the theme version from package.json, its only source, to the partial templates read.
// npm runs this as the "version" lifecycle script, so `npm version <x> --no-git-tag-version`
// updates package.json, package-lock.json and the partial together; `npm run version` syncs
// the partial after a manual edit. It never touches git: review and commit the files yourself.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export const partial = 'layouts/_partials/loveit/version.html';

export function render(version) {
  return `{{- /* Generated from package.json by scripts/version.mjs. Do not edit. */ -}}\n{{- return ${JSON.stringify(version)} -}}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  writeFileSync(path.join(root, partial), render(version));
}
