import React, { useCallback, useMemo } from 'react';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;}

interface TabsProps {
  items: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange
}: TabsProps) => {

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className="w-full">
      <div className="border-b border-white/20">
        <nav className="flex space-x-8" role="tablist">
          {items.map((tab: Tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabChange(tab.id);
                }
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 min-h-[44px] ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 focus:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};