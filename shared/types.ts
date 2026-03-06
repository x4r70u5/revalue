export type AssessmentStatus = 'pass' | 'fail' | 'unclear' | 'not_visible';
export type CosmeticGrade = 'A' | 'B' | 'C' | 'D';
export type Confidence = 'high' | 'medium' | 'low';

export interface DeviceIdentification {
  brand: string;
  model: string;
  storage: string;
  color: string;
  confidence: Confidence;
}

export interface AssessmentItem {
  status: AssessmentStatus;
  confidence: number;
  notes: string;
}

export interface VisualAssessment {
  screen_cracks: AssessmentItem;
  screen_burnin: AssessmentItem;
  back_panel: AssessmentItem;
  frame_condition: AssessmentItem;
  camera_lens: AssessmentItem;
  missing_parts: AssessmentItem;
  port_corrosion: AssessmentItem;
  cosmetic_grade: CosmeticGrade;
}

export type RemainingQuestion = 'power_on' | 'touch_response' | 'buttons_functional';

export interface EstimateResponse {
  device: DeviceIdentification;
  visual_assessment: VisualAssessment;
  remaining_questions: RemainingQuestion[];
  photo_quality_feedback: string[];
}

export interface ManualAnswers {
  power_on: boolean;
  touch_response: boolean;
  buttons_functional: boolean;
}

export interface FinalizeRequest {
  device: DeviceIdentification;
  visual_assessment: VisualAssessment;
  manual_answers: ManualAnswers;
}

export interface Adjustment {
  reason: string;
  amount: number;
}

export interface ValuationResponse {
  basePrice: number;
  conditionGrade: CosmeticGrade;
  adjustments: Adjustment[];
  estimatedValue: number;
  range: { low: number; high: number };
  disclaimer: string;
}

export interface DevicePrice {
  brand: string;
  model: string;
  storage: string;
  basePrice: number;
  conditionMultipliers: Record<CosmeticGrade, number>;
  deductions: {
    screen_cracked: number;
    screen_burnin: number;
    back_cracked: number;
    frame_bent: number;
    camera_broken: number;
    missing_parts: number;
    no_power: number;
    touch_issues: number;
    buttons_broken: number;
  };
}
