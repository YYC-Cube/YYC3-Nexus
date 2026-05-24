/**
 * Preload Fix for Dynamic Import Issues
 * This file ensures all critical components are imported synchronously
 * to prevent "Failed to fetch dynamically imported module" errors
 */

import { FormHistory } from '../form-history';
import { FormTemplateBuilder } from '../form-template-builder';
import { LeftPanelPage } from '../left-panel-page';
import { ModelSettings } from '../model-settings';
// Note: NumberDatabasePage is intentionally excluded from preload to maintain
// consistent dynamic import behavior (see cyberpunk-standalone.tsx lazy loading)
import { AIToolsPage } from '../pages/ai/ai-tools-page';
import { NLPProcessingPage } from '../pages/ai/nlp-processing-page';
import { SmartCreationPage } from '../pages/ai/smart-creation-page';
import { CustomerCarePage } from '../pages/customer/customer-care-page';
import { InsightsEnhancedPage } from '../pages/customer/insights-enhanced';
import { AppOverviewPage } from '../pages/dashboard/app-overview-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';
import { DecisionSupportPage } from '../pages/dashboard/decision-support-page';
import { QuickActionsPage } from '../pages/developer/quick-actions-page';
import { ChannelCenterPage } from '../pages/integration/channel-center-page';
import { DataIntegrationPage } from '../pages/integration/data-integration-page';
import { PlatformIntegrationPage } from '../pages/integration/platform-integration-page';
import { WechatConfigPage } from '../pages/integration/wechat-config-page';
import { BrandManagementPage } from '../pages/marketing/brand-management-page';
import { CampaignExecutionPage } from '../pages/marketing/campaign-execution-page';
import { CustomerAcquisitionPage } from '../pages/marketing/customer-acquisition-page';
import { MarketingAnalyticsPage } from '../pages/marketing/marketing-analytics-page';
import { MarketingAssetsPage } from '../pages/marketing/marketing-assets-page';
import { MarketingStrategyPage } from '../pages/marketing/marketing-strategy-page';
import { SmartMarketingEnginePage } from '../pages/marketing/smart-marketing-engine-page';
import { SmartOperationsPage } from '../pages/operations/smart-operations-page';
import { ProfilePage } from '../pages/profile/profile-page';
import { ParameterSettingsPage } from '../pages/settings/parameter-settings-page';
import { PlatformSettingsPage } from '../pages/settings/platform-settings-page';
import { TaskBoardPage } from '../pages/tasks/task-board-page';
import { SmartFormPage } from '../smart-form-system';

import { ActivityLogPage } from './activity-log';
import { ThemeConfigPage } from './theme-config';

export {
  ActivityLogPage,
  AIToolsPage,
  AppOverviewPage,
  BrandManagementPage,
  CampaignExecutionPage,
  ChannelCenterPage,
  CustomerAcquisitionPage,
  CustomerCarePage,
  DashboardPage,
  DataIntegrationPage,
  DecisionSupportPage,
  FormHistory,
  FormTemplateBuilder,
  InsightsEnhancedPage,
  LeftPanelPage,
  MarketingAnalyticsPage,
  MarketingAssetsPage,
  MarketingStrategyPage,
  ModelSettings,
  NLPProcessingPage,
  // NumberDatabasePage: loaded dynamically via React.lazy() for consistency
  ParameterSettingsPage,
  PlatformIntegrationPage,
  PlatformSettingsPage,
  ProfilePage,
  QuickActionsPage,
  SmartCreationPage,
  SmartFormPage,
  SmartMarketingEnginePage,
  SmartOperationsPage,
  TaskBoardPage,
  ThemeConfigPage,
  WechatConfigPage,
};

/** Sentinel flag confirming all lazy-loaded component modules are resolved. */
export const COMPONENTS_LOADED = true;
