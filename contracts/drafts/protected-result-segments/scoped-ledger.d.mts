import type {
  ActualCopy,
  LedgerCapacity,
  LedgerOwner,
  ResultLedger,
  LedgerProposal,
} from "../../v0.51.0/result-ledger.mjs";
import type { CaptureStats } from "./input-domains.mjs";
/** Owned actual rows are deeply frozen. Matching does not authenticate their host provenance. */
export declare function verifyScopedCopies(
  ledger: ResultLedger,
  owner: LedgerOwner,
  actual: ActualCopy[],
): Readonly<{
  capacity: Readonly<LedgerCapacity>;
  actual: ReadonlyArray<Readonly<ActualCopy>>;
  fingerprint: string;
  stats: CaptureStats;
}>;
/** Pure proposal, same stored layout; requires future coherent reader/writer adoption. */
export declare function proposeScoped(
  ledger: ResultLedger,
  owner: LedgerOwner,
  revision: number,
  change: LedgerProposal,
): ResultLedger;
