import React from 'react';
import Link from 'next/link';
import { CLevelType } from '@/types';
import { getCLevelFullName } from '@/lib/utils/helpers';

interface CLevelSelectorProps {
  selectedCLevel?: CLevelType;
}

export const CLevelSelector: React.FC<CLevelSelectorProps> = ({ selectedCLevel }) => {
  const cLevelOptions: CLevelType[] = ['CEO', 'COO', 'CMO', 'CCO', 'CTO', 'CFO'];
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select C-Level
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {cLevelOptions.map((clevel) => (
            <Link 
              key={clevel}
              href={`/c-level/${clevel.toLowerCase()}`}
              className={`block p-3 rounded-md border ${
                selectedCLevel === clevel
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{clevel}</div>
              <div className="text-sm text-gray-700 font-medium">{getCLevelFullName(clevel)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
