import type {
  ValuationResponse,
  DeviceIdentification,
} from '../../../shared/types';

interface Props {
  valuation: ValuationResponse;
  device: DeviceIdentification;
  onReset: () => void;
}

export default function ValuationResult({ valuation, device, onReset }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-xkom-card p-6 text-center">
        <p className="text-sm text-xkom-muted">Szacowana wartosc odkupu</p>
        <p className="text-lg text-xkom-muted mt-1">
          {device.brand} {device.model}{' '}
          {device.storage && `(${device.storage})`}
        </p>

        <p className="mt-4 text-5xl font-bold text-xkom-green">
          {valuation.estimatedValue.toLocaleString('pl-PL')} PLN
        </p>
        <p className="mt-2 text-sm text-xkom-muted">
          Zakres: {valuation.range.low.toLocaleString('pl-PL')} -{' '}
          {valuation.range.high.toLocaleString('pl-PL')} PLN
        </p>
      </div>

      <div className="rounded-xl bg-xkom-card p-5">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-xkom-muted">
          Szczegoly wyceny
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-xkom-muted">Cena bazowa (stan idealny)</span>
            <span className="text-white">
              {valuation.basePrice.toLocaleString('pl-PL')} PLN
            </span>
          </div>

          {valuation.adjustments.map((adj, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-xkom-muted">{adj.reason}</span>
              <span
                className={adj.amount < 0 ? 'text-xkom-red' : 'text-xkom-green'}
              >
                {adj.amount > 0 ? '+' : ''}
                {adj.amount.toLocaleString('pl-PL')} PLN
              </span>
            </div>
          ))}

          <div className="mt-2 border-t border-xkom-accent/30 pt-2 flex justify-between text-sm font-semibold">
            <span className="text-white">Wartosc koncowa</span>
            <span className="text-xkom-green">
              {valuation.estimatedValue.toLocaleString('pl-PL')} PLN
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-xkom-accent/20 p-4 text-center">
        <p className="text-xs text-xkom-muted">{valuation.disclaimer}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 rounded-lg border border-xkom-accent/50 py-3 text-sm text-xkom-muted hover:border-xkom-green/50 hover:text-white transition-colors"
        >
          Nowa wycena
        </button>
        <a
          href="https://www.x-kom.pl/lp/odkup"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-xkom-green py-3 text-sm font-semibold text-white hover:bg-xkom-green/90 transition-colors text-center"
        >
          Odwiedz salon x-kom
        </a>
      </div>
    </div>
  );
}
