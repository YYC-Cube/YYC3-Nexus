import { beforeEach, describe, expect, it } from 'vitest'

import { useSettingsStore } from '../../src/app/stores/useSettingsStore'

describe('useSettingsStore', () => {
  beforeEach(() => {
    const store = useSettingsStore.getState()
    store.updateUserProfile({ displayName: 'YYC³ User', email: 'admin@0379.email', username: 'yyc3user', role: 'admin' })
    store.updateGeneralSettings({
      language: 'zh', theme: 'cyberpunk', fontSize: 14, editorFont: 'monospace',
      editorFontSize: 14, wordWrap: true, sidebarCollapsed: false,
      notifications: true, sounds: true, enableSounds: true,
      animations: true, enableAnimations: true,
    })
    store.setSearchQuery('')
  })

  describe('default state', () => {
    it('should have correct default user profile', () => {
      const { userProfile } = useSettingsStore.getState()
      expect(userProfile.displayName).toBe('YYC³ User')
      expect(userProfile.email).toBe('admin@0379.email')
      expect(userProfile.username).toBe('yyc3user')
      expect(userProfile.role).toBe('admin')
    })

    it('should have correct default general settings', () => {
      const { generalSettings } = useSettingsStore.getState()
      expect(generalSettings.language).toBe('zh')
      expect(generalSettings.theme).toBe('cyberpunk')
      expect(generalSettings.fontSize).toBe(14)
      expect(generalSettings.editorFont).toBe('monospace')
      expect(generalSettings.editorFontSize).toBe(14)
      expect(generalSettings.wordWrap).toBe(true)
      expect(generalSettings.animations).toBe(true)
    })

    it('should have empty arrays for configs', () => {
      const state = useSettingsStore.getState()
      expect(state.agents).toEqual([])
      expect(state.mcpServers).toEqual([])
      expect(state.mcpConfigs).toEqual([])
      expect(state.models).toEqual([])
      expect(state.rules).toEqual([])
      expect(state.skills).toEqual([])
    })

    it('should expose settings mirror', () => {
      const { settings } = useSettingsStore.getState()
      expect(settings.userProfile).toBeDefined()
      expect(settings.generalSettings).toBeDefined()
    })
  })

  describe('updateUserProfile', () => {
    it('should update display name', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'New User' })
      expect(useSettingsStore.getState().userProfile.displayName).toBe('New User')
    })

    it('should update email', () => {
      useSettingsStore.getState().updateUserProfile({ email: 'new@test.com' })
      expect(useSettingsStore.getState().userProfile.email).toBe('new@test.com')
    })

    it('should merge partial updates without losing other fields', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Updated' })
      const { userProfile } = useSettingsStore.getState()
      expect(userProfile.displayName).toBe('Updated')
      expect(userProfile.email).toBe('admin@0379.email')
    })

    it('should sync to settings mirror', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Mirror Test' })
      expect(useSettingsStore.getState().settings.userProfile.displayName).toBe('Mirror Test')
    })
  })

  describe('updateGeneralSettings', () => {
    it('should update theme', () => {
      useSettingsStore.getState().updateGeneralSettings({ theme: 'liquidGlass' })
      expect(useSettingsStore.getState().generalSettings.theme).toBe('liquidGlass')
    })

    it('should update font size', () => {
      useSettingsStore.getState().updateGeneralSettings({ fontSize: 18 })
      expect(useSettingsStore.getState().generalSettings.fontSize).toBe(18)
    })

    it('should merge partial updates preserving other fields', () => {
      useSettingsStore.getState().updateGeneralSettings({ fontSize: 20 })
      const { generalSettings } = useSettingsStore.getState()
      expect(generalSettings.fontSize).toBe(20)
      expect(generalSettings.language).toBe('zh')
      expect(generalSettings.theme).toBe('cyberpunk')
    })

    it('should sync to settings mirror', () => {
      useSettingsStore.getState().updateGeneralSettings({ sidebarCollapsed: true })
      expect(useSettingsStore.getState().settings.generalSettings.sidebarCollapsed).toBe(true)
    })
  })

  describe('updateLanguage', () => {
    it('should switch to English', () => {
      useSettingsStore.getState().updateLanguage('en')
      expect(useSettingsStore.getState().generalSettings.language).toBe('en')
    })

    it('should switch back to Chinese', () => {
      useSettingsStore.getState().updateLanguage('en')
      useSettingsStore.getState().updateLanguage('zh')
      expect(useSettingsStore.getState().generalSettings.language).toBe('zh')
    })
  })

  describe('searchQuery', () => {
    it('should set search query', () => {
      useSettingsStore.getState().setSearchQuery('test query')
      expect(useSettingsStore.getState().searchQuery).toBe('test query')
    })

    it('should clear search query', () => {
      useSettingsStore.getState().setSearchQuery('test')
      useSettingsStore.getState().setSearchQuery('')
      expect(useSettingsStore.getState().searchQuery).toBe('')
    })
  })

  describe('resetSettings', () => {
    it('should reset all modified settings to defaults', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Changed' })
      useSettingsStore.getState().updateGeneralSettings({ fontSize: 99 })
      useSettingsStore.getState().updateLanguage('en')

      useSettingsStore.getState().resetSettings()

      const state = useSettingsStore.getState()
      expect(state.userProfile.displayName).toBe('YYC³ User')
      expect(state.generalSettings.fontSize).toBe(14)
      expect(state.generalSettings.language).toBe('zh')
    })
  })

  describe('exportConfig', () => {
    it('should return valid JSON string', () => {
      const json = useSettingsStore.getState().exportConfig()
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('should include user profile in export', () => {
      const json = useSettingsStore.getState().exportConfig()
      const parsed = JSON.parse(json)
      expect(parsed.userProfile).toBeDefined()
      expect(parsed.generalSettings).toBeDefined()
    })

    it('should reflect current state after changes', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Export Test' })
      const json = useSettingsStore.getState().exportConfig()
      const parsed = JSON.parse(json)
      expect(parsed.userProfile.displayName).toBe('Export Test')
    })
  })

  describe('importConfig', () => {
    it('should import valid config JSON', () => {
      const config = {
        userProfile: { displayName: 'Imported', email: 'import@test.com', username: 'imported', role: 'user' },
        generalSettings: { language: 'en', theme: 'liquidGlass', fontSize: 16, editorFont: 'Fira Code', editorFontSize: 16, wordWrap: false, sidebarCollapsed: true, notifications: false, sounds: false, enableSounds: false, animations: false, enableAnimations: false },
        agents: [], mcpServers: [], mcpConfigs: [], models: [], rules: [], skills: [],
        searchQuery: '',
      }
      useSettingsStore.getState().importConfig(JSON.stringify(config))
      expect(useSettingsStore.getState().userProfile.displayName).toBe('Imported')
      expect(useSettingsStore.getState().generalSettings.language).toBe('en')
    })

    it('should ignore invalid JSON', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Before Import' })
      useSettingsStore.getState().importConfig('not valid json{{{')
      expect(useSettingsStore.getState().userProfile.displayName).toBe('Before Import')
    })

    it('should ignore empty string', () => {
      useSettingsStore.getState().updateUserProfile({ displayName: 'Stable' })
      useSettingsStore.getState().importConfig('')
      expect(useSettingsStore.getState().userProfile.displayName).toBe('Stable')
    })
  })
})
