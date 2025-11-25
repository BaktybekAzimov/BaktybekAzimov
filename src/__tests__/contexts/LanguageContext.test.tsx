import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides language context', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.language).toBeDefined();
    expect(result.current.setLanguage).toBeDefined();
    expect(result.current.t).toBeDefined();
  });

  it('throws error when useLanguage is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within LanguageProvider');

    console.error = originalError;
  });

  it('initializes with Russian language by default', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.language).toBe('ru');
  });

  it('loads language from localStorage if available', () => {
    localStorage.setItem('language', 'ky');

    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.language).toBe('ky');
  });

  it('sets language to Russian', () => {
    localStorage.setItem('language', 'ky');

    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('ru');
    });

    expect(result.current.language).toBe('ru');
    expect(localStorage.getItem('language')).toBe('ru');
  });

  it('sets language to Kyrgyz', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('ky');
    });

    expect(result.current.language).toBe('ky');
    expect(localStorage.getItem('language')).toBe('ky');
  });

  it('translates keys correctly in Russian', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('nav.dashboard')).toBe('Dashboard');
    expect(result.current.t('nav.trips')).toBe('Рейсы');
    expect(result.current.t('nav.drivers')).toBe('Водители');
    expect(result.current.t('nav.vehicles')).toBe('Машины');
    expect(result.current.t('nav.routes')).toBe('Маршруты');
    expect(result.current.t('nav.users')).toBe('Пользователи');
    expect(result.current.t('nav.settings')).toBe('Настройки');
    expect(result.current.t('nav.logout')).toBe('Выйти');
  });

  it('translates keys correctly in Kyrgyz', () => {
    localStorage.setItem('language', 'ky');

    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('nav.dashboard')).toBe('Башкы бет');
    expect(result.current.t('nav.trips')).toBe('Рейстер');
    expect(result.current.t('nav.drivers')).toBe('Айдоочулар');
    expect(result.current.t('nav.vehicles')).toBe('Унаалар');
    expect(result.current.t('nav.routes')).toBe('Маршруттар');
    expect(result.current.t('nav.users')).toBe('Колдонуучулар');
    expect(result.current.t('nav.settings')).toBe('Жөндөөлөр');
    expect(result.current.t('nav.logout')).toBe('Чыгуу');
  });

  it('returns key if translation not found', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('non.existent.key')).toBe('non.existent.key');
  });

  it('translates dashboard keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('dashboard.total_revenue')).toBe('Общая выручка');
    expect(result.current.t('dashboard.total_trips')).toBe('Всего рейсов');
    expect(result.current.t('dashboard.net_profit')).toBe('Чистая прибыль');
    expect(result.current.t('dashboard.avg_profit')).toBe('Средняя прибыль');
  });

  it('translates status keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('status.completed')).toBe('Завершён');
    expect(result.current.t('status.in_progress')).toBe('В пути');
    expect(result.current.t('status.cancelled')).toBe('Отменён');
    expect(result.current.t('status.active')).toBe('Активен');
    expect(result.current.t('status.inactive')).toBe('Неактивен');
  });

  it('translates role keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('role.admin')).toBe('Администратор');
    expect(result.current.t('role.dispatcher')).toBe('Диспетчер');
    expect(result.current.t('role.driver')).toBe('Водитель');
  });

  it('persists language changes to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('ky');
    });

    expect(localStorage.getItem('language')).toBe('ky');

    act(() => {
      result.current.setLanguage('ru');
    });

    expect(localStorage.getItem('language')).toBe('ru');
  });

  it('switches language and updates translations', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('nav.dashboard')).toBe('Dashboard');

    act(() => {
      result.current.setLanguage('ky');
    });

    expect(result.current.t('nav.dashboard')).toBe('Башкы бет');

    act(() => {
      result.current.setLanguage('ru');
    });

    expect(result.current.t('nav.dashboard')).toBe('Dashboard');
  });

  it('handles button translations', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('button.edit')).toBe('Изменить');
    expect(result.current.t('button.delete')).toBe('Удалить');
    expect(result.current.t('button.add')).toBe('Добавить');
    expect(result.current.t('button.save')).toBe('Сохранить');
    expect(result.current.t('button.cancel')).toBe('Отмена');
  });

  it('handles filter translations', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('filter.today')).toBe('Сегодня');
    expect(result.current.t('filter.week')).toBe('Неделя');
    expect(result.current.t('filter.month')).toBe('Месяц');
    expect(result.current.t('filter.all')).toBe('Всё время');
  });
});
