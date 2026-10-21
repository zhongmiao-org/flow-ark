/** Unpublished complete-flow source analysis. No provenance, reservation or action authority. */
import { canonical, digest, LIMITS } from "../../v0.51.0/result-retention.mjs";
import { captureProducerSchemas } from "./input-domains.mjs";
import {
  BoundaryError,
  compileBoundary,
  measureValue,
} from "./schema-bounds.mjs";
import { compileOutputValidation } from "./output-validation.mjs";

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
  "run-result",
  "script",
  "skill",
  "source",
  "source-reduce",
  "value",
]);
const forbidden = new Set(["__proto__", "constructor", "prototype"]);
const dimensions = ["canonicalBytes", "valueNodes", "depth", "workBytes"];
const caps = [LIMITS.value, LIMITS.visits, LIMITS.jsonDepth, LIMITS.workBytes];
const own = (v, k) =>
  v !== null && v !== undefined && Object.hasOwn(Object(v), k);
const object = (v) => !!v && Object.getPrototypeOf(v) === Object.prototype;
const copy = (v) => JSON.parse(canonical(v));
const fail = (code, path, message) => {
  throw new BoundaryError(code, path, message);
};
const safe = (n) => {
  if (!Number.isSafeInteger(n) || n < 0) fail("limit", "#", "流程编译运算超限");
  return n;
};
const checked = (b) => {
  dimensions.forEach((k, i) => {
    if (safe(b[k]) > caps[i]) fail("limit", "#", "完整运行返回超过固定值边界");
  });
  return b;
};
const known = (value) => ({ kind: "known", value });
const bottom = { kind: "bottom" };
const choice = (alternatives) =>
  alternatives.length === 1
    ? alternatives[0]
    : { kind: "choice", alternatives };
const record = (fields) =>
  [...fields.values()].every((f) => f.value.kind === "known" && f.required)
    ? known(Object.fromEntries([...fields].map(([k, f]) => [k, f.value.value])))
    : { kind: "object", fields };
const tuple = (items) =>
  items.every((v) => v.kind === "known")
    ? known(items.map((v) => v.value))
    : { kind: "tuple", items };

// Exact current parameterSources rules. Actual fixed parameters are required; defaults are not guessed.
function resolveParameters(flow, input) {
  const values = copy(input);
  if (!object(values))
    fail("invalid", "#/parameters", "需要本次运行完整固定参数");
  const sources = flow.parameterSources ?? {},
    result = copy(values),
    done = new Set(),
    active = [];
  if (!object(sources) || Object.keys(sources).length > 1000)
    fail("invalid", "#/parameterSources", "参数来源映射无效");
  function resolve(key) {
    if (!Object.hasOwn(values, key))
      fail("invalid", "#/parameterSources", "参数来源不存在");
    if (done.has(key) || !Object.hasOwn(sources, key)) return result[key];
    if (active.includes(key) || active.length >= 64)
      fail("cycle", "#/parameterSources", "参数来源循环或依赖超限");
    const source = sources[key],
      parts =
        typeof source?.$ref === "string" ? source.$ref.split(".") : undefined;
    if (
      !object(source) ||
      Object.keys(source).length !== 1 ||
      typeof source.$ref !== "string" ||
      source.$ref.length > 2048 ||
      !parts ||
      parts.length < 2 ||
      parts.length > 32 ||
      parts[0] !== "params" ||
      parts.some((p) => !p || /\s/u.test(p) || forbidden.has(p))
    )
      fail("invalid", "#/parameterSources", "参数来源路径无效");
    active.push(key);
    try {
      let value = resolve(parts[1]);
      for (const field of parts.slice(2)) {
        if (
          value === null ||
          typeof value !== "object" ||
          (Array.isArray(value) && !/^(0|[1-9][0-9]*)$/u.test(field)) ||
          !own(value, field)
        )
          fail("invalid", "#/parameterSources", "参数来源路径不存在");
        value = value[field];
      }
      Object.defineProperty(result, key, {
        value: copy(value),
        enumerable: true,
        writable: true,
        configurable: true,
      });
      done.add(key);
      return result[key];
    } finally {
      active.pop();
    }
  }
  for (const key of Object.keys(sources)) {
    if (!key || key.includes(".") || /\s/u.test(key) || forbidden.has(key))
      fail("invalid", "#/parameterSources", "参数来源目标无法引用");
    resolve(key);
  }
  canonical(result);
  return { input: values, resolved: result };
}

