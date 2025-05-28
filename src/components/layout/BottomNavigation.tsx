import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RiDashboardLine, 
  RiTaskLine, 
  RiFileList3Line, 
  RiUserSettingsLine,
  RiAddCircleLine
} from 'react-icons/ri';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  
  // Navigation items
  const navItems = [
    {
      label: 'Board',
      href: '/dashboard',
      icon: <RiDashboardLine className="text-xl" />,
      active: pathname === '/dashboard'
    },
    {
      label: 'C-Level',
      href: '/c-level',
      icon: <RiUserSettingsLine className="text-xl" />,
      active: pathname?.startsWith('/c-level')
    },
    {
      label: 'Add Task',
      href: '/tasks/new',
      icon: <RiAddCircleLine className="text-xl" />,
      active: pathname === '/tasks/new'
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center w-full h-full ${
              item.active 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
