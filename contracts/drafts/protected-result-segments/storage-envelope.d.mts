import type {
  MeasuredBoundary,
  BoundaryCertificate,
} from "./schema-bounds.mjs";
export type StorageEnvelope = {
  cells: number;
  references: number;
  cellRowsBytes: number;
  catalogNodes: number;
  graphDepth: number;
  reconstructionWorkBytes: number;
};
/** Internal arithmetic only; this does not validate a supplied certificate. */
export declare function envelopeOfBoundary(
  boundary: MeasuredBoundary,
): StorageEnvelope;
export declare function compileStorageEnvelope(schema: unknown): {
  certificate: Readonly<BoundaryCertificate>;
  envelope: StorageEnvelope;
};
