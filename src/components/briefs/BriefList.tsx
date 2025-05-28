import React from 'react';
import Link from 'next/link';
import { Brief } from '@/types';
import { formatDate, truncateText } from '@/lib/utils/helpers';

interface BriefListProps {
  briefs: Brief[];
  isLoading: boolean;
}

export const BriefList: React.FC<BriefListProps> = ({ briefs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!briefs.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 font-medium">No briefs available yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {briefs.map((brief) => (
        <Link key={brief.id} href={`/briefs/${brief.id}`}>
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">
                  Brief for Task #{brief.taskId.substring(0, 8)}
                </h3>
                <span className="text-xs text-gray-700 font-medium">
                  {formatDate(brief.createdAt)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {truncateText(brief.content, 150)}
              </p>
              
              {brief.recommendations && brief.recommendations.length > 0 && (
                <div className="flex items-center text-xs text-gray-700 font-medium">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {brief.recommendations.length} recommendation(s)
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
