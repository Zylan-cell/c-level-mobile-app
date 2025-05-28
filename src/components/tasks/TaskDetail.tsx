"use client";

import React from 'react';
import Link from 'next/link';
import { Task } from '@/types';
import { formatDate, getStatusColor, getStatusName, getCLevelFullName } from '@/lib/utils/helpers';
import { useBriefStore } from '@/lib/store';

interface TaskDetailProps {
  task: Task | null;
  isLoading: boolean;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, isLoading }) => {
  const { currentBrief, isLoading: isBriefLoading } = useBriefStore();
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse" data-testid="loading-skeleton">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 font-medium mb-4">Task not found</p>
        <Link 
          href="/tasks" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
          <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {getStatusName(task.status)}
          </span>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-700 font-medium mb-2">
            <span className="mr-4">Assigned to: {getCLevelFullName(task.clevelType)}</span>
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
          
          {task.status === 'in_progress' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
              <span className="text-blue-800 text-sm">AI is currently working on this task</span>
            </div>
          )}
          
          {task.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <span className="text-red-800 text-sm font-medium">Task Failed</span>
              <p className="text-red-700 text-sm mt-1">
                The AI was unable to complete this task. Please review and try again with more specific instructions.
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Task Description:</h3>
            <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
          </div>
        </div>
        
        {task.briefId && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Brief</h3>
            
            {isBriefLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : currentBrief ? (
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-gray-600 whitespace-pre-line mb-4">{currentBrief.content}</p>
                
                {currentBrief.recommendations && currentBrief.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      {currentBrief.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-700 font-medium">
                  Brief created: {formatDate(currentBrief.createdAt)}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 font-medium">Brief not available</p>
            )}
          </div>
        )}
        
        <div className="flex justify-between">
          <Link 
            href="/tasks" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Tasks
          </Link>
          
          {task.status === 'failed' && (
            <Link 
              href={`/tasks/retry/${task.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry Task
            </Link>
          )}
          
          {task.briefId && (
            <Link 
              href={`/briefs/${task.briefId}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Full Brief
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
