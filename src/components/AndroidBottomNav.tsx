import React from 'react';
import { Sliders, TrendingUp, Grid, Layers, Bookmark } from 'lucide-react';

export type ActiveTab = 'planner' | 'dayramp' | 'matrix' | 'ladders' | 'saved';

interface AndroidBottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  savedCount?: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount = 0
}) => {
  const tabs = [
    { id: 'planner' as const, label: 'Planner', icon: Sliders },
    { id: 'dayramp' as const, label: 'Day Ramp', icon: TrendingUp },
    { id: 'matrix' as const, label: 'Matrix', icon: Grid },
    { id: 'ladders' as const, label: 'Ladders', icon: Layers },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-slate-300 shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 min-h-[48px] rounded-xl transition-all duration-150 active:scale-95 ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active pill background */}
              <div
                className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
