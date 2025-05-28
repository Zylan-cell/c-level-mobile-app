"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLevelType, TaskStatus } from '@/types';
import { useTaskStore } from '@/lib/store';

interface TaskFormProps {
  onSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clevelType, setClevelType] = useState<CLevelType>('COO');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { createTask, error, clearError } = useTaskStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !clevelType || !status) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createTask({
        title,
        description,
        clevelType,
        status
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setClevelType('COO');
      setStatus('pending');
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/tasks');
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const clevelOptions: CLevelType[] = ['CEO', 'COO', 'CMO', 'CCO', 'CTO', 'CFO'];
  const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed', 'failed'];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
          <button 
            className="ml-2 text-sm underline" 
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="clevelType" 
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Assign to C-Level
          </label>
          <select
            id="clevelType"
            value={clevelType}
            onChange={(e) => setClevelType(e.target.value as CLevelType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            required
          >
            {clevelOptions.map((option) => (
              <option key={option} value={option} className="text-gray-900 font-medium">
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="status" 
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Task Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            required
          >
            {statusOptions.map((option) => (
              <option key={option} value={option} className="text-gray-900 font-medium">
                {option.replace('_', ' ').charAt(0).toUpperCase() + option.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            placeholder="Describe the task in detail..."
            required
          />
          <p className="mt-1 text-xs text-gray-900 font-medium">
            Be specific about what you want the AI to accomplish
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 font-medium mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Delegating...' : 'Delegate to AI'}
          </button>
        </div>
      </form>
    </div>
  );
};
