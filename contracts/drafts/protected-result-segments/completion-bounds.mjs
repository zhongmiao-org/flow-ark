/** Unpublished aggregation analysis. This is not a storage reservation or action permit. */
import { canonical, digest } from "../../v0.51.0/result-retention.mjs";
import {
  BOUND_LIMITS,
  BoundaryError,
  compileBoundary,
  measureValue,
} from "./schema-bounds.mjs";

const dimensions = ["canonicalBytes", "valueNodes", "depth", "workBytes"];
const leafTypes = new Set([
  "ai",
  "assert",
  "browser",
  "context",
  "conversation",
  "desktop",
  "document",
  "effect",
  "excel",
  "file",
  "http",
  "human",
  "mcp",
  "script",
  "skill",
  "source",
  "source-reduce",
  "value",
]);
const fail = (code, path, message) => {
  throw new BoundaryError(code, path, message);
};
const object = (v) => !!v && Object.getPrototypeOf(v) === Object.prototype;
const safe = (v, path) => {
  if (!Number.isSafeInteger(v) || v < 0)
    fail("limit", path, "完整汇总边界运算超限");
  return v;
};
function checked(v, path) {
  const caps = [
    BOUND_LIMITS.bytes,
    BOUND_LIMITS.valueNodes,
    BOUND_LIMITS.depth,
    BOUND_LIMITS.workBytes,
  ];
  dimensions.forEach((key, i) => {
    if (safe(v[key], path) > caps[i])
      fail("limit", path, "完整运行汇总超过有限值上限");
  });
  return v;
}
const maximum = (a, b, path) =>
  checked(
    Object.fromEntries(
      dimensions.map((key) => [key, Math.max(a[key], b[key])]),
    ),
    path,
  );
function record(fields, path) {
  let bytes = 2 + Math.max(0, fields.length - 1),
    nodes = 1,
    depth = 0,
    work = 0;
  for (const [key, value] of fields) {
    bytes = safe(
      bytes +
        Buffer.byteLength(JSON.stringify(key), "utf8") +
        1 +
        value.canonicalBytes,
      path,
    );
    nodes = safe(nodes + value.valueNodes, path);
    depth = Math.max(depth, value.depth + 1);
    work = safe(work + value.workBytes, path);
  }
  return checked(
    {
      canonicalBytes: bytes,
      valueNodes: nodes,
      depth,
      workBytes: safe(bytes + work, path),
    },
    path,
  );
}
function array(value, count, path) {
  if (count === 0) return measureValue([]);
  const bytes = safe(2 + count - 1 + count * value.canonicalBytes, path);
  return checked(
    {
      canonicalBytes: bytes,
      valueNodes: safe(1 + count * value.valueNodes, path),
      depth: value.depth + 1,
      workBytes: safe(bytes + count * value.workBytes, path),
    },
    path,
  );
}
function containsReference(value) {
  if (Array.isArray(value)) return value.some(containsReference);
  if (!object(value)) return false;
  if (Object.keys(value).length === 1 && typeof value.$ref === "string")
    return true;
  return Object.values(value).some(containsReference);
}

/**
 * The caller must first validate the complete fixed FlowDefinition and producer Schemas.
 * Each supplied producer Schema must be enforced on every actual leaf return in production.
 * No supplied numeric bound, loop override or partial forest is accepted here.
 */
