import React from 'react';
import Link from 'next/link';
import { CLevelSelector } from '@/components/c-level/CLevelSelector';

export default function CLevelPage() {
  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">C-Level Overview</h1>
        <div className="flex space-x-3">
          <Link 
            href="/tasks" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Tasks
          </Link>
          <Link 
            href="/briefs" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Briefs
          </Link>
        </div>
      </div>
      
      <CLevelSelector />
      
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-800 font-medium mb-4">
          Select a C-Level role above to view its strategy and task wall
        </p>
      </div>
    </div>
  );
}
