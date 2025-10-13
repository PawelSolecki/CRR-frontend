import type { StepStatus } from "../types";

/**
 * Determines the CSS class for a step based on its position relative to the current step
 */
export function getStepClass(stepId: number, currentStep: number): StepStatus {
  if (stepId < currentStep) {
    return "completed";
  } else if (stepId === currentStep) {
    return "current";
  } else {
    return "upcoming";
  }
}
