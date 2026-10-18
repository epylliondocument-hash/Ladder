import React from 'react';
import { SavedStyle, OrderInputs } from '../types/smv';
import { Bookmark, Plus, Trash2, ArrowUpRight, Shirt, Calendar, Users, Clock } from 'lucide-react';
import { formatNum } from '../utils/smvEngine';

interface SavedStylesTabProps {
  savedStyles: SavedStyle[];
  onSaveCurrent: () => void;
  onLoadStyle: (style: SavedStyle) => void;
  onDeleteStyle: (id: string) => void;
  currentInputs: OrderInputs;
}

export const SavedStylesTab: React.FC<SavedStylesTabProps> = ({
  savedStyles,
  onSaveCurrent,
  onLoadStyle,
  onDeleteStyle,
  currentInputs,
}) => {
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header and Quick Save Action */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              Saved Factory Styles & Plans ({savedStyles.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Locally saved garment orders with photo attachments and line configurations
            </p>
          </div>

          <button
            onClick={onSaveCurrent}
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current Plan</span>
          </button>
        </div>

        {/* Current Active Plan Preview Banner */}
        <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Current in Planner:</span>
            <p className="text-white font-bold truncate">
              {currentInputs.styleName || 'Unsaved Style'} · SMV: {currentInputs.smv}m · {formatNum(currentInputs.quantity, 0)} pcs
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono shrink-0">
            {currentInputs.ladderType} Ladder
          </span>
        </div>
      </div>

      {/* List of Saved Styles */}
      {savedStyles.length === 0 ? (
        <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-white">No Saved Styles Yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Save Current Plan" above to store this sewing order with its picture, SMV, manpower, and line ramp parameters.
          </p>
          <button
            onClick={onSaveCurrent}
            type="button"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Save Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedStyles.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md flex flex-col justify-between space-y-3 hover:border-slate-600 transition"
            >
              {/* Top row: Photo + Name + Date */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Shirt className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                  {item.buyer && (
                    <p className="text-xs text-slate-400 truncate">Buyer: {item.buyer}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Middle row: Parameters */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center font-mono text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans uppercase">SMV</span>
                  <span className="font-bold text-blue-400">{item.smv}m</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans uppercase">Quantity</span>
                  <span className="font-bold text-white">{formatNum(item.quantity, 0)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-sans uppercase">Lead Time</span>
                  <span className="font-bold text-emerald-400">{item.leadTime}d</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                <button
                  onClick={() => onDeleteStyle(item.id)}
                  type="button"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700/50 transition"
                  title="Delete style"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onLoadStyle(item)}
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-sm transition"
                >
                  <span>Load Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
