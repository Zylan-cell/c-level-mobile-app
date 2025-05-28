import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppNavigation } from '@/components/layout/AppNavigation';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    pathname: '/dashboard'
  }),
  usePathname: jest.fn().mockReturnValue('/dashboard')
}));

// Мокируем хук для определения размера экрана
jest.mock('@/lib/hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn().mockReturnValue(true) // Всегда возвращаем true для десктопного режима
}));

describe('Navigation Interaction', () => {
  it('renders all navigation items correctly', () => {
    render(<AppNavigation />);
    
    // Проверяем, что все пункты навигации отображаются
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('C-Level')).toBeInTheDocument();
    
    // Проверяем, что Tasks и Briefs нет в меню навигации
    expect(screen.queryByText('Tasks')).not.toBeInTheDocument();
    expect(screen.queryByText('Briefs')).not.toBeInTheDocument();
  });
  
  it('highlights the active navigation item', () => {
    render(<AppNavigation />);
    
    // Проверяем, что активный пункт навигации выделен
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-blue-50');
  });
  
  it('allows clicking on navigation items', () => {
    const { container } = render(<AppNavigation />);
    
    // Находим все ссылки навигации
    const navLinks = container.querySelectorAll('a');
    
    // Проверяем, что все ссылки кликабельны
    navLinks.forEach(link => {
      expect(link).not.toBeDisabled();
      fireEvent.click(link);
    });
  });
});
