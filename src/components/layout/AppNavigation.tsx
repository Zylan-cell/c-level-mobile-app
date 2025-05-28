"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const AppNavigation: React.FC = () => {
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'chart-bar' },
    { name: 'C-Level', path: '/c-level', icon: 'users' }
  ];
  
  if (isDesktop) {
    return (
      <nav data-testid="desktop-navigation" className="bg-white rounded-lg shadow">
        <div className="px-4 py-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">
                    <i className={`fas fa-${item.icon}`}></i>
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
  
  return (
    <button
      data-testid="mobile-menu-button"
      className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      aria-label="Open menu"
    >
      <i className="fas fa-bars"></i>
    </button>
  );
};
