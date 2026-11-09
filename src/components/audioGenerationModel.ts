// Nominal representation budgets from the ACE-Step 1.5 report, not inferred model states.
export function aceStepBudget(seconds: number) {
  return { semanticSteps: seconds * 5, latentFrames: seconds * 25, samplesPerChannel: seconds * 48_000 };
}
