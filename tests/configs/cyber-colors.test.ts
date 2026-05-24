import { describe, expect, it } from 'vitest';

import {
  COLOR_MIGRATION,
  CYBER_COLORS,
  CYBER_GRADIENTS,
  CYBER_SHADOWS,
} from '../../src/app/config/cyber-colors';

describe('cyber-colors', () => {
  describe('CYBER_COLORS', () => {
    it('should export all primary color keys', () => {
      expect(CYBER_COLORS.primary).toBeDefined();
      expect(CYBER_COLORS.primaryLight).toBeDefined();
      expect(CYBER_COLORS.primaryDark).toBeDefined();
    });

    it('should export all secondary color keys', () => {
      expect(CYBER_COLORS.secondary).toBeDefined();
      expect(CYBER_COLORS.accent).toBeDefined();
      expect(CYBER_COLORS.success).toBeDefined();
      expect(CYBER_COLORS.highlight).toBeDefined();
    });

    it('should export status colors', () => {
      expect(CYBER_COLORS.muted).toBeDefined();
      expect(CYBER_COLORS.warning).toBeDefined();
      expect(CYBER_COLORS.destructive).toBeDefined();
    });

    it('should export alpha variants', () => {
      expect(CYBER_COLORS.primaryAlpha10).toContain('rgba');
      expect(CYBER_COLORS.primaryAlpha20).toContain('rgba');
      expect(CYBER_COLORS.primaryAlpha40).toContain('rgba');
      expect(CYBER_COLORS.primaryAlpha60).toContain('rgba');
      expect(CYBER_COLORS.secondaryAlpha10).toContain('rgba');
      expect(CYBER_COLORS.accentAlpha10).toContain('rgba');
    });

    it('should have valid hex format for solid colors', () => {
      const hexColors = [
        CYBER_COLORS.primary,
        CYBER_COLORS.primaryLight,
        CYBER_COLORS.primaryDark,
        CYBER_COLORS.secondary,
        CYBER_COLORS.accent,
        CYBER_COLORS.success,
        CYBER_COLORS.highlight,
        CYBER_COLORS.muted,
        CYBER_COLORS.warning,
        CYBER_COLORS.destructive,
      ];
      for (const color of hexColors) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      }
    });

    it('should have cyan-based primary palette', () => {
      expect(CYBER_COLORS.primary).toBe('#00f0ff');
      expect(CYBER_COLORS.destructive).toBe('#ff0040');
    });
  });

  describe('COLOR_MIGRATION', () => {
    it('should map old colors to new ones', () => {
      expect(Object.keys(COLOR_MIGRATION).length).toBeGreaterThan(0);
    });

    it('should map magenta to secondary', () => {
      expect(COLOR_MIGRATION['#ff00ff']).toBe(CYBER_COLORS.secondary);
    });

    it('should map yellow to accent', () => {
      expect(COLOR_MIGRATION['#ffff00']).toBe(CYBER_COLORS.accent);
    });

    it('should preserve primary cyan', () => {
      expect(COLOR_MIGRATION['#00f0ff']).toBe(CYBER_COLORS.primary);
    });

    it('should preserve destructive red', () => {
      expect(COLOR_MIGRATION['#ff0040']).toBe(CYBER_COLORS.destructive);
    });
  });

  describe('CYBER_GRADIENTS', () => {
    it('should export all gradient presets', () => {
      expect(CYBER_GRADIENTS.primary).toBeDefined();
      expect(CYBER_GRADIENTS.secondary).toBeDefined();
      expect(CYBER_GRADIENTS.accent).toBeDefined();
      expect(CYBER_GRADIENTS.brand).toBeDefined();
    });

    it('should contain linear-gradient syntax', () => {
      expect(CYBER_GRADIENTS.primary).toContain('linear-gradient');
      expect(CYBER_GRADIENTS.brand).toContain('linear-gradient');
    });

    it('should use valid color values in gradients', () => {
      const gradients = Object.values(CYBER_GRADIENTS);
      for (const g of gradients) {
        expect(g).toContain('#');
      }
    });
  });

  describe('CYBER_SHADOWS', () => {
    it('should export all shadow presets', () => {
      expect(CYBER_SHADOWS.primary).toBeDefined();
      expect(CYBER_SHADOWS.secondary).toBeDefined();
      expect(CYBER_SHADOWS.accent).toBeDefined();
      expect(CYBER_SHADOWS.glow).toBeDefined();
    });

    it('should contain box-shadow syntax', () => {
      expect(CYBER_SHADOWS.primary).toContain('0 0');
      expect(CYBER_SHADOWS.glow).toContain('0 0');
    });

    it('should use rgba in shadows', () => {
      const shadows = Object.values(CYBER_SHADOWS);
      for (const s of shadows) {
        expect(s).toContain('rgba');
      }
    });
  });
});
