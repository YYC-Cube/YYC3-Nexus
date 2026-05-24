/**
 * @file test-providers.tsx
 * @description YYC³ Test Providers — Render wrapper with all required Context Providers.
 *   Simplifies testing of components that depend on multiple contexts.
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.1.0 (TypeScript Clean)
 * @created 2026-05-24
 * @tags P1,testing,providers,render-utils
 */

import { render } from '@testing-library/react';
import React, { type ReactNode } from 'react';

// Import all required providers (alphabetical order)
import { AIModelProvider } from '../../src/app/components/context/ai-model-context';
import { AppProvider } from '../../src/app/components/context/app-context';
import { I18nProvider } from '../../src/app/components/context/i18n-context';
import { ThemeSwitcherProvider } from '../../src/app/components/context/theme-switcher-context';

// ==========================================
// Types
// ==========================================

interface RenderWithProvidersOptions {
  wrapper?: ({ children }: { children: ReactNode }) => React.JSX.Element;
  theme?: string;
  locale?: string;
}

// ==========================================
// All-in-One Provider Wrapper
// ==========================================

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { wrapper: CustomWrapper, theme = 'cyberpunk', locale = 'zh-CN' } = options;

  let element: ReactNode = ui;

  element = React.createElement(AIModelProvider, null, element);
  element = React.createElement(I18nProvider, { defaultLocale: locale } as any, element);
  element = React.createElement(
    ThemeSwitcherProvider,
    { defaultTheme: theme, children: null } as any,
    element,
  );
  element = React.createElement(AppProvider, null, element);

  if (CustomWrapper) {
    element = React.createElement(CustomWrapper, null, element);
  }

  return render(element as React.ReactElement);
}
