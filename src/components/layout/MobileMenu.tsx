"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'chart-bar' },
    { name: 'C-Level', path: '/c-level', icon: 'users' }
  ];
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <button
        data-testid="mobile-menu-button"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleMenu}
        aria-label="Open menu"
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center">
          <div 
            data-testid="mobile-menu-content"
            className="bg-white w-full max-h-[80vh] rounded-t-xl p-4 overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                data-testid="mobile-menu-close"
                className="text-gray-500 hover:text-gray-700"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-3 rounded-md ${
                      pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={toggleMenu}
                  >
                    <span className="mr-3 text-lg">
                      <i className={`fas fa-${item.icon}`}></i>
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
