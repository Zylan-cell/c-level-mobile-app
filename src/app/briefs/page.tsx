import React from 'react';
import { BriefList } from '@/components/briefs/BriefList';
import { mockBriefs } from '@/lib/mock-data';

export default function BriefsPage() {
  // Используем моковые данные брифов
  
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Briefs</h1>
      
      <BriefList briefs={mockBriefs} isLoading={false} />
    </div>
  );
}
