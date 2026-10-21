/** Unpublished input capture. Domains are not permissions or retention reservations. */
import { createHash } from "node:crypto";
import { types } from "node:util";
import { canonical, LIMITS } from "../../v0.51.0/result-retention.mjs";
import { BoundaryError, measureValue } from "./schema-bounds.mjs";

// Preflight limits, separate from the unchanged 8MiB value/retention policy.
export const CAPTURE_LIMITS = Object.freeze({
  bytes: LIMITS.workBytes,
  valueNodes: 16 * LIMITS.visits,
  workBytes: 4 * LIMITS.workBytes,
});
const fail = (path, message) => {
  throw new BoundaryError("limit", path, message);
};
const pointer = (s) => s.replace(/~/g, "~0").replace(/\//g, "~1");
function freeze(v) {
  if (v && typeof v === "object") {
    Object.values(v).forEach(freeze);
    Object.freeze(v);
  }
  return v;
}
function entries(v, path) {
  if (types.isProxy(v)) fail(path, "输入不能包含可执行代理");
  if (Array.isArray(v)) {
    if (
      Object.getPrototypeOf(v) !== Array.prototype ||
      v.length > LIMITS.visits ||
      Reflect.ownKeys(v).length !== v.length + 1
    )
      fail(path, "输入数组不是普通稠密数据");
    return Array.from({ length: v.length }, (_, i) => {
      const d = Object.getOwnPropertyDescriptor(v, String(i));
      if (!d?.enumerable || !Object.hasOwn(d, "value"))
        fail(path, "输入数组不能含空项或访问器");
      return [String(i), d.value];
    });
  }
  if (Object.getPrototypeOf(v) !== Object.prototype)
    fail(path, "输入记录必须是普通JSON数据");
  const keys = Reflect.ownKeys(v);
  if (keys.length > LIMITS.visits) fail(path, "输入记录成员过多");
  return keys.map((key) => {
    const d = Object.getOwnPropertyDescriptor(v, key);
    if (typeof key !== "string" || !d?.enumerable || !Object.hasOwn(d, "value"))
      fail(path, "输入记录不能含符号、隐藏成员或访问器");
    return [key, d.value];
  });
}
// No executable adapter may change a body between measurement and its owned canonical copy.
function payloadData(value, path) {
  let nodes = 0;
  const active = new Set();
  function visit(v, depth) {
    if (++nodes > LIMITS.visits || depth > LIMITS.jsonDepth)
      fail(path, "完整正文结构超限");
    if (types.isProxy(v)) fail(path, "完整正文不能包含可执行代理");
    if (v === null || typeof v !== "object") return;
    if (active.has(v)) fail(path, "完整正文不能循环引用");
    active.add(v);
    try {
      for (const [, child] of entries(v, path)) visit(child, depth + 1);
    } finally {
      active.delete(v);
    }
  }
  visit(value, 0);
}
function capture(input, domain, bodyAt) {
  const active = new Set();
  const stats = { bodies: 0, bytes: 0, valueNodes: 0, workBytes: 0 };
  let controls = 0;
  let metadataBytes = 0,
    metadataWorkBytes = 0;
  // Charge emitted metadata tokens before retaining subsequent branches, not just at the end.
  function reserveMetadata(bytes, depth) {
    metadataBytes += bytes;
    metadataWorkBytes += bytes * (depth + 1);
    if (
      !Number.isSafeInteger(metadataWorkBytes) ||
      metadataBytes > LIMITS.value ||
      metadataWorkBytes > LIMITS.workBytes
    )
      fail("", "输入管理字段总量超过固定限额");
  }
  function visit(v, path, depth) {
    if (types.isProxy(v)) fail(path, "输入不能包含可执行代理");
    if (++controls > LIMITS.visits || depth > LIMITS.jsonDepth)
      fail(path, "输入控制结构超限");
    if (bodyAt(path)) {
      // JSON string containing "sha256:" and 64 hex digits.
      reserveMetadata(73, depth);
      payloadData(v, path);
      const measured = measureValue(v);
      for (const [key, limit] of Object.entries(CAPTURE_LIMITS)) {
        const metric = key === "bytes" ? "canonicalBytes" : key;
        stats[key] += measured[metric];
        if (!Number.isSafeInteger(stats[key]) || stats[key] > limit)
          fail(path, "输入准备总量超过固定限额");
      }
      stats.bodies++;
      const text = canonical(v);
      const sha = createHash("sha256").update(text, "utf8").digest("hex");
      return { value: freeze(JSON.parse(text)), manifest: "sha256:" + sha };
    }
    if (v === null || typeof v !== "object") {
      const text = canonical(v);
      reserveMetadata(Buffer.byteLength(text, "utf8"), depth);
      const value = JSON.parse(text);
      return { value, manifest: value };
    }
    if (active.has(v)) fail(path, "输入控制结构不能循环引用");
    active.add(v);
    try {
      const members = entries(v, path);
      reserveMetadata(2 + Math.max(0, members.length - 1), depth);
      if (!Array.isArray(v))
        for (const [key] of members)
          reserveMetadata(
            Buffer.byteLength(JSON.stringify(key), "utf8") + 1,
            depth,
          );
      const captured = members.map(([key, value]) => [
        key,
        visit(value, path + "/" + pointer(key), depth + 1),
      ]);
      return Array.isArray(v)
        ? {
            value: captured.map(([, c]) => c.value),
            manifest: captured.map(([, c]) => c.manifest),
          }
        : {
            value: Object.fromEntries(captured.map(([k, c]) => [k, c.value])),
            manifest: Object.fromEntries(
              captured.map(([k, c]) => [k, c.manifest]),
            ),
          };
    } finally {
      active.delete(v);
    }
  }
  const result = visit(input, "", 0);
  // This checks only the administrative structure. Payloads kept their independent limits.
  const metadata = measureValue(result.manifest);
  const fingerprint = createHash("sha256")
    .update("flowark-input-domains-v1\0" + domain + "\0", "utf8")
    .update(canonical(result.manifest), "utf8")
    .digest("hex");
  return Object.freeze({
    value: freeze(result.value),
    fingerprint,
    stats: Object.freeze({ ...stats, metadataBytes: metadata.canonicalBytes }),
  });
}
export function captureProducerSchemas(input) {
  if (types.isProxy(input)) fail("", "生产者结构清单不能使用可执行代理");
  if (!input || Array.isArray(input) || typeof input !== "object")
    fail("", "生产者结构清单须为对象");
  return capture(input, "producer-schemas", (path) => /^\/[^/]+$/u.test(path));
}
export function captureJointPlan(input) {
  return capture(
    input,
    "joint-plan",
    (path) =>
      path === "/completion/flow" ||
      path === "/completion/parameters" ||
      /^\/completion\/producerSchemas\/[^/]+$/u.test(path) ||
      /^\/(?:pending\/[0-9]+|proposed)\/(?:results\/[0-9]+\/output|copies\/[0-9]+\/stages\/[0-9]+)\/(?:value|schema)$/u.test(
        path,
      ),
  );
}
export function captureProposal(input) {
  return capture(
    input,
    "ledger-proposal",
    (path) => path === "/values" || /^\/copies\/[0-9]+\/value$/u.test(path),
  );
}
export function captureActualCopies(input) {
  if (types.isProxy(input)) fail("", "实际副本清单不能使用可执行代理");
  if (!Array.isArray(input) || input.length > 8192)
    fail("", "实际副本清单必须是有界数组");
  return capture(input, "actual-copies", (path) =>
    /^\/[0-9]+\/value$/u.test(path),
  );
}
