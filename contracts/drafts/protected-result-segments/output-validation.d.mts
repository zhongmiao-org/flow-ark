import type {
  BoundaryCertificate,
  MeasuredBoundary,
} from "./schema-bounds.mjs";
export declare const OUTPUT_VALIDATION_PROFILE: "ajv-draft07-data-only-v1";
export declare const OUTPUT_VALIDATION_LIMITS: Readonly<{
  schemaGraphDepth: 256;
}>;
export type ValidatedOutput = Readonly<{
  profile: typeof OUTPUT_VALIDATION_PROFILE;
  schemaSha256: string;
  /** Deeply frozen, complete owned JSON copy. Save this value, never the caller's original. */
  value: unknown;
  measured: Readonly<MeasuredBoundary>;
}>;
export type OutputValidator = Readonly<{
  profile: typeof OUTPUT_VALIDATION_PROFILE;
  certificate: Readonly<BoundaryCertificate>;
  verify(value: unknown): ValidatedOutput;
}>;
/** Unpublished reference profile; requires the consumer's own AJV 8.20.0. */
export declare function compileOutputValidation(
  schema: unknown,
): OutputValidator;
