'use client';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progreso del checkout">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.number} className="flex items-center">
            <div className="flex items-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  step.number < currentStep
                    ? 'bg-[var(--hl-primary)] text-white'
                    : step.number === currentStep
                    ? 'border-2 border-[var(--hl-primary)] text-[var(--hl-primary)]'
                    : 'border-2 border-border text-muted-foreground'
                }`}
                aria-current={step.number === currentStep ? 'step' : undefined}
              >
                {step.number < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </span>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 ${
                  step.number < currentStep ? 'bg-[var(--hl-primary)]' : 'bg-border'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
