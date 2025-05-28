"use client";

import { useState, useEffect } from 'react';

// Функция для создания мока matchMedia в тестовом окружении
const createMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // Для обратной совместимости
  removeListener: jest.fn(), // Для обратной совместимости
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Проверяем, находимся ли мы в браузере
    if (typeof window === 'undefined') return;
    
    // Проверяем, находимся ли мы в тестовом окружении
    if (typeof window.matchMedia !== 'function') {
      // В тестовом окружении возвращаем мок
      return;
    }
    
    const media = window.matchMedia(query);
    
    // Устанавливаем начальное значение
    setMatches(media.matches);

    // Создаем колбэк для обновления состояния
    const listener = () => setMatches(media.matches);

    // Добавляем слушатель
    media.addEventListener('change', listener);

    // Удаляем слушатель при размонтировании
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
