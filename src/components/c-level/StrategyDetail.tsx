"use client";

import React, { useState } from 'react';
import { CLevelStrategy, Strategy } from '@/types';
import { getCLevelFullName } from '@/lib/utils/helpers';

interface StrategyDetailProps {
  strategy: CLevelStrategy | Strategy | null;
  isLoading: boolean;
}

export const StrategyDetail: React.FC<StrategyDetailProps> = ({ strategy, isLoading }) => {
  const [expandedObjectives, setExpandedObjectives] = useState<number[]>([]);
  
  const toggleObjective = (index: number) => {
    if (expandedObjectives.includes(index)) {
      setExpandedObjectives(expandedObjectives.filter(i => i !== index));
    } else {
      setExpandedObjectives([...expandedObjectives, index]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse" data-testid="strategy-skeleton">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }
  
  if (!strategy) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No strategy found for this C-Level role</p>
      </div>
    );
  }
  
  // Проверяем, является ли стратегия нового типа Strategy
  const isNewStrategy = 'objectives' in strategy && Array.isArray(strategy.objectives) && 
                       strategy.objectives.length > 0 && typeof strategy.objectives[0] === 'object';
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {strategy.title}
        </h2>
        <p className="text-gray-500 mb-6">
          {'clevelType' in strategy ? getCLevelFullName(strategy.clevelType) : ''}
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Strategy Overview</h3>
          <p className="text-gray-600 whitespace-pre-line">{strategy.description}</p>
        </div>
        
        {isNewStrategy ? (
          // Отображаем цели и KPI для нового типа Strategy
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Strategic Objectives</h3>
            
            {(strategy as Strategy).objectives.map((objective, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleObjective(index)}
                >
                  <h4 className="font-medium text-gray-800">{objective.title}</h4>
                  <span className="text-gray-500">
                    {expandedObjectives.includes(index) ? '↑' : '↓'}
                  </span>
                </div>
                
                {expandedObjectives.includes(index) && (
                  <div className="p-4 border-t">
                    <p className="text-gray-600 mb-4">{objective.description}</p>
                    
                    <h5 className="font-medium text-gray-800 mb-2">KPIs:</h5>
                    <div className="space-y-3">
                      {objective.kpis.map((kpi, kpiIndex) => (
                        <div key={kpiIndex} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{kpi.title}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              kpi.status === 'completed' ? 'bg-green-100 text-green-800' :
                              kpi.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              kpi.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {kpi.status.replace('_', ' ').charAt(0).toUpperCase() + kpi.status.replace('_', ' ').slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>Current: <strong>{kpi.current}</strong></span>
                            <span>Target: <strong>{kpi.target}</strong></span>
                          </div>
                          
                          <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                kpi.status === 'completed' ? 'bg-green-500' :
                                kpi.status === 'in_progress' ? 'bg-blue-500' :
                                kpi.status === 'failed' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}
                              style={{ width: `${Math.min(parseInt(kpi.current) / parseInt(kpi.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Print Strategy
              </button>
            </div>
          </div>
        ) : (
          // Отображаем цели и KPI для старого типа CLevelStrategy
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Objectives</h3>
              <ul className="list-disc list-inside space-y-2">
                {(strategy as CLevelStrategy).objectives.map((objective, index) => (
                  <li key={index} className="text-gray-600">{objective}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Key Performance Indicators</h3>
              <ul className="list-disc list-inside space-y-2">
                {(strategy as CLevelStrategy).kpis.map((kpi, index) => (
                  <li key={index} className="text-gray-600">{kpi}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
