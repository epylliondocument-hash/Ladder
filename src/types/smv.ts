export type LadderType = 'Tight' | 'Basic' | 'Complex';

export interface BandDefinition {
  above: number;
  upTo: number;
  band: string;
  days: number[]; // 8 days of efficiency decimals (e.g. 0.25, 0.60, ...)
}

export type LaddersData = Record<LadderType, BandDefinition[]>;

export interface DayPlanRow {
  day: number;
  efficiency: number;
  pcsHour: number;
  hours: number;
  output: number;
  remaining: number;
}

export interface LineSimulation {
  line: number;
  quantity: number;
  days: number;
  lineHours: number;
  avgEff: number;
  avgPcsHour: number;
  dayPlan: DayPlanRow[];
}

export interface OrderInputs {
  smv: number | '';
  manpower: number | '';
  quantity: number | '';
  leadTime: number | '';
  hoursDay: number | '';
  ladderType: LadderType;
  effGap: number | '';
  avgBasis: 'best' | 'all';
  manualPcs?: number | '';
  manualEff?: number | '';
  styleName?: string;
  buyerName?: string;
  poNumber?: string;
}

export interface OrderPlan {
  band: BandDefinition;
  target: number;
  qtyPerFullLine: number;
  lines: LineSimulation[];
  totalHours: number;
  avgPcsHour: number;
  avgEff: number;
  bestPcsHour: number;
  bestEff: number;
  headPcs: number;
  headEff: number;
  numLines: number;
  isReady: boolean;
}

export interface SavedStyle {
  id: string;
  name: string;
  buyer?: string;
  poNumber?: string;
  smv: number | '';
  manpower: number | '';
  quantity: number | '';
  leadTime: number | '';
  hoursDay: number | '';
  ladderType: LadderType;
  effGap: number | '';
  photoUrl?: string;
  photoCaption?: string;
  createdAt: number;
}
