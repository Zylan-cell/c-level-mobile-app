import React from 'react';
import Link from 'next/link';
import { TaskList } from '@/components/tasks/TaskList';
import { mockTasks } from '@/lib/mock-data';

export default function TasksPage() {
  // Используем моковые данные задач
  
  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        
        <Link 
          href="/tasks/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Task
        </Link>
      </div>
      
      <TaskList tasks={mockTasks} isLoading={false} />
    </div>
  );
}
