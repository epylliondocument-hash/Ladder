import React, { useState } from 'react';
import { OrderPlan, OrderInputs } from '../types/smv';
import { formatNum, formatPercent } from '../utils/smvEngine';
import { TrendingUp, Award, Layers } from 'lucide-react';

interface DayRampTabProps {
  plan: OrderPlan;
  inputs: OrderInputs;
  selectedLine?: number;
}

export const DayRampTab: React.FC<DayRampTabProps> = ({
  plan,
  inputs,
  selectedLine = 1,
}) => {
  const [activeLineNum, setActiveLineNum] = useState<number>(selectedLine);

  const activeLine = plan.lines.find((l) => l.line === activeLineNum) || plan.lines[0];
  const maxDayPcs = activeLine
    ? Math.max(...activeLine.dayPlan.map((d) => d.pcsHour * inputs.hoursDay), 1)
    : 100;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header and Line Switcher */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
              Day-by-Day Production Ramp
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual learning curve and daily sewing output per line
            </p>
          </div>

          {/* Line Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {plan.lines.map((l) => (
              <button
                key={l.line}
                type="button"
                onClick={() => setActiveLineNum(l.line)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                  activeLineNum === l.line
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                Line {l.line}
              </button>
            ))}
          </div>
        </div>

        {/* Active Line Stats Banner */}
        {activeLine && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Quantity</span>
              <p className="text-base font-bold text-white font-mono mt-0.5">{formatNum(activeLine.quantity, 0)} pcs</p>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Line Days</span>
              <p className="text-base font-bold text-white font-mono mt-0.5">{activeLine.days} days ({formatNum(activeLine.lineHours, 1)}h)</p>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Avg Efficiency</span>
              <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{formatPercent(activeLine.avgEff)}</p>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Avg Pcs / Hour</span>
              <p className="text-base font-bold text-blue-400 font-mono mt-0.5">{activeLine.avgPcsHour} pcs/h</p>
            </div>
          </div>
        )}
      </div>

      {/* Visual Efficiency Chart / Ramp Graph */}
      {activeLine && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Efficiency Curve (%) & Output (Pcs)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Target @ 100%: {formatNum(plan.target, 1)} pcs/hr
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="space-y-2 pt-2">
            {activeLine.dayPlan.map((d) => {
              const effPercent = Math.min(100, Math.round(d.efficiency * 1000) / 10);
              const isPeak = d.day >= 6 && Math.abs(d.efficiency - plan.band.days[7]) < 0.02;

              return (
                <div key={d.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      Day {d.day}
                      {isPeak && (
                        <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Plateau
                        </span>
                      )}
                    </span>
                    <span className="text-slate-300">
                      <strong className="text-emerald-400">{effPercent}%</strong> ({formatNum(d.pcsHour, 1)} pcs/h · {formatNum(d.output, 0)} pcs)
                    </span>
                  </div>

                  {/* Dual Bar Progress */}
                  <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60 flex items-center">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.max(4, effPercent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Day-by-Day Table */}
      {activeLine && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Detailed Day Breakdown — Line {activeLine.line}
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3 text-right">Efficiency</th>
                  <th className="py-2.5 px-3 text-right">Pcs / Hour</th>
                  <th className="py-2.5 px-3 text-right">Hours</th>
                  <th className="py-2.5 px-3 text-right">Output (pcs)</th>
                  <th className="py-2.5 px-3 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activeLine.dayPlan.map((d) => (
                  <tr key={d.day} className="hover:bg-slate-700/20">
                    <td className="py-2 px-3 font-semibold text-white">Day {d.day}</td>
                    <td className="py-2 px-3 text-right text-emerald-400">{formatPercent(d.efficiency)}</td>
                    <td className="py-2 px-3 text-right text-blue-400">{formatNum(d.pcsHour, 1)}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{formatNum(d.hours, 1)}</td>
                    <td className="py-2 px-3 text-right font-bold text-white">{formatNum(d.output, 0)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{formatNum(d.remaining, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
