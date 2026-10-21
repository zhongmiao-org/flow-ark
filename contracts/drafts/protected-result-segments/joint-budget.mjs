/** Unpublished host-side accounting reference. Does not acquire or release a reservation. */
import {
  canonical,
  digest,
  encode,
  inspect,
  merge,
  read,
  LIMITS,
} from "../../v0.51.0/result-retention.mjs";
import { verifyCopies } from "../../v0.51.0/result-ledger.mjs";
import { BoundaryError, measureValue } from "./schema-bounds.mjs";
import { compileOutputValidation } from "./output-validation.mjs";
import { compileCompletionBoundary } from "./completion-bounds.mjs";
import { envelopeOfBoundary } from "./storage-envelope.mjs";

const H = "0".repeat(64);
const INDEX = "run-result-copy-index";
const byKey = Object.freeze({
  "template-result": "entry-result",
  "author-sdk-result": "entry-result",
  "entry-result-display": "entry-display",
  "run-result-reuse": "entry-reuse",
  "typed-run-index": "typed-result-index",
  output: "run-output",
});
const byBody = Object.freeze({
  "template-data-operation": "state-operation",
  "template-effect": "effect-operation",
  "mcp-effect": "effect-operation",
  "desktop-effect": "effect-operation",
  "typed-run-result": "typed-result-record",
  "browser-fields-input": "browser-input-proof",
  "browser-scroll-input": "browser-input-proof",
  "document-source-proof": "document-source-proof",
  "@ai-event": "ai-receipt",
});
const resultTypes = new Set([
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
const fail = (code, path, message) => {
  throw new BoundaryError(code, path, message);
};
const copy = (v) => JSON.parse(canonical(v));
const refKey = (v) => v.family + ":" + v.id;
const checked = (n) => {
  if (!Number.isSafeInteger(n) || n < 0) fail("limit", "#", "联合预算运算超限");
  return n;
};
function fields(v, names, path) {
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).sort().join("\0") !== [...names].sort().join("\0")
  )
    fail("invalid", path, "联合预算字段不完整或包含未声明字段");
}
function text(v, max, empty = false) {
  if (
    typeof v !== "string" ||
    (!empty && !v) ||
    [...v].length > max ||
    [...v].some((c) => {
      const n = c.codePointAt(0);
      return n >= 0xd800 && n <= 0xdfff;
    })
  )
    fail("invalid", "#", "预算来源或结果标识无效");
}
function inventoryRows(input) {
  if (
    !Array.isArray(input) ||
    Object.getPrototypeOf(input) !== Array.prototype ||
    input.length > 8192 ||
    Reflect.ownKeys(input).length !== input.length + 1
  )
    fail("invalid", "#/actualCopies", "实际副本清单必须是有界普通稠密数组");
  const rows = [];
  for (let i = 0; i < input.length; i++) {
    const d = Object.getOwnPropertyDescriptor(input, String(i));
    if (!d?.enumerable || !Object.hasOwn(d, "value"))
      fail("invalid", "#/actualCopies", "实际副本清单不能包含访问器或空项");
    rows.push(d.value);
  }
  return rows;
}
function ref(runId, kind, key) {
  const family =
    typeof kind !== "string"
      ? undefined
      : kind === INDEX
        ? "typed-result-index"
        : Object.hasOwn(byKey, kind)
          ? byKey[kind]
          : Object.hasOwn(byBody, kind)
            ? byBody[kind]
            : undefined;
  if (!family || typeof key !== "string" || !key || key.length > 4096)
    fail("unsupported", "#/copies", "副本来源不属于固定保存布局");
  if ((Object.hasOwn(byKey, kind) || kind === INDEX) && key !== runId)
    fail("mismatch", "#/copies", "按运行索引的副本跨越拥有者");
  return {
    family,
    kind,
    key,
    id: digest({ version: 1, runId, family, kind, key }),
  };
}
const edgeCount = (set) =>
  set.cells.reduce(
    (n, { cell }) =>
      n +
      (cell.kind === "members"
        ? cell.entries.length * 2
        : cell.kind === "text"
          ? 1
          : (cell.parts?.length ?? 0)),
    0,
  );

