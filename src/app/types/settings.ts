export type Language = 'zh' | 'en';

export type SettingsCategory =
  | 'general'
  | 'account'
  | 'agents'
  | 'models'
  | 'mcp'
  | 'rules'
  | 'skills'
  | 'context'
  | 'conversation'
  | 'import-export';

export interface UserProfile {
  displayName: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
}

export interface GeneralSettings {
  language: Language;
  theme: 'cyberpunk' | 'liquidGlass';
  fontSize: number;
  editorFont: string;
  editorFontSize: number;
  wordWrap: boolean;
  sidebarCollapsed: boolean;
  notifications: boolean;
  sounds: boolean;
  enableSounds: boolean;
  animations: boolean;
  enableAnimations: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  description?: string;
  temperature?: number;
  maxTokens?: number;
  isBuiltIn?: boolean;
  isCustom?: boolean;
  enabled: boolean;
}

export interface MCPConfig {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
}

export interface SettingsState {
  userProfile: UserProfile;
  generalSettings: GeneralSettings;
  agents: AgentConfig[];
  mcpServers: MCPConfig[];
  mcpConfigs: MCPConfig[];
  models: ModelConfig[];
  rules: Array<{ id: string; name: string; content: string; enabled: boolean }>;
  skills: Array<{ id: string; name: string; description: string; enabled: boolean }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetSettings: () => void;
}
