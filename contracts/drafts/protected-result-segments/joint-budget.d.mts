import type {
  ActualCopy,
  LedgerOwner,
  ResultLedger,
  LedgerCapacity,
  ResultMeta,
} from "../../v0.51.0/result-ledger.mjs";
export type FutureOutput =
  | { kind: "known"; value: unknown }
  | { kind: "schema"; schema: unknown };
export type FutureResult = Pick<
  ResultMeta,
  "nodeId" | "nodeInstance" | "type" | "label"
> & { output: FutureOutput };
export type FutureCopy = { kind: string; key: string; stages: FutureOutput[] };
export type SegmentInventory = {
  results: FutureResult[];
  copies: FutureCopy[];
};
export type JointPlan = {
  /** Every unconsumed inventory from the same stable host view. Never just cached byte counters. */
  pending: SegmentInventory[];
  proposed: SegmentInventory;
  completion: {
    flow: unknown;
    producerSchemas: Record<string, unknown>;
    parameters: unknown;
  };
};
export type JointBudget = {
  version: 1;
  policy: "protected-joint-budget-v1";
  owner: LedgerOwner;
  ledgerSha256: string;
  actualCopiesSha256: string;
  planSha256: string;
  flowSha256: string;
  producerSchemasSha256: string;
  parametersSha256: string;
  resolvedParametersSha256: string;
  baseline: LedgerCapacity;
  upper: {
    results: number;
    copies: number;
    cells: number;
    catalogBytes: number;
    copyBytes: number;
    retainedBytes: number;
    catalogNodes: number;
    catalogDepth: number;
    catalogWorkBytes: number;
  };
  withinBounds: boolean;
  exceeded: string[];
};
/** Unpublished accounting only: host provenance, complete inventory and lifecycle remain mandatory. */
export declare function compileJointBudget(
  ledger: ResultLedger,
  owner: LedgerOwner,
  actual: ActualCopy[],
  plan: JointPlan,
): JointBudget;
