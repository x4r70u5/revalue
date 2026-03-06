import type { DeviceIdentification as DeviceInfo } from '../../../shared/types';

const confidenceLabels = {
  high: { label: 'Wysoka pewnosc', color: 'text-xkom-green' },
  medium: { label: 'Srednia pewnosc', color: 'text-xkom-yellow' },
  low: { label: 'Niska pewnosc', color: 'text-xkom-red' },
};

export default function DeviceIdentification({
  device,
}: {
  device: DeviceInfo;
}) {
  const conf = confidenceLabels[device.confidence];

  return (
    <div className="rounded-xl bg-xkom-card p-5">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-xkom-muted">
        Rozpoznane urzadzenie
      </h2>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-white">
            {device.brand} {device.model}
          </p>
          <div className="mt-1 flex gap-3 text-sm text-xkom-muted">
            {device.storage && <span>{device.storage}</span>}
            {device.color && <span>{device.color}</span>}
          </div>
        </div>
        <span className={`text-xs font-medium ${conf.color}`}>
          {conf.label}
        </span>
      </div>
      {device.confidence === 'low' && (
        <p className="mt-3 text-xs text-xkom-yellow">
          Nie udalo sie jednoznacznie rozpoznac modelu. Wycena moze byc
          niedokladna.
        </p>
      )}
    </div>
  );
}
