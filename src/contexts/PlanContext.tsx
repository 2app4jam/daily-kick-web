// src/contexts/PlanContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlanContextType {
  activeView: number;
  setActiveView: (view: number) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState(0);

  return (
    <PlanContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};