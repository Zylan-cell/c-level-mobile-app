"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Task, CLevelType, TaskStatus } from '@/types';
import { formatDate, getStatusColor, getStatusName } from '@/lib/utils/helpers';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  const router = useRouter();
  const [clevelFilter, setClevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  const filteredAndSortedTasks = useMemo(() => {
    // Фильтрация по C-Level
    let filtered = tasks;
    
    if (clevelFilter !== 'all') {
      filtered = filtered.filter(task => task.clevelType === clevelFilter);
    }
    
    // Фильтрация по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Сортировка
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, clevelFilter, statusFilter, sortBy]);
  
  // Create filter controls component
  const filterControls = (
    <div className="mb-4 space-y-3">
      <div>
        <label htmlFor="clevelFilter" className="block text-sm font-medium text-gray-900 mb-1">
          Filter by C-Level
        </label>
        <select
          id="clevelFilter"
          value={clevelFilter}
          onChange={(e) => setClevelFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
        >
          <option value="all" className="text-gray-900 font-medium">All C-Levels</option>
          <option value="CEO" className="text-gray-900 font-medium">CEO</option>
          <option value="CTO" className="text-gray-900 font-medium">CTO</option>
          <option value="CFO" className="text-gray-900 font-medium">CFO</option>
          <option value="CMO" className="text-gray-900 font-medium">CMO</option>
          <option value="COO" className="text-gray-900 font-medium">COO</option>
        </select>
      </div>

      <div>
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-900 mb-1">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
        >
          <option value="all" className="text-gray-900 font-medium">All Statuses</option>
          <option value="pending" className="text-gray-900 font-medium">Pending</option>
          <option value="in_progress" className="text-gray-900 font-medium">In Progress</option>
          <option value="completed" className="text-gray-900 font-medium">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-900 mb-1">
          Sort by
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
        >
          <option value="date-desc" className="text-gray-900 font-medium">Newest first</option>
          <option value="date-asc" className="text-gray-900 font-medium">Oldest first</option>
          <option value="title" className="text-gray-900 font-medium">Title (A-Z)</option>
        </select>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4" data-testid="task-skeleton">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          </div>
        ))}
        
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-900 mb-1">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          >
            <option value="date-desc" className="text-gray-900 font-medium">Newest first</option>
            <option value="date-asc" className="text-gray-900 font-medium">Oldest first</option>
            <option value="title" className="text-gray-900 font-medium">Title (A-Z)</option>
          </select>
        </div>
      </div>
    );
  }
  
  if (!filteredAndSortedTasks.length) {
    return (
      <>
        {filterControls}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700 font-medium mb-4">No tasks found</p>
          <Link 
            href="/tasks/new" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Task
          </Link>
        </div>
      </>
    );
  }
  
  return (
    <>
      {filterControls}
      <div className="space-y-4">
        {filteredAndSortedTasks.map((task) => (
          <div 
            key={task.id} 
            data-testid="task-item"
            onClick={() => router.push(`/tasks/${task.id}`)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {getStatusName(task.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-700 font-medium">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-2">
                    {task.clevelType}
                  </span>
                  
                  {task.status === 'in_progress' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      AI
                    </span>
                  )}
                </div>
                
                <span>{formatDate(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
