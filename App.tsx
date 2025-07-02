
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { KOLLevel, SavedCalculation } from './types';
import { INITIAL_KOL_LEVELS, LOCAL_STORAGE_KEY, MAX_SAVED_RESULTS } from './constants';
import SummaryDashboard from './components/SummaryDashboard';
import KOLTable from './components/KOLTable';
import SaveLoadManager from './components/SaveLoadManager';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import { Icon } from './components/icons/Icon';

const App: React.FC = () => {
  const [levels, setLevels] = useState<KOLLevel[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // Load initial data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedData = savedData ? JSON.parse(savedData) : [];
      setSavedCalculations(parsedData);
      
      // Load the most recent calculation if available, otherwise use initial data
      if (parsedData.length > 0) {
        const sorted = [...parsedData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLevels(sorted[0].levels);
        showToast('Loaded most recent calculation.');
      } else {
        setLevels(INITIAL_KOL_LEVELS);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setLevels(INITIAL_KOL_LEVELS);
    }
  }, []);

  // Persist saved calculations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCalculations));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      showToast('Error: Could not save data.');
    }
  }, [savedCalculations]);
  
  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
  };

  const handleAddLevel = useCallback((newLevel: Omit<KOLLevel, 'id'>) => {
    setLevels(prev => [...prev, { ...newLevel, id: crypto.randomUUID() }]);
    showToast('KOL level added.');
  }, []);

  const handleUpdateLevel = useCallback((id: string, updatedValues: Partial<KOLLevel>) => {
    setLevels(prev =>
      prev.map(level =>
        level.id === id ? { ...level, ...updatedValues } : level
      )
    );
  }, []);

  const handleRemoveLevel = useCallback((id: string) => {
    setModalState({
      isOpen: true,
      title: 'Delete Level',
      message: 'Are you sure you want to delete this KOL level? This action cannot be undone.',
      onConfirm: () => {
        setLevels(prev => prev.filter(level => level.id !== id));
        showToast('KOL level removed.');
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  }, []);

  const handleSaveCalculation = useCallback((name: string) => {
    if (name.trim() === '') {
      showToast('Please provide a name for the calculation.');
      return;
    }
    const newSave: SavedCalculation = {
      id: crypto.randomUUID(),
      name,
      levels: JSON.parse(JSON.stringify(levels)), // Deep copy
      createdAt: new Date().toISOString(),
    };
    
    setSavedCalculations(prev => {
      const updatedSaves = [newSave, ...prev];
      if (updatedSaves.length > MAX_SAVED_RESULTS) {
        // Remove the oldest item
        return updatedSaves.slice(0, MAX_SAVED_RESULTS);
      }
      return updatedSaves;
    });
    showToast(`Calculation "${name}" saved.`);
  }, [levels]);

  const handleLoadCalculation = useCallback((id: string) => {
    const calculationToLoad = savedCalculations.find(calc => calc.id === id);
    if (calculationToLoad) {
      setLevels(calculationToLoad.levels);
      showToast(`Calculation "${calculationToLoad.name}" loaded.`);
    }
  }, [savedCalculations]);
  
  const handleRemoveCalculation = useCallback((id: string) => {
     const calculationToRemove = savedCalculations.find(calc => calc.id === id);
     if (!calculationToRemove) return;
     
    setModalState({
      isOpen: true,
      title: 'Delete Saved Calculation',
      message: `Are you sure you want to delete "${calculationToRemove.name}"? This is permanent.`,
      onConfirm: () => {
        setSavedCalculations(prev => prev.filter(calc => calc.id !== id));
        showToast(`Calculation "${calculationToRemove.name}" deleted.`);
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  }, [savedCalculations]);

  const summaryData = useMemo(() => {
    return levels.reduce(
      (acc, level) => {
        const count = Number(level.count) || 0;
        acc.totalKOLs += count;
        acc.totalCostMin += count * (Number(level.costMin) || 0);
        acc.totalCostMax += count * (Number(level.costMax) || 0);
        acc.totalSellingMin += count * (Number(level.sellingMin) || 0);
        acc.totalSellingMax += count * (Number(level.sellingMax) || 0);
        return acc;
      },
      {
        totalKOLs: 0,
        totalCostMin: 0,
        totalCostMax: 0,
        totalSellingMin: 0,
        totalSellingMax: 0,
      }
    );
  }, [levels]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            AsiaPac KOL Budget Calculator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Plan your influencer marketing campaigns with precision.
          </p>
        </header>

        <main className="space-y-8">
          <SummaryDashboard summary={summaryData} />
          
          <div className="bg-gray-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-4 sm:p-6">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="users" className="text-cyan-400" />
                KOL Levels
             </h2>
             <KOLTable 
                levels={levels}
                onUpdate={handleUpdateLevel}
                onRemove={handleRemoveLevel}
                onAdd={handleAddLevel}
             />
          </div>

          <SaveLoadManager
            savedCalculations={savedCalculations}
            onSave={handleSaveCalculation}
            onLoad={handleLoadCalculation}
            onDelete={handleRemoveCalculation}
          />
        </main>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
      
      {toast && <Toast key={toast.id} message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default App;
