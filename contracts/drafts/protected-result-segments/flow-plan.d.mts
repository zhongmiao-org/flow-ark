import type { CompletionBoundary } from "./completion-bounds.mjs";
import type { MeasuredBoundary } from "./schema-bounds.mjs";
export type SegmentSelection = {
  id: string;
  label: string;
  blockPath: string[];
  first: string;
  last: string;
};
export type FlowPlan = Omit<CompletionBoundary, "policy"> & {
  policy: "scoped-flow-plan-v1";
  nodes: Array<{
    nodeId: string;
    type: string;
    blockPath: string[];
    position: number;
    ancestors: string[];
  }>;
  references: Array<{
    nodeId: string;
    instance: string;
    path: string;
    reference: string;
    source:
      | { kind: "parameter" }
      | { kind: "step"; nodeId: string; instance: string }
      | { kind: "item" | "index"; instance: string }
      | {
          kind: "steps";
          instances: Array<{ nodeId: string; instance: string }>;
        };
    presence: "guaranteed" | "runtime";
    reachable: boolean;
    boundary: MeasuredBoundary;
  }>;
  loops: Array<{
    nodeId: string;
    instance: string;
    maxItems: number;
    presence: "guaranteed" | "runtime";
    itemsSha256?: string;
  }>;
  segments: Array<SegmentSelection & { roots: string[]; members: string[] }>;
};
/** Pure analysis. Full fixed P1 validation first; does not authenticate any producer or Store source. */
export declare function compileFlowPlan(
  flow: unknown,
  schemas: unknown,
  parameters: unknown,
  selections?: SegmentSelection[],
): FlowPlan;
/** Full recomputation, still not a permission or reservation. */
export declare function verifyFlowPlan(
  flow: unknown,
  schemas: unknown,
  parameters: unknown,
  selections: SegmentSelection[],
  plan: unknown,
): FlowPlan;
