export type MeasuredBoundary = {
  canonicalBytes: number;
  valueNodes: number;
  depth: number;
  workBytes: number;
};
export type BoundaryCertificate = MeasuredBoundary & {
  version: 1;
  policy: "finite-json-output-v1";
  schemaSha256: string;
};
export declare const BOUND_LIMITS: Readonly<{
  schemaNodes: 4096;
  bytes: 8388608;
  valueNodes: 262144;
  depth: 64;
  workBytes: 134217728;
  arrayItems: 1000;
}>;
export declare const BOUND_SCHEMA_KEYWORDS: readonly string[];
export declare class BoundaryError extends Error {
  readonly code:
    | "invalid"
    | "unsupported"
    | "unbounded"
    | "cycle"
    | "limit"
    | "mismatch";
  readonly path: string;
  constructor(code: BoundaryError["code"], path: string, message: string);
}
export declare function compileBoundary(schema: unknown): BoundaryCertificate;
export declare function measureValue(value: unknown): MeasuredBoundary;
/** Also requires independent validation of the actual value against the fixed Schema. */
export declare function verifyMeasuredBoundary(
  schema: unknown,
  certificate: BoundaryCertificate,
  value: unknown,
): MeasuredBoundary;
