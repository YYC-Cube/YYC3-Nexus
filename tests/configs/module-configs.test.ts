import { describe, expect, it } from 'vitest';

import { MODULE_CONFIGS } from '../../src/app/components/module-configs';

describe('Module Configs — Validation', () => {
  it('should export MODULE_CONFIGS as a non-empty object', () => {
    expect(MODULE_CONFIGS).toBeDefined();
    expect(Object.keys(MODULE_CONFIGS).length).toBeGreaterThan(0);
  });

  it('should have valid structure for each config', () => {
    for (const [key, config] of Object.entries(MODULE_CONFIGS)) {
      expect(config.id).toBe(key);
      expect(config.title).toBeTruthy();
      expect(config.subtitle).toBeTruthy();
      expect(config.icon).toBeDefined();
      expect(config.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(config.category).toBeTruthy();
      expect(Array.isArray(config.features)).toBe(true);
      expect(config.features.length).toBeGreaterThan(0);
    }
  });

  it('should have valid feature structure', () => {
    for (const config of Object.values(MODULE_CONFIGS)) {
      for (const f of config.features) {
        expect(f.title).toBeTruthy();
        expect(f.desc).toBeTruthy();
        if (f.status) {
          expect(['ready', 'beta', 'planned']).toContain(f.status);
        }
        if (f.color) {
          expect(f.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
      }
    }
  });

  it('should have valid stats if present', () => {
    for (const config of Object.values(MODULE_CONFIGS)) {
      if (config.stats) {
        expect(Array.isArray(config.stats)).toBe(true);
        for (const s of config.stats) {
          expect(s.label).toBeTruthy();
          expect(s.value).toBeTruthy();
        }
      }
    }
  });

  it('should have valid aiCapabilities if present', () => {
    for (const config of Object.values(MODULE_CONFIGS)) {
      if (config.aiCapabilities) {
        expect(Array.isArray(config.aiCapabilities)).toBe(true);
        for (const cap of config.aiCapabilities) {
          expect(typeof cap).toBe('string');
          expect(cap.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('should have unique config IDs', () => {
    const ids = Object.values(MODULE_CONFIGS).map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have at least one ready feature per config', () => {
    for (const config of Object.values(MODULE_CONFIGS)) {
      const hasReady = config.features.some(f => f.status === 'ready');
      expect(hasReady).toBe(true);
    }
  });
});
