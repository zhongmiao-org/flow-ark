// Pure contract shape and source relations. Does not import application code or run a browser.
import { createRequire } from 'node:module';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.argv[2]) throw Error('Pass a directory providing existing esbuild and AJV dependencies');
const dependencies = path.resolve(process.argv[2]);
const require = createRequire(path.join(dependencies, 'package.json'));
const { build } = require('esbuild');
const snapshot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../v0.49.0');
const temp = await mkdtemp(path.join(tmpdir(), 'flowark-scroll-format-'));
try {
  await build({ entryPoints: [path.join(snapshot, 'browser-scroll.ts')], bundle: true,
    platform: 'node', format: 'cjs', outfile: path.join(temp, 'reference.cjs'),
    nodePaths: [path.join(dependencies, 'node_modules')], logLevel: 'silent' });
  const m = require(path.join(temp, 'reference.cjs'));
  const cases = JSON.parse(await readFile(path.join(snapshot, 'browser-scroll.cases.json'), 'utf8'));
  for (const c of cases) {
    let valid = true;
    try {
      if (c.kind === 'node') m.assertBrowserScrollNode(c.value);
      else if (c.kind === 'invocation') m.assertBrowserScrollInvocation(c.source, c.value);
      else m.assertBrowserScrollResult(c.source, c.value);
    } catch { valid = false; }
    if (valid !== c.valid) throw Error('Format case mismatch: ' + c.name);
  }
  const node = cases[0].value;
  const manifest = { resources: [{ id: 'page', kind: 'browser', access: 'use' }] };
  const entry = { capabilities: ['browser', 'browser-scroll-v1'], resources: ['page'] };
  const declarations = [
    ['own-resource', entry.capabilities, manifest, entry, true],
    ['missing-capability', ['browser'], manifest, entry, false],
    ['missing-own-resource', entry.capabilities, manifest, { ...entry, resources: [] }, false],
    ['wrong-access', entry.capabilities, { resources: [{ id: 'page', kind: 'browser', access: 'read' }] }, entry, false],
  ];
  for (const [name, caps, pkg, e, expected] of declarations) {
    let valid = true;
    try { m.assertBrowserScrollCapabilities(node, caps, pkg, e); } catch { valid = false; }
    if (valid !== expected) throw Error('Declaration mismatch: ' + name);
  }
  console.log(JSON.stringify({ formatRelations: cases.length, declarationRelations: declarations.length,
    status: 'passed', scope: 'pure contract only; no browser, Runtime or unit tests' }));
} finally {
  await rm(temp, { recursive: true, force: true });
}
