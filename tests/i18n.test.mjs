import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { root } from '../scripts/tools.mjs';

const i18nDir = path.join(root, 'i18n');
const reference = 'en.toml';
const pluralForms = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
// Keys that only make sense for some languages; English deliberately leaves them out.
const languageOnlyKeys = new Set(['lunrLanguageLib', 'lunrSegmentitLib']);

// Parses the subset of TOML used by Hugo translation files:
// `[key]` tables holding plural forms, and top-level `key = "value"` shorthands.
function parseTranslations(file) {
  const entries = new Map();
  let current;
  readFileSync(path.join(i18nDir, file), 'utf8').split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    const where = `${file}:${index + 1}`;
    if (!line || line.startsWith('#')) return;
    const table = line.match(/^\[\s*([A-Za-z0-9_-]+)\s*\]\s*(?:#.*)?$/);
    if (table) {
      assert.ok(!entries.has(table[1]), `${where}: duplicate key "${table[1]}"`);
      current = { line: index + 1, forms: {} };
      entries.set(table[1], current);
      return;
    }
    const pair = line.match(/^([A-Za-z0-9_-]+)\s*=\s*("(?:[^"\\]|\\.)*")\s*(?:#.*)?$/);
    assert.ok(pair, `${where}: unsupported syntax: ${line}`);
    const value = JSON.parse(pair[2]);
    if (current) {
      assert.ok(pluralForms.has(pair[1]), `${where}: unknown plural form "${pair[1]}"`);
      assert.ok(!(pair[1] in current.forms), `${where}: duplicate form "${pair[1]}"`);
      current.forms[pair[1]] = value;
    } else {
      assert.ok(!entries.has(pair[1]), `${where}: duplicate key "${pair[1]}"`);
      entries.set(pair[1], { line: index + 1, forms: { other: value } });
    }
  });
  return entries;
}

const placeholders = forms => new Set(Object.values(forms).flatMap(value => value.match(/{{.*?}}/g) || []).map(p => p.replace(/\s+/g, '')));

const files = readdirSync(i18nDir).filter(file => file.endsWith('.toml')).sort();
let english;

test('English is the reference translation and defines every key with an "other" form', () => {
  assert.ok(files.includes(reference), `i18n/${reference} is missing`);
  english = parseTranslations(reference);
  for (const [key, { forms }] of english) {
    assert.ok('other' in forms, `${reference}: "${key}" has no "other" form`);
  }
});

for (const file of files.filter(file => file !== reference)) {
  test(`i18n/${file} matches the English keys`, t => {
    assert.ok(english, `i18n/${reference} could not be parsed`);
    const entries = parseTranslations(file);
    const unknown = [...entries.keys()].filter(key => !english.has(key) && !languageOnlyKeys.has(key));
    assert.deepEqual(unknown, [], `${file} has keys that English does not define (typo or stale key?)`);

    for (const [key, { line, forms }] of entries) {
      assert.ok('other' in forms, `${file}:${line}: "${key}" has no "other" form`);
      if (!english.has(key)) continue;
      const expected = placeholders(english.get(key).forms);
      const extra = [...placeholders(forms)].filter(p => !expected.has(p));
      assert.deepEqual(extra, [], `${file}:${line}: "${key}" uses placeholders that English does not provide`);
    }

    // Hugo falls back to the default language for missing keys, so report them without failing.
    const missing = [...english.keys()].filter(key => !entries.has(key));
    if (missing.length) {
      t.diagnostic(`warning: ${file} is missing ${missing.length} key(s): ${missing.join(', ')}`);
    }
  });
}
