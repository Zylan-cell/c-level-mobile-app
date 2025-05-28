import React from 'react';
import Link from 'next/link';
import { Task } from '@/types';
import { formatDate, truncateText, getStatusColor } from '@/lib/utils/helpers';

interface ProblematicTasksCardProps {
  tasks: Task[];
  isLoading: boolean;
}

export const ProblematicTasksCard: React.FC<ProblematicTasksCardProps> = ({ 
  tasks, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        {[1, 2].map((i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!tasks.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tasks AI Can't Do
        </h3>
        <p className="text-gray-500">No problematic tasks found</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tasks AI Can't Do
        </h3>
        
        <div className="space-y-4">
          {tasks.map((task) => (
            <Link 
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block"
            >
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">
                    {truncateText(task.title, 40)}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                  {truncateText(task.description, 100)}
                </p>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Assigned to: {task.clevelType}</span>
                  <span>{formatDate(task.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/tasks" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all tasks →
          </Link>
        </div>
      </div>
    </div>
  );
};
