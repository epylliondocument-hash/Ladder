/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { OrderInputs, SavedStyle, LadderType, LaddersData } from './types/smv';
import { planOrder, GarmentPreset, GARMENT_PRESETS, DEFAULT_LADDERS } from './utils/smvEngine';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidBottomNav, ActiveTab } from './components/AndroidBottomNav';
import { PlannerTab } from './components/PlannerTab';
import { DayRampTab } from './components/DayRampTab';
import { MatrixTab } from './components/MatrixTab';
import { LaddersTab } from './components/LaddersTab';
import { SavedStylesTab } from './components/SavedStylesTab';
import { StylePresetModal } from './components/StylePresetModal';
import { StylePhotoModal } from './components/StylePhotoModal';
import { AndroidGuideModal } from './components/AndroidGuideModal';
import { PDFExportModal } from './components/PDFExportModal';
import { PrintReportView } from './components/PrintReportView';
import { PWAInstallBanner, OfflineIndicator } from './components/PWAInstallBanner';

const STORAGE_INPUTS_KEY = 'smvPlanner.inputs.v4';
const STORAGE_PHOTO_KEY = 'smvPlanner.photo.v4';
const STORAGE_CAPTION_KEY = 'smvPlanner.caption.v4';
const STORAGE_SAVED_STYLES_KEY = 'smvPlanner.savedStyles.v4';
const STORAGE_LADDERS_KEY = 'smvPlanner.customLadders.v2';

const DEFAULT_INPUTS: OrderInputs = {
  smv: '',
  manpower: '',
  quantity: '',
  leadTime: '',
  hoursDay: '',
  ladderType: 'Tight',
  effGap: '',
  avgBasis: 'best',
  manualPcs: '',
  manualEff: '',
  styleName: '',
  buyerName: '',
  poNumber: '',
};

