/**
 * @file index.ts
 * @description YYC³ Developer Workspace — Panel components barrel export.
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-18
 * @updated 2026-03-18
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags P1,frontend,panels,export
 */

export { AIAssistantPanel } from './ai-assistant-panel';
export type { QuickAction } from './editor-quick-actions';
export {
  buildActionPrompt,
  EditorQuickActions,
  getMockResponse,
  QUICK_ACTIONS,
} from './editor-quick-actions';
// Panel Components
export { FileExplorerPanel } from './file-explorer-panel';
export { GitIntegrationPanel } from './git-integration-panel';
export { GlobalSearchPanel } from './global-search-panel';
// Helpers
export {
  AI_PROVIDER_MODELS,
  AI_RESPONSES,
  AI_SUGGESTIONS_POOL,
  formatFileSize,
  getFileIcon,
  getGitStatusStyle,
  MOCK_FILE_TREE,
  MOCK_GIT_LOG,
  MOCK_GIT_STATUS,
  MOCK_SEARCH_RESULTS,
  timeAgo,
} from './panel-helpers';
export type { PanelStoreActions, PanelStoreState } from './panel-store';
// Store
export { usePanelStore } from './panel-store';
// Types
export type {
  AIChatMessage,
  AIProviderConfig,
  AIProviderType,
  AISuggestion,
  FileNode,
  GitCommitItem,
  GitStatus,
  PanelType,
  QuickAccessItem,
  SearchResult,
} from './panel-types';
export { QuickAccessPanel } from './quick-access-panel';
export { TaskManagerPanel } from './task-manager-panel';
// Multi-Instance UI
export { WindowBar } from './window-bar';
export { WorkspaceSelector } from './workspace-selector';
// New panels
export { WorkspaceSettingsPanel } from './workspace-settings-panel';
