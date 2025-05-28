import React from 'react';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { mockTasks } from '@/lib/mock-data';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Используем await для доступа к params, как рекомендует Next.js
  const taskId = await Promise.resolve(params.id);
  
  // Находим задачу по ID из моковых данных
  const task = mockTasks.find(t => t.id === taskId) || null;
  
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Details</h1>
      
      <TaskDetail task={task} isLoading={false} />
    </div>
  );
}
