import type {
  DevicePrice,
  DeviceIdentification,
  VisualAssessment,
  ManualAnswers,
  ValuationResponse,
  Adjustment,
  CosmeticGrade,
} from '../types.js';

const defaultDeductions = {
  screen_cracked: 300,
  screen_burnin: 150,
  back_cracked: 200,
  frame_bent: 150,
  camera_broken: 200,
  missing_parts: 100,
  no_power: 500,
  touch_issues: 250,
  buttons_broken: 100,
};

const defaultMultipliers: Record<CosmeticGrade, number> = {
  A: 1.0,
  B: 0.85,
  C: 0.65,
  D: 0.4,
};

function makeDevice(
  brand: string,
  model: string,
  storage: string,
  basePrice: number,
  deductionScale = 1.0
): DevicePrice {
  const scaled: DevicePrice['deductions'] = {} as DevicePrice['deductions'];
  for (const [key, val] of Object.entries(defaultDeductions)) {
    scaled[key as keyof DevicePrice['deductions']] = Math.round(
      val * deductionScale
    );
  }
  return {
    brand,
    model,
    storage,
    basePrice,
    conditionMultipliers: { ...defaultMultipliers },
    deductions: scaled,
  };
}

const PRICING_TABLE: DevicePrice[] = [
  // iPhone 17 series
  makeDevice('Apple', 'iPhone 17', '128GB', 2800),
  makeDevice('Apple', 'iPhone 17', '256GB', 3100),
  makeDevice('Apple', 'iPhone 17 Pro', '128GB', 3400),
  makeDevice('Apple', 'iPhone 17 Pro', '256GB', 3700),
  makeDevice('Apple', 'iPhone 17 Pro', '512GB', 4200),
  makeDevice('Apple', 'iPhone 17 Pro Max', '256GB', 4400),
  makeDevice('Apple', 'iPhone 17 Pro Max', '512GB', 4900),
  makeDevice('Apple', 'iPhone 17 Pro Max', '1TB', 5500),

  // iPhone 16 series
  makeDevice('Apple', 'iPhone 16', '128GB', 2200),
  makeDevice('Apple', 'iPhone 16', '256GB', 2400),
  makeDevice('Apple', 'iPhone 16 Pro', '128GB', 2800),
  makeDevice('Apple', 'iPhone 16 Pro', '256GB', 3000),
  makeDevice('Apple', 'iPhone 16 Pro', '512GB', 3500),
  makeDevice('Apple', 'iPhone 16 Pro Max', '256GB', 3600),
  makeDevice('Apple', 'iPhone 16 Pro Max', '512GB', 4000),
  makeDevice('Apple', 'iPhone 16 Pro Max', '1TB', 4500),

  // iPhone 15 series
  makeDevice('Apple', 'iPhone 15', '128GB', 1600),
  makeDevice('Apple', 'iPhone 15', '256GB', 1800),
  makeDevice('Apple', 'iPhone 15 Pro', '128GB', 2100),
  makeDevice('Apple', 'iPhone 15 Pro', '256GB', 2300),
  makeDevice('Apple', 'iPhone 15 Pro', '512GB', 2700),
  makeDevice('Apple', 'iPhone 15 Pro Max', '256GB', 2800),
  makeDevice('Apple', 'iPhone 15 Pro Max', '512GB', 3200),
  makeDevice('Apple', 'iPhone 15 Pro Max', '1TB', 3600),

  // Samsung Galaxy S25 series
  makeDevice('Samsung', 'Galaxy S25', '128GB', 1800),
  makeDevice('Samsung', 'Galaxy S25', '256GB', 2000),
  makeDevice('Samsung', 'Galaxy S25+', '256GB', 2400),
  makeDevice('Samsung', 'Galaxy S25+', '512GB', 2700),
  makeDevice('Samsung', 'Galaxy S25 Ultra', '256GB', 3000),
  makeDevice('Samsung', 'Galaxy S25 Ultra', '512GB', 3400),
  makeDevice('Samsung', 'Galaxy S25 Ultra', '1TB', 3900),

  // Samsung Galaxy S24 series
  makeDevice('Samsung', 'Galaxy S24', '128GB', 1200),
  makeDevice('Samsung', 'Galaxy S24', '256GB', 1350),
  makeDevice('Samsung', 'Galaxy S24+', '256GB', 1600),
  makeDevice('Samsung', 'Galaxy S24+', '512GB', 1800),
  makeDevice('Samsung', 'Galaxy S24 Ultra', '256GB', 2000),
  makeDevice('Samsung', 'Galaxy S24 Ultra', '512GB', 2300),
  makeDevice('Samsung', 'Galaxy S24 Ultra', '1TB', 2700),

  // Samsung Galaxy S23 series
  makeDevice('Samsung', 'Galaxy S23', '128GB', 900),
  makeDevice('Samsung', 'Galaxy S23', '256GB', 1050),
  makeDevice('Samsung', 'Galaxy S23+', '256GB', 1200),
  makeDevice('Samsung', 'Galaxy S23+', '512GB', 1400),
  makeDevice('Samsung', 'Galaxy S23 Ultra', '256GB', 1600),
  makeDevice('Samsung', 'Galaxy S23 Ultra', '512GB', 1850),

  // Samsung Galaxy S22 series
  makeDevice('Samsung', 'Galaxy S22', '128GB', 600),
  makeDevice('Samsung', 'Galaxy S22', '256GB', 700),
  makeDevice('Samsung', 'Galaxy S22+', '128GB', 750),
  makeDevice('Samsung', 'Galaxy S22+', '256GB', 850),
  makeDevice('Samsung', 'Galaxy S22 Ultra', '128GB', 1000),
  makeDevice('Samsung', 'Galaxy S22 Ultra', '256GB', 1150),
  makeDevice('Samsung', 'Galaxy S22 Ultra', '512GB', 1350),

  // Samsung Galaxy S21 series
  makeDevice('Samsung', 'Galaxy S21', '128GB', 400),
  makeDevice('Samsung', 'Galaxy S21', '256GB', 480),
  makeDevice('Samsung', 'Galaxy S21+', '128GB', 500),
  makeDevice('Samsung', 'Galaxy S21+', '256GB', 580),
  makeDevice('Samsung', 'Galaxy S21 Ultra', '128GB', 700),
  makeDevice('Samsung', 'Galaxy S21 Ultra', '256GB', 800),
  makeDevice('Samsung', 'Galaxy S21 Ultra', '512GB', 950),

  // Samsung Galaxy A series (popular mid-range)
  makeDevice('Samsung', 'Galaxy A55', '128GB', 500),
  makeDevice('Samsung', 'Galaxy A54', '128GB', 350),
  makeDevice('Samsung', 'Galaxy A35', '128GB', 350),
  makeDevice('Samsung', 'Galaxy A34', '128GB', 250),

  // iPhone 14 series
  makeDevice('Apple', 'iPhone 14', '128GB', 1200),
  makeDevice('Apple', 'iPhone 14', '256GB', 1350),
  makeDevice('Apple', 'iPhone 14 Pro', '128GB', 1600),
  makeDevice('Apple', 'iPhone 14 Pro', '256GB', 1800),
  makeDevice('Apple', 'iPhone 14 Pro', '512GB', 2100),
  makeDevice('Apple', 'iPhone 14 Pro Max', '128GB', 1900),
  makeDevice('Apple', 'iPhone 14 Pro Max', '256GB', 2100),
  makeDevice('Apple', 'iPhone 14 Pro Max', '512GB', 2400),

  // iPhone 13 series
  makeDevice('Apple', 'iPhone 13', '128GB', 900),
  makeDevice('Apple', 'iPhone 13', '256GB', 1050),
  makeDevice('Apple', 'iPhone 13 Pro', '128GB', 1200),
  makeDevice('Apple', 'iPhone 13 Pro', '256GB', 1350),
  makeDevice('Apple', 'iPhone 13 Pro Max', '128GB', 1400),
  makeDevice('Apple', 'iPhone 13 Pro Max', '256GB', 1550),

  // iPads
  makeDevice('Apple', 'iPad Pro 13" M4', '256GB', 3200, 1.2),
  makeDevice('Apple', 'iPad Pro 13" M4', '512GB', 3600, 1.2),
  makeDevice('Apple', 'iPad Pro 11" M4', '256GB', 2600, 1.2),
  makeDevice('Apple', 'iPad Air 13" M3', '128GB', 2000, 1.0),
  makeDevice('Apple', 'iPad Air 11" M3', '128GB', 1600, 1.0),
  makeDevice('Apple', 'iPad 10th gen', '64GB', 800, 0.8),

  // MacBooks
  makeDevice('Apple', 'MacBook Pro 16" M4 Pro', '512GB', 6500, 1.5),
  makeDevice('Apple', 'MacBook Pro 14" M4 Pro', '512GB', 5200, 1.5),
  makeDevice('Apple', 'MacBook Pro 14" M4', '512GB', 4000, 1.5),
  makeDevice('Apple', 'MacBook Air 15" M4', '256GB', 3200, 1.3),
  makeDevice('Apple', 'MacBook Air 13" M4', '256GB', 2800, 1.3),

  // Galaxy Tabs
  makeDevice('Samsung', 'Galaxy Tab S10 Ultra', '256GB', 2600, 1.2),
  makeDevice('Samsung', 'Galaxy Tab S10+', '256GB', 2000, 1.1),
  makeDevice('Samsung', 'Galaxy Tab S10 FE', '128GB', 1000, 0.9),

  // Smartwatches
  makeDevice('Apple', 'Apple Watch Ultra 2', '64GB', 1200, 0.6),
  makeDevice('Apple', 'Apple Watch Series 10', '64GB', 800, 0.5),
  makeDevice('Samsung', 'Galaxy Watch Ultra', '32GB', 900, 0.5),
  makeDevice('Samsung', 'Galaxy Watch 7', '16GB', 500, 0.4),
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+]/g, '');
}

