/** Unpublished reference validator. No storage reservation or action permission. */
import Ajv from "ajv";
import ajvPackage from "ajv/package.json" with { type: "json" };
import { canonical } from "../../v0.51.0/result-retention.mjs";
import {
  BOUND_LIMITS,
  BOUND_SCHEMA_KEYWORDS,
  BoundaryError,
  compileBoundary,
  verifyMeasuredBoundary,
} from "./schema-bounds.mjs";

export const OUTPUT_VALIDATION_PROFILE = "ajv-draft07-data-only-v1";
// Schema graph edges are not JSON data nesting. Keep their finite limits distinct.
export const OUTPUT_VALIDATION_LIMITS = Object.freeze({
  schemaGraphDepth: 256,
});
const keywords = new Set(BOUND_SCHEMA_KEYWORDS);
const pointer = (key) => key.replace(/~/g, "~0").replace(/\//g, "~1");
const object = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const fail = (code, path, message) => {
  throw new BoundaryError(code, path, message);
};
function frozen(value) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) frozen(child);
    Object.freeze(value);
  }
  return value;
}
function copy(value) {
  // Validate plain, dense, finite JSON before invoking a code-generating validator.
  return JSON.parse(canonical(value));
}
function reference(root, ref, path) {
  if (ref === "#") return root;
  if (typeof ref !== "string" || !ref.startsWith("#/") || ref.includes("%"))
    fail("unsupported", path, "仅支持固定结构内的规范JSON Pointer引用");
  let current = root;
  for (const raw of ref.slice(2).split("/")) {
    if (/~(?![01])/u.test(raw)) fail("invalid", path, "本地引用转义无效");
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!current || typeof current !== "object" || !Object.hasOwn(current, key))
      fail("invalid", path, "本地引用不存在");
    current = current[key];
  }
  return current;
}

/** Compile once from an owned Schema copy; verified output is also an owned copy. */
export function compileOutputValidation(schema) {
  if (ajvPackage.version !== "8.20.0")
    fail("unsupported", "#", "输出校验器版本与固定配置不一致");
  const fixed = copy(schema);
  const ajv = new Ajv({
    strictSchema: true,
    strictTypes: false,
    strictNumbers: true,
    allowUnionTypes: true,
    allErrors: false,
    ownProperties: true,
    validateSchema: true,
    validateFormats: true,
    coerceTypes: false,
    useDefaults: false,
    removeAdditional: false,
    addUsedSchema: false,
    inlineRefs: false,
    logger: false,
  });
  const heights = new Map(),
    active = new Set();
  let visits = 0;
  function inspect(node, path, depth) {
    if (depth > OUTPUT_VALIDATION_LIMITS.schemaGraphDepth)
      fail("limit", path, "输出结构与引用展开层数超过校验限额");
    if (!object(node)) fail("invalid", path, "输出结构须为有限对象定义");
    if (active.has(node)) fail("cycle", path, "递归输出结构尚不能取得准入");
    if (heights.has(node)) {
      const height = heights.get(node);
      if (depth + height > OUTPUT_VALIDATION_LIMITS.schemaGraphDepth)
        fail("limit", path, "输出结构与引用展开层数超过校验限额");
      return height;
    }
    if (++visits > BOUND_LIMITS.schemaNodes)
      fail("limit", path, "输出结构准入工作超过限额");
    active.add(node);
    let height = 0;
    const child = (value, at) => {
      height = Math.max(height, 1 + inspect(value, at, depth + 1));
    };
    for (const key of Object.keys(node))
      if (!keywords.has(key))
        fail(
          "unsupported",
          path + "/" + pointer(key),
          "输出结构关键词尚不支持",
        );
    if (
      Object.hasOwn(node, "$schema") &&
      node.$schema !== "http://json-schema.org/draft-07/schema#"
    )
      fail("unsupported", path + "/$schema", "输出结构版本不一致");
    // No silent annotation-only fallback: this profile registers no format plugin.
    if (Object.hasOwn(node, "format"))
      fail("unsupported", path + "/format", "命名格式尚无固定的校验实现");
    if (!ajv.validateSchema(node))
      fail("invalid", path, "输出结构不符合固定Schema元格式");
    if (Object.hasOwn(node, "pattern")) {
      try {
        new RegExp(node.pattern, "u");
      } catch {
        fail("invalid", path + "/pattern", "输出结构正则表达式无效");
      }
    }
    for (const key of ["$defs", "properties"]) {
      if (!Object.hasOwn(node, key)) continue;
      if (!object(node[key]))
        fail("invalid", path + "/" + key, "结构字段与本地定义须为对象");
      for (const [name, definition] of Object.entries(node[key])) {
        if (key === "properties" && name === "__proto__")
          fail(
            "unsupported",
            path + "/properties/__proto__",
            "固定校验器不支持此字段定义",
          );
        child(definition, path + "/" + key + "/" + pointer(name));
      }
    }
    if (Object.hasOwn(node, "items") && node.items !== false)
      child(node.items, path + "/items");
    for (const key of ["anyOf", "oneOf"]) {
      if (!Object.hasOwn(node, key)) continue;
      if (!Array.isArray(node[key]))
        fail("invalid", path + "/" + key, "输出分支必须是数组");
      node[key].forEach((definition, i) =>
        child(definition, path + "/" + key + "/" + i),
      );
    }
    if (Object.hasOwn(node, "$ref"))
      child(reference(fixed, node.$ref, path + "/$ref"), node.$ref);
    active.delete(node);
    heights.set(node, height);
    return height;
  }
  inspect(fixed, "#", 0);
  const certificate = frozen(compileBoundary(fixed));
  let validate;
  try {
    validate = ajv.compile(fixed);
  } catch {
    // Do not expose validator messages containing supplied Schema or original values.
    fail("invalid", "#", "固定输出结构无法编译，尚未取得准入");
  }
  frozen(fixed);
  return Object.freeze({
    profile: OUTPUT_VALIDATION_PROFILE,
    certificate,
    verify(value) {
      const snapshot = copy(value);
      if (!validate(snapshot))
        fail("mismatch", "#", "完整返回值不符合固定输出结构");
      const measured = frozen(
        verifyMeasuredBoundary(fixed, certificate, snapshot),
      );
      return Object.freeze({
        profile: OUTPUT_VALIDATION_PROFILE,
        schemaSha256: certificate.schemaSha256,
        value: frozen(snapshot),
        measured,
      });
    },
  });
}
