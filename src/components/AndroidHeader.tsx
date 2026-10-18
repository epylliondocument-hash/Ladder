import React from 'react';
import { Download, Sparkles, Printer, Smartphone, Share2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidHeaderProps {
  onOpenPresets: () => void;
  onPrint: () => void;
  onOpenGuide: () => void;
  onShare?: () => void;
  styleName?: string;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  onOpenPresets,
  onPrint,
  onOpenGuide,
  onShare,
  styleName
}) => {
  const { isInstallable, install, isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 transition-all">
      {/* Top Android App Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19h16" />
              <path d="M4 15l4-4 4 4 8-8" />
              <circle cx="20" cy="7" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                SMV Planner
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Android
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {styleName ? styleName : 'Garment Sewing Line & Productivity Ladder'}
            </p>
          </div>
        </div>

        {/* Actions Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* APK & GitHub Guide */}
          <button
            onClick={onOpenGuide}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 active:scale-95 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition min-h-[38px]"
            title="Android APK & GitHub Actions Guide"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK Guide</span>
          </button>

          {/* Preset Styles Button */}
          <button
            onClick={onOpenPresets}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium border border-slate-700/80 transition min-h-[38px]"
            title="Load apparel presets"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Presets</span>
          </button>

          {/* PDF / Print Button */}
          <button
            onClick={onPrint}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-sm transition min-h-[38px]"
            title="Export PDF / Print Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Plan</span>
          </button>

          {/* Install on Android PWA button (shown when installable) */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-medium shadow-sm transition min-h-[38px] animate-pulse"
              title="Install SMV Planner on your Android Device"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Quick Share button on supported browsers */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={onShare}
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center transition"
              title="Share Planner"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
