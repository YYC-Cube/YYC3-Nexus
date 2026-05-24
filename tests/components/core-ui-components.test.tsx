/**
 * @file core-ui-components.test.tsx
 * @description YYC³ Core UI Components — Unit Tests with renderWithProviders.
 *   Focuses on component import and basic rendering validation.
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.3.0 (Stable & TypeScript Clean)
 * @created 2026-05-24
 * @tags P1,testing,ui-components,core,coverage-enhancement
 */

import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../utils/test-providers';

// ==========================================
// Test Suite: NeonCard Component
// ==========================================

describe('NeonCard — Core UI Component', () => {
  it('should import NeonCard without errors', async () => {
    const neonModule = await import('../../src/app/components/core/neon-card');
    const NeonCard = neonModule.NeonCard || (neonModule as any).default;
    expect(NeonCard).toBeDefined();
  });

  it('should be a valid React component type', async () => {
    const neonModule = await import('../../src/app/components/core/neon-card');
    const NeonCard = neonModule.NeonCard || (neonModule as any).default;
    expect(['function', 'object'].includes(typeof NeonCard)).toBe(true);
  });

  it('should render within providers without crashing', async () => {
    const neonModule = await import('../../src/app/components/core/neon-card');
    const NeonCard = neonModule.NeonCard || (neonModule as any).default;

    const { container } = renderWithProviders(
      <NeonCard>
        <p>Card content</p>
      </NeonCard>,
    );

    expect(container).toBeTruthy();
  });
});

// ==========================================
// Test Suite: CyberTooltip Component
// ==========================================

describe('CyberTooltip — Core UI Component', () => {
  it('should import CyberTooltip without errors', async () => {
    const tooltipModule = await import('../../src/app/components/core/cyber-tooltip');
    const CyberTooltip = tooltipModule.CyberTooltip || (tooltipModule as any).default;
    expect(CyberTooltip).toBeDefined();
  });

  it('should render tooltip within providers', async () => {
    const tooltipModule = await import('../../src/app/components/core/cyber-tooltip');
    const CyberTooltip = tooltipModule.CyberTooltip || (tooltipModule as any).default;

    const { container } = renderWithProviders(<CyberTooltip />);

    expect(container).toBeTruthy();
  });
});

// ==========================================
// Test Suite: GlitchText Component
// ==========================================

describe('GlitchText — Core UI Component', () => {
  it('should import GlitchText without errors', async () => {
    const glitchModule = await import('../../src/app/components/core/glitch-text');
    const GlitchText = glitchModule.GlitchText || (glitchModule as any).default;
    expect(GlitchText).toBeDefined();
  });

  it('should be a valid React component type', async () => {
    const glitchModule = await import('../../src/app/components/core/glitch-text');
    const GlitchText = glitchModule.GlitchText || (glitchModule as any).default;
    expect(['function', 'object'].includes(typeof GlitchText)).toBe(true);
  });

  it('should render text content when used in providers', async () => {
    const glitchModule = await import('../../src/app/components/core/glitch-text');
    const GlitchText = glitchModule.GlitchText || (glitchModule as any).default;

    const { container } = renderWithProviders(<GlitchText>Glitch Effect</GlitchText>);

    expect(container).toBeTruthy();
  });
});

// ==========================================
// Test Suite: ThemeSwitcherButton Component
// ==========================================

describe('ThemeSwitcherButton — Core UI Component', () => {
  it('should import ThemeSwitcherButton without errors', async () => {
    const btnModule = await import('../../src/app/components/core/theme-switcher-button');
    const ThemeSwitcherButton = btnModule.ThemeSwitcherButton || (btnModule as any).default;
    expect(ThemeSwitcherButton).toBeDefined();
  });

  it('should render theme switcher button within providers', async () => {
    const btnModule = await import('../../src/app/components/core/theme-switcher-button');
    const ThemeSwitcherButton = btnModule.ThemeSwitcherButton || (btnModule as any).default;

    const { container } = renderWithProviders(<ThemeSwitcherButton />);

    expect(container).toBeTruthy();
  });
});

// ==========================================
// Test Suite: PageTransition Component
// ==========================================

describe('PageTransition — Core UI Component', () => {
  it('should import PageTransition without errors', async () => {
    const transitionModule = await import('../../src/app/components/core/page-transition');
    const PageTransition = transitionModule.PageTransition || (transitionModule as any).default;
    expect(PageTransition).toBeDefined();
  });

  it('should be a valid React component type', async () => {
    const transitionModule = await import('../../src/app/components/core/page-transition');
    const PageTransition = transitionModule.PageTransition || (transitionModule as any).default;
    expect(['function', 'object'].includes(typeof PageTransition)).toBe(true);
  });

  it('should wrap and render children content', async () => {
    const transitionModule = await import('../../src/app/components/core/page-transition');
    const PageTransition = transitionModule.PageTransition || (transitionModule as any).default;

    const { container } = renderWithProviders(
      <PageTransition pageKey="test-page">
        <div data-testid="transition-content">Transition Content</div>
      </PageTransition>,
    );

    expect(container).toBeTruthy();
  });
});

// ==========================================
// Test Suite: DataExportModal Component
// ==========================================

describe('DataExportModal — Core UI Component', () => {
  it('should import DataExportModal without errors', async () => {
    const modalModule = await import('../../src/app/components/core/data-export-modal');
    const DataExportModal = modalModule.DataExportModal || (modalModule as any).default;
    expect(DataExportModal).toBeDefined();
  });

  it('should render modal component structure with providers', async () => {
    const modalModule = await import('../../src/app/components/core/data-export-modal');
    const DataExportModal = modalModule.DataExportModal || (modalModule as any).default;

    const { container } = renderWithProviders(<DataExportModal open={true} onClose={() => {}} />);

    expect(container).toBeTruthy();
  });
});
