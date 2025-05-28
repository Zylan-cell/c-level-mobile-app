import React from 'react';
import { BriefDetail } from '@/components/briefs/BriefDetail';
import { mockBriefs } from '@/lib/mock-data';

// Генерируем статические параметры для всех брифов
export async function generateStaticParams() {
  return mockBriefs.map(brief => ({
    id: brief.id,
  }));
}

interface BriefDetailPageProps {
  params: {
    id: string;
  };
}

export default async function BriefDetailPage({ params }: BriefDetailPageProps) {
  // Используем await для доступа к params, как рекомендует Next.js
  const briefId = await Promise.resolve(params.id);
  
  // Находим бриф по ID из моковых данных
  const brief = mockBriefs.find(b => b.id === briefId) || null;
  
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Brief Details</h1>
      
      <BriefDetail brief={brief} isLoading={false} />
    </div>
  );
}
