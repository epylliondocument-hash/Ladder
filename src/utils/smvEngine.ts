import { BandDefinition, LadderType, OrderInputs, OrderPlan, LineSimulation, DayPlanRow } from '../types/smv';

export const LADDERS: Record<LadderType, BandDefinition[]> = {
  Basic: [
    { above: 0,  upTo: 8,  band: 'over 0.0 to 8.0',   days: [0.25, 0.50, 0.60, 0.70, 0.80, 0.80, 0.80, 0.80] },
    { above: 8,  upTo: 16, band: 'over 8.0 to 16.0',  days: [0.20, 0.45, 0.60, 0.70, 0.75, 0.75, 0.75, 0.75] },
    { above: 16, upTo: 24, band: 'over 16.0 to 24.0', days: [0.18, 0.40, 0.53, 0.63, 0.70, 0.70, 0.70, 0.70] },
    { above: 24, upTo: 32, band: 'over 24.0 to 32.0', days: [0.17, 0.35, 0.48, 0.57, 0.67, 0.67, 0.67, 0.67] },
    { above: 32, upTo: 40, band: 'over 32.0 to 40.0', days: [0.15, 0.30, 0.45, 0.55, 0.63, 0.63, 0.63, 0.63] },
    { above: 40, upTo: 48, band: 'over 40.0 to 48.0', days: [0.10, 0.25, 0.40, 0.50, 0.60, 0.60, 0.60, 0.60] },
    { above: 48, upTo: 53, band: 'over 48.0 to 53.0', days: [0.07, 0.25, 0.35, 0.45, 0.55, 0.57, 0.57, 0.57] },
    { above: 53, upTo: 58, band: 'over 53.0 to 58.0', days: [0.05, 0.20, 0.30, 0.40, 0.50, 0.55, 0.55, 0.55] },
    { above: 58, upTo: 63, band: 'over 58.0 to 63.0', days: [0.05, 0.20, 0.35, 0.40, 0.45, 0.50, 0.50, 0.50] },
    { above: 63, upTo: 68, band: 'over 63.0 to 68.0', days: [0.05, 0.20, 0.30, 0.37, 0.40, 0.42, 0.42, 0.42] },
  ],
  Tight: [
    { above: 0,  upTo: 8,  band: 'over 0.0 to 8.0',   days: [0.25, 0.60, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85] },
    { above: 8,  upTo: 16, band: 'over 8.0 to 16.0',  days: [0.20, 0.53, 0.77, 0.77, 0.77, 0.77, 0.77, 0.77] },
    { above: 16, upTo: 24, band: 'over 16.0 to 24.0', days: [0.18, 0.47, 0.65, 0.75, 0.75, 0.75, 0.75, 0.75] },
    { above: 24, upTo: 32, band: 'over 24.0 to 32.0', days: [0.17, 0.45, 0.62, 0.72, 0.72, 0.72, 0.72, 0.72] },
    { above: 32, upTo: 40, band: 'over 32.0 to 40.0', days: [0.15, 0.42, 0.59, 0.69, 0.69, 0.69, 0.69, 0.69] },
    { above: 40, upTo: 48, band: 'over 40.0 to 48.0', days: [0.15, 0.41, 0.58, 0.68, 0.68, 0.68, 0.68, 0.68] },
    { above: 48, upTo: 53, band: 'over 48.0 to 53.0', days: [0.13, 0.38, 0.55, 0.65, 0.65, 0.65, 0.65, 0.65] },
    { above: 53, upTo: 58, band: 'over 53.0 to 58.0', days: [0.13, 0.36, 0.53, 0.63, 0.63, 0.63, 0.63, 0.63] },
    { above: 58, upTo: 63, band: 'over 58.0 to 63.0', days: [0.09, 0.29, 0.44, 0.52, 0.55, 0.55, 0.55, 0.55] },
    { above: 63, upTo: 68, band: 'over 63.0 to 68.0', days: [0.05, 0.21, 0.33, 0.41, 0.45, 0.47, 0.47, 0.47] },
  ],
  Complex: [
    { above: 0,  upTo: 8,  band: 'over 0.0 to 8.0',   days: [0.10, 0.25, 0.40, 0.50, 0.57, 0.62, 0.62, 0.62] },
    { above: 8,  upTo: 16, band: 'over 8.0 to 16.0',  days: [0.10, 0.25, 0.40, 0.50, 0.55, 0.60, 0.60, 0.60] },
    { above: 16, upTo: 24, band: 'over 16.0 to 24.0', days: [0.10, 0.23, 0.35, 0.45, 0.52, 0.57, 0.57, 0.57] },
    { above: 24, upTo: 32, band: 'over 24.0 to 32.0', days: [0.10, 0.20, 0.30, 0.40, 0.50, 0.55, 0.55, 0.55] },
    { above: 32, upTo: 40, band: 'over 32.0 to 40.0', days: [0.05, 0.17, 0.27, 0.35, 0.43, 0.48, 0.50, 0.50] },
    { above: 40, upTo: 48, band: 'over 40.0 to 48.0', days: [0.05, 0.15, 0.25, 0.35, 0.40, 0.45, 0.47, 0.47] },
    { above: 48, upTo: 53, band: 'over 48.0 to 53.0', days: [0.05, 0.13, 0.23, 0.33, 0.37, 0.42, 0.44, 0.44] },
    { above: 53, upTo: 58, band: 'over 53.0 to 58.0', days: [0.05, 0.10, 0.20, 0.30, 0.35, 0.40, 0.42, 0.42] },
    { above: 58, upTo: 63, band: 'over 58.0 to 63.0', days: [0.03, 0.10, 0.20, 0.30, 0.35, 0.38, 0.40, 0.40] },
    { above: 63, upTo: 68, band: 'over 63.0 to 68.0', days: [0.05, 0.20, 0.30, 0.37, 0.40, 0.42, 0.42, 0.42] },
  ]
};

