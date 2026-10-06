import React, { createContext, useContext } from 'react';
import { type StatusFilter } from '../types/deadline';

interface FilterContextType {
  activeTab: StatusFilter;
  onChangeTab: (tab: StatusFilter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterTabsProps {
  activeTab: StatusFilter;
  onChangeTab: (tab: StatusFilter) => void;
  children: React.ReactNode;
}

// Container chính bọc Context Provider
export const FilterTabs = ({ activeTab, onChangeTab, children }: FilterTabsProps) => {
  return (
    <FilterContext.Provider value={{ activeTab, onChangeTab }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>{children}</div>
    </FilterContext.Provider>
  );
};

interface TabProps {
  value: StatusFilter;
  children: React.ReactNode;
}

// Sub-component nút Tab
const Tab = ({ value, children }: TabProps) => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('FilterTabs.Tab phải được sử dụng bên trong FilterTabs');
  }

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.onChangeTab(value)}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: isActive ? '1px solid #4338ca' : '1px solid #e2e8f0',
        backgroundColor: isActive ? '#4338ca' : '#ffffff',
        color: isActive ? '#ffffff' : '#64748b',
        fontWeight: isActive ? '600' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: isActive ? '0 1px 3px rgba(67, 56, 202, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
};
// Gắn Tab vào FilterTabs theo đúng Compound Component Pattern
FilterTabs.Tab = Tab;