"use client";

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Header } from '@/components/layout/Header';
import { InstallPWA } from '@/components/pwa/InstallPWA';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Don't show navigation on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {!isAuthPage && <BottomNavigation />}
      <InstallPWA />
    </div>
  );
};
