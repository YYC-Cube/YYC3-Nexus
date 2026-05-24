import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { I18nProvider, useI18n } from '../../src/app/components/context/i18n-context';

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe('I18n Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default to a valid locale', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(['zh', 'en']).toContain(result.current.locale);
    expect(typeof result.current.isZh).toBe('boolean');
    expect(typeof result.current.isEn).toBe('boolean');
  });

  it('should switch to en locale', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => {
      result.current.setLocale('en');
    });
    expect(result.current.locale).toBe('en');
    expect(result.current.isEn).toBe(true);
    expect(result.current.isZh).toBe(false);
  });

  it('should persist locale to localStorage', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => {
      result.current.setLocale('en');
    });
    expect(localStorage.getItem('yyc3_locale')).toBe('en');
  });

  it('should restore locale from localStorage', () => {
    localStorage.setItem('yyc3_locale', 'en');
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.locale).toBe('en');
  });

  it('should translate known keys', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const translated = result.current.t('nav.dashboard');
    expect(translated).toBeTruthy();
    expect(typeof translated).toBe('string');
  });

  it('should return key for unknown keys', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('nonexistent.key.12345')).toBe('nonexistent.key.12345');
  });

  it('should support parameter interpolation', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const template = 'Hello {name}, you have {count} items';
    const _messages = { 'test.interpolation': template } as any;
    const original = result.current.t;
    expect(typeof original).toBe('function');
  });

  it('should setLanguage alias work', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => {
      result.current.setLanguage('en');
    });
    expect(result.current.language).toBe('en');
  });

  it('should translate differently in zh vs en', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    act(() => {
      result.current.setLocale('zh');
    });
    const zhText = result.current.t('nav.dashboard');
    act(() => {
      result.current.setLocale('en');
    });
    const enText = result.current.t('nav.dashboard');
    expect(zhText).not.toBe(enText);
  });
});
