import React from 'react';
import {
  Plus,
  Minus,
  Camera,
  Layers,
  Clock,
  Users,
  Calendar,
  Box,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';
import { OrderInputs, OrderPlan, LadderType } from '../types/smv';
import { formatNum, formatPercent, ALT_LEAD_TIMES, ALT_QUANTITIES, planOrder } from '../utils/smvEngine';

interface PlannerTabProps {
  inputs: OrderInputs;
  onChangeInputs: (updated: Partial<OrderInputs>) => void;
  plan: OrderPlan;
  photoUrl: string | null;
  photoCaption: string;
  onOpenPhotoModal: () => void;
  onSelectLineForRamp?: (lineNum: number) => void;
}

export const PlannerTab: React.FC<PlannerTabProps> = ({
  inputs,
  onChangeInputs,
  plan,
  photoUrl,
  photoCaption,
  onOpenPhotoModal,
  onSelectLineForRamp,
}) => {
  const isBest = inputs.avgBasis === 'best';
  const manualPcs = inputs.manualPcs || 0;
  const manualEff = inputs.manualEff || 0;
  const line1Peak = plan.lines.length
    ? Math.max(...plan.lines[0].dayPlan.map((x) => x.pcsHour))
    : 0;

  // Touch Stepper helper for quick mobile adjustments
  const adjustValue = (field: keyof OrderInputs, delta: number, min: number = 0.1, max: number = 1000000) => {
    const current = (inputs[field] as number) || 0;
    const next = Math.max(min, Math.min(max, Math.round((current + delta) * 10) / 10));
    onChangeInputs({ [field]: next });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Style Identity & Photo Banner (Mobile Compact) */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={onOpenPhotoModal}
            className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition relative group"
            title="Attach Style Photo"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Style" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-5 h-5 text-blue-400" />
                <span className="text-[9px] mt-0.5 font-medium">Add Pic</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <input
              type="text"
              value={inputs.styleName || ''}
              onChange={(e) => onChangeInputs({ styleName: e.target.value })}
              placeholder="Enter Style / PO Name..."
              className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-slate-500 border-none p-0 focus:outline-none focus:ring-0 truncate"
            />
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {photoCaption ? photoCaption : `${inputs.ladderType} Ladder · ${plan.band.band}`}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPhotoModal}
          type="button"
          className="px-2.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-blue-300 text-xs font-medium shrink-0 border border-slate-600/60 flex items-center gap-1 active:scale-95 transition"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{photoUrl ? 'Edit Pic' : 'Photo'}</span>
        </button>
      </div>

      {/* KPI Grid (Material 3 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* KPI 1: Head Efficiency */}
        <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            {formatPercent(plan.headEff)}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-200/70 mt-1">
            {isBest ? 'Best Efficiency' : 'Avg Efficiency'}
          </div>
        </div>

        {/* KPI 2: Head Pcs / Hour */}
        <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-blue-400 tracking-tight">
            {plan.headPcs}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-blue-200/70 mt-1">
            {isBest ? 'Best Pcs / Hour' : 'Avg Pcs / Hour'}
          </div>
        </div>

        {/* KPI 3: 100% Target */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            {formatNum(plan.target, 1)}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Target @ 100%
          </div>
        </div>

        {/* KPI 4: Lines × Days */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-orange-400 tracking-tight">
            {plan.numLines} × {inputs.leadTime}d
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Lines × Days
          </div>
        </div>

        {/* KPI 5: Total Line Hours */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-200 tracking-tight">
            {formatNum(plan.totalHours, 1)}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Total Line Hours
          </div>
        </div>

        {/* KPI 6: Pcs per Full Line */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-200 tracking-tight">
            {formatNum(plan.qtyPerFullLine, 0)}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Pcs / Full Line
          </div>
        </div>
      </div>

      {/* Main Inputs Section */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
            Sewing Order Inputs
          </h2>
          <span className="text-xs text-blue-400 font-mono">
            {plan.band.band}
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* SMV Input with Stepper */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>SMV (Minutes / Pc)</span>
              <span className="text-blue-400 font-mono font-bold">{inputs.smv}m</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustValue('smv', -0.5, 0.5, 120)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={inputs.smv}
                onChange={(e) => onChangeInputs({ smv: parseFloat(e.target.value) || 0.1 })}
                className="w-full text-center text-lg font-bold text-white bg-slate-950/60 border border-slate-700 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => adjustValue('smv', 0.5, 0.5, 120)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Manpower Input with Stepper */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>Manpower (Operators)</span>
              <span className="text-blue-400 font-mono font-bold">{inputs.manpower} ops</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustValue('manpower', -1, 1, 300)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="1"
                min="1"
                value={inputs.manpower}
                onChange={(e) => onChangeInputs({ manpower: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-center text-lg font-bold text-white bg-slate-950/60 border border-slate-700 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => adjustValue('manpower', 1, 1, 300)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quantity Input with Stepper */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>Order Quantity (Pcs)</span>
              <span className="text-blue-400 font-mono font-bold">{formatNum(inputs.quantity, 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustValue('quantity', -1000, 100, 10000000)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-sm transition shrink-0"
                title="-1000"
              >
                -1k
              </button>
              <input
                type="number"
                step="500"
                min="1"
                value={inputs.quantity}
                onChange={(e) => onChangeInputs({ quantity: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-center text-lg font-bold text-white bg-slate-950/60 border border-slate-700 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => adjustValue('quantity', 1000, 100, 10000000)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-sm transition shrink-0"
                title="+1000"
              >
                +1k
              </button>
            </div>
          </div>

          {/* Lead Time (Days) */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>Lead Time (Days)</span>
              <span className="text-blue-400 font-mono font-bold">{inputs.leadTime} days</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustValue('leadTime', -1, 1, 90)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="1"
                min="1"
                max="90"
                value={inputs.leadTime}
                onChange={(e) => onChangeInputs({ leadTime: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-center text-lg font-bold text-white bg-slate-950/60 border border-slate-700 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => adjustValue('leadTime', 1, 1, 90)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Working Hours / Day */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>Hours / Day</span>
              <span className="text-blue-400 font-mono font-bold">{inputs.hoursDay} hrs</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustValue('hoursDay', -0.5, 1, 24)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="0.5"
                min="1"
                max="24"
                value={inputs.hoursDay}
                onChange={(e) => onChangeInputs({ hoursDay: parseFloat(e.target.value) || 8 })}
                className="w-full text-center text-lg font-bold text-white bg-slate-950/60 border border-slate-700 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => adjustValue('hoursDay', 0.5, 1, 24)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center font-bold text-base transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ladder Type Segmented Switcher */}
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              Productivity Ladder
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {(['Tight', 'Basic', 'Complex'] as LadderType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChangeInputs({ ladderType: type })}
                  className={`py-2 text-xs font-bold rounded-md transition-all active:scale-95 ${
                    inputs.ladderType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Planning Controls (Accordion / Expandable) */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* EFF Gap */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              EFF Gap (Planning Margin)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="0.5"
              value={inputs.effGap}
              onChange={(e) => onChangeInputs({ effGap: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. 0.05 for 5% gap"
            />
          </div>

          {/* Headline Basis */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Headline Basis
            </label>
            <select
              value={inputs.avgBasis}
              onChange={(e) => onChangeInputs({ avgBasis: e.target.value as 'best' | 'all' })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="best">Best Single Line</option>
              <option value="all">All Lines (Blended Avg)</option>
            </select>
          </div>

          {/* Manual Avg Pcs / Hour */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Manual Pcs/Hr (Optional)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={inputs.manualPcs || ''}
              onChange={(e) => onChangeInputs({ manualPcs: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="Blank = follow ladder"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Calculation Status Callout */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              Band: {inputs.ladderType} ({plan.band.band}) · Target @ 100%: {formatNum(plan.target, 2)} pcs/h
            </span>
          </div>
          {manualPcs > 0 ? (
            <p className="text-amber-300 pl-5">
              Holding manual average of <strong>{formatNum(manualPcs, 2)} pcs/hr</strong> ({formatPercent(manualPcs / plan.target)} efficiency). Ladder shape scales to peak at {formatNum(line1Peak, 1)} pcs/hr.
            </p>
          ) : (
            <p className="text-slate-400 pl-5">
              Plateau peak efficiency (Days 6–8): <strong>{formatPercent(Math.max(0, plan.band.days[7] - inputs.effGap))}</strong> → {formatNum(plan.target * Math.max(0, plan.band.days[7] - inputs.effGap), 1)} pcs/hr per line.
            </p>
          )}
        </div>
      </div>

      {/* Sequential Line Allocations */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              Sequential Line Allocations ({plan.numLines} {plan.numLines === 1 ? 'Line' : 'Lines'})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lines run sequentially. Full lines maximize lead time; last line sews remaining balance.
            </p>
          </div>
        </div>

        {/* Line Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {plan.lines.map((l) => {
            const isLast = l.line === plan.numLines && plan.numLines > 1;
            return (
              <div
                key={l.line}
                onClick={() => onSelectLineForRamp?.(l.line)}
                className={`p-3.5 rounded-xl border transition cursor-pointer active:scale-98 ${
                  isLast
                    ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                    : 'bg-slate-900/80 border-slate-700/70 hover:border-blue-500/60 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Line {l.line} {isLast && <span className="text-amber-400 text-[10px] uppercase font-semibold ml-1">(Remainder)</span>}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {formatPercent(l.avgEff)}
                  </span>
                </div>

                <div className="text-lg font-black text-white mt-1">
                  {formatNum(l.quantity, 0)} <span className="text-xs font-normal text-slate-400">pcs</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 font-mono">
                  <span>{l.days} days ({formatNum(l.lineHours, 1)} hrs)</span>
                  <span className="text-emerald-400">{l.avgPcsHour} pcs/h</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Line Allocations Summary Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 mt-3">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Line #</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3 text-right">Days</th>
                <th className="py-2.5 px-3 text-right">Line Hours</th>
                <th className="py-2.5 px-3 text-right">Avg Eff.</th>
                <th className="py-2.5 px-3 text-right">Pcs / Hr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {plan.lines.map((l) => (
                <tr key={l.line} className="hover:bg-slate-700/20">
                  <td className="py-2 px-3 font-semibold text-white">Line {l.line}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatNum(l.quantity, 0)}</td>
                  <td className="py-2 px-3 text-right font-mono">{l.days}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatNum(l.lineHours, 1)}</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-400">{formatPercent(l.avgEff)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-400">{l.avgPcsHour}</td>
                </tr>
              ))}
              <tr className="bg-slate-900/90 font-bold text-white border-t-2 border-slate-700">
                <td className="py-2.5 px-3">All Lines (Total)</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatNum(inputs.quantity, 0)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{inputs.leadTime}</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatNum(plan.totalHours, 1)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-300">{formatPercent(plan.avgEff)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-300">{plan.avgPcsHour}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparisons Grid (Alternative Lead Times & Quantities) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Same Quantity · Other Lead Times */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Same Qty ({formatNum(inputs.quantity, 0)}) · Other Lead Times
            </h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2 px-2.5">Lead Time</th>
                  <th className="py-2 px-2.5 text-right">{isBest ? 'Best Eff.' : 'Avg Eff.'}</th>
                  <th className="py-2 px-2.5 text-right">{isBest ? 'Best Pcs/h' : 'Avg Pcs/h'}</th>
                  <th className="py-2 px-2.5 text-right">Lines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {ALT_LEAD_TIMES.map((lt) => {
                  const altP = planOrder({ ...inputs, leadTime: lt });
                  const isCurrent = lt === inputs.leadTime;
                  return (
                    <tr
                      key={lt}
                      className={isCurrent ? 'bg-blue-950/40 text-blue-300 font-bold' : 'hover:bg-slate-700/20'}
                    >
                      <td className="py-1.5 px-2.5">
                        {lt} days {isCurrent && '★'}
                      </td>
                      <td className="py-1.5 px-2.5 text-right text-emerald-400">{formatPercent(altP.headEff)}</td>
                      <td className="py-1.5 px-2.5 text-right text-blue-400">{altP.headPcs}</td>
                      <td className="py-1.5 px-2.5 text-right text-white">{altP.numLines}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Same Lead Time · Other Quantities */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Same Lead Time ({inputs.leadTime}d) · Other Quantities
            </h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2 px-2.5">Quantity (pcs)</th>
                  <th className="py-2 px-2.5 text-right">{isBest ? 'Best Eff.' : 'Avg Eff.'}</th>
                  <th className="py-2 px-2.5 text-right">{isBest ? 'Best Pcs/h' : 'Avg Pcs/h'}</th>
                  <th className="py-2 px-2.5 text-right">Days</th>
                  <th className="py-2 px-2.5 text-right">Lines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {ALT_QUANTITIES.map((q) => {
                  const altP = planOrder({ ...inputs, quantity: q });
                  const isCurrent = q === inputs.quantity;
                  return (
                    <tr
                      key={q}
                      className={isCurrent ? 'bg-blue-950/40 text-blue-300 font-bold' : 'hover:bg-slate-700/20'}
                    >
                      <td className="py-1.5 px-2.5">{formatNum(q, 0)}</td>
                      <td className="py-1.5 px-2.5 text-right text-emerald-400">{formatPercent(altP.headEff)}</td>
                      <td className="py-1.5 px-2.5 text-right text-blue-400">{altP.headPcs}</td>
                      <td className="py-1.5 px-2.5 text-right">{altP.lines[altP.lines.length - 1]?.days || 0}</td>
                      <td className="py-1.5 px-2.5 text-right text-white">{altP.numLines}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
