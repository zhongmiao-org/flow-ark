import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDraftChecks } from './reference.mjs';
if (!process.argv[2]) throw Error('Pass an existing dependency directory containing ajv');
const { default: Ajv } = await import(pathToFileURL(resolve(process.argv[2], 'ajv/dist/2020.js')));
const schema = JSON.parse(await readFile(new URL('./wire.schema.json', import.meta.url), 'utf8'));
const examples = JSON.parse(await readFile(new URL('./examples.json', import.meta.url), 'utf8'));
const checks = createDraftChecks(new Ajv({ strict: false, allErrors: true }), schema);
for (const example of examples) {
  let value = example.value;
  if (example.valueSource) {
    const source = example.valueSource;
    if (Object.keys(source).sort().join(',') !== 'count,repeat' ||
        typeof source.repeat !== 'string' || [...source.repeat].length !== 1 ||
        !Number.isSafeInteger(source.count) || source.count < 0 || source.count > 65536)
      throw Error('Invalid bounded fixture recipe');
    value = source.repeat.repeat(source.count);
  }
  let passed = true;
  try {
    if (example.kind === 'node') checks.node(value);
    else if (example.kind === 'invocation') checks.invocation(example.source, value);
    else if (example.kind === 'result') checks.result(example.operation, value);
    else throw Error('unknown example kind');
  } catch { passed = false; }
  if (passed !== example.valid) throw Error('Unexpected draft example outcome: ' + example.name);
}
console.log('Draft format/association examples passed: ' + examples.length + '; no browser or application execution');
