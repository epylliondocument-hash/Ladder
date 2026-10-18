import React, { useState } from 'react';
import { LADDERS } from '../utils/smvEngine';
import { LadderType } from '../types/smv';
import { Layers, ArrowRight } from 'lucide-react';

interface LaddersTabProps {
  currentLadder: LadderType;
  currentSmv: number;
  onSelectLadder: (ladder: LadderType) => void;
}

export const LaddersTab: React.FC<LaddersTabProps> = ({
  currentLadder,
  currentSmv,
  onSelectLadder,
}) => {
  const [selectedLadderView, setSelectedLadderView] = useState<LadderType>(currentLadder);

  const bands = LADDERS[selectedLadderView];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header and Switcher */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
              Efficiency Ladders Reference
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard garment sewing line Day 1 to Day 8+ ramp percentages
            </p>
          </div>

          {/* Ladder Selector */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            {(['Tight', 'Basic', 'Complex'] as LadderType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedLadderView(type);
                  onSelectLadder(type);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95 ${
                  selectedLadderView === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <p className="font-semibold text-white">
            Active: <span className="text-blue-400">{selectedLadderView}</span> Ladder · Bands touch continuously without gaps.
          </p>
          <p className="text-slate-400">
            Day 1 to 8 represent the ramp-up phase. After Day 8, the Day 8 efficiency value repeats as the continuous production plateau.
          </p>
        </div>
      </div>

      {/* Ladder Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg">
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-left">SMV Range</th>
                {Array.from({ length: 8 }, (_, i) => (
                  <th key={i} className="py-2.5 px-2 text-center">
                    Day {i + 1}{i === 7 ? '+' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {bands.map((band) => {
                const isCurrentBand = currentSmv > band.above && currentSmv <= band.upTo;

                return (
                  <tr
                    key={band.band}
                    className={`${
                      isCurrentBand
                        ? 'bg-blue-950/40 font-bold border-l-2 border-blue-500'
                        : 'hover:bg-slate-700/20'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-left font-sans font-medium text-slate-200 whitespace-nowrap">
                      {band.band} {isCurrentBand && '★ (Your Order)'}
                    </td>

                    {band.days.map((dayVal, dayIdx) => (
                      <td
                        key={dayIdx}
                        className={`py-2 px-2 text-center ${
                          dayIdx === 7 ? 'text-emerald-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {(dayVal * 100).toFixed(0)}%
                      </td>
                    ))}
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
