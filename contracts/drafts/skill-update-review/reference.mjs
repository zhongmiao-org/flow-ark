import { createHash } from "node:crypto";

export const LIMITS = Object.freeze({
  contentBytes: 1048576,
  reviewBytes: 4194304,
  depth: 32,
  values: 10000,
  fields: 256,
  lifetimeMs: 300000,
});
const fail = (message) => {
  throw Error(message);
};
const plain = (v) =>
  v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(v));
const unicode = (s) =>
  !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(
    s,
  );
export function assertBudget(
  value,
  max = LIMITS.contentBytes,
  maxDepth = LIMITS.depth,
  maxValues = LIMITS.values,
) {
  let count = 0;
  const seen = new Set();
  const visit = (v, d) => {
    if (++count > maxValues || d > maxDepth) fail("JSON structure limit");
    if (
      v === null ||
      typeof v === "boolean" ||
      (typeof v === "number" && Number.isFinite(v))
    )
      return;
    if (typeof v === "string") {
      if (!unicode(v)) fail("Invalid Unicode");
      return;
    }
    if ((!plain(v) && !Array.isArray(v)) || seen.has(v))
      fail("Not finite JSON");
    if (
      Array.isArray(v) &&
      (Object.keys(v).length !== v.length ||
        Object.keys(v).some((k, i) => k !== String(i)))
    )
      fail("Sparse or decorated array");
    seen.add(v);
    for (const key of Reflect.ownKeys(v)) {
      const descriptor = Object.getOwnPropertyDescriptor(v, key);
      if (
        typeof key !== "string" ||
        (!descriptor.enumerable && !(Array.isArray(v) && key === "length")) ||
        !Object.hasOwn(descriptor, "value")
      )
        fail("Not plain enumerable JSON");
    }
    for (const [k, child] of Object.entries(v)) {
      if (!unicode(k) || k.length > 1024) fail("JSON key limit");
      visit(child, d + 1);
    }
    seen.delete(v);
  };
  visit(value, 0);
  if (Buffer.byteLength(JSON.stringify(value), "utf8") > max)
    fail("JSON byte limit");
}
export function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  return (
    "{" +
    Object.keys(v)
      .sort()
      .map((k) => JSON.stringify(k) + ":" + canonical(v[k]))
      .join(",") +
    "}"
  );
}
export const digest = (value) =>
  createHash("sha256").update(canonical(value)).digest("hex");
const equal = (a, b) => canonical(a) === canonical(b);
// JSON wire values are trees, even when an in-memory caller reused an object.
const clone = (value) => JSON.parse(JSON.stringify(value));
const absent = () => ({ present: false });
const present = (value) => ({ present: true, value: clone(value) });
const at = (v, key) =>
  plain(v) && Object.hasOwn(v, key) ? present(v[key]) : absent();
function content(value) {
  assertBudget(value);
  if (
    !plain(value) ||
    Object.keys(value).sort().join(",") !== "data,markdown,title" ||
    typeof value.title !== "string" ||
    !value.title.trim() ||
    value.title.length > 200 ||
    typeof value.markdown !== "string" ||
    !value.markdown.trim() ||
    value.markdown.length > 60000 ||
    !plain(value.data)
  )
    fail("Skill content invalid");
  return value;
}

