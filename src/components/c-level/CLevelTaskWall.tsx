"use client";

import React from 'react';
import Link from 'next/link';
import { Task, CLevelType } from '@/types';
import { getStatusColor, getStatusName, formatDate, truncateText } from '@/lib/utils/helpers';

interface CLevelTaskWallProps {
  tasks: Task[];
  clevelType: CLevelType;
  isLoading: boolean;
}

export const CLevelTaskWall: React.FC<CLevelTaskWallProps> = ({ 
  tasks, 
  clevelType,
  isLoading 
}) => {
  // Фильтруем задачи на активные и архивные
  const activeTasks = tasks.filter(task => 
    task.status === 'pending' || task.status === 'in_progress'
  );
  
  const archivedTasks = tasks.filter(task => 
    task.status === 'completed' || task.status === 'failed'
  );
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!tasks.length) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          TASK-WALL
        </h3>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No tasks assigned to {clevelType}</p>
          <Link 
            href="/tasks/new" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Task
          </Link>
        </div>
      </div>
    );
  }
  
  // Group active tasks by status
  const pendingTasks = activeTasks.filter(task => task.status === 'pending');
  const inProgressTasks = activeTasks.filter(task => task.status === 'in_progress');
  
  // Group archived tasks by status
  const completedTasks = archivedTasks.filter(task => task.status === 'completed');
  const failedTasks = archivedTasks.filter(task => task.status === 'failed');
  
  const renderTaskCard = (task: Task) => (
    <Link key={task.id} href={`/tasks/${task.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow h-full">
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{truncateText(task.title, 40)}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
              {getStatusName(task.status)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
            {truncateText(task.description, 80)}
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
            {task.status === 'in_progress' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                AI
              </span>
            )}
            <span className="ml-auto">{formatDate(task.updatedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        TASK-WALL
      </h3>
      
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Active Tasks Section - Left Side */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="border-b border-gray-300 mb-4">
            <h4 className="text-md font-medium text-blue-700 pb-2 border-b-2 border-blue-600 inline-block">
              Active
            </h4>
          </div>
          
          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center mb-6">
              <p className="text-gray-500">No active tasks for {clevelType}</p>
            </div>
          ) : (
            <>
              {inProgressTasks.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    In Progress
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {inProgressTasks.map(renderTaskCard)}
                  </div>
                </div>
              )}
              
              {pendingTasks.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Pending
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {pendingTasks.map(renderTaskCard)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Archive Tasks Section - Right Side */}
        <div className="w-full md:w-1/2">
          <div className="border-b border-gray-300 mb-4">
            <h4 className="text-md font-medium text-gray-700 pb-2 border-b-2 border-gray-600 inline-block">
              Archive
            </h4>
          </div>
          
          {archivedTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-500">No archived tasks for {clevelType}</p>
            </div>
          ) : (
            <>
              {completedTasks.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Completed
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {completedTasks.map(renderTaskCard)}
                  </div>
                </div>
              )}
              
              {failedTasks.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-red-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Failed
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {failedTasks.map(renderTaskCard)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