/** Caller validates complete fixed P1 FlowDefinition first; all supplied Schemas are compiled here. */
export function compileFlowPlan(
  flowInput,
  schemasInput,
  parametersInput,
  selectionsInput = [],
) {
  const flow = copy(flowInput),
    parameters = resolveParameters(flow, parametersInput);
  const capturedSchemas = captureProducerSchemas(schemasInput),
    schemas = capturedSchemas.value;
  const selections = copy(selectionsInput);
  if (
    !object(flow) ||
    !Array.isArray(flow.steps) ||
    !Array.isArray(selections) ||
    selections.length > 1000
  )
    fail("invalid", "#", "需要完整流程及连续步骤段选择");
  const definitions = [],
    blocks = new Map(),
    spans = new Map(),
    ids = new Map(),
    validators = new Map(),
    producerRows = [];
  function structure(nodes, path, ancestors) {
    if (!Array.isArray(nodes) || nodes.length > 1000)
      fail("invalid", "#/steps", "流程块须为有限数组");
    blocks.set(JSON.stringify(path), nodes);
    nodes.forEach((n, position) => {
      if (
        !object(n) ||
        typeof n.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,100}$/u.test(n.id) ||
        forbidden.has(n.id) ||
        ids.has(n.id) ||
        definitions.length >= 4096
      )
        fail("invalid", "#/steps", "步骤身份重复、不可引用或结构超限");
      if (!leafTypes.has(n.type) && n.type !== "condition" && n.type !== "loop")
        fail("unsupported", n.id, "未知步骤不能编译完整计划");
      const start = definitions.length;
      const row = {
        nodeId: n.id,
        type: n.type,
        blockPath: path,
        position,
        ancestors,
      };
      definitions.push(row);
      ids.set(n.id, n);
      if (n.type === "condition") {
        structure(n.then, [...path, n.id, "then"], [...ancestors, n.id]);
        structure(n.else, [...path, n.id, "else"], [...ancestors, n.id]);
      } else if (n.type === "loop")
        structure(n.body, [...path, n.id, "body"], [...ancestors, n.id]);
      else if (n.type !== "value" && n.type !== "assert") {
        if (!Object.hasOwn(schemas, n.id))
          fail("unbounded", n.id, "生产者缺少完整有限输出结构");
        const validator = compileOutputValidation(schemas[n.id]);
        validators.set(n.id, validator);
        producerRows.push({
          nodeId: n.id,
          schemaSha256: validator.certificate.schemaSha256,
          boundary: maximum([validator.certificate, measureValue(null)]),
        });
      } else if (Object.hasOwn(schemas, n.id))
        fail("invalid", n.id, "确定性返回不接受覆盖结构");
      spans.set(n.id, { start, end: definitions.length });
    });
  }
  function maximum(values) {
    return checked(
      Object.fromEntries(
        dimensions.map((k) => [
          k,
          values.reduce((max, v) => Math.max(max, v[k]), 0),
        ]),
      ),
    );
  }
  structure(flow.steps, [], []);
  if (Object.keys(schemas).some((id) => !validators.has(id)))
    fail("invalid", "#/producerSchemas", "存在未属于完整流程的生产者结构");
  const shapeCache = new WeakMap(),
    boundCache = new WeakMap();
  let work = 0,
    reportBytes = 0;
  const references = [],
    loops = [];
  const tick = () => {
    if (++work > LIMITS.visits) fail("limit", "#", "流程分析工作超过固定限额");
  };
  function report(list, row) {
    reportBytes += Buffer.byteLength(canonical(row), "utf8") + 1;
    if (reportBytes > LIMITS.value)
      fail("limit", "#", "完整来源计划超过固定限额");
    list.push(row);
  }
  function shape(d) {
    if (d.kind !== "schema") return d;
    if (shapeCache.has(d.node)) return shapeCache.get(d.node);
    tick();
    let n = d.node,
      result;
    if (Object.hasOwn(n, "$ref")) {
      let target = d.root;
      for (const p of n.$ref.slice(2).split("/"))
        target = target[p.replace(/~1/g, "/").replace(/~0/g, "~")];
      result = shape({ kind: "schema", root: d.root, node: target });
    } else if (Object.hasOwn(n, "const")) result = known(n.const);
    else if (Object.hasOwn(n, "enum")) result = choice(n.enum.map(known));
    else if (n.anyOf || n.oneOf)
      result = choice(
        (n.anyOf ?? n.oneOf).map((node) => ({
          kind: "schema",
          root: d.root,
          node,
        })),
      );
    else if (Array.isArray(n.type))
      result = choice(
        n.type.map((type) => ({
          kind: "schema",
          root: d.root,
          node: { ...n, type },
        })),
      );
    else if (n.type === "object")
      result = {
        kind: "object",
        fields: new Map(
          Object.entries(n.properties ?? {}).map(([k, node]) => [
            k,
            {
              required: (n.required ?? []).includes(k),
              value: { kind: "schema", root: d.root, node },
            },
          ]),
        ),
      };
    else if (n.type === "array")
      result = {
        kind: "array",
        min: n.minItems ?? 0,
        max: n.maxItems,
        item:
          n.maxItems === 0
            ? bottom
            : { kind: "schema", root: d.root, node: n.items },
      };
    else
      result =
        n.type === "string"
          ? {
              kind: "string",
              minUnits: n.minLength ?? 0,
              maxUnits: safe(2 * n.maxLength),
              boundary: validatorsForScalar(n),
            }
          : { kind: "scalar", boundary: validatorsForScalar(n) };
    shapeCache.set(d.node, result);
    return result;
  }
  function validatorsForScalar(n) {
    // Whole original Schema is already fully validated; annotations/unused defs add no scalar size.
    const { $defs, ...scalar } = n;
    return compileBoundary(scalar);
  }
  function boundary(d) {
    if (boundCache.has(d)) return boundCache.get(d);
    tick();
    let b;
    const s = shape(d);
    if (s !== d) b = boundary(s);
    else if (d.kind === "known") b = measureValue(d.value);
    else if (d.kind === "maybe") b = boundary(d.value);
    else if (d.kind === "bottom")
      b = measureValue(null); // only for structurally checked unreachable loop bodies
    else if (d.kind === "scalar" || d.kind === "string") b = d.boundary;
    else if (d.kind === "choice") b = maximum(d.alternatives.map(boundary));
    else if (d.kind === "array") {
      if (!d.max) b = measureValue([]);
      else {
        const item = boundary(d.item),
          bytes = safe(2 + d.max - 1 + d.max * item.canonicalBytes);
        b = checked({
          canonicalBytes: bytes,
          valueNodes: safe(1 + d.max * item.valueNodes),
          depth: item.depth + 1,
          workBytes: safe(bytes + d.max * item.workBytes),
        });
      }
    } else {
      const fields =
        d.kind === "object"
          ? [...d.fields].map(([k, f]) => [k, boundary(f.value)])
          : d.items.map((v) => [null, boundary(v)]);
      let bytes = 2 + Math.max(0, fields.length - 1),
        nodes = 1,
        depth = 0,
        workBytes = 0;
      for (const [k, v] of fields) {
        bytes = safe(
          bytes +
            (k === null
              ? 0
              : Buffer.byteLength(JSON.stringify(k), "utf8") + 1) +
            v.canonicalBytes,
        );
        nodes = safe(nodes + v.valueNodes);
        depth = Math.max(depth, v.depth + 1);
        workBytes = safe(workBytes + v.workBytes);
      }
      b = checked({
        canonicalBytes: bytes,
        valueNodes: nodes,
        depth,
        workBytes: safe(bytes + workBytes),
      });
    }
    b = checked(Object.fromEntries(dimensions.map((k) => [k, b[k]])));
    boundCache.set(d, b);
    return b;
  }
  function child(d, key) {
    tick();
    const s = shape(d);
    if (s !== d) return child(s, key);
    if (d.kind === "maybe") {
      const found = child(d.value, key);
      return found ? { ...found, required: false } : null;
    }
    if (d.kind === "bottom") return { value: bottom, required: false };
    if (d.kind === "known")
      return own(d.value, key)
        ? { value: known(d.value[key]), required: true }
        : null;
    if (d.kind === "object") return d.fields.get(key) ?? null;
    if (d.kind === "choice") {
      const found = d.alternatives.map((v) => child(v, key)),
        present = found.filter(Boolean);
      return present.length
        ? {
            value: choice(present.map((v) => v.value)),
            required:
              present.length === found.length &&
              present.every((v) => v.required),
          }
        : null;
    }
    if (d.kind === "string") {
      if (key === "length")
        return {
          value:
            d.minUnits === d.maxUnits
              ? known(d.maxUnits)
              : {
                  kind: "scalar",
                  boundary: {
                    canonicalBytes: 32,
                    valueNodes: 1,
                    depth: 0,
                    workBytes: 32,
                  },
                },
          required: true,
        };
      return /^(0|[1-9][0-9]*)$/u.test(key) && Number(key) < d.maxUnits
        ? {
            value: {
              kind: "string",
              minUnits: 1,
              maxUnits: 1,
              boundary: {
                canonicalBytes: 8,
                valueNodes: 1,
                depth: 0,
                workBytes: 8,
              },
            },
            required: Number(key) < d.minUnits,
          }
        : null;
    }
    if (d.kind === "tuple") {
      if (key === "length")
        return { value: known(d.items.length), required: true };
      return /^(0|[1-9][0-9]*)$/u.test(key) && Number(key) < d.items.length
        ? { value: d.items[Number(key)], required: true }
        : null;
    }
    if (d.kind === "array") {
      if (key === "length")
        return {
          value: {
            kind: "scalar",
            boundary: {
              canonicalBytes: 32,
              valueNodes: 1,
              depth: 0,
              workBytes: 32,
            },
          },
          required: true,
        };
      return /^(0|[1-9][0-9]*)$/u.test(key) && Number(key) < d.max
        ? { value: d.item, required: Number(key) < d.min }
        : null;
    }
    return null;
  }
  function reference(ref, scope, nodeId, instance, path, reachable) {
    const parts = ref.split(".", LIMITS.visits + 1);
    if (parts.length > LIMITS.visits || parts.some((p) => forbidden.has(p)))
      fail("invalid", nodeId, "引用路径不可安全解析");
    let source, d;
    if (parts[0] === "steps" && parts.length === 1) {
      source = {
        kind: "steps",
        instances: [...scope.steps].map(([nodeId, binding]) => ({
          nodeId,
          instance: binding.instance,
        })),
      };
      d = record(
        new Map(
          [...scope.steps].map(([id, binding]) => [
            id,
            { required: true, value: binding.value },
          ]),
        ),
      );
      parts.shift();
    } else if (parts[0] === "steps") {
      const binding = scope.steps.get(parts[1]);
      if (!binding) fail("invalid", nodeId, "引用不在此前已完成的词法作用域");
      source = { kind: "step", nodeId: parts[1], instance: binding.instance };
      d = binding.value;
      parts.splice(0, 2);
    } else if (parts[0] === "params") {
      source = { kind: "parameter" };
      d = scope.params;
      parts.shift();
    } else if (parts[0] === "item" || parts[0] === "index") {
      const name = parts.shift();
      if (!scope[name]) fail("invalid", nodeId, "循环变量不属于当前词法作用域");
      source = { kind: name, instance: scope.loopInstance };
      d = scope[name];
    } else fail("invalid", nodeId, "引用根不存在");
    let required = d.kind !== "maybe";
    for (const key of parts) {
      const next = child(d, key);
      if (!next) fail("invalid", nodeId, "引用子路径不属于完整来源结构");
      required &&= next.required;
      d = next.value;
    }
    report(references, {
      nodeId,
      instance,
      path,
      reference: ref,
      source,
      presence: required ? "guaranteed" : "runtime",
      reachable,
      boundary: boundary(d),
    });
    return required ? d : { kind: "maybe", value: d };
  }
  function expression(v, scope, nodeId, instance, path, reachable) {
    tick();
    if (object(v) && Object.keys(v).length === 1 && typeof v.$ref === "string")
      return reference(v.$ref, scope, nodeId, instance, path, reachable);
    if (Array.isArray(v))
      return tuple(
        v.map((item, i) =>
          expression(item, scope, nodeId, instance, path + "/" + i, reachable),
        ),
      );
    if (object(v))
      return record(
        new Map(
          Object.entries(v).map(([k, item]) => [
            k,
            {
              required: true,
              value: expression(
                item,
                scope,
                nodeId,
                instance,
                path + "/" + k.replace(/~/g, "~0").replace(/\//g, "~1"),
                reachable,
              ),
            },
          ]),
        ),
      );
    return known(v);
  }
  function arrayCases(d) {
    tick();
    const s = shape(d);
    if (s !== d) return arrayCases(s);
    if (d.kind === "maybe") {
      const cases = arrayCases(d.value);
      return { ...cases, missing: true };
    }
    if (d.kind === "known") {
      if (!Array.isArray(d.value)) return { cases: [], missing: true };
      if (d.value.length > 1000) fail("limit", "#", "循环来源超过执行器1000项");
      return {
        cases: [
          {
            items: d.value.map(known),
            max: d.value.length,
            sha256: digest(d.value),
          },
        ],
        missing: false,
      };
    }
    if (d.kind === "tuple")
      return {
        cases: [{ items: d.items, max: d.items.length }],
        missing: false,
      };
    if (d.kind === "array")
      return { cases: [{ item: d.item, max: d.max }], missing: false };
    if (d.kind === "bottom")
      return { cases: [{ item: bottom, max: 0 }], missing: true };
    if (d.kind === "choice") {
      const all = d.alternatives.map(arrayCases);
      return {
        cases: all.flatMap((c) => c.cases),
        missing: all.some((c) => c.missing),
      };
    }
    return { cases: [], missing: true };
  }
  function block(nodes, scope, path, multiplier, reachable) {
    const local = { ...scope, steps: new Map(scope.steps) },
      fields = new Map();
    let executions = 0,
      returns = 0;
    for (const n of nodes) {
      tick();
      const instance = path + n.id;
      let output,
        children = 0,
        leaves = 0;
      const expr = (value, field) =>
        expression(
          value,
          local,
          n.id,
          instance,
          field ? "/" + field : "",
          reachable,
        );
      if (n.type === "condition") {
        expr(n.actual, "actual");
        expr(n.expected, "expected");
        const yes = block(n.then, local, instance + "/", multiplier, reachable),
          no = block(n.else, local, instance + "/", multiplier, reachable);
        output = choice([yes.output, no.output]);
        children = Math.max(yes.executions, no.executions);
        leaves = Math.max(yes.returns, no.returns);
      } else if (n.type === "loop") {
        const items = expr(n.items, "items"),
          resolved = arrayCases(items);
        if (!resolved.cases.length)
          fail("invalid", n.id, "循环来源没有数组形状");
        const outputs = [],
          counts = [],
          leafCounts = [];
        for (const c of resolved.cases) {
          if (!Number.isSafeInteger(c.max) || c.max < 0 || c.max > 1000)
            fail("limit", n.id, "循环来源超过执行器1000项");
          report(loops, {
            nodeId: n.id,
            instance,
            maxItems: c.max,
            presence: resolved.missing ? "runtime" : "guaranteed",
            ...(c.sha256 ? { itemsSha256: c.sha256 } : {}),
          });
          if (c.items?.length) {
            const results = c.items.map((item, index) =>
              block(
                n.body,
                { ...local, item, index: known(index), loopInstance: instance },
                instance + "[" + index + "]/",
                multiplier,
                reachable,
              ),
            );
            outputs.push(tuple(results.map((r) => r.output)));
            counts.push(results.reduce((a, r) => safe(a + r.executions), 0));
            leafCounts.push(results.reduce((a, r) => safe(a + r.returns), 0));
          } else {
            const body = block(
              n.body,
              {
                ...local,
                item: c.item ?? bottom,
                index: {
                  kind: "scalar",
                  boundary: {
                    canonicalBytes: 32,
                    valueNodes: 1,
                    depth: 0,
                    workBytes: 32,
                  },
                },
                loopInstance: instance,
              },
              instance + "[*]/",
              safe(multiplier * c.max),
              reachable && c.max > 0,
            );
            outputs.push({
              kind: "array",
              min: 0,
              max: c.max,
              item: body.output,
            });
            counts.push(safe(c.max * body.executions));
            leafCounts.push(safe(c.max * body.returns));
          }
        }
        output = choice(outputs);
        children = counts.reduce((max, n) => Math.max(max, n), 0);
        leaves = leafCounts.reduce((max, n) => Math.max(max, n), 0);
      } else if (n.type === "value") {
        output = expr(n.value ?? null, "value");
        leaves = 1;
      } else if (n.type === "assert") {
        expr(n.actual, "actual");
        expr(n.expected, "expected");
        output = known({ verified: true });
        leaves = 1;
      } else {
        if (n.type === "ai") expr(n.input, "input");
        else if (n.type === "conversation") {
          expr(n.key, "key");
          expr(n.input, "input");
        } else if (n.type === "source-reduce") expr(n.seed, "seed");
        else if (n.type !== "human") expr(n, "");
        output = choice([
          { kind: "schema", root: schemas[n.id], node: schemas[n.id] },
          known(null),
        ]);
        leaves = 1;
      }
      // Bound each node as well as the root, including branches which return no later value.
      boundary(output);
      local.steps.set(n.id, { value: output, instance });
      fields.set(n.id, { required: true, value: output });
      executions = safe(executions + 1 + children);
      returns = safe(returns + leaves);
      if (executions > 10000 || safe(multiplier * executions) > 10000)
        fail("limit", n.id, "完整路径可能超过单次10000步");
    }
    return { output: record(fields), executions, returns };
  }
  const root = block(
    flow.steps,
    { params: known(parameters.resolved), steps: new Map() },
    "",
    1,
    true,
  );
  const occupied = new Set(),
    segmentIds = new Set();
  const segments = selections.map((selection) => {
    if (
      !object(selection) ||
      Object.keys(selection).sort().join("\0") !==
        ["blockPath", "first", "id", "label", "last"].sort().join("\0") ||
      typeof selection.id !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/u.test(selection.id) ||
      segmentIds.has(selection.id) ||
      typeof selection.label !== "string" ||
      [...selection.label].length > 2000 ||
      !Array.isArray(selection.blockPath)
    )
      fail("invalid", "#/segments", "步骤段选择格式无效");
    segmentIds.add(selection.id);
    const nodes = blocks.get(JSON.stringify(selection.blockPath));
    const first = nodes?.findIndex((n) => n.id === selection.first),
      last = nodes?.findIndex((n) => n.id === selection.last);
    if (!nodes || first < 0 || last < first)
      fail("invalid", "#/segments", "步骤段须是同一流程块内的连续范围");
    const roots = nodes.slice(first, last + 1).map((n) => n.id);
    const members = definitions
      .slice(spans.get(selection.first).start, spans.get(selection.last).end)
      .map((d) => d.nodeId);
    for (const id of members) {
      if (occupied.has(id))
        fail("invalid", "#/segments", "步骤段不能重叠或嵌套持有");
      occupied.add(id);
    }
    return { ...selection, roots, members };
  });
  const result = {
    version: 1,
    policy: "scoped-flow-plan-v1",
    flowSha256: digest(flow),
    producerSchemasSha256: capturedSchemas.fingerprint,
    parametersSha256: digest(parameters.input),
    resolvedParametersSha256: digest(parameters.resolved),
    aggregate: boundary(root.output),
    maxNodeExecutions: root.executions,
    maxLeafReturns: root.returns,
    producers: producerRows,
    nodes: definitions,
    references,
    loops,
    segments,
  };
  canonical(result);
  return result;
}

/** Complete recomputation. This still does not authenticate source provenance or grant execution. */
export function verifyFlowPlan(flow, schemas, parameters, selections, plan) {
  const expected = compileFlowPlan(flow, schemas, parameters, selections);
  if (canonical(expected) !== canonical(plan))
    fail("mismatch", "#", "完整流程来源计划与当前输入不一致");
  return expected;
}
