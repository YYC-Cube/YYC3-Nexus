import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useThemeTokens } from '../../src/app/components/hooks/use-theme-tokens';

describe('useThemeTokens', () => {
  it('should return all required token keys', () => {
    const { result } = renderHook(() => useThemeTokens());
    const tokens = result.current;

    const requiredKeys = [
      'overlayBg',
      'modalBg',
      'modalBorder',
      'modalShadow',
      'textPrimary',
      'textSecondary',
      'textTertiary',
      'textMuted',
      'accent',
      'accentBg',
      'accentBorder',
      'surfaceInset',
      'sectionBorder',
      'hoverBg',
      'activeBg',
      'activeTabText',
      'badgeBg',
    ];

    for (const key of requiredKeys) {
      expect(tokens[key as keyof typeof tokens]).toBeTruthy();
    }
  });

  it('should return non-empty string values', () => {
    const { result } = renderHook(() => useThemeTokens());
    for (const [, value] of Object.entries(result.current)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it('should return consistent values on re-render', () => {
    const { result, rerender } = renderHook(() => useThemeTokens());
    const first = result.current;
    rerender();
    const second = result.current;
    expect(first).toEqual(second);
  });

  it('should include cyberpunk theme tokens', () => {
    const { result } = renderHook(() => useThemeTokens());
    expect(result.current.accent).toContain('#00f0ff');
    expect(result.current.modalBg).toContain('0c0c0c');
  });
});
