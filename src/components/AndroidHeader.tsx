import React from 'react';
import { Sparkles, Printer, Smartphone, Share2, FileText } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidHeaderProps {
  onOpenPresets: () => void;
  onOpenPDF: () => void;
  onOpenGuide: () => void;
  onShare?: () => void;
  styleName?: string;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  onOpenPresets,
  onOpenPDF,
  onOpenGuide,
  onShare,
  styleName,
}) => {
  const { isInstallable, install, isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 text-slate-100 px-3 sm:px-6 pt-[max(env(safe-area-inset-top,0px),0.85rem)] pb-2.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Top Row on Mobile: Brand on Left, Primary [PDF Plan] on Right */}
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          {/* Brand Lockup */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19h16" />
                <path d="M4 15l4-4 4 4 8-8" />
                <circle cx="20" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-white leading-tight truncate">
                  SMV Planner
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                  Android
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                {styleName ? styleName : 'Garment Sewing Line Planner'}
              </p>
            </div>
          </div>

          {/* Primary Mobile Action: PDF Plan Button (Always Visible & Large) */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenPDF}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition min-h-[42px]"
              title="Open PDF / Print Plan"
            >
              <FileText className="w-4 h-4" />
              <span>PDF Plan</span>
            </button>
          </div>
        </div>

        {/* Secondary Actions Cluster: Mobile Action Strip or Desktop Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-between sm:justify-end shrink-0 pt-0.5 sm:pt-0">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto">
            {/* Presets Button */}
            <button
              onClick={onOpenPresets}
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition min-h-[38px]"
              title="Load garment style presets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Presets</span>
            </button>

            {/* APK Guide Button */}
            <button
              onClick={onOpenGuide}
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 active:scale-95 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition min-h-[38px]"
              title="Android APK & GitHub Actions Guide"
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>APK Guide</span>
            </button>

            {/* Desktop Only PDF Button (on mobile it's in top row) */}
            <button
              onClick={onOpenPDF}
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition min-h-[38px]"
              title="Export PDF / Print Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Plan</span>
            </button>

            {/* Install on Android PWA button (shown when installable) */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-medium shadow-sm transition min-h-[38px] animate-pulse"
                title="Install SMV Planner on your Android Device"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Quick Share button */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={onShare}
                type="button"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center border border-slate-700 transition shrink-0"
                title="Share Planner"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
