/** Read-only draft shape/relationship check. No application runtime or user data. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { verifyReference, verifyRead } from './reference.mjs';

if (!process.argv[2]) throw Error('Provide a dependency directory containing ajv/dist/2020.js');
const require = createRequire(resolve(process.argv[2], 'package.json'));
const Ajv = require('ajv/dist/2020.js').default;
const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const validate = new Ajv({ strict: true, allErrors: true }).compile(read('wire.schema.json'));
const counts = { valid: 0, 'format-invalid': 0, 'relation-invalid': 0 };
for (const item of read('examples.json')) {
  const shape = validate(item.value);
  if (item.expected === 'format-invalid') {
    if (shape) throw Error(item.id + ': expected format rejection');
  } else {
    if (!shape) throw Error(item.id + ': ' + JSON.stringify(validate.errors));
    let relation = true;
    try {
      if (item.owner) {
        if ('value' in item.value) verifyRead(item.value, item.owner, item.resource);
        else verifyReference(item.value, item.owner, item.resource);
      }
    } catch { relation = false; }
    if (relation !== (item.expected === 'valid')) throw Error(item.id + ': relationship mismatch');
  }
  if (!(item.expected in counts)) throw Error('unknown classification');
  counts[item.expected]++;
}
console.log(JSON.stringify({ scope: 'draft pure format and relationships only', counts }));
