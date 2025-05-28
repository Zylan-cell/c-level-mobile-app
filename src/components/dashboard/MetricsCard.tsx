import React from 'react';
import { BusinessMetrics } from '@/types';
import { formatCurrency } from '@/lib/utils/helpers';

interface MetricsCardProps {
  metrics: BusinessMetrics | null;
  isLoading: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 font-medium">No metrics data available</p>
      </div>
    );
  }
  
  const metricItems = [
    {
      label: 'LTV',
      value: formatCurrency(metrics.ltv),
      change: '+5.2%',
      positive: true
    },
    {
      label: 'MRR',
      value: formatCurrency(metrics.mrr),
      change: '+3.8%',
      positive: true
    },
    {
      label: 'Cash Flow',
      value: formatCurrency(metrics.cashFlow),
      change: '-2.1%',
      positive: false
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Business Metrics
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {metricItems.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className={`text-xs font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
