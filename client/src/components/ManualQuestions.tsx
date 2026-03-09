import { useState } from 'react';
import type { RemainingQuestion, ManualAnswers } from '../../../shared/types';

const questionLabels: Record<RemainingQuestion, string> = {
  power_on: 'Czy urzadzenie wlacza sie i dziala bez ladowarki?',
  touch_response: 'Czy ekran dotykowy reaguje na calej powierzchni?',
  buttons_functional: 'Czy wszystkie przyciski dzialaja prawidlowo?',
};

interface Props {
  questions: RemainingQuestion[];
  onSubmit: (answers: ManualAnswers) => void;
}

export default function ManualQuestions({ questions, onSubmit }: Props) {
  const knownQuestions = questions.filter((q) => q in questionLabels);

  const [answers, setAnswers] = useState<Record<string, boolean | null>>(() => {
    const init: Record<string, boolean | null> = {};
    knownQuestions.forEach((q) => (init[q] = null));
    return init;
  });

  const allAnswered = knownQuestions.every((q) => answers[q] !== null);

  function handleSubmit() {
    if (!allAnswered) return;
    const manual: ManualAnswers = {
      power_on: answers.power_on ?? true,
      touch_response: answers.touch_response ?? true,
      buttons_functional: answers.buttons_functional ?? true,
    };
    onSubmit(manual);
  }

  return (
    <div className="rounded-xl bg-xkom-card p-5">
      <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-xkom-muted">
        Pytania weryfikacyjne
      </h2>
      <p className="mb-4 text-xs text-xkom-muted">
        Tych aspektow nie mozna ocenic ze zdjec — potrzebujemy Twojej
        odpowiedzi.
      </p>

      <div className="space-y-4">
        {knownQuestions.map((q) => (
          <div key={q}>
            <p className="mb-2 text-sm text-white">{questionLabels[q]}</p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q]: true }))
                }
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  answers[q] === true
                    ? 'border-xkom-green bg-xkom-green/20 text-xkom-green'
                    : 'border-xkom-accent/50 text-xkom-muted hover:border-xkom-green/50'
                }`}
              >
                Tak
              </button>
              <button
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q]: false }))
                }
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  answers[q] === false
                    ? 'border-xkom-red bg-xkom-red/20 text-xkom-red'
                    : 'border-xkom-accent/50 text-xkom-muted hover:border-xkom-red/50'
                }`}
              >
                Nie
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!allAnswered}
        onClick={handleSubmit}
        className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
          allAnswered
            ? 'bg-xkom-green text-white hover:bg-xkom-green/90'
            : 'bg-xkom-accent/30 text-xkom-muted cursor-not-allowed'
        }`}
      >
        Oblicz wycene
      </button>
    </div>
  );
}
