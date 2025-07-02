
import React, { useState } from 'react';
import { KOLLevel } from '../types';
import { Icon } from './icons/Icon';

interface KOLTableProps {
  levels: KOLLevel[];
  onUpdate: (id: string, updatedValues: Partial<KOLLevel>) => void;
  onRemove: (id: string) => void;
  onAdd: (newLevel: Omit<KOLLevel, 'id'>) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

const EditableCell: React.FC<{ value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder: string; className?: string }> = 
({ value, onChange, type = 'text', placeholder, className }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent p-2 rounded-md border border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition ${className}`}
    />
);


const KOLLevelRow: React.FC<{ level: KOLLevel, onUpdate: KOLTableProps['onUpdate'], onRemove: KOLTableProps['onRemove'] }> = ({ level, onUpdate, onRemove }) => {
    
    const handleNumberChange = <K extends keyof KOLLevel,>(key: K, value: string) => {
        onUpdate(level.id, { [key]: parseInt(value, 10) || 0 } as Partial<KOLLevel>);
    };

    const costTotalMin = level.count * level.costMin;
    const costTotalMax = level.count * level.costMax;
    const sellingTotalMin = level.count * level.sellingMin;
    const sellingTotalMax = level.count * level.sellingMax;
    const profitTotalMin = sellingTotalMin - costTotalMax;
    const profitTotalMax = sellingTotalMax - costTotalMin;

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
            <td className="p-2 align-top"><EditableCell value={level.name} onChange={(e) => onUpdate(level.id, { name: e.target.value })} placeholder="Level Name" /></td>
            <td className="p-2 align-top"><EditableCell value={level.count} onChange={(e) => handleNumberChange('count', e.target.value)} type="number" placeholder="Count" className="w-20 text-center" /></td>
            <td className="p-2 align-top">
                <div className="flex flex-col gap-1">
                    <EditableCell value={level.costMin} onChange={(e) => handleNumberChange('costMin', e.target.value)} type="number" placeholder="Min Cost"/>
                    <EditableCell value={level.costMax} onChange={(e) => handleNumberChange('costMax', e.target.value)} type="number" placeholder="Max Cost" />
                </div>
            </td>
            <td className="p-2 align-top">
                <div className="flex flex-col gap-1">
                    <EditableCell value={level.sellingMin} onChange={(e) => handleNumberChange('sellingMin', e.target.value)} type="number" placeholder="Min Selling" />
                    <EditableCell value={level.sellingMax} onChange={(e) => handleNumberChange('sellingMax', e.target.value)} type="number" placeholder="Max Selling" />
                </div>
            </td>
            <td className="p-2 text-sm align-middle text-center text-gray-400">{`${formatCurrency(costTotalMin)} - ${formatCurrency(costTotalMax)}`}</td>
            <td className="p-2 text-sm align-middle text-center text-gray-400">{`${formatCurrency(sellingTotalMin)} - ${formatCurrency(sellingTotalMax)}`}</td>
            <td className={`p-2 text-sm align-middle text-center font-semibold ${profitTotalMin < 0 ? 'text-red-400' : 'text-green-400'}`}>{`${formatCurrency(profitTotalMin)} - ${formatCurrency(profitTotalMax)}`}</td>
            <td className="p-2 align-middle text-center">
                <button onClick={() => onRemove(level.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
                    <Icon name="trash" />
                </button>
            </td>
        </tr>
    );
};

const AddKOLForm: React.FC<{ onAdd: KOLTableProps['onAdd'] }> = ({ onAdd }) => {
    const [newLevel, setNewLevel] = useState({ name: '', count: 1, costMin: 0, costMax: 0, sellingMin: 0, sellingMax: 0 });
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setNewLevel(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newLevel.name || newLevel.count <= 0) {
            alert("Please fill in a valid name and count.");
            return;
        }
        onAdd(newLevel);
        setNewLevel({ name: '', count: 1, costMin: 0, costMax: 0, sellingMin: 0, sellingMax: 0 });
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <div className="mt-4">
                 <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-all">
                    <Icon name="plus" /> Add New KOL Level
                 </button>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold mb-3">Add New Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <input name="name" value={newLevel.name} onChange={handleChange} placeholder="Level Name (e.g., Nano)" className="md:col-span-3 lg:col-span-1 bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                <input name="count" type="number" value={newLevel.count} onChange={handleChange} placeholder="KOLs Count" className="bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                <div className="flex gap-2">
                    <input name="costMin" type="number" value={newLevel.costMin} onChange={handleChange} placeholder="Min Cost" className="w-1/2 bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                    <input name="costMax" type="number" value={newLevel.costMax} onChange={handleChange} placeholder="Max Cost" className="w-1/2 bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div className="flex gap-2">
                     <input name="sellingMin" type="number" value={newLevel.sellingMin} onChange={handleChange} placeholder="Min Selling" className="w-1/2 bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                    <input name="sellingMax" type="number" value={newLevel.sellingMax} onChange={handleChange} placeholder="Max Selling" className="w-1/2 bg-gray-800 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div className="flex gap-2 items-center">
                    <button type="submit" className="flex-grow px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-all">Add</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-all">Cancel</button>
                </div>
            </div>
        </form>
    );
}

const KOLTable: React.FC<KOLTableProps> = ({ levels, onUpdate, onRemove, onAdd }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
          <tr>
            <th className="p-2 w-1/4">Level Name</th>
            <th className="p-2 text-center"># KOLs</th>
            <th className="p-2">Cost Range / KOL</th>
            <th className="p-2">Selling Range / KOL</th>
            <th className="p-2 text-center">Total Cost</th>
            <th className="p-2 text-center">Total Selling</th>
            <th className="p-2 text-center">Total Profit</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => (
            <KOLLevelRow key={level.id} level={level} onUpdate={onUpdate} onRemove={onRemove} />
          ))}
        </tbody>
      </table>
      {levels.length === 0 && <p className="text-center text-gray-500 py-8">No KOL levels added yet. Start by adding one below.</p>}
      <AddKOLForm onAdd={onAdd} />
    </div>
  );
};

export default KOLTable;
