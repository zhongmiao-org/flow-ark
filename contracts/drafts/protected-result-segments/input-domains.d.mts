export type CaptureStats = Readonly<{
  bodies: number;
  bytes: number;
  valueNodes: number;
  workBytes: number;
  metadataBytes: number;
}>;
export type CapturedInput<T = unknown> = Readonly<{
  /** Deeply frozen, complete owned data. Do not serialize the entire composite as one value. */
  value: T;
  fingerprint: string;
  stats: CaptureStats;
}>;
export declare const CAPTURE_LIMITS: Readonly<{
  bytes: number;
  valueNodes: number;
  workBytes: number;
}>;
export declare function captureProducerSchemas(
  input: unknown,
): CapturedInput<Record<string, unknown>>;
export declare function captureJointPlan(input: unknown): CapturedInput;
export declare function captureProposal(input: unknown): CapturedInput;
export declare function captureActualCopies(input: unknown): CapturedInput;