function findDevice(device: DeviceIdentification): DevicePrice | null {
  const brandNorm = normalize(device.brand);
  const modelNorm = normalize(device.model);
  const storageNorm = normalize(device.storage);

  // Exact match
  const exact = PRICING_TABLE.find(
    (d) =>
      normalize(d.brand) === brandNorm &&
      normalize(d.model) === modelNorm &&
      normalize(d.storage) === storageNorm
  );
  if (exact) return exact;

  // Match without storage (take first matching model)
  const modelMatch = PRICING_TABLE.find(
    (d) =>
      normalize(d.brand) === brandNorm && normalize(d.model) === modelNorm
  );
  return modelMatch ?? null;
}

export function calculateValuation(
  device: DeviceIdentification,
  assessment: VisualAssessment,
  answers: ManualAnswers
): ValuationResponse {
  const priceEntry = findDevice(device);

  if (!priceEntry) {
    return {
      basePrice: 0,
      conditionGrade: assessment.cosmetic_grade,
      adjustments: [],
      estimatedValue: 0,
      range: { low: 0, high: 0 },
      disclaimer:
        'Nie znaleziono tego modelu w bazie cenowej. Skontaktuj sie ze sklepem po indywidualna wycene.',
    };
  }

  const grade = assessment.cosmetic_grade;
  const multiplier = priceEntry.conditionMultipliers[grade];
  const adjustedBase = Math.round(priceEntry.basePrice * multiplier);
  const adjustments: Adjustment[] = [];

  const gradeLabels: Record<CosmeticGrade, string> = {
    A: 'Stan idealny',
    B: 'Lekkie slady uzytkowania',
    C: 'Widoczne slady uzytkowania',
    D: 'Powazne uszkodzenia kosmetyczne',
  };

  if (multiplier < 1) {
    adjustments.push({
      reason: gradeLabels[grade],
      amount: adjustedBase - priceEntry.basePrice,
    });
  }

  if (assessment.screen_cracks.status === 'fail') {
    adjustments.push({
      reason: 'Pekniecia ekranu',
      amount: -priceEntry.deductions.screen_cracked,
    });
  }
  if (assessment.screen_burnin.status === 'fail') {
    adjustments.push({
      reason: 'Wypalenie ekranu',
      amount: -priceEntry.deductions.screen_burnin,
    });
  }
  if (assessment.back_panel.status === 'fail') {
    adjustments.push({
      reason: 'Uszkodzony tylny panel',
      amount: -priceEntry.deductions.back_cracked,
    });
  }
  if (assessment.frame_condition.status === 'fail') {
    adjustments.push({
      reason: 'Uszkodzona ramka',
      amount: -priceEntry.deductions.frame_bent,
    });
  }
  if (assessment.camera_lens.status === 'fail') {
    adjustments.push({
      reason: 'Uszkodzony obiektyw',
      amount: -priceEntry.deductions.camera_broken,
    });
  }
  if (assessment.missing_parts.status === 'fail') {
    adjustments.push({
      reason: 'Brakujace elementy',
      amount: -priceEntry.deductions.missing_parts,
    });
  }
  if (!answers.power_on) {
    adjustments.push({
      reason: 'Urzadzenie nie wlacza sie',
      amount: -priceEntry.deductions.no_power,
    });
  }
  if (!answers.touch_response) {
    adjustments.push({
      reason: 'Problemy z ekranem dotykowym',
      amount: -priceEntry.deductions.touch_issues,
    });
  }
  if (!answers.buttons_functional) {
    adjustments.push({
      reason: 'Niesprawne przyciski',
      amount: -priceEntry.deductions.buttons_broken,
    });
  }

  const totalAdjustment = adjustments.reduce((sum, a) => sum + a.amount, 0);
  const estimatedValue = Math.max(0, priceEntry.basePrice + totalAdjustment);

  const rangePct = 0.1;
  const low = Math.max(0, Math.round(estimatedValue * (1 - rangePct)));
  const high = Math.round(estimatedValue * (1 + rangePct));

  return {
    basePrice: priceEntry.basePrice,
    conditionGrade: grade,
    adjustments,
    estimatedValue,
    range: { low, high },
    disclaimer:
      'Wycena orientacyjna. Ostateczna cena zalezy od weryfikacji w salonie.',
  };
}
