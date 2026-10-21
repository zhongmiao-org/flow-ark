/** Unpublished scoped input readers/writers. Persistent layout stays unchanged; no host authority. */
import { canonical, merge, LIMITS } from "../../v0.51.0/result-retention.mjs";
import { inspectLedger, rawCharge } from "../../v0.51.0/result-ledger.mjs";
import { captureActualCopies, captureProposal } from "./input-domains.mjs";

const copy = (value) => JSON.parse(canonical(value));
const key = (row) => row.family + ":" + row.id;
const fail = (reason) => {
  throw Error(reason);
};
const types = new Set([
  "document",
  "skill",
  "context",
  "conversation",
  "browser",
  "run-result",
  "source",
  "source-reduce",
  "effect",
]);
const hash = (v) => typeof v === "string" && /^[a-f0-9]{64}$/.test(v);
// Only called on owned input from a fixed capture grammar. Do not canonicalize a composite body.
function fields(value, expected) {
  if (
    !value ||
    Array.isArray(value) ||
    typeof value !== "object" ||
    Object.keys(value).sort().join("\0") !== [...expected].sort().join("\0")
  )
    fail("scoped ledger fields");
}
function text(value, max, empty = false) {
  if (
    typeof value !== "string" ||
    (!empty && !value) ||
    [...value].length > max ||
    [...value].some((c) => {
      const n = c.codePointAt(0);
      return n >= 0xd800 && n <= 0xdfff;
    })
  )
    fail("scoped ledger text");
}
function meta(row) {
  fields(row, [
    "id",
    "nodeId",
    "nodeInstance",
    "type",
    "label",
    "bytes",
    "sha256",
  ]);
  text(row.nodeId, 1000);
  text(row.nodeInstance, 4000);
  text(row.label, 2000, true);
  if (
    !hash(row.id) ||
    !hash(row.sha256) ||
    !types.has(row.type) ||
    !Number.isSafeInteger(row.bytes) ||
    row.bytes < 1 ||
    row.bytes > LIMITS.value
  )
    fail("scoped ledger result metadata");
}

/** Exact charge matching, with each actual body captured in its own unchanged value domain. */
export function verifyScopedCopies(ledgerInput, expectedOwner, input) {
  const ledger = copy(ledgerInput),
    owner = copy(expectedOwner);
  const capacity = inspectLedger(ledger, owner);
  const captured = captureActualCopies(input),
    actual = captured.value;
  if (actual.length !== ledger.copies.length) fail("actual copy inventory");
  const expected = new Map(ledger.copies.map((r) => [key(r), r])),
    seen = new Set();
  for (const row of actual) {
    fields(row, ["family", "id", "value"]);
    const charge = rawCharge(row.family, row.id, row.value),
      id = key(charge);
    if (
      seen.has(id) ||
      !expected.has(id) ||
      canonical(charge) !== canonical(expected.get(id))
    )
      fail("actual retained copy changed or missing");
    seen.add(id);
  }
  return Object.freeze({
    capacity: Object.freeze(capacity),
    actual,
    fingerprint: captured.fingerprint,
    stats: captured.stats,
  });
}

/** Pure proposal, not persistence: roots, CAS bodies and revision still require one host transaction. */
export function proposeScoped(
  ledgerInput,
  expectedOwner,
  expectedRevision,
  input,
) {
  const ledger = copy(ledgerInput),
    owner = copy(expectedOwner);
  inspectLedger(ledger, owner);
  const change = captureProposal(input).value;
  fields(change, ["values", "results", "copies"]);
  if (
    ledger.revision !== expectedRevision ||
    expectedRevision >= Number.MAX_SAFE_INTEGER - 1 ||
    !Array.isArray(change.results) ||
    change.results.length > LIMITS.roots ||
    !Array.isArray(change.copies) ||
    change.copies.length > 8192
  )
    fail("ledger revision or proposal");
  const values =
    change.values === null
      ? ledger.values
      : merge(ledger.values, change.values);
  const results = [...ledger.results],
    entries = new Map(results.map((r) => [r.id, r]));
  for (const row of change.results) {
    meta(row);
    const old = entries.get(row.id);
    if (old && canonical(old) !== canonical(row))
      fail("logical metadata identity conflict");
    if (!old) {
      const owned = copy(row);
      results.push(owned);
      entries.set(row.id, owned);
    }
  }
  const copies = new Map(ledger.copies.map((r) => [key(r), r])),
    changed = new Set();
  for (const row of change.copies) {
    fields(row, ["family", "id", "before", "value"]);
    const charge = rawCharge(row.family, row.id, row.value),
      id = key(charge),
      old = copies.get(id);
    if (
      changed.has(id) ||
      (old ? old.sha256 !== row.before : row.before !== null)
    )
      fail("raw copy compare-and-swap conflict");
    changed.add(id);
    copies.set(id, charge);
  }
  const result = {
    ...ledger,
    revision: ledger.revision + 1,
    values,
    results,
    copies: [...copies.values()].sort((a, b) =>
      key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0,
    ),
  };
  if (canonical({ ...result, revision: ledger.revision }) === canonical(ledger))
    return ledger;
  inspectLedger(result, owner);
  return copy(result);
}
