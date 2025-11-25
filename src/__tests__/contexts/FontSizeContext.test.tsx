import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FontSizeProvider, useFontSize } from '../../contexts/FontSizeContext';

describe('FontSizeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear data attribute
    document.documentElement.removeAttribute('data-font-size');
  });

  it('provides font size context', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.fontSize).toBeDefined();
    expect(result.current.setFontSize).toBeDefined();
  });

  it('throws error when useFontSize is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useFontSize());
    }).toThrow('useFontSize must be used within FontSizeProvider');

    console.error = originalError;
  });

  it('initializes with medium font size by default', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    expect(result.current.fontSize).toBe('medium');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('medium');
  });

  it('loads font size from localStorage if available', () => {
    localStorage.setItem('fontSize', 'large');

    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    expect(result.current.fontSize).toBe('large');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
  });

  it('sets font size to small', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('small');
    });

    expect(result.current.fontSize).toBe('small');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('small');
    expect(localStorage.getItem('fontSize')).toBe('small');
  });

  it('sets font size to medium', () => {
    localStorage.setItem('fontSize', 'large');

    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('medium');
    });

    expect(result.current.fontSize).toBe('medium');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('medium');
    expect(localStorage.getItem('fontSize')).toBe('medium');
  });

  it('sets font size to large', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('large');
    });

    expect(result.current.fontSize).toBe('large');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
    expect(localStorage.getItem('fontSize')).toBe('large');
  });

  it('persists font size changes to localStorage', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('small');
    });

    expect(localStorage.getItem('fontSize')).toBe('small');

    act(() => {
      result.current.setFontSize('large');
    });

    expect(localStorage.getItem('fontSize')).toBe('large');
  });

  it('applies font size attribute to document root', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('small');
    });

    expect(document.documentElement.getAttribute('data-font-size')).toBe('small');

    act(() => {
      result.current.setFontSize('large');
    });

    expect(document.documentElement.getAttribute('data-font-size')).toBe('large');
  });

  it('handles all font size transitions', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    // medium -> small
    act(() => {
      result.current.setFontSize('small');
    });
    expect(result.current.fontSize).toBe('small');

    // small -> large
    act(() => {
      result.current.setFontSize('large');
    });
    expect(result.current.fontSize).toBe('large');

    // large -> medium
    act(() => {
      result.current.setFontSize('medium');
    });
    expect(result.current.fontSize).toBe('medium');
  });

  it('maintains font size after multiple changes', () => {
    const { result } = renderHook(() => useFontSize(), {
      wrapper: FontSizeProvider,
    });

    act(() => {
      result.current.setFontSize('small');
      result.current.setFontSize('large');
      result.current.setFontSize('medium');
    });

    expect(result.current.fontSize).toBe('medium');
    expect(localStorage.getItem('fontSize')).toBe('medium');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('medium');
  });
});
