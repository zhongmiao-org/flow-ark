/** Unpublished codec envelope. Arithmetic evidence, never a reservation or permit. */
import { canonical, LIMITS } from "../../v0.51.0/result-retention.mjs";
import { BoundaryError } from "./schema-bounds.mjs";
import { compileOutputValidation } from "./output-validation.mjs";

const hash = "0".repeat(64);
const bytes = (value) => Buffer.byteLength(canonical(value), "utf8");
const rowBase = Math.max(
  ...[
    { kind: "json", text: "" },
    { kind: "bytes", data: "" },
    { kind: "text", body: "" },
    ...["concat", "list", "array", "object"].map((kind) => ({
      kind,
      parts: [],
    })),
    { kind: "members", entries: [] },
  ].map((cell) => bytes({ id: hash, cell })),
);
const refBytes = Math.max(
  bytes(hash) + 1,
  Math.ceil((bytes({ key: hash, value: hash }) + 1) / 2),
);
const checked = (value) => {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new BoundaryError("limit", "#", "完整存储上界运算超限");
  return value;
};
function groupHeight(items) {
  let height = 1;
  while (items > LIMITS.fanout) {
    items = Math.ceil(items / LIMITS.fanout);
    height++;
  }
  return height;
}
/** Internal input must be freshly computed by the fixed Schema/full-flow compiler. */
export function envelopeOfBoundary(boundary) {
  const { canonicalBytes: b, valueNodes: n, depth } = boundary;
  for (const value of [b, n, depth, boundary.workBytes]) checked(value);
  if (
    b < 1 ||
    n < 1 ||
    b > LIMITS.value ||
    n > LIMITS.visits ||
    depth > LIMITS.jsonDepth
  )
    throw new BoundaryError("limit", "#", "完整值上界不符合固定保存政策");
  // Small roots are always a single JSON cell. No guessed deduplication is credited.
  if (b <= LIMITS.leaf)
    return {
      cells: 1,
      references: 0,
      cellRowsBytes: checked(rowBase + 1 + 2 * b),
      catalogNodes: 5,
      graphDepth: 1,
      reconstructionWorkBytes: b,
    };
  // Every long JSON string exceeds leaf bytes: sum(ceil(si/leaf)) <= floor(2*b/leaf).
  const chunks = Math.floor((2 * b) / LIMITS.leaf);
  const cells = checked(3 * n - 2 + 2 * chunks);
  const references = checked(3 * (n - 1) + 2 * chunks);
  const graphDepth = checked(depth * groupHeight(n) + groupHeight(chunks) + 2);
  return {
    cells,
    references,
    cellRowsBytes: checked(
      cells * (rowBase + 1) + references * refBytes + 2 * b,
    ),
    catalogNodes: checked(5 * cells + 2 * references),
    graphDepth,
    reconstructionWorkBytes: checked(graphDepth * (b + 2 * cells)),
  };
}
/** Public entry takes the full Schema, never caller-supplied dimensions. */
export function compileStorageEnvelope(schema) {
  const { certificate } = compileOutputValidation(schema);
  return { certificate, envelope: envelopeOfBoundary(certificate) };
}