export function compileCompletionBoundary(flow, producerSchemas) {
  canonical(flow);
  canonical(producerSchemas);
  if (!object(flow) || !Array.isArray(flow.steps) || !object(producerSchemas))
    fail("invalid", "#", "需要完整固定流程及生产者输出结构");
  const ids = new Set(),
    used = new Set(),
    leaves = [];
  let visits = 0;
  const count = (n, path) => {
    if (safe(n, path) > 10000)
      fail("limit", path, "完整路径可能超过单次运行10000步");
    return n;
  };
  function block(steps, path) {
    if (!Array.isArray(steps) || steps.length > 1000)
      fail("invalid", path, "流程块必须是最多1000步的数组");
    const fields = [];
    let executions = 0,
      leafReturns = 0;
    for (const node of steps) {
      if (++visits > 4096) fail("limit", path, "完整流程结构编译超限");
      if (
        !object(node) ||
        typeof node.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,100}$/.test(node.id) ||
        ["__proto__", "constructor", "prototype"].includes(node.id) ||
        ids.has(node.id)
      )
        fail("invalid", path, "步骤身份须唯一且可被执行器完整保存");
      ids.add(node.id);
      const at = path + "/" + node.id;
      let output,
        children = 0,
        returns = 0;
      if (node.type === "condition") {
        if (Object.hasOwn(producerSchemas, node.id))
          fail("invalid", at, "条件的完整返回由两个分支推导，不能覆盖");
        const yes = block(node.then, at + "/then"),
          no = block(node.else, at + "/else");
        output = maximum(yes.output, no.output, at);
        children = Math.max(yes.executions, no.executions);
        returns = Math.max(yes.leafReturns, no.leafReturns);
      } else if (node.type === "loop") {
        if (Object.hasOwn(producerSchemas, node.id))
          fail(
            "invalid",
            at,
            "循环的完整返回由实际数组或执行器上限推导，不能覆盖",
          );
        let items;
        if (Array.isArray(node.items)) items = node.items.length;
        else if (
          object(node.items) &&
          Object.keys(node.items).length === 1 &&
          typeof node.items.$ref === "string"
        )
          items = 1000;
        else fail("invalid", at, "循环输入须为数组或唯一变量引用");
        if (items > 1000) fail("limit", at, "循环数组超过执行器上限");
        // Even an empty literal loop is structurally checked; it cannot hide unknown producers.
        const body = block(node.body, at + "/body");
        output = array(body.output, items, at);
        children = count(items * body.executions, at);
        returns = count(items * body.leafReturns, at);
      } else {
        if (!leafTypes.has(node.type))
          fail("unsupported", at, "未知生产者不能推导完整汇总");
        if (node.type === "assert") {
          if (Object.hasOwn(producerSchemas, node.id))
            fail("invalid", at, "断言成功返回由执行器固定，不能覆盖");
          output = measureValue({ verified: true });
        } else if (node.type === "value" && !containsReference(node.value)) {
          if (Object.hasOwn(producerSchemas, node.id))
            fail("invalid", at, "固定值按完整原值准确计量，不能覆盖");
          output = measureValue(node.value ?? null);
        } else {
          if (!Object.hasOwn(producerSchemas, node.id))
            fail("unbounded", at, "生产者尚无固定且被实际执行的有限输出结构");
          used.add(node.id);
          const certificate = compileBoundary(producerSchemas[node.id]);
          // execute() normalizes undefined and null returns to null at node completion.
          output = maximum(certificate, measureValue(null), at);
          leaves.push({
            nodeId: node.id,
            schemaSha256: certificate.schemaSha256,
            boundary: output,
          });
        }
        returns = 1;
      }
      fields.push([node.id, output]);
      executions = count(executions + 1 + children, at);
      leafReturns = count(leafReturns + returns, at);
    }
    return { output: record(fields, path), executions, leafReturns };
  }
  const root = block(flow.steps, "#/steps");
  if (Object.keys(producerSchemas).some((id) => !used.has(id)))
    fail("invalid", "#/producerSchemas", "存在未属于此完整流程的生产者结构");
  return {
    version: 1,
    policy: "structured-completion-boundary-v1",
    flowSha256: digest(flow),
    producerSchemasSha256: digest(producerSchemas),
    aggregate: root.output,
    maxNodeExecutions: root.executions,
    maxLeafReturns: root.leafReturns,
    producers: leaves,
  };
}

/** Full recomputation only; certificate equality is not provenance or production validation. */
export function verifyCompletionBoundary(flow, producerSchemas, certificate) {
  const expected = compileCompletionBoundary(flow, producerSchemas);
  if (canonical(expected) !== canonical(certificate))
    fail("mismatch", "#", "完整汇总边界与当前固定流程不一致");
  return expected;
}
