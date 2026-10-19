/** Pure unpublished draft relations; no browser, application or Store access. */
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const canonical = (v) => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
function unicode(value) {
  if (new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(new TextEncoder().encode(value)) !== value)
    throw Error('invalid Unicode');
}
function reference(value) {
  unicode(value);
  const p = value.split('.');
  if (p.some(x => !x || ['__proto__', 'prototype', 'constructor'].includes(x)) ||
      !['params', 'steps', 'item', 'index'].includes(p[0]) ||
      (['params', 'steps'].includes(p[0]) && p.length < 2) || (p[0] === 'index' && p.length !== 1))
    throw Error('invalid target reference');
}
export function createDraftChecks(ajv, schema) {
  ajv.addSchema(schema);
  const format = (definition, value) => {
    const validate = ajv.getSchema(schema.$id + '#/$defs/' + definition);
    if (!validate(value)) throw Error('invalid format ' + definition + ': ' + ajv.errorsText(validate.errors));
  };
  const node = value => {
    format('BrowserTargetNode', value);
    for (const x of value.framePath) unicode(x);
    if (typeof value.selector === 'string') unicode(value.selector);
    else reference(value.selector.$ref);
    return value;
  };
  const invocation = (source, value) => {
    node(source);
    format('BrowserTargetInvocation', value);
    unicode(value.selector);
    const { selector: original, ...fixed } = source;
    const { selector: resolved, nodeInstance, ...received } = value;
    if (!same(fixed, received) || nodeInstance.split('/').at(-1) !== source.id ||
        (typeof original === 'string' && original !== resolved)) throw Error('fixed invocation mismatch');
    return value;
  };
  const result = (operation, value) => {
    const name = { read: 'BrowserTargetReadResult', click: 'BrowserTargetClickResult', wait: 'BrowserTargetWaitResult' }[operation];
    if (!name) throw Error('unknown operation');
    format(name, value);
    if (operation === 'read') {
      unicode(value);
      if (new TextEncoder().encode(value).length > 65536) throw Error('read result exceeds byte limit');
    }
    return value;
  };
  return { node, invocation, result };
}