export default function App() {
  // Inputs state - Starts completely empty by default as requested!
  const [inputs, setInputs] = useState<OrderInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INPUTS_KEY);
      if (saved) return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return DEFAULT_INPUTS;
  });

  // Custom Editable Ladders state (persisted)
  const [customLadders, setCustomLadders] = useState<LaddersData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LADDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_LADDERS;
  });

  // Photo & Caption state
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_PHOTO_KEY);
    } catch (e) {
      return null;
    }
  });

  const [photoCaption, setPhotoCaption] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_CAPTION_KEY) || '';
    } catch (e) {
      return '';
    }
  });

  // Saved Styles Library
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_STYLES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [selectedRampLine, setSelectedRampLine] = useState<number>(1);

  // Modals
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  // Persist inputs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INPUTS_KEY, JSON.stringify(inputs));
    } catch (e) {}
  }, [inputs]);

  // Persist photo
  useEffect(() => {
    try {
      if (photoUrl) localStorage.setItem(STORAGE_PHOTO_KEY, photoUrl);
      else localStorage.removeItem(STORAGE_PHOTO_KEY);
    } catch (e) {}
  }, [photoUrl]);

  // Persist caption
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CAPTION_KEY, photoCaption);
    } catch (e) {}
  }, [photoCaption]);

  // Persist saved styles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_STYLES_KEY, JSON.stringify(savedStyles));
    } catch (e) {}
  }, [savedStyles]);

  // Calculate live plan using inputs and custom ladders
  const plan = useMemo(() => planOrder(inputs, customLadders), [inputs, customLadders]);

  const handleUpdateInputs = (updated: Partial<OrderInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
  };

  const handleClearInputs = () => {
    setInputs(DEFAULT_INPUTS);
    setPhotoUrl(null);
    setPhotoCaption('');
    try {
      localStorage.removeItem(STORAGE_INPUTS_KEY);
      localStorage.removeItem(STORAGE_PHOTO_KEY);
      localStorage.removeItem(STORAGE_CAPTION_KEY);
    } catch (e) {}
  };

  const handleUpdateLadders = (updated: LaddersData) => {
    setCustomLadders(updated);
    try {
      localStorage.setItem(STORAGE_LADDERS_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleResetLadders = () => {
    setCustomLadders(DEFAULT_LADDERS);
    try {
      localStorage.removeItem(STORAGE_LADDERS_KEY);
    } catch (e) {}
  };

  const handleSelectPreset = (preset: GarmentPreset) => {
    setInputs((prev) => ({
      ...prev,
      styleName: preset.name,
      smv: preset.smv,
      manpower: preset.manpower,
      leadTime: preset.leadTime,
      hoursDay: preset.hoursDay,
      ladderType: preset.ladderType,
      quantity: preset.defaultQty,
      effGap: '',
      manualPcs: '',
      manualEff: '',
    }));
    setPhotoCaption(`${preset.name} · ${preset.category}`);
  };

  const handleSavePhoto = (newPhotoUrl: string | null, newCaption: string) => {
    setPhotoUrl(newPhotoUrl);
    setPhotoCaption(newCaption);
  };

  const handleSaveCurrentStyle = () => {
    const newStyle: SavedStyle = {
      id: `style-${Date.now()}`,
      name: inputs.styleName || `Style SMV ${inputs.smv || 'Custom'}`,
      buyer: inputs.buyerName,
      poNumber: inputs.poNumber,
      smv: inputs.smv,
      manpower: inputs.manpower,
      quantity: inputs.quantity,
      leadTime: inputs.leadTime,
      hoursDay: inputs.hoursDay,
      ladderType: inputs.ladderType,
      effGap: inputs.effGap,
      photoUrl: photoUrl || undefined,
      photoCaption: photoCaption,
      createdAt: Date.now(),
    };

    setSavedStyles((prev) => [newStyle, ...prev]);
  };

  const handleLoadStyle = (style: SavedStyle) => {
    setInputs((prev) => ({
      ...prev,
      styleName: style.name,
      buyerName: style.buyer,
      poNumber: style.poNumber,
      smv: style.smv,
      manpower: style.manpower,
      quantity: style.quantity,
      leadTime: style.leadTime,
      hoursDay: style.hoursDay,
      ladderType: style.ladderType,
      effGap: style.effGap,
      manualPcs: '',
      manualEff: '',
    }));

    if (style.photoUrl) setPhotoUrl(style.photoUrl);
    if (style.photoCaption) setPhotoCaption(style.photoCaption);

    setActiveTab('planner');
  };

  const handleDeleteStyle = (id: string) => {
    setSavedStyles((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePrint = () => {
    const prevTitle = document.title;
    document.title = `SMV_Plan_${inputs.styleName ? inputs.styleName.replace(/[^a-zA-Z0-9]/g, '_') : 'Garment'}_${inputs.smv || 0}m_${inputs.quantity || 0}pcs_${inputs.leadTime || 0}d`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SMV Plan - ${inputs.styleName || 'Garment Order'}`,
          text: `Garment Capacity Plan: SMV ${inputs.smv || '—'}m, ${inputs.manpower || '—'} ops, ${plan.numLines} lines for ${inputs.quantity || '—'} pcs (${inputs.leadTime || '—'} days). Target 100%: ${Math.round(plan.target)} pcs/hr.`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    }
  };

  const handleSelectLineForRamp = (lineNum: number) => {
    setSelectedRampLine(lineNum);
    setActiveTab('dayramp');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline connectivity alert */}
      <OfflineIndicator />

      {/* Android Top App Bar */}
      <AndroidHeader
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onOpenPDF={() => setIsPDFModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onShare={handleShare}
        styleName={inputs.styleName}
      />

      {/* In-app PWA install prompt banner for Android devices */}
      <PWAInstallBanner />

      {/* Main Responsive Content Container */}
      <main id="app-screen-container" className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-20">
        {activeTab === 'planner' && (
          <PlannerTab
            inputs={inputs}
            onChangeInputs={handleUpdateInputs}
            onClearInputs={handleClearInputs}
            plan={plan}
            photoUrl={photoUrl}
            photoCaption={photoCaption}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onSelectLineForRamp={handleSelectLineForRamp}
            onOpenPDF={() => setIsPDFModalOpen(true)}
          />
        )}

        {activeTab === 'dayramp' && (
          <DayRampTab
            plan={plan}
            inputs={inputs}
            selectedLine={selectedRampLine}
          />
        )}

        {activeTab === 'matrix' && (
          <MatrixTab inputs={inputs} customLadders={customLadders} />
        )}

        {activeTab === 'ladders' && (
          <LaddersTab
            currentLadder={inputs.ladderType}
            currentSmv={inputs.smv}
            onSelectLadder={(ladder: LadderType) => handleUpdateInputs({ ladderType: ladder })}
            customLadders={customLadders}
            onUpdateLadders={handleUpdateLadders}
            onResetLadders={handleResetLadders}
          />
        )}

        {activeTab === 'saved' && (
          <SavedStylesTab
            savedStyles={savedStyles}
            onSaveCurrent={handleSaveCurrentStyle}
            onLoadStyle={handleLoadStyle}
            onDeleteStyle={handleDeleteStyle}
            currentInputs={inputs}
          />
        )}
      </main>

      {/* Android Material 3 Bottom Navigation Bar */}
      <AndroidBottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        savedCount={savedStyles.length}
      />

      {/* Garment Presets Modal Drawer */}
      <StylePresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        currentInputs={inputs}
      />

      {/* Style Photo Upload & Camera Modal Drawer */}
      <StylePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photoUrl={photoUrl}
        caption={photoCaption}
        onSavePhoto={handleSavePhoto}
      />

      {/* Android & GitHub Guide Modal */}
      <AndroidGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* PDF Export & Share Modal */}
      <PDFExportModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        onPrint={handlePrint}
        plan={plan}
        inputs={inputs}
        photoUrl={photoUrl}
        photoCaption={photoCaption}
      />

      {/* Dedicated High-Quality Print / PDF Report (Visible ONLY when printing) */}
      <PrintReportView
        plan={plan}
        inputs={inputs}
        photoUrl={photoUrl}
        photoCaption={photoCaption}
      />
    </div>
  );
}
