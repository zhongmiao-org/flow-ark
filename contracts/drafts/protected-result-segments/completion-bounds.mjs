/** Unpublished aggregation analysis. No storage reservation or action authority. */
import { canonical } from "../../v0.51.0/result-retention.mjs";
import { BoundaryError } from "./schema-bounds.mjs";
import { compileFlowPlan } from "./flow-plan.mjs";

/** Fixed P1 validation precedes this call; actual fixed parameters are required, not guessed. */
export function compileCompletionBoundary(flow, producerSchemas, parameters) {
  const plan = compileFlowPlan(flow, producerSchemas, parameters);
  const {
    flowSha256,
    producerSchemasSha256,
    parametersSha256,
    resolvedParametersSha256,
    aggregate,
    maxNodeExecutions,
    maxLeafReturns,
    producers,
  } = plan;
  return {
    version: 1,
    policy: "structured-completion-boundary-v1",
    flowSha256,
    producerSchemasSha256,
    parametersSha256,
    resolvedParametersSha256,
    aggregate,
    maxNodeExecutions,
    maxLeafReturns,
    producers,
  };
}
export function verifyCompletionBoundary(
  flow,
  producerSchemas,
  parameters,
  certificate,
) {
  const expected = compileCompletionBoundary(flow, producerSchemas, parameters);
  if (canonical(expected) !== canonical(certificate))
    throw new BoundaryError(
      "mismatch",
      "#",
      "完整汇总证书与固定流程及参数不一致",
    );
  return expected;
}
