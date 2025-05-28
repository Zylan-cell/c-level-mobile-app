import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  // Get page title based on current path
  const getPageTitle = () => {
    switch (true) {
      case pathname === '/dashboard':
        return 'Board Overview';
      case pathname?.startsWith('/c-level'):
        return 'C-LEVEL Overview';
      case pathname?.startsWith('/tasks'):
        return pathname?.includes('/new') ? 'Add Task' : 'Tasks';
      case pathname?.startsWith('/briefs'):
        return 'Briefs';
      case pathname?.startsWith('/feedback'):
        return 'Feedback';
      default:
        return 'C-Level App';
    }
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                {user.name}
              </span>
              <button
                onClick={() => logout()}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
