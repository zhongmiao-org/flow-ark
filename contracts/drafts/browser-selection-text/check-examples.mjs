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
  let passed = true;
  try {
    if (example.kind === 'node') checks.node(example.value);
    else if (example.kind === 'invocation') checks.invocation(example.source, example.value);
    else if (example.kind === 'result') checks.result(example.source, example.value);
    else if (example.kind === 'declaration') checks.declaration(example.value);
    else throw Error('unknown kind');
  } catch { passed = false; }
  if (passed !== example.valid) throw Error('Unexpected draft outcome: ' + example.name);
}
console.log('Selection-source draft format/association examples passed: ' + examples.length + '; no DOM, application or model execution');
