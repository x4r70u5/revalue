import type { VisualAssessment, AssessmentItem } from '../../../shared/types';

const criterionLabels: Record<string, string> = {
  screen_cracks: 'Pekniecia ekranu',
  screen_burnin: 'Wypalenie ekranu',
  back_panel: 'Tylny panel',
  frame_condition: 'Ramka / boki',
  camera_lens: 'Obiektyw aparatu',
  missing_parts: 'Brakujace elementy',
  port_corrosion: 'Korozja portow',
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'pass':
      return <span className="text-xkom-green">OK</span>;
    case 'fail':
      return <span className="text-xkom-red">!</span>;
    case 'unclear':
      return <span className="text-xkom-yellow">?</span>;
    default:
      return <span className="text-xkom-muted">--</span>;
  }
}

function statusBg(status: string): string {
  switch (status) {
    case 'pass':
      return 'bg-xkom-green/10 border-xkom-green/30';
    case 'fail':
      return 'bg-xkom-red/10 border-xkom-red/30';
    case 'unclear':
      return 'bg-xkom-yellow/10 border-xkom-yellow/30';
    default:
      return 'bg-xkom-accent/10 border-xkom-accent/30';
  }
}

const gradeLabels: Record<string, { label: string; color: string }> = {
  A: { label: 'A — Stan idealny', color: 'text-xkom-green' },
  B: { label: 'B — Lekkie slady uzytkowania', color: 'text-xkom-green' },
  C: { label: 'C — Widoczne slady uzytkowania', color: 'text-xkom-yellow' },
  D: { label: 'D — Powazne uszkodzenia', color: 'text-xkom-red' },
};

export default function AutoAssessment({
  assessment,
  feedback,
}: {
  assessment: VisualAssessment;
  feedback: string[];
}) {
  const grade = gradeLabels[assessment.cosmetic_grade];
  const entries = Object.entries(criterionLabels).map(([key, label]) => ({
    key,
    label,
    item: assessment[key as keyof VisualAssessment] as AssessmentItem,
  }));

  return (
    <div className="rounded-xl bg-xkom-card p-5">
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-xkom-muted">
        Ocena wizualna AI
      </h2>
      <p className={`mb-4 text-lg font-bold ${grade.color}`}>{grade.label}</p>

      <div className="space-y-2">
        {entries.map(({ key, label, item }) => (
          <div
            key={key}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 ${statusBg(item.status)}`}
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={item.status} />
              <span className="text-sm text-white">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-xkom-muted">{item.notes}</span>
              {item.confidence > 0 && (
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-xkom-accent/30">
                  <div
                    className="h-full rounded-full bg-xkom-green transition-all"
                    style={{ width: `${item.confidence * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {feedback.length > 0 && (
        <div className="mt-4 rounded-lg bg-xkom-accent/20 p-3">
          <p className="mb-1 text-xs font-medium text-xkom-yellow">
            Wskazowki dotyczace zdjec:
          </p>
          <ul className="space-y-1">
            {feedback.map((tip, i) => (
              <li key={i} className="text-xs text-xkom-muted">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
