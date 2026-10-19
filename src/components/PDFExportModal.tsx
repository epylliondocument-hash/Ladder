import React, { useState } from 'react';
import { X, Printer, Share2, Copy, Check, FileText, Download, Smartphone } from 'lucide-react';
import { OrderInputs, OrderPlan } from '../types/smv';
import { formatNum, formatPercent } from '../utils/smvEngine';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  plan: OrderPlan;
  inputs: OrderInputs;
  photoUrl: string | null;
  photoCaption: string;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  plan,
  inputs,
  photoUrl,
  photoCaption,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isBest = inputs.avgBasis === 'best';

  // Generate formatted plan text for WhatsApp / Email sharing
  const getPlanSummaryText = () => {
    return `📋 *SMV SEWING CAPACITY PLAN*
────────────────────────
👔 *Style:* ${inputs.styleName || 'Garment Order'}
${inputs.buyerName ? `🏢 *Buyer:* ${inputs.buyerName}\n` : ''}${inputs.poNumber ? `🔖 *PO:* ${inputs.poNumber}\n` : ''}⏱️ *SMV:* ${inputs.smv || '—'} min/pc
👥 *Manpower:* ${inputs.manpower || '—'} operators
📦 *Total Quantity:* ${formatNum(typeof inputs.quantity === 'number' ? inputs.quantity : (inputs.quantity ? parseInt(inputs.quantity, 10) : 0), 0)} pcs
📅 *Lead Time:* ${inputs.leadTime || '—'} days (${inputs.hoursDay || '—'} hrs/day)
🪜 *Ladder:* ${inputs.ladderType} (${plan.band.band})
────────────────────────
🎯 *Target @ 100%:* ${formatNum(plan.target, 1)} pcs/hr
⚡ *${isBest ? 'Best Line Efficiency' : 'Avg Efficiency'}:* ${formatPercent(plan.headEff)}
📈 *${isBest ? 'Best Pcs / Hour' : 'Avg Pcs / Hour'}:* ${plan.headPcs} pcs/hr
🏭 *Lines Required:* ${plan.numLines} lines (${plan.numLines} × ${inputs.leadTime}d)
⏱️ *Total Line Hours:* ${formatNum(plan.totalHours, 1)} hrs
📦 *Pcs / Full Line:* ${formatNum(plan.qtyPerFullLine, 0)} pcs
────────────────────────
*Sequential Lines Breakdown:*
${plan.lines
  .map(
    (l) =>
      `• Line ${l.line}: ${formatNum(l.quantity, 0)} pcs (${l.days} days, ${formatPercent(l.avgEff)} eff, ${l.avgPcsHour} pcs/h)`
  )
  .join('\n')}
────────────────────────
_Generated via SMV Productivity Ladder Android Planner_`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getPlanSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SMV Plan - ${inputs.styleName || 'Garment Order'}`,
          text: getPlanSummaryText(),
        });
      } catch (e) {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handlePrintClick = () => {
    onPrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Android Drawer Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export & PDF Plan</h3>
              <p className="text-[11px] text-slate-400">Print sheet or share order breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Primary Action: Direct Print / PDF Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Print or Save as PDF
                </span>
                <span className="text-[11px] text-blue-200/80">
                  Full formatted A4 factory report with style photo & tables
                </span>
              </div>
            </div>

            <button
              onClick={handlePrintClick}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition min-h-[46px]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              💡 On Android: In the print screen, tap <strong className="text-slate-300">"Select a printer" → "Save as PDF"</strong>.
            </p>
          </div>

          {/* Quick Sharing Options */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShare}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition min-h-[44px]"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Share Plan</span>
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Live Plan Summary Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase text-[11px]">
                {inputs.styleName || 'Order Summary'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                {inputs.ladderType} Ladder
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">SMV:</span>
                <span className="text-white font-bold">{inputs.smv} min</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Manpower:</span>
                <span className="text-white font-bold">{inputs.manpower} operators</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Quantity:</span>
                <span className="text-white font-bold">{formatNum(typeof inputs.quantity === 'number' ? inputs.quantity : (inputs.quantity ? parseInt(inputs.quantity, 10) : 0), 0)} pcs</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Lead Time:</span>
                <span className="text-white font-bold">{inputs.leadTime} days ({inputs.hoursDay}h/d)</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Target 100%:</span>
                <span className="text-amber-400 font-bold">{formatNum(plan.target, 1)} pcs/hr</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Efficiency:</span>
                <span className="text-emerald-400 font-bold">{formatPercent(plan.headEff)}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Lines Required:</span>
                <span className="text-orange-400 font-bold">{plan.numLines} lines ({plan.numLines} × {inputs.leadTime}d)</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[10px]">Total Hours:</span>
                <span className="text-white font-bold">{formatNum(plan.totalHours, 1)} hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
