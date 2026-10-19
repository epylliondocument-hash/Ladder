import React from 'react';
import { OrderInputs, OrderPlan } from '../types/smv';
import { formatNum, formatPercent, ALT_LEAD_TIMES, ALT_QUANTITIES, planOrder } from '../utils/smvEngine';

interface PrintReportViewProps {
  plan: OrderPlan;
  inputs: OrderInputs;
  photoUrl: string | null;
  photoCaption: string;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  plan,
  inputs,
  photoUrl,
  photoCaption,
}) => {
  const { smv, manpower, quantity, leadTime, hoursDay, ladderType, effGap } = inputs;
  const isBest = inputs.avgBasis === 'best';
  const now = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const numHours = typeof hoursDay === 'number' ? hoursDay : (hoursDay ? parseFloat(hoursDay) : 10);
  const numManpower = typeof manpower === 'number' ? manpower : (manpower ? parseInt(manpower, 10) : 0);
  const numGap = typeof effGap === 'number' ? effGap : (effGap ? parseFloat(effGap) : 0);
  const numQty = typeof quantity === 'number' ? quantity : (quantity ? parseInt(quantity, 10) : 0);

  const line1 = plan.lines[0];
  const manualVal = typeof inputs.manualPcs === 'number' ? inputs.manualPcs : (inputs.manualPcs ? parseFloat(inputs.manualPcs) : 0);
  const peakPcs = manualVal > 0 && plan.lines.length
    ? Math.max(...plan.lines[0].dayPlan.map((x) => x.pcsHour))
    : plan.target * Math.max(0, plan.band.days[7] - numGap);
  const peakEff = plan.target > 0 ? peakPcs / plan.target : 0;
  const dailyTarget100 = plan.target * numHours;
  const totalManHours = plan.totalHours * numManpower;

  return (
    <div id="printReport" className="print-only p-4 bg-white text-slate-900 font-sans">
      {/* Header bar */}
      <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            SMV Productivity Ladder Plan
          </h1>
          {inputs.styleName && (
            <p className="text-sm font-semibold text-blue-800 mt-0.5">
              Style: {inputs.styleName} {inputs.buyerName ? `· Buyer: ${inputs.buyerName}` : ''}
            </p>
          )}
        </div>
        <div className="flex items-end gap-3">
          {photoUrl && (
            <div className="text-center">
              <img
                src={photoUrl}
                alt="Style"
                className="max-h-20 max-w-32 border border-slate-400 rounded object-contain bg-white"
              />
              {photoCaption && (
                <div className="text-[9px] text-slate-600 mt-0.5 max-w-32 truncate">{photoCaption}</div>
              )}
            </div>
          )}
          <div className="text-[10px] text-slate-600 text-right leading-tight">
            SMV Factory Planner<br />
            {now}
          </div>
        </div>
      </div>

      {/* Subtitle Badges */}
      <div className="text-xs text-slate-700 mb-3 flex flex-wrap items-center gap-1.5">
        <span className="bg-sky-100 text-sky-900 border border-sky-300 rounded px-1.5 py-0.5 font-bold">
          {ladderType} Ladder
        </span>
        <span className="bg-sky-100 text-sky-900 border border-sky-300 rounded px-1.5 py-0.5 font-bold">
          {plan.band.band}
        </span>
        {numGap > 0 && (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 font-bold">
            EFF Gap −{numGap}
          </span>
        )}
        <span className="text-[11px] text-slate-600 ml-1">
          Peak {formatPercent(peakEff)} ({formatNum(peakPcs, 1)} pcs/h) · Daily Target @ 100%: {formatNum(dailyTarget100, 0)} pcs/line
        </span>
      </div>

      {/* Input Meta Grid */}
      <div className="grid grid-cols-6 border border-slate-400 mb-3 bg-slate-50 text-xs">
        <div className="p-1.5 border-r border-slate-300">
          <div className="text-[9px] uppercase font-bold text-slate-500">SMV</div>
          <div className="font-bold text-sm text-slate-900">{smv}m</div>
        </div>
        <div className="p-1.5 border-r border-slate-300">
          <div className="text-[9px] uppercase font-bold text-slate-500">Manpower</div>
          <div className="font-bold text-sm text-slate-900">{manpower} ops</div>
        </div>
        <div className="p-1.5 border-r border-slate-300">
          <div className="text-[9px] uppercase font-bold text-slate-500">Quantity</div>
          <div className="font-bold text-sm text-slate-900">{formatNum(numQty, 0)}</div>
        </div>
        <div className="p-1.5 border-r border-slate-300">
          <div className="text-[9px] uppercase font-bold text-slate-500">Lead Time</div>
          <div className="font-bold text-sm text-slate-900">{leadTime} d</div>
        </div>
        <div className="p-1.5 border-r border-slate-300">
          <div className="text-[9px] uppercase font-bold text-slate-500">Hours / Day</div>
          <div className="font-bold text-sm text-slate-900">{hoursDay} h</div>
        </div>
        <div className="p-1.5">
          <div className="text-[9px] uppercase font-bold text-slate-500">Target 100%</div>
          <div className="font-bold text-sm text-slate-900">{formatNum(plan.target, 1)} /h</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-1.5 mb-3 text-center">
        <div className="border border-blue-400 bg-blue-50 p-1.5 rounded">
          <div className="text-base font-extrabold text-blue-900 leading-tight">{formatPercent(plan.headEff)}</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">{isBest ? 'Best Eff.' : 'Avg Eff.'}</div>
        </div>
        <div className="border border-blue-400 bg-blue-50 p-1.5 rounded">
          <div className="text-base font-extrabold text-blue-900 leading-tight">{plan.headPcs}</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">{isBest ? 'Best Pcs/h' : 'Avg Pcs/h'}</div>
        </div>
        <div className="border border-slate-400 bg-slate-100 p-1.5 rounded">
          <div className="text-base font-extrabold text-slate-900 leading-tight">{plan.numLines} × {leadTime}d</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">Lines × Days</div>
        </div>
        <div className="border border-slate-400 bg-slate-100 p-1.5 rounded">
          <div className="text-base font-extrabold text-slate-900 leading-tight">{formatNum(plan.totalHours, 1)}</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">Total Hours</div>
        </div>
        <div className="border border-slate-400 bg-slate-100 p-1.5 rounded">
          <div className="text-base font-extrabold text-slate-900 leading-tight">{formatNum(totalManHours, 0)}</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">Man-Hours</div>
        </div>
        <div className="border border-slate-400 bg-slate-100 p-1.5 rounded">
          <div className="text-base font-extrabold text-slate-900 leading-tight">{formatNum(plan.qtyPerFullLine, 0)}</div>
          <div className="text-[8px] uppercase tracking-wider font-bold text-slate-600">Pcs / Full Line</div>
        </div>
      </div>

      {/* Ladder Ramp Strip */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1">
          Efficiency Ramp ({ladderType} · {plan.band.band})
        </h2>
        <div className="flex border border-slate-300 text-center text-xs">
          {plan.band.days.map((e, i) => {
            const val = Math.max(0, e - (numGap || 0));
            return (
              <div key={i} className="flex-1 py-1 border-r border-slate-300 last:border-r-0 bg-slate-50">
                <div className="text-[9px] text-slate-500 font-bold">Day {i + 1}{i === 7 ? '+' : ''}</div>
                <div className="font-extrabold text-slate-900">{(val * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Plan Line 1 */}
      {line1 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1">
            Day Plan — Line 1 of {plan.numLines}
          </h2>
          <table className="w-full text-[10px] text-right border border-slate-300">
            <thead className="bg-slate-800 text-white font-bold uppercase text-[9px]">
              <tr>
                <th className="py-1 px-1.5 text-left">Day</th>
                <th className="py-1 px-1.5">Efficiency</th>
                <th className="py-1 px-1.5">Pcs / Hr</th>
                <th className="py-1 px-1.5">Hours</th>
                <th className="py-1 px-1.5">Output (pcs)</th>
                <th className="py-1 px-1.5">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {line1.dayPlan.map((d) => (
                <tr key={d.day} className={d.day % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="py-1 px-1.5 text-left font-bold">{d.day}</td>
                  <td className="py-1 px-1.5 font-bold text-blue-900">{formatPercent(d.efficiency)}</td>
                  <td className="py-1 px-1.5">{formatNum(d.pcsHour, 2)}</td>
                  <td className="py-1 px-1.5">{formatNum(d.hours, 2)}</td>
                  <td className="py-1 px-1.5 font-semibold text-slate-900">{formatNum(d.output, 1)}</td>
                  <td className="py-1 px-1.5 text-slate-600">{formatNum(d.remaining, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Line by Line Breakdown */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1">
          Sequential Line Breakdown
        </h2>
        <table className="w-full text-[10px] text-right border border-slate-300">
          <thead className="bg-slate-800 text-white font-bold uppercase text-[9px]">
            <tr>
              <th className="py-1 px-1.5 text-left">Line</th>
              <th className="py-1 px-1.5">Quantity (pcs)</th>
              <th className="py-1 px-1.5">Days</th>
              <th className="py-1 px-1.5">Line Hours</th>
              <th className="py-1 px-1.5">Avg Efficiency</th>
              <th className="py-1 px-1.5">Avg Pcs / Hr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {plan.lines.map((l) => (
              <tr key={l.line} className="hover:bg-slate-50">
                <td className="py-1 px-1.5 text-left font-bold">Line {l.line}</td>
                <td className="py-1 px-1.5 font-semibold">{formatNum(l.quantity, 1)}</td>
                <td className="py-1 px-1.5">{l.days}</td>
                <td className="py-1 px-1.5">{formatNum(l.lineHours, 2)}</td>
                <td className="py-1 px-1.5 font-bold text-blue-900">{formatPercent(l.avgEff)}</td>
                <td className="py-1 px-1.5 font-semibold">{l.avgPcsHour}</td>
              </tr>
            ))}
            <tr className="bg-sky-100 font-bold border-t-2 border-slate-800 text-slate-900">
              <td className="py-1 px-1.5 text-left">All Lines (Total)</td>
              <td className="py-1 px-1.5">{formatNum(numQty, 0)}</td>
              <td className="py-1 px-1.5">{leadTime}</td>
              <td className="py-1 px-1.5">{formatNum(plan.totalHours, 2)}</td>
              <td className="py-1 px-1.5">{formatPercent(plan.avgEff)}</td>
              <td className="py-1 px-1.5">{plan.avgPcsHour}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparisons 2-column grid */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <h2 className="text-[11px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">
            Same Qty · Other Lead Times
          </h2>
          <table className="w-full text-[9px] text-right border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-1 text-left">Lead Time</th>
                <th className="p-1">{isBest ? 'Best Eff.' : 'Avg Eff.'}</th>
                <th className="p-1">Pcs/h</th>
                <th className="p-1">Lines</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {ALT_LEAD_TIMES.map((lt) => {
                const altP = planOrder({ ...inputs, leadTime: lt });
                const isCurrent = lt === leadTime;
                return (
                  <tr key={lt} className={isCurrent ? 'bg-amber-100 font-bold' : ''}>
                    <td className="p-1 text-left">{lt}d {isCurrent ? '★' : ''}</td>
                    <td className="p-1">{formatPercent(altP.headEff)}</td>
                    <td className="p-1">{altP.headPcs}</td>
                    <td className="p-1">{altP.numLines}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1">
            Same Lead Time · Other Quantities
          </h2>
          <table className="w-full text-[9px] text-right border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-1 text-left">Quantity</th>
                <th className="p-1">{isBest ? 'Best Eff.' : 'Avg Eff.'}</th>
                <th className="p-1">Pcs/h</th>
                <th className="p-1">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {ALT_QUANTITIES.map((q) => {
                const altP = planOrder({ ...inputs, quantity: q });
                return (
                  <tr key={q}>
                    <td className="p-1 text-left">{formatNum(q, 0)}</td>
                    <td className="p-1">{formatPercent(altP.headEff)}</td>
                    <td className="p-1">{altP.headPcs}</td>
                    <td className="p-1">{altP.lines[altP.lines.length - 1]?.days || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-400 text-[9px] text-slate-500 flex justify-between">
        <span>SMV Productivity Ladder Planner · Industrial Engineering Garment Calculation</span>
        <span>Generated {now}</span>
      </div>
    </div>
  );
};
