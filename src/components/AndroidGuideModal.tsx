import React from 'react';
import { X, CheckCircle, Smartphone, Github, Download, AlertCircle } from 'lucide-react';

interface AndroidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidGuideModal: React.FC<AndroidGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">Android App & GitHub Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* GitHub Action Error Solved Box */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>GitHub Actions Error Fixed!</span>
            </div>
            <p className="text-slate-300">
              Your screenshot showed: <code className="bg-slate-950 px-1 py-0.5 rounded text-red-300 font-mono text-[11px]">No file matched to [**/*.gradle*...]</code>.
            </p>
            <p className="text-slate-400">
              This happened because GitHub’s default "Android CI" template expects a native Java/Gradle project in root. We have now added the full <strong>Capacitor Android</strong> native project (in <code className="text-blue-400">/android</code>) and configured a customized workflow at <code className="text-blue-400">.github/workflows/android.yml</code>.
            </p>
          </div>

          {/* 2 Ways to Get the App */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">
              How to get this app on your Android phone:
            </h4>

            {/* Way 1: Instant PWA */}
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-1.5">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5 text-blue-300">
                  <Smartphone className="w-4 h-4" /> Option 1: 1-Tap Install (Easiest)
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">No APK Needed</span>
              </div>
              <p className="text-slate-300">
                1. Open this website in <strong>Google Chrome</strong> on your Android phone.<br />
                2. Tap the blue <strong>Install App</strong> button or Chrome menu (⋮) → <strong>Install App</strong>.<br />
                3. The app will be added directly to your home screen with its icon and works completely offline!
              </p>
            </div>

            {/* Way 2: GitHub APK Artifact */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Github className="w-4 h-4" /> Option 2: Download APK from GitHub
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">.apk file</span>
              </div>
              <p className="text-slate-300">
                1. Push your updated code to your GitHub repository.<br />
                2. Go to the <strong>Actions</strong> tab on your GitHub repository.<br />
                3. Click on the completed <strong>Android Build & APK Generator</strong> workflow.<br />
                4. Download <strong>SMV-Productivity-Ladder-Debug-APK</strong> under <em>Artifacts</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