/** All inputs require an authenticated, stable host view. They do not prove their own provenance. */
export function compileJointBudget(
  ledgerInput,
  expectedOwner,
  actualInput,
  planInput,
) {
  const ledger = copy(ledgerInput),
    owner = copy(expectedOwner),
    plan = copy(planInput);
  const rows = inventoryRows(actualInput);
  const baseline = verifyCopies(ledger, owner, rows);
  // Each existing ActualCopy has its own published codec scope; do not re-wrap all bodies.
  const actual = rows.map(copy);
  for (const root of ledger.values.roots)
    read(ledger.values, owner.runId, root.resultId);
  fields(plan, ["pending", "proposed", "completion"], "#");
  fields(plan.completion, ["flow", "producerSchemas"], "#/completion");
  if (!Array.isArray(plan.pending) || plan.pending.length > 1000)
    fail("invalid", "#/pending", "未消费预留清单必须有界且完整");
  if (plan.completion.flow?.id !== owner.flowId)
    fail("mismatch", "#/completion", "完整流程与目录拥有者不一致");
  const schemaCache = new Map();
  function validator(schema) {
    const key = digest(schema);
    if (!schemaCache.has(key))
      schemaCache.set(key, compileOutputValidation(schema));
    return schemaCache.get(key);
  }
  for (const schema of Object.values(plan.completion.producerSchemas ?? {}))
    validator(schema);
  const completion = compileCompletionBoundary(
    plan.completion.flow,
    plan.completion.producerSchemas,
  );
  const nodes = new Map();
  function walk(steps) {
    for (const n of steps) {
      nodes.set(n.id, n);
      if (n.type === "condition") {
        walk(n.then);
        walk(n.else);
      }
      if (n.type === "loop") walk(n.body);
    }
  }
  walk(plan.completion.flow.steps);
  const actualMap = new Map(actual.map((v) => [refKey(v), v]));
  const sourceIndex = ref(owner.runId, INDEX, owner.runId);
  const oldIndex = actualMap.get(refKey(sourceIndex));
  const refs = new Map();
  if (oldIndex) {
    fields(oldIndex.value, ["version", "owner", "refs"], "#/sources");
    if (
      oldIndex.value.version !== 1 ||
      canonical(oldIndex.value.owner) !== canonical(owner) ||
      !Array.isArray(oldIndex.value.refs) ||
      oldIndex.value.refs.length > 8191
    )
      fail("mismatch", "#/sources", "原来源索引不符");
    let previous = "";
    for (const r of oldIndex.value.refs) {
      fields(r, ["family", "kind", "key", "id"], "#/sources");
      const expected = ref(owner.runId, r.kind, r.key),
        k = refKey(r);
      if (
        r.kind === INDEX ||
        canonical(r) !== canonical(expected) ||
        k <= previous ||
        !actualMap.has(k)
      )
        fail("mismatch", "#/sources", "原来源索引缺失、重复或不符");
      previous = k;
      refs.set(k, r);
    }
    if (refs.size + 1 !== actual.length)
      fail("mismatch", "#/sources", "实际副本未完整列入来源索引");
  } else if (actual.length || ledger.results.length || ledger.revision !== 0)
    fail("mismatch", "#/sources", "非初始目录缺少来源索引");
  for (const r of refs.values()) {
    const body = actualMap.get(refKey(r)).value;
    if (
      Object.hasOwn(byBody, r.kind) &&
      (!body ||
        typeof body !== "object" ||
        !Object.hasOwn(body, "runId") ||
        body.runId !== owner.runId)
    )
      fail("mismatch", "#/sources", "实际副本拥有者不一致");
    if (
      r.kind === "@ai-event" &&
      (body.type !== "ai-outcome" ||
        !Number.isSafeInteger(body.sequence) ||
        body.sequence < 1 ||
        String(body.sequence) !== r.key)
    )
      fail("mismatch", "#/sources", "模型副本不属于原事件身份");
  }
  const mirrors = [...refs.values()].filter(
    (r) => r.kind === "typed-run-index",
  );
  if (
    mirrors.length > 1 ||
    (ledger.results.length && mirrors.length !== 1) ||
    (mirrors.length &&
      canonical(actualMap.get(refKey(mirrors[0])).value) !==
        canonical({ entries: ledger.results }))
  )
    fail("mismatch", "#/sources", "原逻辑结果镜像不完整");
  const oldWrappers = [...refs.values()].filter(
    (r) => r.kind === "typed-run-result",
  );
  if (oldWrappers.length !== ledger.results.length)
    fail("mismatch", "#/sources", "原结果包装清单不符");
  for (const meta of ledger.results) {
    if (
      meta.id !==
        digest({
          runId: owner.runId,
          nodeId: meta.nodeId,
          nodeInstance: meta.nodeInstance,
          type: meta.type,
        }) ||
      nodes.get(meta.nodeId)?.type !== meta.type ||
      !(
        meta.nodeInstance === meta.nodeId ||
        meta.nodeInstance.endsWith("/" + meta.nodeId)
      )
    )
      fail("mismatch", "#/sources", "原逻辑结果不属于固定流程实例");
    const r = ref(owner.runId, "typed-run-result", meta.id);
    if (
      !refs.has(refKey(r)) ||
      canonical(actualMap.get(refKey(r)).value) !==
        canonical({
          runId: owner.runId,
          meta,
          retention: "run-owned-results-v1",
        })
    )
      fail("mismatch", "#/sources", "原完整结果包装不符");
  }
  const maxima = new Map(
    ledger.copies.map((c) => [
      refKey(c),
      { family: c.family, id: c.id, bytes: c.bytes },
    ]),
  );
  let copyShape = true;
  const frameBases = new Map();
  const boundCopy = (r, boundary) => {
    if (!frameBases.has(r.family))
      frameBases.set(
        r.family,
        measureValue({ family: r.family, id: H, value: null }),
      );
    const frame = frameBases.get(r.family),
      b = boundary.canonicalBytes;
    copyShape &&=
      frame.canonicalBytes + b - 4 <= LIMITS.value &&
      frame.valueNodes + boundary.valueNodes - 1 <= LIMITS.visits &&
      boundary.depth + 1 <= LIMITS.jsonDepth &&
      frame.workBytes + boundary.workBytes + b - 8 <= LIMITS.workBytes;
    const k = refKey(r),
      old = maxima.get(k);
    const oldRef = refs.get(k);
    if (
      (oldRef && canonical(oldRef) !== canonical(r)) ||
      (r.kind !== INDEX && k === refKey(sourceIndex))
    )
      fail("mismatch", "#/copies", "副本摘要对应不同来源");
    maxima.set(k, {
      family: r.family,
      id: r.id,
      bytes: Math.max(old?.bytes ?? 0, b),
    });
    if (r.kind !== INDEX) refs.set(k, r);
  };
  const knownCopy = (kind, key, value) =>
    boundCopy(ref(owner.runId, kind, key), measureValue(value));
  function valueBoundary(source) {
    if (source?.kind === "known") {
      fields(source, ["kind", "value"], "#/output");
      return measureValue(source.value);
    }
    fields(source, ["kind", "schema"], "#/output");
    if (source.kind !== "schema")
      fail("unsupported", "#/output", "结果必须来自完整值或固定结构");
    return validator(source.schema).certificate;
  }
  function scopedSource(r, source) {
    const boundary = valueBoundary(source);
    if (Object.hasOwn(byBody, r.kind)) {
      if (source.kind === "known") {
        if (
          !source.value ||
          typeof source.value !== "object" ||
          !Object.hasOwn(source.value, "runId") ||
          source.value.runId !== owner.runId
        )
          fail("mismatch", "#/copies", "未来副本拥有者不一致");
      } else if (
        source.schema?.type !== "object" ||
        !source.schema.required?.includes("runId") ||
        source.schema.properties?.runId?.const !== owner.runId
      )
        fail("unsupported", "#/copies", "未来副本结构必须固定原运行身份");
    }
    if (r.kind === "@ai-event") {
      const n = Number(r.key);
      const body = source.kind === "known" ? source.value : null;
      if (
        !Number.isSafeInteger(n) ||
        n < 1 ||
        String(n) !== r.key ||
        (body
          ? body.sequence !== n || body.type !== "ai-outcome"
          : source.schema.properties?.sequence?.const !== n ||
            source.schema.properties?.type?.const !== "ai-outcome" ||
            !source.schema.required?.includes("sequence") ||
            !source.schema.required?.includes("type"))
      )
        fail("unsupported", "#/copies", "模型副本必须固定实际事件身份");
    }
    boundCopy(r, boundary);
  }
  const metadata = [...ledger.results],
    ids = new Set(metadata.map((m) => m.id));
  let values = ledger.values,
    unknownCells = 0,
    unknownRows = 0,
    unknownNodes = 0,
    unknownRefs = 0;
  let futureCommits = completion.maxNodeExecutions + 3;
  const envelopes = [];
  for (const block of [...plan.pending, plan.proposed]) {
    fields(block, ["results", "copies"], "#/segments");
    if (
      !Array.isArray(block.results) ||
      block.results.length > 1000 ||
      !Array.isArray(block.copies) ||
      block.copies.length > 8191
    )
      fail("limit", "#/segments", "预留结果与副本清单超限");
    for (const result of block.results) {
      fields(
        result,
        ["nodeId", "nodeInstance", "type", "label", "output"],
        "#/results",
      );
      text(result.nodeId, 1000);
      text(result.nodeInstance, 4000);
      text(result.label, 2000, true);
      if (
        !resultTypes.has(result.type) ||
        nodes.get(result.nodeId)?.type !== result.type ||
        !(
          result.nodeInstance === result.nodeId ||
          result.nodeInstance.endsWith("/" + result.nodeId)
        )
      )
        fail("mismatch", "#/results", "结果身份不属于完整固定流程");
      const id = digest({
        runId: owner.runId,
        nodeId: result.nodeId,
        nodeInstance: result.nodeInstance,
        type: result.type,
      });
      if (ids.has(id))
        fail("mismatch", "#/results", "未消费预留重复或包含已保存结果");
      ids.add(id);
      const producer = plan.completion.producerSchemas[result.nodeId];
      if (!producer)
        fail("unbounded", "#/results", "结果缺少同一生产者的固定结构");
      if (result.output?.kind === "known")
        validator(producer).verify(result.output.value);
      else if (canonical(result.output?.schema) !== canonical(producer))
        fail("mismatch", "#/results", "结果结构不能缩小完整生产者声明");
      const boundary = valueBoundary(result.output);
      futureCommits += 2;
      const meta = {
        id,
        nodeId: result.nodeId,
        nodeInstance: result.nodeInstance,
        type: result.type,
        label: result.label,
        bytes: boundary.canonicalBytes,
        sha256:
          result.output.kind === "known" ? digest(result.output.value) : H,
      };
      metadata.push(meta);
      if (result.output.kind === "known")
        values = merge(values, encode(result.output.value, owner.runId, id));
      else {
        const e = envelopeOfBoundary(boundary);
        envelopes.push(e);
        unknownCells += e.cells;
        unknownRows += e.cellRowsBytes;
        unknownNodes += e.catalogNodes;
        unknownRefs += e.references;
      }
      // Private synthetic metadata gives a byte upper bound, never a claimed saved value.
      knownCopy("typed-run-result", id, {
        runId: owner.runId,
        meta,
        retention: "run-owned-results-v1",
      });
    }
    for (const source of block.copies) {
      fields(source, ["kind", "key", "stages"], "#/copies");
      if (
        [INDEX, "typed-run-index", "typed-run-result", "output"].includes(
          source.kind,
        )
      )
        fail(
          "invalid",
          "#/copies",
          "系统索引、包装与整体输出由完整计划自动计量",
        );
      if (
        !Array.isArray(source.stages) ||
        !source.stages.length ||
        source.stages.length > 1000
      )
        fail("invalid", "#/copies", "副本阶段必须非空且有界");
      futureCommits += source.stages.length;
      const r = ref(owner.runId, source.kind, source.key);
      for (const stage of source.stages) scopedSource(r, stage);
    }
  }
  if (metadata.length)
    knownCopy("typed-run-index", owner.runId, { entries: metadata });
  // This reservation is Run-wide. Segment completion must not release it.
  boundCopy(ref(owner.runId, "output", owner.runId), completion.aggregate);
  const ordered = [...refs.values()].sort((a, b) =>
    refKey(a) < refKey(b) ? -1 : 1,
  );
  knownCopy(INDEX, owner.runId, { version: 1, owner, refs: ordered });
  const skeleton = {
    ...ledger,
    revision: Number.MAX_SAFE_INTEGER - 1,
    values: copy(values),
    results: metadata,
    copies: [...maxima.values()]
      .sort((a, b) => (refKey(a) < refKey(b) ? -1 : 1))
      .map((c) => ({ ...c, sha256: H })),
  };
  const knownIds = new Set(skeleton.values.roots.map((r) => r.resultId));
  for (const m of metadata)
    if (!knownIds.has(m.id))
      skeleton.values.roots.push({
        resultId: m.id,
        root: H,
        sha256: H,
        bytes: m.bytes,
      });
  skeleton.values.roots.sort((a, b) => (a.resultId < b.resultId ? -1 : 1));
  const measured = measureValue(skeleton),
    valueInfo = inspect(values, owner.runId);
  const catalogBytes = checked(measured.canonicalBytes + unknownRows);
  const copyBytes = checked(
    [...maxima.values()].reduce((n, c) => n + c.bytes, 0),
  );
  const catalogNodes = checked(measured.valueNodes + unknownNodes);
  const catalogDepth = Math.max(measured.depth, unknownCells ? 7 : 0);
  const catalogWorkBytes = checked(
    measured.workBytes + unknownRows * (catalogDepth + 1),
  );
  const limits = {
    revision:
      Number.isSafeInteger(ledger.revision + futureCommits) &&
      ledger.revision + futureCommits < Number.MAX_SAFE_INTEGER,
    results: metadata.length <= LIMITS.roots,
    copies: maxima.size <= 8192 && ordered.length <= 8191,
    copyShape,
    cells: checked(valueInfo.cells + unknownCells) <= LIMITS.cells,
    graphEdges:
      checked(edgeCount(values) + unknownRefs) <=
      LIMITS.cells * LIMITS.fanout * 2,
    reconstruction: envelopes.every(
      (e) =>
        e.graphDepth <= LIMITS.graphDepth &&
        e.reconstructionWorkBytes <= LIMITS.workBytes,
    ),
    catalogNodes: catalogNodes <= LIMITS.visits,
    catalogDepth: catalogDepth <= LIMITS.jsonDepth,
    catalogWork: catalogWorkBytes <= LIMITS.workBytes,
    retainedBytes: checked(catalogBytes + copyBytes) <= LIMITS.retained,
  };
  return {
    version: 1,
    policy: "protected-joint-budget-v1",
    owner,
    ledgerSha256: digest(ledger),
    // Full bodies have already matched these sorted, content-addressed charges individually.
    actualCopiesSha256: digest(ledger.copies),
    planSha256: digest(plan),
    flowSha256: completion.flowSha256,
    producerSchemasSha256: completion.producerSchemasSha256,
    baseline,
    upper: {
      results: metadata.length,
      copies: maxima.size,
      cells: valueInfo.cells + unknownCells,
      catalogBytes,
      copyBytes,
      retainedBytes: catalogBytes + copyBytes,
      catalogNodes,
      catalogDepth,
      catalogWorkBytes,
    },
    withinBounds: Object.values(limits).every(Boolean),
    exceeded: Object.keys(limits).filter((k) => !limits[k]),
  };
}
