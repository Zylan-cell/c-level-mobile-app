import React from 'react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { CLevelPerformanceCard } from '@/components/dashboard/CLevelPerformanceCard';
import { LatestBriefsCard } from '@/components/dashboard/LatestBriefsCard';
import { ProblematicTasksCard } from '@/components/dashboard/ProblematicTasksCard';
import { mockBusinessMetrics, mockCLevelPerformance, mockBriefs, mockTasks } from '@/lib/mock-data';

// This is a client component that will fetch data on the client side
export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-16">
      {/* Metrics Card */}
      <div>
        <MetricsCard 
          metrics={mockBusinessMetrics} 
          isLoading={false} 
        />
      </div>
      
      {/* C-Level Performance */}
      <div>
        <CLevelPerformanceCard 
          performances={mockCLevelPerformance} 
          isLoading={false} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Briefs */}
        <div>
          <LatestBriefsCard 
            briefs={mockBriefs.slice(0, 3)} 
            isLoading={false} 
          />
        </div>
        
        {/* Problematic Tasks */}
        <div>
          <ProblematicTasksCard 
            tasks={mockTasks.filter(task => task.status === 'failed')} 
            isLoading={false} 
          />
        </div>
      </div>
    </div>
  );
}