export const TYPICAL_SMV = [5.65, 12, 20, 28, 36, 44, 50.5, 55.5, 60.5, 65.5];
export const ALT_LEAD_TIMES = [24, 7, 10, 12, 14, 21, 25, 30, 40];
export const ALT_QUANTITIES = [750, 1500, 2500, 3750, 5000, 7500, 12500, 20000, 50000];

export function findBand(ladderType: LadderType, smv: number): BandDefinition {
  const bands = LADDERS[ladderType] || LADDERS.Tight;
  for (const b of bands) {
    if (smv > b.above && smv <= b.upTo) return b;
  }
  return bands[bands.length - 1];
}

export function target100(manpower: number, smv: number): number {
  if (smv <= 0) return 0;
  return (60 * manpower) / smv;
}

export function getEffectiveManualPcs(target: number, manualPcs?: number, manualEff?: number): number {
  if (manualPcs && manualPcs > 0) return manualPcs;
  if (manualEff && manualEff > 0 && target > 0) {
    return (manualEff / 100) * target;
  }
  return 0;
}

export function getDayEfficiency(band: BandDefinition, dayIndex: number, effGap: number = 0): number {
  const idx = Math.min(dayIndex, 7);
  return Math.max(0, band.days[idx] - (effGap || 0));
}

export function simulateLine(
  qty: number,
  band: BandDefinition,
  target: number,
  hoursDay: number,
  maxDays: number,
  effGap: number,
  manualPcs: number = 0
): {
  days: DayPlanRow[];
  totalOutput: number;
  totalHours: number;
  avgPcsHour: number;
  avgEff: number;
  daysUsed: number;
  finished: boolean;
} {
  let scale = 1;
  if (manualPcs > 0 && qty < 1e11) {
    const H = qty / manualPcs;
    const f = Math.floor(H / hoursDay + 1e-9);
    const r = Math.max(0, H - f * hoursDay);
    let cum = 0;
    for (let i = 0; i < f; i++) cum += getDayEfficiency(band, i, effGap);
    const nextEff = r > 1e-9 ? getDayEfficiency(band, f, effGap) : 0;
    const denom = hoursDay * cum + r * nextEff;
    scale = denom > 0 ? (qty / denom) / target : 1;
  }

  let remaining = qty;
  const days: DayPlanRow[] = [];
  let totalOutput = 0;
  let totalHours = 0;

  for (let d = 0; d < maxDays && remaining > 1e-9; d++) {
    const eff = getDayEfficiency(band, d, effGap) * scale;
    const pcsHour = target * eff;
    const capacity = pcsHour * hoursDay;
    const output = Math.min(capacity, remaining);
    const hoursUsed = capacity > 0 ? output / pcsHour : 0;
    remaining -= output;
    totalOutput += output;
    totalHours += hoursUsed;

    days.push({
      day: d + 1,
      efficiency: eff,
      pcsHour,
      hours: hoursUsed,
      output,
      remaining: Math.max(0, remaining)
    });
  }

  const avgPcsHour = manualPcs > 0
    ? Math.round(manualPcs * 100) / 100
    : (totalHours > 0 ? Math.floor(totalOutput / totalHours) : 0);

  const avgEff = target > 0
    ? (manualPcs > 0 ? manualPcs : avgPcsHour) / target
    : 0;

  return {
    days,
    totalOutput,
    totalHours,
    avgPcsHour,
    avgEff,
    daysUsed: days.length,
    finished: remaining < 1e-6
  };
}

