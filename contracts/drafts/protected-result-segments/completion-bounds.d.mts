import type { MeasuredBoundary } from "./schema-bounds.mjs";
export type CompletionBoundary = {
  version: 1;
  policy: "structured-completion-boundary-v1";
  flowSha256: string;
  producerSchemasSha256: string;
  parametersSha256: string;
  resolvedParametersSha256: string;
  aggregate: MeasuredBoundary;
  maxNodeExecutions: number;
  maxLeafReturns: number;
  producers: Array<{
    nodeId: string;
    schemaSha256: string;
    boundary: MeasuredBoundary;
  }>;
};
/** Requires independent validation of the full fixed flow and every producer Schema. */
export declare function compileCompletionBoundary(
  flow: unknown,
  producerSchemas: unknown,
  parameters: unknown,
): CompletionBoundary;
/** Recomputes bounds; does not prove provenance, production enforcement or reservation. */
export declare function verifyCompletionBoundary(
  flow: unknown,
  producerSchemas: unknown,
  parameters: unknown,
  certificate: unknown,
): CompletionBoundary;
