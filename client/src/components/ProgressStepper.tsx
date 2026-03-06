type Step = 'upload' | 'analyzing' | 'assessment' | 'valuation';

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Zdjecia' },
  { key: 'analyzing', label: 'Analiza' },
  { key: 'assessment', label: 'Ocena' },
  { key: 'valuation', label: 'Wycena' },
];

function stepIndex(step: Step): number {
  return STEPS.findIndex((s) => s.key === step);
}

export default function ProgressStepper({ current }: { current: Step }) {
  const currentIdx = stepIndex(current);

  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i <= currentIdx
                  ? 'bg-xkom-green text-white'
                  : 'bg-xkom-accent/50 text-xkom-muted'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-1 text-xs ${
                i <= currentIdx ? 'text-white' : 'text-xkom-muted'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-2 h-0.5 flex-1 transition-colors ${
                i < currentIdx ? 'bg-xkom-green' : 'bg-xkom-accent/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
