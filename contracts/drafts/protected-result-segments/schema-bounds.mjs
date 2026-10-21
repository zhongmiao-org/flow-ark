/** Unpublished, pure single-value bounds. This never grants storage or execution. */
import { canonical, digest, LIMITS } from "../../v0.51.0/result-retention.mjs";

export const BOUND_LIMITS = Object.freeze({
  schemaNodes: 4096,
  bytes: LIMITS.value,
  valueNodes: LIMITS.visits,
  depth: LIMITS.jsonDepth,
  workBytes: LIMITS.workBytes,
  arrayItems: 1000,
});
export class BoundaryError extends Error {
  constructor(code, path, message) {
    super(message);
    this.code = code;
    this.path = path;
  }
}
const fail = (code, path, message) => {
  throw new BoundaryError(code, path, message);
};
const dictionary = (value) =>
  !!value && Object.getPrototypeOf(value) === Object.prototype;
const annotations = [
  "$schema",
  "$defs",
  "title",
  "description",
  "default",
  "examples",
];
const scalarKeys = {
  string: ["maxLength", "minLength", "pattern", "format"],
  number: [
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
  ],
  integer: [
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
  ],
  boolean: [],
  null: [],
  array: ["items", "maxItems", "minItems", "uniqueItems"],
  object: [
    "properties",
    "required",
    "additionalProperties",
    "minProperties",
    "maxProperties",
  ],
};
const length = (text) => Buffer.byteLength(text, "utf8");
const add = (a, b, path) => {
  const result = a + b;
  if (!Number.isSafeInteger(result) || result < 0)
    fail("limit", path, "边界运算超限");
  return result;
};
const multiply = (a, b, path) => {
  const result = a * b;
  if (!Number.isSafeInteger(result) || result < 0)
    fail("limit", path, "边界运算超限");
  return result;
};
function checked(result, path) {
  for (const [key, limit] of Object.entries({
    canonicalBytes: BOUND_LIMITS.bytes,
    valueNodes: BOUND_LIMITS.valueNodes,
    depth: BOUND_LIMITS.depth,
    workBytes: BOUND_LIMITS.workBytes,
  })) {
    if (
      !Number.isSafeInteger(result[key]) ||
      result[key] < 0 ||
      result[key] > limit
    )
      fail("limit", path, "完整值边界超过现行格式限额");
  }
  return result;
}
const leaf = (bytes) => ({
  canonicalBytes: bytes,
  valueNodes: 1,
  depth: 0,
  workBytes: bytes,
});
function members(children, keys, path) {
  let bytes = add(2, Math.max(0, children.length - 1), path),
    nodes = 1,
    depth = 0,
    work = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    bytes = add(bytes, child.canonicalBytes, path);
    if (keys) bytes = add(bytes, length(JSON.stringify(keys[i])) + 1, path);
    nodes = add(nodes, child.valueNodes, path);
    depth = Math.max(depth, child.depth + 1);
    work = add(work, child.workBytes, path);
  }
  return checked(
    {
      canonicalBytes: bytes,
      valueNodes: nodes,
      depth,
      workBytes: add(bytes, work, path),
    },
    path,
  );
}
/** Measures valid complete JSON, including codec work at every container level. */
export function measureValue(value) {
  const text = canonical(value); // Also rejects accessors, custom prototypes, cycles and holes.
  const visit = (v, path) => {
    if (Array.isArray(v))
      return members(
        v.map((item, i) => visit(item, path + "/" + i)),
        null,
        path,
      );
    if (v !== null && typeof v === "object") {
      const keys = Object.keys(v);
      return members(
        keys.map((key) => visit(v[key], path + "/" + key)),
        keys,
        path,
      );
    }
    return leaf(length(JSON.stringify(v)));
  };
  const measured = checked(visit(value, "#"), "#");
  if (measured.canonicalBytes !== length(text))
    fail("mismatch", "#", "规范值计量不一致");
  return measured;
}

