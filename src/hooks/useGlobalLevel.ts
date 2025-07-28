import { useState, useEffect, createContext, useContext } from 'react';
import type { CEFRLevel } from '../types';
import toast from 'react-hot-toast';

interface GlobalLevelContextType {
  selectedLevel: CEFRLevel;
  tempLevel: CEFRLevel;
  setTempLevel: (level: CEFRLevel) => void;
  confirmLevel: () => void;
  isLevelChanged: boolean;
}

export const GlobalLevelContext = createContext<GlobalLevelContextType | undefined>(undefined);

export const useGlobalLevel = () => {
  const context = useContext(GlobalLevelContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      selectedLevel: 'A1' as CEFRLevel,
      tempLevel: 'A1' as CEFRLevel,
      setTempLevel: () => {},
      confirmLevel: () => {},
      isLevelChanged: false
    };
  }
  return context;
};

export const useGlobalLevelState = () => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [tempLevel, setTempLevel] = useState<CEFRLevel>('A1');

  useEffect(() => {
    try {
      // Load saved level from localStorage
      const savedLevel = localStorage.getItem('frenchLearningLevel') as CEFRLevel;
      if (savedLevel && ['A1', 'A2', 'B1', 'B2'].includes(savedLevel)) {
        setSelectedLevel(savedLevel);
        setTempLevel(savedLevel);
      }
    } catch (error) {
      console.error('Error loading saved level:', error);
    }
  }, []);

  const confirmLevel = () => {
    try {
      setSelectedLevel(tempLevel);
      localStorage.setItem('frenchLearningLevel', tempLevel);
      toast.success(`רמה עודכנה ל-${tempLevel}! 🎯`);
    } catch (error) {
      console.error('Error saving level:', error);
      setSelectedLevel(tempLevel);
    }
  };

  const isLevelChanged = selectedLevel !== tempLevel;

  return {
    selectedLevel,
    tempLevel,
    setTempLevel,
    confirmLevel,
    isLevelChanged
  };
};