/** Pure projection only. Callers still own proposal/source/parent/workspace verification. */
export function compareContent(baseline, current, suggested) {
  [baseline, current, suggested].forEach(content);
  const fields = [];
  const add = (target, b, c, s) => {
    if (equal(b, c) && equal(b, s)) return;
    // Recurse only when all three values are present plain objects. Presence or
    // type changes and arrays remain one explicit atomic field, without index guessing.
    if (
      target.area === "data" &&
      b.present &&
      c.present &&
      s.present &&
      [b.value, c.value, s.value].every(plain)
    ) {
      const keys = [
        ...new Set([b.value, c.value, s.value].flatMap(Object.keys)),
      ].sort();
      if (keys.length) {
        for (const key of keys)
          add(
            { area: "data", path: [...target.path, key] },
            at(b.value, key),
            at(c.value, key),
            at(s.value, key),
          );
        return;
      }
    }
    const status = equal(b, s)
      ? "manual-only"
      : equal(c, s)
        ? "already-applied"
        : equal(b, c)
          ? "candidate"
          : "conflict";
    if (fields.length >= LIMITS.fields)
      fail("Field count limit; nothing was truncated");
    const body = { target, baseline: b, current: c, suggested: s, status };
    fields.push({ id: digest(body), ...body });
  };
  for (const area of ["title", "markdown"])
    add(
      { area, path: [] },
      present(baseline[area]),
      present(current[area]),
      present(suggested[area]),
    );
  for (const key of [
    ...new Set(
      [baseline.data, current.data, suggested.data].flatMap(Object.keys),
    ),
  ].sort())
    add(
      { area: "data", path: [key] },
      at(baseline.data, key),
      at(current.data, key),
      at(suggested.data, key),
    );
  return fields;
}
const id = (value) =>
  typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const sha = (value) =>
  typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
