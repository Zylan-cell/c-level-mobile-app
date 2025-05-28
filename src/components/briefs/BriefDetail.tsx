"use client";

import React from 'react';
import Link from 'next/link';
import { Brief } from '@/types';
import { formatDate } from '@/lib/utils/helpers';
import { useTaskStore } from '@/lib/store';

interface BriefDetailProps {
  brief: Brief | null;
  isLoading: boolean;
}

export const BriefDetail: React.FC<BriefDetailProps> = ({ brief, isLoading }) => {
  const { tasks } = useTaskStore();
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse" data-testid="loading-skeleton">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (!brief) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 font-medium mb-4">Brief not found</p>
        <Link 
          href="/briefs" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Briefs
        </Link>
      </div>
    );
  }
  
  // Find related task
  const relatedTask = tasks.find(task => task.id === brief.taskId);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {relatedTask ? relatedTask.title : `Brief #${brief.id.substring(0, 8)}`}
          </h2>
          <span className="text-sm text-gray-700 font-medium">
            {formatDate(brief.createdAt)}
          </span>
        </div>
        
        {relatedTask && (
          <div className="mb-4">
            <Link 
              href={`/tasks/${brief.taskId}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Related Task →
            </Link>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Brief Content</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-gray-600 whitespace-pre-line">{brief.content}</p>
          </div>
        </div>
        
        {brief.recommendations && brief.recommendations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Recommendations</h3>
            <div className="bg-green-50 rounded-md p-4">
              <ul className="list-disc list-inside space-y-2">
                {brief.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Link 
            href="/briefs" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Briefs
          </Link>
          
          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: relatedTask?.title || 'Brief Report',
                    text: brief.content,
                  }).catch(err => console.error('Error sharing:', err));
                } else {
                  navigator.clipboard.writeText(brief.content)
                    .then(() => alert('Brief content copied to clipboard'))
                    .catch(err => console.error('Error copying:', err));
                }
              }}
            >
              Share Brief
            </button>
            
            <Link 
              href={`/feedback?briefId=${brief.id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Provide Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