export function planOrder(inputs: OrderInputs): OrderPlan {
  const {
    smv,
    manpower,
    quantity,
    leadTime,
    hoursDay,
    ladderType,
    effGap,
    avgBasis,
    manualPcs,
    manualEff
  } = inputs;

  const band = findBand(ladderType, smv);
  const target = target100(manpower, smv);
  const manual = getEffectiveManualPcs(target, manualPcs, manualEff);

  // Full single line capacity inside leadTime
  const fullSim = simulateLine(1e12, band, target, hoursDay, leadTime, effGap, manual);
  const qtyPerFullLine = manual > 0 ? manual * leadTime * hoursDay : fullSim.totalOutput;

  let remaining = quantity;
  const lines: LineSimulation[] = [];
  let lineNum = 0;

  while (remaining > 1e-6) {
    lineNum++;
    const take = Math.min(remaining, qtyPerFullLine);
    const sim = simulateLine(take, band, target, hoursDay, leadTime, effGap, manual);
    lines.push({
      line: lineNum,
      quantity: take,
      days: sim.daysUsed,
      lineHours: sim.totalHours,
      avgEff: sim.avgEff,
      avgPcsHour: sim.avgPcsHour,
      dayPlan: sim.days
    });
    remaining -= take;
    if (lineNum > 500) break;
  }

  const totalHours = lines.reduce((s, l) => s + l.lineHours, 0);
  const totalOutput = quantity;
  const avgPcsHour = manual > 0
    ? Math.round(manual * 100) / 100
    : (totalHours > 0 ? Math.floor(totalOutput / totalHours) : 0);

  const avgEff = target > 0
    ? (manual > 0 ? manual : avgPcsHour) / target
    : 0;

  const bestPcsHour = lines.length ? Math.max(...lines.map(l => l.avgPcsHour)) : 0;
  const bestEff = lines.length ? Math.max(...lines.map(l => l.avgEff)) : 0;
  const useBest = avgBasis === 'best';

  return {
    band,
    target,
    qtyPerFullLine,
    lines,
    totalHours,
    avgPcsHour,
    avgEff,
    bestPcsHour,
    bestEff,
    headPcs: useBest ? bestPcsHour : avgPcsHour,
    headEff: useBest ? bestEff : avgEff,
    numLines: lines.length
  };
}

export function formatNum(n: number | null | undefined, decimals: number = 2): string {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  });
}

export function formatPercent(n: number | null | undefined, decimals: number = 2): string {
  if (n == null || isNaN(n)) return '—';
  return (n * 100).toFixed(decimals) + '%';
}

export interface GarmentPreset {
  id: string;
  name: string;
  category: string;
  smv: number;
  manpower: number;
  leadTime: number;
  hoursDay: number;
  ladderType: LadderType;
  defaultQty: number;
  description: string;
}

export const GARMENT_PRESETS: GarmentPreset[] = [
  {
    id: 'heavy-outerwear',
    name: 'Heavy Padded Winter Jacket',
    category: 'Outerwear',
    smv: 66.5,
    manpower: 70,
    leadTime: 24,
    hoursDay: 10,
    ladderType: 'Tight',
    defaultQty: 50000,
    description: 'Heavy multi-pocket quilted insulated jacket with hood, seam sealing and lining.'
  },
  {
    id: 'basic-crewneck',
    name: 'Basic Crewneck T-Shirt',
    category: 'Knitwear',
    smv: 8.5,
    manpower: 36,
    leadTime: 14,
    hoursDay: 10,
    ladderType: 'Basic',
    defaultQty: 25000,
    description: '100% cotton single jersey ribbed neck crewneck t-shirt.'
  },
  {
    id: 'polo-shirt',
    name: 'Pique Polo Shirt 2-Button',
    category: 'Knitwear',
    smv: 18.5,
    manpower: 45,
    leadTime: 21,
    hoursDay: 10,
    ladderType: 'Basic',
    defaultQty: 20000,
    description: 'Polo shirt with rib collar, sleeve cuffs, taped shoulder, side slit.'
  },
  {
    id: 'denim-jeans',
    name: 'Classic 5-Pocket Denim Jeans',
    category: 'Woven Bottoms',
    smv: 28.5,
    manpower: 60,
    leadTime: 25,
    hoursDay: 10,
    ladderType: 'Tight',
    defaultQty: 30000,
    description: 'Heavyweight twill 5-pocket denim with coin pocket, back yoke, rivets and bar tacks.'
  },
  {
    id: 'formal-shirt',
    name: 'Mens Long Sleeve Woven Shirt',
    category: 'Woven Tops',
    smv: 23.0,
    manpower: 50,
    leadTime: 21,
    hoursDay: 10,
    ladderType: 'Tight',
    defaultQty: 20000,
    description: 'Dress shirt with two-piece collar, front button stand, cuff placket, and back pleat.'
  },
  {
    id: 'zip-hoodie',
    name: 'Fleece Full-Zip Hoodie',
    category: 'Active / Fleece',
    smv: 38.0,
    manpower: 55,
    leadTime: 24,
    hoursDay: 10,
    ladderType: 'Complex',
    defaultQty: 15000,
    description: 'Heavy brushed fleece hoodie with kangaroo pockets, drawcord and metal zipper.'
  }
];
