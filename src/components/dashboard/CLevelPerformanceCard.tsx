import React from 'react';
import Link from 'next/link';
import { CLevelPerformance } from '@/types';
import { getCLevelFullName } from '@/lib/utils/helpers';

interface CLevelPerformanceCardProps {
  performances: CLevelPerformance[];
  isLoading: boolean;
}

export const CLevelPerformanceCard: React.FC<CLevelPerformanceCardProps> = ({ 
  performances, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!performances.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          C-Level Performance
        </h3>
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          C-Level Performance
        </h3>
        
        <div className="space-y-4">
          {performances.map((performance) => (
            <Link 
              key={performance.clevelType}
              href={`/c-level/${performance.clevelType.toLowerCase()}`}
              className="block"
            >
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">
                    {performance.clevelType} - {getCLevelFullName(performance.clevelType)}
                  </h4>
                  <span className="text-sm font-medium text-blue-600">
                    Details →
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(performance.completedKpis / performance.totalKpis) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {performance.completedKpis}/{performance.totalKpis} KPIs
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-800 font-medium">Confidence Score:</span>
                    <span className="ml-1 font-semibold text-gray-900">
                      {performance.confidenceScore}/100
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {performance.positiveNotes.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{performance.positiveNotes.length}
                      </span>
                    )}
                    
                    {performance.negativeNotes.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{performance.negativeNotes.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
