export interface Step {
  id: number
  title: string
  link: string
}

export interface HeaderProps {
  steps: Step[]
  currentStep: number
}

export type StepStatus = 'completed' | 'current' | 'upcoming'