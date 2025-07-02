
import React, { useState } from 'react';
import { SavedCalculation } from '../types';
import { Icon } from './icons/Icon';

interface SaveLoadManagerProps {
  savedCalculations: SavedCalculation[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const SaveLoadManager: React.FC<SaveLoadManagerProps> = ({ savedCalculations, onSave, onLoad, onDelete }) => {
  const [saveName, setSaveName] = useState('');

  const handleSave = () => {
    onSave(saveName);
    setSaveName('');
  };

  const sortedCalculations = [...savedCalculations].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-gray-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-4 sm:p-6">
       <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon name="save" className="text-cyan-400" />
        Save & Load
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Save Section */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Save Current Calculation</h3>
            <div className="flex gap-2">
                <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter calculation name"
                className="flex-grow bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-all flex items-center gap-2">
                    <Icon name="save" /> Save
                </button>
            </div>
        </div>
        {/* Load Section */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Load Previous Calculations</h3>
            {sortedCalculations.length > 0 ? (
                 <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {sortedCalculations.map(calc => (
                        <div key={calc.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                            <div>
                                <p className="font-medium">{calc.name}</p>
                                <p className="text-xs text-gray-400">{new Date(calc.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onLoad(calc.id)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-cyan-500/10" title="Load">
                                    <Icon name="load" />
                                </button>
                                <button onClick={() => onDelete(calc.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10" title="Delete">
                                    <Icon name="trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No saved calculations.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default SaveLoadManager;
