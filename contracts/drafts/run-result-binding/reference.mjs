/** Pure relationships only. Does not prove host privacy, ownership, TTL, storage or current grants. */
import { canonical, digest, bytes, seal, verify } from '../../v0.41.0/entry-result-view.mjs';
export function verifyReference(ref, owner, resource) {
  if (resource.kind !== 'run-result' || resource.access !== 'read' ||
      !resource.sourceEntries.includes(ref.source.entryId)) throw Error('resource scope');
  const source = ref.source;
  if (source.kind === 'template' ? owner.kind !== 'instance' || owner.id !== source.instanceId :
      owner.kind !== 'author-draft' || owner.id !== source.draftId) throw Error('owner mismatch');
  // Reuse the sealed wire source relationships without claiming an actual historical read.
  const run = { ...ref.run, state: 'SUCCEEDED' };
  verify(seal({ formatVersion: '1.0', run, viewStatus: 'missing', source }), run, source);
  return ref;
}
export function verifyRead(value, owner, resource) {
  verifyReference(value.ref, owner, resource);
  if (value.binding !== resource.id || bytes(value.value) > 196608 ||
      value.ref.dataBytes !== bytes(value.value) || value.ref.dataSha256 !== digest(value.value))
    throw Error('read data mismatch');
  if (bytes(value) > 524288) throw Error('read response budget');
  return value;
}
export function verifyCursor(cursor, expected) {
  if (cursor.targetSha256 !== expected.targetSha256 || cursor.binding !== expected.binding ||
      cursor.querySha256 !== expected.querySha256 || cursor.ceiling !== expected.ceiling ||
      cursor.before > cursor.ceiling + 1) throw Error('cursor scope');
  return cursor;
}
export { canonical, digest, bytes };
