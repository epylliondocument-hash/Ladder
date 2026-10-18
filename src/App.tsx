/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { OrderInputs, SavedStyle, LadderType } from './types/smv';
import { planOrder, GarmentPreset, GARMENT_PRESETS } from './utils/smvEngine';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidBottomNav, ActiveTab } from './components/AndroidBottomNav';
import { PlannerTab } from './components/PlannerTab';
import { DayRampTab } from './components/DayRampTab';
import { MatrixTab } from './components/MatrixTab';
import { LaddersTab } from './components/LaddersTab';
import { SavedStylesTab } from './components/SavedStylesTab';
import { StylePresetModal } from './components/StylePresetModal';
import { StylePhotoModal } from './components/StylePhotoModal';
import { PrintReportView } from './components/PrintReportView';
import { PWAInstallBanner, OfflineIndicator } from './components/PWAInstallBanner';

const STORAGE_INPUTS_KEY = 'smvPlanner.inputs.v2';
const STORAGE_PHOTO_KEY = 'smvPlanner.photo.v2';
const STORAGE_CAPTION_KEY = 'smvPlanner.caption.v2';
const STORAGE_SAVED_STYLES_KEY = 'smvPlanner.savedStyles.v2';

const DEFAULT_INPUTS: OrderInputs = {
  smv: 66.5,
  manpower: 70,
  quantity: 50000,
  leadTime: 24,
  hoursDay: 10,
  ladderType: 'Tight',
  effGap: 0,
  avgBasis: 'best',
  manualPcs: undefined,
  manualEff: undefined,
  styleName: 'Heavy Padded Winter Jacket',
  buyerName: 'Global Apparel Co.',
  poNumber: 'PO-2026-8841',
};

export default function App() {
  // Inputs state
  const [inputs, setInputs] = useState<OrderInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INPUTS_KEY);
      if (saved) return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return DEFAULT_INPUTS;
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
      return localStorage.getItem(STORAGE_CAPTION_KEY) || 'Heavy Quilted Parka · Tight Ladder';
    } catch (e) {
      return 'Heavy Quilted Parka · Tight Ladder';
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
    // Initial pre-loaded industry styles
    return [
      {
        id: 'sample-1',
        name: 'Heavy Padded Winter Jacket',
        buyer: 'The North Trail',
        poNumber: 'PO-44120',
        smv: 66.5,
        manpower: 70,
        quantity: 50000,
        leadTime: 24,
        hoursDay: 10,
        ladderType: 'Tight',
        effGap: 0,
        photoCaption: 'Style #JK-660 · Multi Pocket Hooded',
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'sample-2',
        name: 'Classic Pique Polo 2-Button',
        buyer: 'Ralph & Co.',
        poNumber: 'PO-39011',
        smv: 18.5,
        manpower: 45,
        quantity: 20000,
        leadTime: 21,
        hoursDay: 10,
        ladderType: 'Basic',
        effGap: 0,
        photoCaption: 'Style #PL-20 · Ribbed Collar & Cuffs',
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'sample-3',
        name: 'Standard Crewneck Tee 100% Cotton',
        buyer: 'Basics Apparel',
        poNumber: 'PO-12093',
        smv: 8.5,
        manpower: 36,
        quantity: 35000,
        leadTime: 14,
        hoursDay: 10,
        ladderType: 'Basic',
        effGap: 0,
        photoCaption: 'Style #TS-01 · 180 GSM Single Jersey',
        createdAt: Date.now() - 86400000 * 10,
      }
    ];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [selectedRampLine, setSelectedRampLine] = useState<number>(1);

  // Modals
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

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

  // Calculate live plan
  const plan = useMemo(() => planOrder(inputs), [inputs]);

  const handleUpdateInputs = (updated: Partial<OrderInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
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
      effGap: 0,
      manualPcs: undefined,
      manualEff: undefined,
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
      name: inputs.styleName || `Style SMV ${inputs.smv}`,
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
      manualPcs: undefined,
      manualEff: undefined,
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
    document.title = `SMV_Plan_${inputs.styleName ? inputs.styleName.replace(/[^a-zA-Z0-9]/g, '_') : 'Garment'}_${inputs.smv}m_${inputs.quantity}pcs_${inputs.leadTime}d`;
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
          text: `Garment Capacity Plan: SMV ${inputs.smv}m, ${inputs.manpower} ops, ${plan.numLines} lines for ${inputs.quantity} pcs (${inputs.leadTime} days). Target 100%: ${Math.round(plan.target)} pcs/hr.`,
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
        onPrint={handlePrint}
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
            plan={plan}
            photoUrl={photoUrl}
            photoCaption={photoCaption}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onSelectLineForRamp={handleSelectLineForRamp}
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
          <MatrixTab inputs={inputs} />
        )}

        {activeTab === 'ladders' && (
          <LaddersTab
            currentLadder={inputs.ladderType}
            currentSmv={inputs.smv}
            onSelectLadder={(ladder: LadderType) => handleUpdateInputs({ ladderType: ladder })}
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
