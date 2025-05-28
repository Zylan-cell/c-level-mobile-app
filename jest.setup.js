// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Настройка для моков Zustand
jest.mock('zustand', () => {
  const actualZustand = jest.requireActual('zustand');
  return {
    ...actualZustand,
    create: jest.fn().mockImplementation(actualZustand.create)
  };
});

// Мокирование персистентного хранилища Zustand
jest.mock('zustand/middleware', () => {
  const actualMiddleware = jest.requireActual('zustand/middleware');
  return {
    ...actualMiddleware,
    persist: jest.fn().mockImplementation((config) => config)
  };
});

// Мок для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Для обратной совместимости
    removeListener: jest.fn(), // Для обратной совместимости
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Мок для next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/'
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams())
}));

// Глобальные моки
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Подавление предупреждений React
console.error = jest.fn();
console.warn = jest.fn();
