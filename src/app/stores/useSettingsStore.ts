import { create } from 'zustand';

import type { GeneralSettings, Language, SettingsState, UserProfile } from '../types/settings';

interface SettingsStore extends SettingsState {
  settings: SettingsState;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateGeneralSettings: (general: Partial<GeneralSettings>) => void;
  updateLanguage: (language: Language) => void;
  exportConfig: () => string;
  importConfig: (json: string) => void;
}

const defaultSettings: SettingsState = {
  userProfile: {
    displayName: 'YYC³ User',
    email: 'admin@0379.email',
    username: 'yyc3user',
    role: 'admin',
  },
  generalSettings: {
    language: 'zh',
    theme: 'cyberpunk',
    fontSize: 14,
    editorFont: 'monospace',
    editorFontSize: 14,
    wordWrap: true,
    sidebarCollapsed: false,
    notifications: true,
    sounds: true,
    enableSounds: true,
    animations: true,
    enableAnimations: true,
  },
  agents: [],
  mcpServers: [],
  mcpConfigs: [],
  models: [],
  rules: [],
  skills: [],
  searchQuery: '',
  setSearchQuery: () => {},
  resetSettings: () => {},
};

export const useSettingsStore = create<SettingsStore>(set => ({
  ...defaultSettings,
  settings: defaultSettings,

  updateUserProfile: profile =>
    set(state => {
      const userProfile = { ...state.userProfile, ...profile };
      return { userProfile, settings: { ...state.settings, userProfile } };
    }),

  updateGeneralSettings: general =>
    set(state => {
      const generalSettings = { ...state.generalSettings, ...general };
      return {
        generalSettings,
        settings: { ...state.settings, generalSettings },
      };
    }),

  updateLanguage: language =>
    set(state => {
      const generalSettings = { ...state.generalSettings, language };
      return {
        generalSettings,
        settings: { ...state.settings, generalSettings },
      };
    }),

  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  resetSettings: () => set({ ...defaultSettings, settings: defaultSettings }),

  exportConfig: (): string => {
    const state: SettingsStore = useSettingsStore.getState();
    return JSON.stringify(state.settings, null, 2);
  },

  importConfig: (json: string) => {
    try {
      const parsed = JSON.parse(json) as SettingsState;
      set({ ...parsed, settings: parsed });
    } catch {
      // ignore
    }
  },
}));
