"use client";

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppNavigation } from '@/components/layout/AppNavigation';
import { MobileMenu } from '@/components/layout/MobileMenu';

// Импортируем мок для Firebase
import '../__mocks__/firebase';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  }),
  usePathname: jest.fn().mockReturnValue('/dashboard')
}));

// Мокируем хук для определения размера экрана
jest.mock('@/lib/hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn()
}));

describe('Responsive UI Interaction', () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('renders desktop navigation on large screens', () => {
    // Мокируем большой экран
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(true); // isDesktop = true
    
    render(<AppNavigation />);
    
    // Проверяем, что отображается десктопная навигация
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
  });
  
  it('renders mobile menu button on small screens', () => {
    // Мокируем маленький экран
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(false); // isDesktop = false
    
    render(<AppNavigation />);
    
    // Проверяем, что отображается кнопка мобильного меню
    expect(screen.queryByTestId('desktop-navigation')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });
  
  it('opens mobile menu when menu button is clicked', () => {
    // Мокируем маленький экран
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(false); // isDesktop = false
    
    render(<MobileMenu />);
    
    // Проверяем, что изначально мобильное меню скрыто
    expect(screen.queryByTestId('mobile-menu-content')).not.toBeInTheDocument();
    
    // Кликаем на кнопку меню
    const menuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(menuButton);
    
    // Проверяем, что мобильное меню отображается
    expect(screen.getByTestId('mobile-menu-content')).toBeInTheDocument();
  });
  
  it('closes mobile menu when close button is clicked', () => {
    // Мокируем маленький экран
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(false); // isDesktop = false
    
    render(<MobileMenu />);
    
    // Открываем мобильное меню
    const menuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(menuButton);
    
    // Проверяем, что меню открыто
    expect(screen.getByTestId('mobile-menu-content')).toBeVisible();
    
    // Кликаем на кнопку закрытия
    const closeButton = screen.getByTestId('mobile-menu-close');
    fireEvent.click(closeButton);
    
    // Проверяем, что мобильное меню скрыто
    expect(screen.queryByTestId('mobile-menu-content')).not.toBeInTheDocument();
  });
  
  it('adapts layout for different screen sizes', () => {
    // Тестируем десктопный вид
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(true); // isDesktop = true
    
    const { rerender } = render(<AppLayout>Test Content</AppLayout>);
    
    // Проверяем, что используется десктопный макет
    expect(screen.getByTestId('desktop-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-layout')).not.toBeInTheDocument();
    
    // Тестируем мобильный вид
    useMediaQueryMock.mockReturnValue(false); // isDesktop = false
    rerender(<AppLayout>Test Content</AppLayout>);
    
    // Проверяем, что используется мобильный макет
    expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
  });
  
  it('renders content correctly on both layouts', () => {
    // Тестируем десктопный вид
    const useMediaQueryMock = require('@/lib/hooks/useMediaQuery').useMediaQuery;
    useMediaQueryMock.mockReturnValue(true); // isDesktop = true
    
    const { rerender } = render(<AppLayout>Test Content</AppLayout>);
    
    // Проверяем, что контент отображается в десктопном макете
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Тестируем мобильный вид
    useMediaQueryMock.mockReturnValue(false); // isDesktop = false
    rerender(<AppLayout>Test Content</AppLayout>);
    
    // Проверяем, что контент отображается в мобильном макете
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
