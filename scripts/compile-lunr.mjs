import { build } from 'esbuild';
import { root } from './tools.mjs';

await build({
  absWorkingDir: root,
  entryPoints: ['src/lib/lunr/lunr.segmentit.js'],
  outfile: 'assets/lib/lunr/lunr.segmentit.js',
  bundle: true,
  minify: true,
  charset: 'utf8',
  target: 'es2015',
  supported: { 'template-literal': false },
  format: 'iife',
});
