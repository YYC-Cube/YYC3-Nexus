import type { AgentConfig, UserProfile } from '../types/settings';

export const accountService = {
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    return {
      displayName: 'YYC³ User',
      email: 'admin@0379.email',
      username: 'yyc3user',
      role: 'admin',
      ...profile,
    };
  },
  uploadAvatar: async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  },
};

export const agentService = {
  getAgents: async (): Promise<AgentConfig[]> => [],
  createAgent: async (
    agent: Omit<AgentConfig, 'id'> & { description?: string },
  ): Promise<AgentConfig> => ({
    ...agent,
    id: Date.now().toString(),
  }),
  updateAgent: async (agent: AgentConfig): Promise<AgentConfig> => agent,
  deleteAgent: async (_id: string): Promise<void> => {},
  duplicateAgent: async (agent: AgentConfig): Promise<AgentConfig> => ({
    ...agent,
    id: Date.now().toString(),
    name: `${agent.name} (copy)`,
  }),
};

export const searchSettings = (
  _query: string,
  _categories: string[],
): Array<{ id: string; label: string; category: string }> => {
  return [];
};
