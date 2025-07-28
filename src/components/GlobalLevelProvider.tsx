import React from 'react';
import { GlobalLevelContext, useGlobalLevelState } from '../hooks/useGlobalLevel';

interface GlobalLevelProviderProps {
  children: React.ReactNode;
}

const GlobalLevelProvider: React.FC<GlobalLevelProviderProps> = ({ children }) => {
  const levelState = useGlobalLevelState();

  return (
    <GlobalLevelContext.Provider value={levelState}>
      {children}
    </GlobalLevelContext.Provider>
  );
};

export default GlobalLevelProvider;