import React from 'react';
import Link from 'next/link';
import { Brief } from '@/types';
import { formatDate, truncateText } from '@/lib/utils/helpers';

interface LatestBriefsCardProps {
  briefs: Brief[];
  isLoading: boolean;
}

export const LatestBriefsCard: React.FC<LatestBriefsCardProps> = ({ 
  briefs, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!briefs.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Briefs
        </h3>
        <p className="text-gray-500">No briefs available yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Briefs
        </h3>
        
        <div className="space-y-4">
          {briefs.map((brief) => (
            <Link 
              key={brief.id}
              href={`/briefs/${brief.id}`}
              className="block"
            >
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">
                    Brief for Task #{brief.taskId.substring(0, 8)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(brief.createdAt)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                  {truncateText(brief.content, 120)}
                </p>
                
                {brief.recommendations && brief.recommendations.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">
                      {brief.recommendations.length} recommendation(s)
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/briefs" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all briefs →
          </Link>
        </div>
      </div>
    </div>
  );
};