function strict(value, keys) {
  if (
    !plain(value) ||
    Object.keys(value).sort().join(",") !== [...keys].sort().join(",")
  )
    fail("Unexpected fields");
}
function context(value) {
  assertBudget(value, LIMITS.reviewBytes, 40, 40000);
  strict(value, [
    "proposalId",
    "revision",
    "epoch",
    "base",
    "baseline",
    "current",
    "suggested",
    "sourceSha256",
    "workspaceRevision",
  ]);
  strict(value.base, ["key", "versionId", "sha256"]);
  if (
    ![value.proposalId, value.epoch].every(id) ||
    typeof value.base.key !== "string" ||
    !/^[a-z][a-z0-9-]{0,63}$/.test(value.base.key) ||
    typeof value.base.versionId !== "string" ||
    !/^sv_[a-f0-9]{32}$/.test(value.base.versionId) ||
    !sha(value.base.sha256) ||
    !Number.isSafeInteger(value.revision) ||
    value.revision < 1 ||
    !sha(value.sourceSha256) ||
    !sha(value.workspaceRevision)
  )
    fail("Context identity invalid");
  [value.baseline, value.current, value.suggested].forEach(content);
}
export function createReview(value, reviewId, createdAt, expiresAt) {
  context(value);
  const start = Date.parse(createdAt),
    end = Date.parse(expiresAt);
  if (
    !id(reviewId) ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    new Date(start).toISOString() !== createdAt ||
    new Date(end).toISOString() !== expiresAt ||
    end <= start ||
    end - start > LIMITS.lifetimeMs
  )
    fail("Review time or identity invalid");
  const body = {
    version: 1,
    reviewId,
    proposalId: value.proposalId,
    revision: value.revision,
    epoch: value.epoch,
    base: clone(value.base),
    baselineSha256: digest(value.baseline),
    suggestionSha256: digest(value.suggested),
    currentSha256: digest(value.current),
    sourceSha256: value.sourceSha256,
    workspaceRevision: value.workspaceRevision,
    createdAt,
    expiresAt,
    fields: compareContent(value.baseline, value.current, value.suggested),
  };
  const result = { ...body, sha256: digest(body) };
  assertBudget(result, LIMITS.reviewBytes, 40, 40000);
  return result;
}
export function assertCurrent(review, value, time) {
  assertBudget(review, LIMITS.reviewBytes, 40, 40000);
  context(value);
  if (
    !Number.isFinite(time) ||
    time < Date.parse(review.createdAt) ||
    time >= Date.parse(review.expiresAt)
  )
    fail("Review expired or clock moved backwards");
  const expected = createReview(
    value,
    review.reviewId,
    review.createdAt,
    review.expiresAt,
  );
  if (!equal(expected, review)) fail("Review or context changed");
}
function replace(result, target, state) {
  if (target.area !== "data") {
    if (!state.present || typeof state.value !== "string")
      fail("Required text cannot be removed");
    result[target.area] = state.value;
    return;
  }
  let owner = result.data;
  for (const key of target.path.slice(0, -1)) {
    if (!plain(owner) || !Object.hasOwn(owner, key) || !plain(owner[key]))
      fail("Parent path changed");
    owner = owner[key];
  }
  const key = target.path.at(-1);
  if (state.present)
    Object.defineProperty(owner, key, {
      value: clone(state.value),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  else delete owner[key];
}
function confirmation(input) {
  assertBudget(input, LIMITS.reviewBytes);
  strict(input, [
    "version",
    "proposalId",
    "revision",
    "reviewId",
    "reviewSha256",
    "requestId",
    "choices",
    "reviewed",
  ]);
  if (
    input.version !== 1 ||
    input.reviewed !== true ||
    !id(input.requestId) ||
    !id(input.proposalId) ||
    !id(input.reviewId) ||
    !sha(input.reviewSha256) ||
    !Number.isSafeInteger(input.revision) ||
    input.revision < 1 ||
    !Array.isArray(input.choices) ||
    input.choices.length > LIMITS.fields
  )
    fail("Confirmation identity invalid");
  const seen = new Set();
  for (const choice of input.choices) {
    strict(choice, ["fieldId", "replaceManual"]);
    if (
      !sha(choice.fieldId) ||
      typeof choice.replaceManual !== "boolean" ||
      seen.has(choice.fieldId)
    )
      fail("Duplicate or invalid field choice");
    seen.add(choice.fieldId);
  }
}
/** Apply only caller-selected host-generated fields to a clone of CURRENT manual content. */
export function applyReview(input, review, value, time) {
  confirmation(input);
  if (
    input.proposalId !== review.proposalId ||
    input.revision !== review.revision ||
    input.reviewId !== review.reviewId ||
    input.reviewSha256 !== review.sha256
  )
    fail("Confirmation identity changed");
  assertCurrent(review, value, time);
  const seen = new Set(),
    result = clone(value.current);
  for (const choice of input.choices) {
    seen.add(choice.fieldId);
    const field = review.fields.find((f) => f.id === choice.fieldId);
    if (!field || !["candidate", "conflict"].includes(field.status))
      fail("Field is not selectable");
    if (choice.replaceManual !== (field.status === "conflict"))
      fail("Manual replacement not explicitly matched");
    replace(result, field.target, field.suggested);
  }
  content(result);
  return {
    content: result,
    changed: !equal(result, value.current),
    contentSha256: digest(result),
    appliedFieldIds: [...seen],
  };
}

/** Pure transaction projection. Only a host's successful atomic commit makes a receipt authoritative. */
export function projectApplication(input, review, value, time) {
  const result = applyReview(input, review, value, time);
  const revisionAfter = value.revision + (result.changed ? 1 : 0);
  if (!Number.isSafeInteger(revisionAfter)) fail("Revision exhausted");
  return {
    ...result,
    receipt: {
      version: 1,
      proposalId: input.proposalId,
      requestId: input.requestId,
      confirmationSha256: digest(input),
      reviewSha256: review.sha256,
      revisionBefore: value.revision,
      revisionAfter,
      contentSha256: result.contentSha256,
      changed: result.changed,
    },
  };
}

/** Host must look up a trustworthy committed receipt by proposal/request FIRST, before expiry/current checks. */
export function matchCommittedReceipt(input, receipt) {
  confirmation(input);
  assertBudget(receipt);
  strict(receipt, [
    "version",
    "proposalId",
    "requestId",
    "confirmationSha256",
    "reviewSha256",
    "revisionBefore",
    "revisionAfter",
    "contentSha256",
    "changed",
  ]);
  if (
    receipt.version !== 1 ||
    typeof receipt.changed !== "boolean" ||
    !Number.isSafeInteger(receipt.revisionBefore) ||
    receipt.revisionBefore < 1 ||
    !Number.isSafeInteger(receipt.revisionAfter) ||
    receipt.revisionAfter < 1 ||
    receipt.revisionAfter !==
      receipt.revisionBefore + (receipt.changed ? 1 : 0) ||
    receipt.proposalId !== input.proposalId ||
    receipt.requestId !== input.requestId ||
    receipt.confirmationSha256 !== digest(input) ||
    receipt.reviewSha256 !== input.reviewSha256 ||
    receipt.revisionBefore !== input.revision ||
    !sha(receipt.contentSha256)
  )
    fail("Committed receipt does not match confirmation");
  return clone(receipt);
}
