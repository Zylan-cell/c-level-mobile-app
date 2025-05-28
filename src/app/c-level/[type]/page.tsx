import React from 'react';
import Link from 'next/link';
import { CLevelSelector } from '@/components/c-level/CLevelSelector';
import { StrategyDetail } from '@/components/c-level/StrategyDetail';
import { CLevelTaskWall } from '@/components/c-level/CLevelTaskWall';
import { CLevelType } from '@/types';
import { mockStrategies, mockTasks } from '@/lib/mock-data';

// Генерируем статические параметры для всех типов C-Level
export async function generateStaticParams() {
  // Список всех возможных типов C-Level
  const types = ['CEO', 'CTO', 'CFO', 'COO'];
  
  return types.map(type => ({
    type: type.toLowerCase(),
  }));
}

interface CLevelTypePageProps {
  params: {
    type: string;
  };
}

export default async function CLevelTypePage({ params }: CLevelTypePageProps) {
  // Получаем тип из параметров маршрута
  const typeParam = (await params).type;
  
  // Convert type param to uppercase for CLevelType
  const clevelType = typeParam.toUpperCase() as CLevelType;
  
  // Получаем стратегию для выбранного C-Level из моковых данных
  const strategy = mockStrategies[clevelType];
  
  // Фильтруем задачи для выбранного C-Level из моковых данных
  const tasks = mockTasks.filter(task => task.clevelType === clevelType);
  
  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {clevelType} Overview
        </h1>
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
      
      <CLevelSelector selectedCLevel={clevelType} />
      
      <div className="space-y-6">
        <StrategyDetail strategy={strategy} isLoading={false} />
        
        <CLevelTaskWall 
          tasks={tasks} 
          clevelType={clevelType} 
          isLoading={false} 
        />
      </div>
    </div>
  );
}
