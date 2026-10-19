import React, { useState } from 'react';
import { LadderType, LaddersData, BandDefinition } from '../types/smv';
import { Lock, Unlock, Key, Check, RotateCcw, AlertTriangle, Save, Shield, ShieldCheck, X } from 'lucide-react';

interface LaddersTabProps {
  currentLadder: LadderType;
  currentSmv: number | '';
  onSelectLadder: (ladder: LadderType) => void;
  customLadders: LaddersData;
  onUpdateLadders: (updated: LaddersData) => void;
  onResetLadders: () => void;
}

const PASSWORD_KEY = 'smvPlanner.ladderPassword.v1';
const DEFAULT_PASS = '1234';

export const LaddersTab: React.FC<LaddersTabProps> = ({
  currentLadder,
  currentSmv,
  onSelectLadder,
  customLadders,
  onUpdateLadders,
  onResetLadders,
}) => {
  const [selectedLadderView, setSelectedLadderView] = useState<LadderType>(currentLadder);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [changePassMsg, setChangePassMsg] = useState({ text: '', isError: false });

  // Local draft of ladders being edited
  const [draftLadders, setDraftLadders] = useState<LaddersData>(() => JSON.parse(JSON.stringify(customLadders)));

  React.useEffect(() => {
    setDraftLadders(JSON.parse(JSON.stringify(customLadders)));
  }, [customLadders]);

  const getSavedPassword = () => {
    try {
      return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASS;
    } catch (e) {
      return DEFAULT_PASS;
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getSavedPassword();
    if (enteredPassword === correctPass) {
      setIsUnlocked(true);
      setIsPasswordModalOpen(false);
      setEnteredPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. (Default is 1234)');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getSavedPassword();
    if (oldPass !== correctPass) {
      setChangePassMsg({ text: 'Current password does not match.', isError: true });
      return;
    }
    if (!newPass || newPass.length < 3) {
      setChangePassMsg({ text: 'New password must be at least 3 characters.', isError: true });
      return;
    }

    try {
      localStorage.setItem(PASSWORD_KEY, newPass);
      setChangePassMsg({ text: 'Password successfully updated!', isError: false });
      setTimeout(() => {
        setIsChangePassModalOpen(false);
        setOldPass('');
        setNewPass('');
        setChangePassMsg({ text: '', isError: false });
      }, 1500);
    } catch (e) {
      setChangePassMsg({ text: 'Failed to save password.', isError: true });
    }
  };

  const handleCellChange = (bandIndex: number, dayIndex: number, valStr: string) => {
    const valNum = parseFloat(valStr);
    const decimal = isNaN(valNum) ? 0 : Math.max(0, Math.min(100, valNum)) / 100;

    setDraftLadders((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[selectedLadderView][bandIndex].days[dayIndex] = decimal;
      return copy;
    });
  };

  const handleSaveLadders = () => {
    onUpdateLadders(draftLadders);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all efficiency ladders to standard factory defaults?')) {
      onResetLadders();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const activeBands = isUnlocked
    ? draftLadders[selectedLadderView]
    : customLadders[selectedLadderView];

  const numSmv = typeof currentSmv === 'number' ? currentSmv : (currentSmv ? parseFloat(currentSmv) : 0);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header, Ladder Switcher, and Password Lock Status */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Efficiency Ladders
              </h2>
              {isUnlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Unlocked (Editing Mode)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/60">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Protected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Day 1 to Day 8+ sewing line ramp standards by SMV band
            </p>
          </div>

          {/* Action Buttons: Unlock / Lock / Change Password */}
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveLadders}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangePassModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs font-medium border border-slate-700"
                  title="Change Password"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Pass</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xs font-medium border border-slate-700"
                  title="Reset to Factory Defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-xs font-semibold"
                  title="Lock Ladders"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEnteredPassword('');
                  setPasswordError('');
                  setIsPasswordModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-sm transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock & Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Ladder Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0 max-w-xs">
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

          <div className="text-xs text-slate-400">
            Active in Planner: <strong className="text-blue-400">{selectedLadderView}</strong>
            {isUnlocked && <span className="text-emerald-400 ml-2 font-medium">✏️ Editing values live</span>}
          </div>
        </div>

        {/* Feedback Alert on Save */}
        {saveSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ladders successfully saved and applied to all capacity calculations!</span>
          </div>
        )}
      </div>

      {/* Ladder Table (Read-Only or Editable) */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
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
              {activeBands.map((band, bIdx) => {
                const isCurrentBand = numSmv > band.above && numSmv <= band.upTo;

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
                      {band.band} {isCurrentBand && '★ (Active)'}
                    </td>

                    {band.days.map((dayVal, dayIdx) => (
                      <td key={dayIdx} className="py-1 px-1 text-center">
                        {isUnlocked ? (
                          <div className="relative inline-flex items-center justify-center">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              max="100"
                              inputMode="numeric"
                              value={Math.round(dayVal * 100)}
                              onChange={(e) => handleCellChange(bIdx, dayIdx, e.target.value)}
                              className="w-12 text-center py-1 px-1 rounded-md bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-[10px] text-slate-500 ml-0.5">%</span>
                          </div>
                        ) : (
                          <span
                            className={
                              dayIdx === 7 ? 'text-emerald-400 font-bold' : 'text-slate-300'
                            }
                          >
                            {(dayVal * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isUnlocked && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Type numbers directly (e.g. 25 = 25%). Click Save when finished.
            </span>
            <button
              onClick={handleSaveLadders}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Password Prompt Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Unlock Ladders</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <p className="text-xs text-slate-400">
                Enter your engineering password to edit efficiency curves.
              </p>

              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Password (Default: 1234)"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {passwordError && (
                  <p className="text-xs text-red-400 mt-1 font-medium">{passwordError}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Default: <strong>1234</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Change Password</h3>
              </div>
              <button
                onClick={() => setIsChangePassModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 3 chars)"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {changePassMsg.text && (
                <p
                  className={`text-xs font-semibold ${
                    changePassMsg.isError ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {changePassMsg.text}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