/** Caller still validates the fixed Schema and actual data using its Schema validator. */
export function compileBoundary(schema) {
  canonical(schema);
  if (!dictionary(schema)) fail("invalid", "#", "输出结构必须是有限对象定义");
  const memo = new Map(),
    active = new Set();
  let visits = 0;
  const keys = (node, allowed, path) => {
    const supported = new Set([...annotations, ...allowed]);
    for (const key of Object.keys(node))
      if (!supported.has(key))
        fail("unsupported", path + "/" + key, "该输出结构尚不能证明有限边界");
    if (
      Object.hasOwn(node, "$schema") &&
      node.$schema !== "http://json-schema.org/draft-07/schema#"
    )
      fail("unsupported", path + "/$schema", "Schema版本与有限边界规则不一致");
    if (Object.hasOwn(node, "$defs") && !dictionary(node.$defs))
      fail("invalid", path + "/$defs", "本地定义必须是对象");
  };
  const integer = (node, key, path, required = false) => {
    const value = node[key];
    if (value === undefined && !required) return;
    if (!Number.isSafeInteger(value) || value < 0)
      fail(
        value === undefined ? "unbounded" : "invalid",
        path + "/" + key,
        "请补齐非负整数上限",
      );
    return value;
  };
  const reference = (ref, path) => {
    if (ref === "#") return schema;
    if (typeof ref !== "string" || !ref.startsWith("#/") || ref.includes("%"))
      fail("unsupported", path, "只支持同一结构内的规范JSON Pointer引用");
    let value = schema;
    for (const raw of ref.slice(2).split("/")) {
      if (/~(?![01])/u.test(raw)) fail("invalid", path, "本地引用转义无效");
      const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
      if (
        (!dictionary(value) && !Array.isArray(value)) ||
        !Object.hasOwn(value, key)
      )
        fail("invalid", path, "本地引用不存在");
      value = value[key];
    }
    return value;
  };
  const maximum = (values, path) =>
    checked(
      Object.fromEntries(
        ["canonicalBytes", "valueNodes", "depth", "workBytes"].map((key) => [
          key,
          Math.max(...values.map((value) => value[key])),
        ]),
      ),
      path,
    );
  const visit = (node, path) => {
    if (++visits > BOUND_LIMITS.schemaNodes)
      fail("limit", path, "输出结构编译工作超限");
    if (!dictionary(node)) fail("unbounded", path, "请使用有限的输出结构");
    if (active.has(node)) fail("cycle", path, "递归输出结构不能取得有限边界");
    if (memo.has(node)) return memo.get(node);
    active.add(node);
    let result;
    try {
      if (Object.hasOwn(node, "$ref")) {
        keys(node, ["$ref"], path);
        result = visit(reference(node.$ref, path + "/$ref"), node.$ref);
      } else if (Object.hasOwn(node, "const") || Object.hasOwn(node, "enum")) {
        keys(node, ["type", "const", "enum"], path);
        if (Object.hasOwn(node, "const")) result = measureValue(node.const);
        else {
          if (
            !Array.isArray(node.enum) ||
            !node.enum.length ||
            node.enum.length > 1000
          )
            fail("invalid", path + "/enum", "枚举须有1至1000个完整值");
          result = maximum(node.enum.map(measureValue), path);
        }
      } else if (Object.hasOwn(node, "anyOf") || Object.hasOwn(node, "oneOf")) {
        const key = Object.hasOwn(node, "anyOf") ? "anyOf" : "oneOf";
        keys(node, [key], path);
        if (
          !Array.isArray(node[key]) ||
          !node[key].length ||
          node[key].length > 1000
        )
          fail("invalid", path + "/" + key, "输出分支须有限且非空");
        result = maximum(
          node[key].map((part, i) => visit(part, path + "/" + key + "/" + i)),
          path,
        );
      } else if (Array.isArray(node.type)) {
        if (
          !node.type.length ||
          node.type.length > 7 ||
          new Set(node.type).size !== node.type.length
        )
          fail("invalid", path + "/type", "输出类型集合须有限、非空且不重复");
        if (
          node.type.some(
            (type) =>
              typeof type !== "string" || !Object.hasOwn(scalarKeys, type),
          )
        )
          fail("invalid", path + "/type", "输出类型集合包含不支持的类型");
        keys(
          node,
          ["type", ...node.type.flatMap((type) => scalarKeys[type])],
          path,
        );
        result = maximum(
          node.type.map((type) => {
            const applicable = new Set([...annotations, ...scalarKeys[type]]);
            return visit(
              {
                ...Object.fromEntries(
                  Object.entries(node).filter(([key]) => applicable.has(key)),
                ),
                type,
              },
              path + "/type/" + type,
            );
          }),
          path,
        );
      } else {
        const type = node.type;
        if (typeof type !== "string" || !Object.hasOwn(scalarKeys, type))
          fail("unbounded", path + "/type", "请明确有限的输出类型");
        keys(node, ["type", ...scalarKeys[type]], path);
        if (type === "string") {
          const max = integer(node, "maxLength", path, true),
            min = integer(node, "minLength", path);
          if (min !== undefined && min > max)
            fail("invalid", path, "文本长度范围不一致");
          result = leaf(add(2, multiply(6, max, path), path));
        } else if (type === "array") {
          const max = integer(node, "maxItems", path, true),
            min = integer(node, "minItems", path);
          if (max > BOUND_LIMITS.arrayItems)
            fail("limit", path, "数组条数超过有限结构上限");
          if (min !== undefined && min > max)
            fail("invalid", path, "数组条数范围不一致");
          if (max === 0) result = leaf(2);
          else {
            const item = visit(node.items, path + "/items");
            const bytes = add(
              2 + max - 1,
              multiply(max, item.canonicalBytes, path),
              path,
            );
            result = {
              canonicalBytes: bytes,
              valueNodes: add(1, multiply(max, item.valueNodes, path), path),
              depth: item.depth + 1,
              workBytes: add(bytes, multiply(max, item.workBytes, path), path),
            };
          }
        } else if (type === "object") {
          if (
            node.additionalProperties !== false ||
            (node.properties !== undefined && !dictionary(node.properties))
          )
            fail("unbounded", path, "对象须只允许已列出的有限字段");
          const properties = node.properties ?? {},
            names = Object.keys(properties),
            required = node.required ?? [];
          if (
            !Array.isArray(required) ||
            required.some(
              (key) =>
                typeof key !== "string" || !Object.hasOwn(properties, key),
            ) ||
            new Set(required).size !== required.length
          )
            fail("invalid", path + "/required", "必填字段须唯一且存在");
          integer(node, "minProperties", path);
          integer(node, "maxProperties", path);
          result = members(
            names.map((key) =>
              visit(properties[key], path + "/properties/" + key),
            ),
            names,
            path,
          );
        } else result = leaf(type === "boolean" ? 5 : type === "null" ? 4 : 32);
      }
      result = checked(result, path);
      memo.set(node, result);
      return result;
    } finally {
      active.delete(node);
    }
  };
  return {
    version: 1,
    policy: "finite-json-output-v1",
    schemaSha256: digest(schema),
    ...visit(schema, "#"),
  };
}

/** Metering only. Passing this function does not prove that value matches Schema. */
export function verifyMeasuredBoundary(schema, certificate, value) {
  const expected = compileBoundary(schema);
  if (canonical(certificate) !== canonical(expected))
    fail("mismatch", "#", "边界与固定输出结构不一致");
  const actual = measureValue(value);
  for (const key of ["canonicalBytes", "valueNodes", "depth", "workBytes"])
    if (actual[key] > expected[key])
      fail("limit", "#", "完整输出超过已核对边界");
  return actual;
}
