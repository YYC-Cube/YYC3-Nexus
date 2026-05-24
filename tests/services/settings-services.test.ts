import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  accountService,
  agentService,
  searchSettings,
} from '../../src/app/services/settings-services';

beforeEach(() => {
  if (typeof URL.createObjectURL === 'undefined') {
    URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-uuid');
  }
});

describe('settings-services', () => {
  describe('accountService', () => {
    describe('updateProfile', () => {
      it('should return merged profile with defaults', async () => {
        const result = await accountService.updateProfile({ displayName: 'Test User' });
        expect(result.displayName).toBe('Test User');
        expect(result.email).toBe('admin@0379.email');
        expect(result.username).toBe('yyc3user');
        expect(result.role).toBe('admin');
      });

      it('should override multiple fields', async () => {
        const result = await accountService.updateProfile({
          displayName: 'A',
          email: 'b@test.com',
          role: 'viewer',
        });
        expect(result.displayName).toBe('A');
        expect(result.email).toBe('b@test.com');
        expect(result.role).toBe('viewer');
      });
    });

    describe('uploadAvatar', () => {
      it('should return a string url for a file', async () => {
        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
        const url = await accountService.uploadAvatar(file);
        expect(typeof url).toBe('string');
        expect(url.length).toBeGreaterThan(0);
      });
    });
  });

  describe('agentService', () => {
    const baseAgent = {
      name: 'Test Agent',
      model: 'gpt-4',
      systemPrompt: 'You are helpful',
      enabled: true,
    };

    describe('getAgents', () => {
      it('should return empty array', async () => {
        const agents = await agentService.getAgents();
        expect(agents).toEqual([]);
      });
    });

    describe('createAgent', () => {
      it('should create agent with generated id', async () => {
        const agent = await agentService.createAgent(baseAgent);
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBe('Test Agent');
        expect(agent.model).toBe('gpt-4');
        expect(agent.enabled).toBe(true);
      });

      it('should preserve optional description', async () => {
        const agent = await agentService.createAgent({ ...baseAgent, description: 'desc' });
        expect(agent.description).toBe('desc');
      });
    });

    describe('updateAgent', () => {
      it('should return the same agent', async () => {
        const agent = { ...baseAgent, id: '1' };
        const result = await agentService.updateAgent(agent);
        expect(result).toEqual(agent);
      });
    });

    describe('deleteAgent', () => {
      it('should resolve without error', async () => {
        await expect(agentService.deleteAgent('1')).resolves.toBeUndefined();
      });
    });

    describe('duplicateAgent', () => {
      it('should duplicate with new id and (copy) suffix', async () => {
        const original = { ...baseAgent, id: 'orig-1' };
        const copy = await agentService.duplicateAgent(original);
        expect(copy.id).not.toBe('orig-1');
        expect(copy.name).toBe('Test Agent (copy)');
        expect(copy.model).toBe('gpt-4');
      });
    });
  });

  describe('searchSettings', () => {
    it('should return empty array', () => {
      const results = searchSettings('test', ['general']);
      expect(results).toEqual([]);
    });

    it('should handle empty query', () => {
      const results = searchSettings('', []);
      expect(results).toEqual([]);
    });
  });
});
