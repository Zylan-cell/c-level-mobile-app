import React from 'react';
import { TaskForm } from '@/components/tasks/TaskForm';

export default function NewTaskPage() {
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h1>
      
      <TaskForm />
    </div>
  );
}
