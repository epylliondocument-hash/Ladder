import React, { useState } from 'react';
import { OrderInputs, LaddersData } from '../types/smv';
import { LADDERS, TYPICAL_SMV, target100, planOrder, formatNum, formatPercent } from '../utils/smvEngine';
import { Grid } from 'lucide-react';

interface MatrixTabProps {
  inputs: OrderInputs;
  customLadders?: LaddersData;
}

type MatrixMode = 'eff' | 'pcs' | 'lines';

export const MatrixTab: React.FC<MatrixTabProps> = ({ inputs, customLadders }) => {
  const [mode, setMode] = useState<MatrixMode>('eff');
  const leadTimes = [40, 30, 25, 21, 14, 12, 10, 7];

  const activeLadders = customLadders || LADDERS;
  const bands = activeLadders[inputs.ladderType] || activeLadders.Tight;

  const numManpower = typeof inputs.manpower === 'number' ? inputs.manpower : (inputs.manpower ? parseInt(inputs.manpower, 10) : 40);
  const numQuantity = typeof inputs.quantity === 'number' ? inputs.quantity : (inputs.quantity ? parseInt(inputs.quantity, 10) : 25000);
  const numSmv = typeof inputs.smv === 'number' ? inputs.smv : (inputs.smv ? parseFloat(inputs.smv) : 0);
  const numLeadTime = typeof inputs.leadTime === 'number' ? inputs.leadTime : (inputs.leadTime ? parseInt(inputs.leadTime, 10) : 14);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
              Lead Time × SMV Range Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates {inputs.ladderType} ladder at {numManpower} operators & {formatNum(numQuantity, 0)} pcs
            </p>
          </div>

          {/* Metric View Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setMode('eff')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                mode === 'eff'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Efficiency
            </button>
            <button
              type="button"
              onClick={() => setMode('pcs')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                mode === 'pcs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pcs / Hr
            </button>
            <button
              type="button"
              onClick={() => setMode('lines')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                mode === 'lines'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lines × Days
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Shows how efficiency scales as lead time tightens or broadens across all garment complexity bands.
        </p>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-left">SMV Range</th>
                <th className="py-2.5 px-2 text-right">Typical</th>
                <th className="py-2.5 px-2 text-right">Target 100%</th>
                {leadTimes.map((lt) => (
                  <th
                    key={lt}
                    className={`py-2.5 px-2 text-right ${
                      lt === numLeadTime ? 'text-blue-400 font-bold bg-blue-950/40' : ''
                    }`}
                  >
                    {lt}d
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {bands.map((band, idx) => {
                const smvUsed = TYPICAL_SMV[idx];
                const target = target100(numManpower, smvUsed);
                const isCurrentBand = numSmv > band.above && numSmv <= band.upTo;

                return (
                  <tr
                    key={band.band}
                    className={`${
                      isCurrentBand
                        ? 'bg-blue-950/30 font-bold border-l-2 border-blue-500'
                        : 'hover:bg-slate-700/20'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-left font-sans font-medium text-slate-200 whitespace-nowrap">
                      {band.band} {isCurrentBand && '★'}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400">{smvUsed}m</td>
                    <td className="py-2.5 px-2 text-amber-400">{formatNum(target, 1)}</td>

                    {leadTimes.map((lt) => {
                      const p = planOrder({
                        ...inputs,
                        smv: smvUsed,
                        manpower: numManpower,
                        quantity: numQuantity,
                        leadTime: lt,
                      }, customLadders);
                      const isColActive = lt === numLeadTime;

                      let cellContent = '';
                      if (mode === 'eff') cellContent = formatPercent(p.headEff);
                      else if (mode === 'pcs') cellContent = `${p.headPcs}`;
                      else cellContent = `${p.numLines}×${lt}d`;

                      return (
                        <td
                          key={lt}
                          className={`py-2 px-2 whitespace-nowrap ${
                            isColActive ? 'bg-blue-950/40 text-blue-300 font-bold' : ''
                          } ${mode === 'eff' ? 'text-emerald-400' : mode === 'pcs' ? 'text-blue-300' : 'text-slate-200'}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
