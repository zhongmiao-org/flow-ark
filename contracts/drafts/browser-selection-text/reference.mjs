/** Unpublished pure format/association reference. No DOM, application, Store or network. */
const canonical = (v) => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const bytes = v => new TextEncoder().encode(v).length;
const forbidden = ['__proto__', 'prototype', 'constructor'];
const issueOrder = ['hidden-target', 'hidden-descendant', 'line-clamp', 'overflow-clip', 'unsupported-layout', 'embedded-content', 'generated-content'];
function unicode(v) {
  if (new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(new TextEncoder().encode(v)) !== v)
    throw Error('invalid Unicode');
}
function input(v, resolved) {
  if (v === null) return;
  if (typeof v === 'string') { unicode(v); return; }
  if (resolved) throw Error('unresolved selection source');
  unicode(v.$ref);
  const p = v.$ref.split('.');
  if (p.some(k => !k || forbidden.includes(k)) || !['params', 'steps', 'item', 'index'].includes(p[0]) ||
      (['params', 'steps'].includes(p[0]) && p.length < 2) || (p[0] === 'index' && p.length !== 1))
    throw Error('invalid selection reference');
}
export function createDraftChecks(ajv, schema) {
  ajv.addSchema(schema);
  const format = (name, v) => {
    const check = ajv.getSchema(schema.$id + '#/$defs/' + name);
    if (!check(v)) throw Error('invalid selection format: ' + name + ' ' + ajv.errorsText(check.errors));
  };
  const node = (v, resolved = false) => {
    format('BrowserSelectionTextFieldsNode', v);
    input(v.selector, resolved); v.framePath.forEach(unicode);
    const keys = new Set();
    for (const f of v.fields) {
      if (keys.has(f.key) || forbidden.includes(f.key)) throw Error('duplicate or reserved field');
      keys.add(f.key); input(f.selector, resolved); input(f.attribute, resolved);
    }
    return v;
  };
  const invocation = (source, v) => {
    node(source); format('BrowserSelectionTextFieldsInvocation', v);
    const { nodeInstance, ...resolved } = v;
    node(resolved, true); unicode(nodeInstance);
    const { selector: originalRoot, fields: originalFields, ...fixed } = source;
    const { selector: actualRoot, fields: actualFields, ...received } = resolved;
    if (!same(fixed, received) || nodeInstance.split('/').at(-1) !== source.id ||
        (typeof originalRoot === 'string' && originalRoot !== actualRoot) ||
        originalFields.length !== actualFields.length) throw Error('fixed selection invocation mismatch');
    for (let i = 0; i < originalFields.length; i++) {
      const { selector: s, attribute: a, ...f } = originalFields[i];
      const { selector: rs, attribute: ra, ...rf } = actualFields[i];
      if (!same(f, rf) || (typeof s === 'string' && s !== rs) ||
          ((a === null || typeof a === 'string') && a !== ra)) throw Error('fixed field mismatch');
    }
    return v;
  };
  const status = f => {
    if (f.count !== 1) {
      if (f.value !== null || f.issues.length) throw Error('nonunique field has content');
      return f.count === 0 ? 'missing' : 'ambiguous';
    }
    if (f.operation !== 'selection-text' && f.issues.length) throw Error('raw field has selection issues');
    if (f.issues.length) {
      if (f.value !== null || !same(f.issues, issueOrder.filter(k => f.issues.includes(k))))
        throw Error('partial content or unordered issues');
      if (f.issues.some(k => k.startsWith('hidden-'))) return 'hidden';
      if (f.issues.some(k => ['line-clamp', 'overflow-clip'].includes(k))) return 'clipped';
      return 'unsupported';
    }
    if (f.value === null) {
      if (f.operation !== 'attribute') throw Error('unique text missing without issue');
      return 'missing-attribute';
    }
    return f.value.trim() ? 'ok' : 'empty';
  };
  const result = (source, v) => {
    node(source, true); format('BrowserSelectionTextFieldsResult', v);
    if (v.selector !== source.selector || !same(v.framePath, source.framePath) ||
        v.fields.length !== source.fields.length || (!v.framePath.length && v.url !== v.documentUrl))
      throw Error('selection result source mismatch');
    for (const u of [v.url, v.documentUrl]) { unicode(u); if (bytes(u) > 16384) throw Error('URL byte budget'); }
    let complete = true;
    for (let i = 0; i < v.fields.length; i++) {
      const f = v.fields[i], configured = source.fields[i];
      for (const k of ['key', 'selector', 'operation', 'attribute', 'required'])
        if (f[k] !== configured[k]) throw Error('selection field mismatch');
      if (f.ignoredAncestorSpaces + f.excludedAncestorDecorations > 128)
        throw Error('ancestor pseudo budget');
      const s = status(f);
      if (s !== f.status) throw Error('selection field status mismatch');
      if (typeof f.value === 'string') {
        unicode(f.value);
        if (bytes(f.value) > (f.operation === 'selection-text' ? 65536 : 8192)) throw Error('field byte budget');
      }
      if (['ambiguous', 'hidden', 'clipped', 'unsupported'].includes(s) || (f.required && s !== 'ok'))
        complete = false;
    }
    if (v.complete !== complete || bytes(JSON.stringify(v)) > 131072) throw Error('result completeness or byte budget');
    return v;
  };
  const declaration = v => {
    node(v.node);
    if (!Array.isArray(v.capabilities) || !['browser', 'browser-selection-text-v1'].every(k => v.capabilities.includes(k)) ||
        !Array.isArray(v.resources) || !Array.isArray(v.entryResources) ||
        !v.resources.some(r => r.kind === 'browser' && r.access === 'use' && v.entryResources.includes(r.id)))
      throw Error('selection capability or entry browser/use missing');
    return v;
  };
  return { node, invocation, result, declaration };
}
