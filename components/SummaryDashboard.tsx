
import React from 'react';
import { Icon } from './icons/Icon';

interface SummaryDashboardProps {
  summary: {
    totalKOLs: number;
    totalCostMin: number;
    totalCostMax: number;
    totalSellingMin: number;
    totalSellingMax: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const SummaryCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode; className?: string }> = ({ title, value, icon, className }) => (
  <div className={`bg-gray-800 p-4 rounded-lg shadow-md flex items-center ${className}`}>
    <div className="p-3 mr-4 text-2xl rounded-full bg-gray-700">
        {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl lg:text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ summary }) => {
  const { totalKOLs, totalCostMin, totalCostMax, totalSellingMin, totalSellingMax } = summary;
  const profitMin = totalSellingMin - totalCostMax;
  const profitMax = totalSellingMax - totalCostMin;

  return (
    <div className="bg-gray-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon name="chart" className="text-cyan-400"/>
        Budget Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
            title="Total KOLs" 
            value={totalKOLs} 
            icon={<Icon name="users"/>} 
        />
        <SummaryCard
          title="Total Cost Range"
          value={`${formatCurrency(totalCostMin)} - ${formatCurrency(totalCostMax)}`}
          icon={<Icon name="dollar"/>}
        />
        <SummaryCard
          title="Total Selling Range"
          value={`${formatCurrency(totalSellingMin)} - ${formatCurrency(totalSellingMax)}`}
          icon={<Icon name="cash"/>}
        />
        <SummaryCard
          title="Estimated Profit Range"
          value={`${formatCurrency(profitMin)} - ${formatCurrency(profitMax)}`}
          icon={<Icon name="trendingUp"/>}
          className={profitMin < 0 ? 'bg-red-900/50' : 'bg-green-900/50'}
        />
      </div>
    </div>
  );
};

export default SummaryDashboard;
