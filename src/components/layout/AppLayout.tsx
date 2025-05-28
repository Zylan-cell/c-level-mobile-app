"use client";

import React, { ReactNode } from 'react';
import { AppNavigation } from './AppNavigation';
import { MobileMenu } from './MobileMenu';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  if (isDesktop) {
    return (
      <div data-testid="desktop-layout" className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AppNavigation />
            </div>
            <main className="col-span-9">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div data-testid="mobile-layout" className="min-h-screen bg-gray-50">
      <div className="px-4 py-6">
        <main>
          {children}
        </main>
      </div>
      <MobileMenu />
    </div>
  );
};
