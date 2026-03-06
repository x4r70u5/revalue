import { useState } from 'react';
import type {
  EstimateResponse,
  ManualAnswers,
  ValuationResponse,
} from '../../shared/types';
import ProgressStepper from './components/ProgressStepper';
import PhotoUpload from './components/PhotoUpload';
import DeviceIdentification from './components/DeviceIdentification';
import AutoAssessment from './components/AutoAssessment';
import ManualQuestions from './components/ManualQuestions';
import ValuationResult from './components/ValuationResult';

type Step = 'upload' | 'analyzing' | 'assessment' | 'valuation';

export default function App() {
  const [step, setStep] = useState<Step>('upload');
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [valuation, setValuation] = useState<ValuationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePhotosSubmit(files: File[]) {
    setStep('analyzing');
    setError(null);

    const formData = new FormData();
    files.forEach((f) => formData.append('photos', f));

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Blad serwera (${res.status})`);
      }

      const data: EstimateResponse = await res.json();
      setEstimate(data);
      setStep('assessment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystapil blad');
      setStep('upload');
    }
  }

  async function handleAnswersSubmit(answers: ManualAnswers) {
    if (!estimate) return;
    setError(null);

    try {
      const res = await fetch('/api/estimate/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: estimate.device,
          visual_assessment: estimate.visual_assessment,
          manual_answers: answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Blad serwera (${res.status})`);
      }

      const data: ValuationResponse = await res.json();
      setValuation(data);
      setStep('valuation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystapil blad');
    }
  }

  function handleReset() {
    setStep('upload');
    setEstimate(null);
    setValuation(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-xkom-bg">
      <header className="border-b border-xkom-accent/30 px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Re<span className="text-xkom-green">Value</span>
          </h1>
          {step !== 'upload' && (
            <button
              onClick={handleReset}
              className="text-sm text-xkom-muted hover:text-white transition-colors"
            >
              Nowa wycena
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <ProgressStepper current={step} />

        {error && (
          <div className="mb-4 rounded-lg bg-xkom-red/20 border border-xkom-red/40 px-4 py-3 text-sm text-xkom-red">
            {error}
          </div>
        )}

        {step === 'upload' && <PhotoUpload onSubmit={handlePhotosSubmit} />}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 h-16 w-16 rounded-full border-4 border-xkom-green/30 border-t-xkom-green animate-spin" />
            <p className="text-lg text-white">Analizujemy zdjecia...</p>
            <p className="mt-2 text-sm text-xkom-muted">
              AI ocenia stan Twojego urzadzenia
            </p>
          </div>
        )}

        {step === 'assessment' && estimate && (
          <div className="space-y-6">
            <DeviceIdentification device={estimate.device} />
            <AutoAssessment
              assessment={estimate.visual_assessment}
              feedback={estimate.photo_quality_feedback}
            />
            <ManualQuestions
              questions={estimate.remaining_questions}
              onSubmit={handleAnswersSubmit}
            />
          </div>
        )}

        {step === 'valuation' && valuation && estimate && (
          <ValuationResult
            valuation={valuation}
            device={estimate.device}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
