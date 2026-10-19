import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { GARMENT_PRESETS, GarmentPreset } from '../utils/smvEngine';
import { OrderInputs } from '../types/smv';

interface StylePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: GarmentPreset) => void;
  currentInputs: OrderInputs;
}

export const StylePresetModal: React.FC<StylePresetModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentInputs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Android Drawer Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-base">Apparel Style Presets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-800/40">
          <p className="text-xs text-slate-400 mb-2">
            Select a garment template to load typical SMV, manpower, and sewing line parameters:
          </p>

          {GARMENT_PRESETS.map((preset) => {
            const isMatch = typeof currentInputs.smv === 'number' && Math.abs(currentInputs.smv - preset.smv) < 0.1 && currentInputs.manpower === preset.manpower;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`pt-2.5 pb-2.5 px-3 rounded-xl cursor-pointer border transition flex items-center justify-between gap-3 ${
                  isMatch
                    ? 'bg-blue-950/40 border-blue-500/50 text-white'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white truncate">{preset.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{preset.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-blue-400 font-mono">
                    <span>SMV: <strong>{preset.smv}m</strong></span>
                    <span>•</span>
                    <span>Operators: <strong>{preset.manpower}</strong></span>
                    <span>•</span>
                    <span>Ladder: <strong>{preset.ladderType}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  {isMatch ? (
                    <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-slate-700/80 text-slate-300 flex items-center justify-center group-hover:bg-blue-600">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
