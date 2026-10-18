import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, install, isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = React.useState(false);

  if (isInstalled || !isInstallable || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900/90 border-b border-blue-500/30 px-4 py-2.5 text-white flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center shrink-0 border border-blue-400/40">
          <Download className="w-4 h-4 text-blue-300" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">Install SMV Planner on Android</p>
          <p className="text-[11px] text-blue-200/80 truncate">Run full offline app with instant home-screen launch</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={install}
          type="button"
          className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-xs font-medium transition shadow-sm"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          type="button"
          className="p-1 rounded hover:bg-white/10 text-blue-200"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500/90 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-slate-950 shadow-lg border border-amber-400">
      <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
      <span>Offline Mode — All Calculations Work 100% Offline</span>
    </div>
  );
};
