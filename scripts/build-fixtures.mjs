import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { getHugo, root } from './tools.mjs';

mkdirSync(path.join(root, 'build'), { recursive: true });
const source = path.join(root, 'build/fixture-source');
rmSync(source, { recursive: true, force: true });
mkdirSync(source, { recursive: true });
for (const directory of ['assets', 'static']) cpSync(path.join(root, 'exampleSite', directory), path.join(source, directory), { recursive: true });
cpSync(path.join(root, 'tests/fixtures/assets'), path.join(source, 'assets'), { recursive: true });
cpSync(path.join(root, 'tests/fixtures/content'), path.join(source, 'content'), { recursive: true });
cpSync(path.join(root, 'tests/fixtures/layouts'), path.join(source, 'layouts'), { recursive: true });
const configs = [path.join(root, 'exampleSite/hugo.toml'), path.join(root, 'tests/fixtures/config.toml')];
const { version } = await getHugo();
const [, major, minor] = version.match(/v(\d+)\.(\d+)\./);
if (Number(major) === 0 && Number(minor) < 158) configs.push(path.join(root, 'exampleSite/config-legacy.toml'));
for (const engine of ['fuse', 'lunr', 'pagefind', 'algolia']) {
  rmSync(path.join(root, 'build/resources', engine), { recursive: true, force: true });
  rmSync(path.join(root, 'build/browser', engine), { recursive: true, force: true });
  execFileSync(process.execPath, [path.join(root, 'scripts/hugo.mjs'), 'build',
    '--source', source, '--config', configs.join(','),
    '--destination', path.join(root, 'build/browser', engine),
    '--baseURL', `http://127.0.0.1:48137/${engine}/blog/`,
    '--environment', 'production', '--minify', '--panicOnWarning', '--noBuildLock',
  ], {
    cwd: root, stdio: 'inherit', env: {
      ...process.env, LOVEIT_SEARCH: engine,
      HUGO_RESOURCEDIR: path.join(root, 'build/resources', engine),
    },
  });
}
