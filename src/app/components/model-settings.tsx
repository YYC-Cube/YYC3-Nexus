import {
  Activity,
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  Cpu,
  Globe,
  Lightbulb,
  Plug,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings2,
  Shield,
  Sparkles,
  Terminal,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type AIModel, useAIModel } from './context/ai-model-context';
import { useI18n } from './context/i18n-context';
import { SmartDiagnosticsPanel } from './diagnostics-panel';
import { useThemeTokens } from './hooks/use-theme-tokens';
import type {
  DiagnosticResult,
  MCPServerConfig,
  ModelDef,
  OllamaDetectedModel,
  ProviderDef,
} from './model-settings-types';
import { CopyButton, ProviderCard } from './provider-card';

/* ================================================================
   Storage Helpers
   ================================================================ */

const PROVIDERS: ProviderDef[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'GPT',
    icon: Cloud,
    color: 'text-emerald-400',
    colorBg: 'bg-emerald-500/10',
    colorBorder: 'border-emerald-500/20',
    description: 'ms.prov.openai.desc',
    baseURL: 'https://api.openai.com/v1/chat/completions',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    apiKeyPlaceholder: 'sk-proj-...',
    openaiCompatible: true,
    docsUrl: 'https://platform.openai.com/docs',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'ms.mdl.gpt4o',
        contextWindow: '128K',
        pricing: '$2.5/1M input',
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o-mini',
        description: 'ms.mdl.gpt4oMini',
        contextWindow: '128K',
        pricing: '$0.15/1M input',
      },
      {
        id: 'o3-mini',
        name: 'o3-mini',
        description: 'ms.mdl.o3Mini',
        contextWindow: '128K',
        pricing: '$1.1/1M input',
      },
      {
        id: 'o4-mini',
        name: 'o4-mini',
        description: 'ms.mdl.o4Mini',
        contextWindow: '200K',
        pricing: '$1.1/1M input',
      },
    ],
  },
  {
    id: 'claude',
    name: 'Anthropic',
    shortName: 'Claude',
    icon: Shield,
    color: 'text-orange-400',
    colorBg: 'bg-orange-500/10',
    colorBorder: 'border-orange-500/20',
    description: 'ms.prov.claude.desc',
    baseURL: 'https://api.anthropic.com/v1/messages',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    apiKeyPlaceholder: 'sk-ant-...',
    openaiCompatible: false,
    docsUrl: 'https://docs.anthropic.com',
    models: [
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        description: 'ms.mdl.claudeSonnet4',
        contextWindow: '200K',
        pricing: '$3/1M input',
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'ms.mdl.claudeHaiku',
        contextWindow: '200K',
        pricing: '$0.8/1M input',
      },
    ],
  },
  {
    id: 'zhipu',
    name: 'ms.prov.zhipu.name',
    shortName: 'GLM',
    icon: Cpu,
    color: 'text-blue-400',
    colorBg: 'bg-blue-500/10',
    colorBorder: 'border-blue-500/20',
    description: 'ms.prov.zhipu.desc',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKeyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    apiKeyPlaceholder: 'ms.prov.zhipu.keyHint',
    openaiCompatible: true,
    docsUrl: 'https://open.bigmodel.cn/dev/api/normal-model/glm-4',
    models: [
      { id: 'glm-5', name: 'GLM-5', description: 'ms.mdl.glm5', contextWindow: '128K' },
      { id: 'glm-4.7', name: 'GLM-4.7', description: 'ms.mdl.glm47' },
      { id: 'glm-4.6', name: 'GLM-4.6', description: 'ms.mdl.glm46' },
      { id: 'glm-4.5', name: 'GLM-4.5', description: 'ms.mdl.glm45', contextWindow: '128K' },
      { id: 'glm-4.5-air', name: 'GLM-4.5-Air', description: 'ms.mdl.glm45Air' },
    ],
  },
  {
    id: 'qwen',
    name: 'ms.prov.qwen.name',
    shortName: 'QWEN',
    icon: Globe,
    color: 'text-purple-400',
    colorBg: 'bg-purple-500/10',
    colorBorder: 'border-purple-500/20',
    description: 'ms.prov.qwen.desc',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    apiKeyUrl: 'https://dashscope.console.aliyun.com/apiKey',
    apiKeyPlaceholder: 'sk-...',
    openaiCompatible: true,
    docsUrl: 'https://help.aliyun.com/zh/model-studio/getting-started/first-api-call-to-qwen',
    models: [
      { id: 'qwen3-max', name: 'Qwen3-Max', description: 'ms.mdl.qwen3Max', contextWindow: '128K' },
      { id: 'qwen-plus', name: 'Qwen-Plus', description: 'ms.mdl.qwenPlus', contextWindow: '128K' },
      {
        id: 'qwen3-coder-plus',
        name: 'Qwen3-Coder-Plus',
        description: 'ms.mdl.qwen3Coder',
        contextWindow: '128K',
      },
      {
        id: 'qwen-vl-max',
        name: 'Qwen-VL-Max',
        description: 'ms.mdl.qwenVlMax',
        contextWindow: '32K',
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DS',
    icon: Zap,
    color: 'text-cyan-400',
    colorBg: 'bg-cyan-500/10',
    colorBorder: 'border-cyan-500/20',
    description: 'ms.prov.deepseek.desc',
    baseURL: 'https://api.deepseek.com/v1/chat/completions',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
    apiKeyPlaceholder: 'sk-...',
    openaiCompatible: true,
    docsUrl: 'https://api-docs.deepseek.com',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek V3.2',
        description: 'ms.mdl.dsChat',
        contextWindow: '128K',
        pricing: '$0.27/1M input',
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek R1',
        description: 'ms.mdl.dsReasoner',
        contextWindow: '128K',
        pricing: '$0.55/1M input',
      },
    ],
  },
  {
    id: 'ollama',
    name: 'ms.prov.ollama.name',
    shortName: 'Local',
    icon: Server,
    color: 'text-amber-400',
    colorBg: 'bg-amber-500/10',
    colorBorder: 'border-amber-500/20',
    description: 'ms.prov.ollama.desc',
    baseURL: 'http://localhost:11434/api/chat',
    apiKeyUrl: '',
    apiKeyPlaceholder: '',
    openaiCompatible: false,
    docsUrl: 'https://ollama.com',
    models: [
      { id: 'llama3.1:8b', name: 'Llama 3.1 8B', description: 'ms.mdl.llama31' },
      { id: 'codellama:13b', name: 'CodeLlama 13B', description: 'ms.mdl.codellama' },
      { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B', description: 'ms.mdl.qwen25' },
      { id: 'deepseek-coder:6.7b', name: 'DeepSeek Coder 6.7B', description: 'ms.mdl.dsCoder' },
    ],
  },
];

const DEFAULT_MCP_SERVERS: MCPServerConfig[] = [
  {
    id: 'mcp-filesystem',
    name: 'Filesystem',
    description: 'ms.mcp.filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/app/designs'],
    env: {},
    enabled: true,
  },
  {
    id: 'mcp-fetch',
    name: 'Fetch',
    description: 'ms.mcp.fetch',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-fetch'],
    env: {},
    enabled: true,
  },
  {
    id: 'mcp-postgres',
    name: 'PostgreSQL',
    description: 'ms.mcp.postgres',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres'],
    env: { DATABASE_URL: 'postgresql://user:pwd@localhost:5432/yanyucloud' },
    enabled: false,
  },
];

const SIMULATED_OLLAMA_MODELS: OllamaDetectedModel[] = [
  { name: 'llama3.1:8b', size: '4.7 GB', status: 'online', quantization: 'Q4_K_M' },
  { name: 'codellama:13b', size: '7.4 GB', status: 'online', quantization: 'Q4_0' },
  { name: 'qwen2.5:7b', size: '4.4 GB', status: 'online', quantization: 'Q4_K_M' },
  { name: 'deepseek-coder:6.7b', size: '3.8 GB', status: 'offline', quantization: 'Q5_K_M' },
  { name: 'mistral:7b', size: '4.1 GB', status: 'online', quantization: 'Q4_0' },
  { name: 'glm4:9b', size: '5.5 GB', status: 'online', quantization: 'Q4_K_M' },
];

/* ================================================================
   Local Storage Helpers
   ================================================================ */

const STORAGE_KEYS = {
  providerKeys: 'yyc3-provider-api-keys',
  providerUrls: 'yyc3-provider-urls',
  mcpServers: 'yyc3-mcp-servers',
  customProviders: 'yyc3-custom-providers',
  ollamaCache: 'yanyucloud_ollama_cache_',
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/* ================================================================
   MCP Config Panel
   ================================================================ */

function MCPConfigPanel() {
  const { t: i } = useI18n();
  const [servers, setServers] = useState<MCPServerConfig[]>(() =>
    loadJSON(STORAGE_KEYS.mcpServers, DEFAULT_MCP_SERVERS),
  );
  const [addingServer, setAddingServer] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    command: '',
    args: '',
    env: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    saveJSON(STORAGE_KEYS.mcpServers, servers);
  }, [servers]);

  const handleToggle = (id: string) => {
    setServers(prev => prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };
  const handleRemove = (id: string) => {
    setServers(prev => prev.filter(s => s.id !== id));
  };
  const handleAdd = () => {
    if (!newServer.name || !newServer.command) return;
    let envObj: Record<string, string> = {};
    try {
      if (newServer.env) envObj = JSON.parse(newServer.env);
    } catch {
      /* invalid JSON */
    }
    const server: MCPServerConfig = {
      id: `mcp-${Date.now()}`,
      name: newServer.name,
      description: newServer.description || newServer.name,
      command: newServer.command,
      args: newServer.args ? newServer.args.split(/\s+/) : [],
      env: envObj,
      enabled: true,
    };
    setServers(prev => [...prev, server]);
    setNewServer({ name: '', command: '', args: '', env: '', description: '' });
    setAddingServer(false);
  };

  const handleExportJson = () => {
    const mcpConfig: Record<string, Record<string, unknown>> = { mcpServers: {} };
    servers
      .filter(s => s.enabled)
      .forEach(s => {
        mcpConfig.mcpServers[s.name.toLowerCase()] = {
          command: s.command,
          args: s.args,
          ...(Object.keys(s.env).length > 0 ? { env: s.env } : {}),
        };
      });
    setJsonDraft(JSON.stringify(mcpConfig, null, 2));
    setJsonMode(true);
    setJsonError('');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      const mcpServers = parsed.mcpServers || parsed;
      const imported: MCPServerConfig[] = Object.entries(mcpServers).map(([name, conf]) => {
        const config = conf as Record<string, unknown>;
        return {
          id: `mcp-${Date.now()}-${name}`,
          name,
          description: (config.description as string) || name,
          command: (config.command as string) || '',
          args: (config.args as string[]) || [],
          env: (config.env as Record<string, string>) || {},
          enabled: true,
        };
      });
      setServers(imported);
      setJsonMode(false);
      setJsonError('');
    } catch (e: unknown) {
      setJsonError(i('ms.jsonParseFail', { msg: e instanceof Error ? e.message : String(e) }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plug className="w-4 h-4 text-violet-400" />
          <span className="text-[12px] text-white/70">{i('ms.mcpTitle')}</span>
          <span className="text-[9px] text-white/20 bg-white/[0.03] px-1.5 py-0.5 rounded">
            {i('ms.mcpEnabled', {
              enabled: servers.filter(s => s.enabled).length,
              total: servers.length,
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-all"
          >
            <Terminal className="w-3 h-3" /> {jsonMode ? i('ms.listMode') : i('ms.jsonMode')}
          </button>
        </div>
      </div>

      {/* JSON Mode */}
      {jsonMode && (
        <div className="space-y-2">
          <textarea
            value={jsonDraft}
            onChange={e => {
              setJsonDraft(e.target.value);
              setJsonError('');
            }}
            rows={12}
            className="w-full bg-black/20 border border-white/[0.06] rounded-lg px-3 py-2 text-[10px] text-white/60 font-mono focus:outline-none focus:border-violet-500/40 resize-none"
            placeholder='{"mcpServers": { "filesystem": { "command": "npx", "args": [...] } }}'
          />
          {jsonError && (
            <div className="text-[10px] text-red-400/70 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {jsonError}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleImportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-400 text-[10px] hover:bg-violet-500/25 transition-all"
            >
              <Check className="w-3 h-3" /> {i('ms.importJson')}
            </button>
            <button
              onClick={() => setJsonMode(false)}
              className="px-3 py-1.5 rounded-lg text-white/30 text-[10px] hover:bg-white/[0.04] transition-all"
            >
              {i('ms.cancel')}
            </button>
            <CopyButton text={jsonDraft} />
          </div>
          <div className="text-[9px] text-white/20 px-1">{i('ms.mcpJsonDesc')}</div>
        </div>
      )}

      {/* Server list */}
      {!jsonMode && (
        <div className="space-y-2">
          {servers.map(server => (
            <div
              key={server.id}
              className={`rounded-xl border p-3 space-y-2 transition-all ${
                server.enabled
                  ? 'border-white/[0.06] bg-white/[0.02]'
                  : 'border-white/[0.03] bg-white/[0.01] opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleToggle(server.id)}
                  className="shrink-0"
                  aria-label={i('ms.toggle')}
                >
                  <div
                    className={`w-8 h-4 rounded-full transition-all ${server.enabled ? 'bg-violet-500/30' : 'bg-white/[0.06]'}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all mt-[1px] ${
                        server.enabled ? 'bg-violet-400 ml-[17px]' : 'bg-white/20 ml-[1px]'
                      }`}
                    />
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white/60">{server.name}</div>
                  <div className="text-[9px] text-white/20">{i(server.description)}</div>
                </div>
                <button
                  onClick={() => setEditingId(editingId === server.id ? null : server.id)}
                  className="p-1 rounded text-white/15 hover:text-white/40 hover:bg-white/[0.04] transition-all"
                  aria-label={i('ms.edit')}
                >
                  <Settings2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleRemove(server.id)}
                  className="p-1 rounded text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label={i('ms.remove')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {editingId === server.id && (
                <div className="space-y-2 pl-10">
                  <div className="text-[9px] text-white/20 space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 w-16 shrink-0">command:</span>
                      <span className="text-white/50">{server.command}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white/30 w-16 shrink-0">args:</span>
                      <span className="text-white/50 break-all">{JSON.stringify(server.args)}</span>
                    </div>
                    {Object.keys(server.env).length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-white/30 w-16 shrink-0">env:</span>
                        <span className="text-white/50 break-all">
                          {JSON.stringify(server.env)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add server */}
          {addingServer ? (
            <div className="rounded-xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] p-3 space-y-2">
              <div className="text-[10px] text-violet-400/70 mb-1">{i('ms.addMcpServer')}</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newServer.name}
                  onChange={e => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder={i('ms.mcpNamePlaceholder')}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/70 font-mono focus:outline-none focus:border-violet-500/40 placeholder:text-white/10"
                />
                <input
                  value={newServer.command}
                  onChange={e => setNewServer({ ...newServer, command: e.target.value })}
                  placeholder={i('ms.mcpCommandPlaceholder')}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/70 font-mono focus:outline-none focus:border-violet-500/40 placeholder:text-white/10"
                />
              </div>
              <input
                value={newServer.args}
                onChange={e => setNewServer({ ...newServer, args: e.target.value })}
                placeholder={i('ms.mcpArgsPlaceholder')}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/70 font-mono focus:outline-none focus:border-violet-500/40 placeholder:text-white/10"
              />
              <input
                value={newServer.env}
                onChange={e => setNewServer({ ...newServer, env: e.target.value })}
                placeholder={i('ms.mcpEnvPlaceholder')}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/70 font-mono focus:outline-none focus:border-violet-500/40 placeholder:text-white/10"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!newServer.name || !newServer.command}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 text-[10px] hover:bg-violet-500/25 transition-all disabled:opacity-30 border border-violet-500/20"
                >
                  <Plus className="w-3 h-3" /> {i('ms.add')}
                </button>
                <button
                  onClick={() => setAddingServer(false)}
                  className="px-3 py-1.5 rounded-lg text-white/30 text-[10px] hover:bg-white/[0.04] transition-all"
                >
                  {i('ms.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingServer(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/[0.06] text-white/20 hover:text-white/40 hover:border-white/[0.12] transition-all text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" /> {i('ms.addMcpServer')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Main Component: ModelSettings
   ================================================================ */

type TabKey = 'providers' | 'ollama' | 'mcp' | 'diagnostics';

/**
 * AI Model Settings modal.
 * Full-featured multi-tab configuration panel for managing AI service providers
 * (OpenAI, Ollama, custom), MCP tool connections, and diagnostic testing.
 * Supports add/edit/delete models, API key management, endpoint configuration,
 * and real-time connectivity diagnostics with streaming test.
 */
export function ModelSettings() {
  const {
    modelSettingsOpen,
    closeModelSettings,
    aiModels,
    addAIModel,
    removeAIModel: _removeAIModel,
    updateAIModel,
    activateAIModel,
    activeModelId,
  } = useAIModel();
  const t = useThemeTokens();
  const { t: i } = useI18n();

  const [activeTab, setActiveTab] = useState<TabKey>('providers');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProvider, setExpandedProvider] = useState<string | null>('zhipu');

  // Provider API keys & URLs (persisted)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() =>
    loadJSON(STORAGE_KEYS.providerKeys, {}),
  );
  const [customUrls, setCustomUrls] = useState<Record<string, string>>(() =>
    loadJSON(STORAGE_KEYS.providerUrls, {}),
  );

  // Custom providers (user-added)
  const [customProviders, setCustomProviders] = useState<ProviderDef[]>(() =>
    loadJSON(STORAGE_KEYS.customProviders, []),
  );
  const [addingProvider, setAddingProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', baseURL: '', apiKeyUrl: '' });

  // Diagnostics
  const [diagnostics, setDiagnostics] = useState<Record<string, DiagnosticResult>>({});

  // Pending activation
  const pendingActivationRef = useRef<string | null>(null);
  const [selectionToast, setSelectionToast] = useState<string | null>(null);

  // Ollama
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [ollamaScanning, setOllamaScanning] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaDetectedModel[]>([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);

  // Auto-activate newly added model if pending
  useEffect(() => {
    const pendingName = pendingActivationRef.current;
    if (!pendingName) return;
    const found = aiModels.find(m => m.name === pendingName && !m.isActive);
    if (found) {
      pendingActivationRef.current = null;
      activateAIModel(found.id);
    }
  }, [aiModels, activateAIModel]);

  // Persist keys & urls
  useEffect(() => {
    saveJSON(STORAGE_KEYS.providerKeys, apiKeys);
  }, [apiKeys]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.providerUrls, customUrls);
  }, [customUrls]);
  useEffect(() => {
    saveJSON(STORAGE_KEYS.customProviders, customProviders);
  }, [customProviders]);

  // Sync API keys from provider config to store models
  useEffect(() => {
    for (const provider of [...PROVIDERS, ...customProviders]) {
      const key = apiKeys[provider.id];
      if (!key) continue;
      const url = customUrls[provider.id] || provider.baseURL;
      for (const storeModel of aiModels) {
        if (storeModel.endpoint === url && storeModel.apiKey !== key) {
          const isMatch = provider.models.some(
            m => m.id === storeModel.name || m.name === storeModel.name,
          );
          if (isMatch) {
            updateAIModel(storeModel.id, { apiKey: key });
          }
        }
      }
    }
  }, [apiKeys, customUrls, customProviders, aiModels, updateAIModel]);

  // All providers = built-in + custom
  const allProviders = useMemo(() => [...PROVIDERS, ...customProviders], [customProviders]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    if (!searchQuery) return allProviders;
    const q = searchQuery.toLowerCase();
    return allProviders.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.models.some(m => m.name.toLowerCase().includes(q)),
    );
  }, [allProviders, searchQuery]);

  // Provider-scoped model mutations
  const handleProviderAddModel = useCallback((providerId: string, model: ModelDef) => {
    setCustomProviders(prev =>
      prev.map(p => (p.id === providerId ? { ...p, models: [...p.models, model] } : p)),
    );
  }, []);

  const handleProviderRemoveModel = useCallback((providerId: string, modelId: string) => {
    setCustomProviders(prev =>
      prev.map(p =>
        p.id === providerId ? { ...p, models: p.models.filter(m => m.id !== modelId) } : p,
      ),
    );
  }, []);

  // Real diagnostic test — actual HTTP connectivity check
  const handleTestConnection = useCallback(
    (providerId: string, modelId: string) => {
      const provider = allProviders.find(p => p.id === providerId);
      if (!provider) return;
      const model = provider.models.find(m => m.id === modelId);
      if (!model) return;
      const diagKey = `${providerId}:${modelId}`;
      const providerApiKey = apiKeys[providerId] || '';
      const url = customUrls[providerId] || provider.baseURL;

      if (providerId !== 'ollama' && !providerApiKey) {
        setDiagnostics(prev => ({
          ...prev,
          [diagKey]: {
            providerId,
            modelName: model.name,
            status: 'error',
            message: i('ms.testNoApiKey'),
            timestamp: Date.now(),
          },
        }));
        return;
      }
      if (!url) {
        setDiagnostics(prev => ({
          ...prev,
          [diagKey]: {
            providerId,
            modelName: model.name,
            status: 'error',
            message: i('ms.testNoUrl'),
            timestamp: Date.now(),
          },
        }));
        return;
      }

      setDiagnostics(prev => ({
        ...prev,
        [diagKey]: {
          providerId,
          modelName: model.name,
          status: 'testing',
          message: i('ms.testSending'),
          timestamp: Date.now(),
        },
      }));

      const start = performance.now();
      const controller = new AbortController();
      const timeoutMs = 20000;
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const setResult = (
        result: Omit<DiagnosticResult, 'providerId' | 'modelName' | 'timestamp'>,
      ) => {
        setDiagnostics(prev => ({
          ...prev,
          [diagKey]: { providerId, modelName: model.name, timestamp: Date.now(), ...result },
        }));
      };

      (async () => {
        try {
          let resp: Response;
          if (providerId === 'ollama') {
            const ollamaBase = url.replace(/\/+$/, '');
            const chatUrl = ollamaBase.includes('/api/chat')
              ? ollamaBase
              : `${ollamaBase.replace(/\/api\/.*$/, '')}/api/chat`;
            resp = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: model.id,
                messages: [{ role: 'user', content: 'Hi, respond with exactly: YANYUCLOUD_OK' }],
                stream: false,
              }),
              signal: controller.signal,
            });
          } else if (providerId === 'claude') {
            resp = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': providerApiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
              },
              body: JSON.stringify({
                model: model.id,
                max_tokens: 20,
                messages: [{ role: 'user', content: 'Hi, respond with exactly: YANYUCLOUD_OK' }],
              }),
              signal: controller.signal,
            });
          } else {
            resp = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${providerApiKey}`,
              },
              body: JSON.stringify({
                model: model.id,
                messages: [{ role: 'user', content: 'Hi, respond with exactly: YANYUCLOUD_OK' }],
                stream: false,
                max_tokens: 20,
                temperature: 0,
              }),
              signal: controller.signal,
            });
          }

          clearTimeout(timer);
          const latency = Math.round(performance.now() - start);

          if (!resp.ok) {
            const errText = await resp.text().catch(() => '');
            let detail = '';
            try {
              const j = JSON.parse(errText);
              detail = j.error?.message || j.message || errText.slice(0, 200);
            } catch {
              detail = errText.slice(0, 200);
            }
            const s = resp.status;
            const statusMsg =
              s === 401
                ? i('ms.testError401')
                : s === 403
                  ? i('ms.testError403')
                  : s === 404
                    ? providerId === 'ollama'
                      ? i('ms.testError404Ollama', { model: model.id })
                      : i('ms.testError404')
                    : s === 429
                      ? i('ms.testError429')
                      : `HTTP ${s}`;
            setResult({
              status: 'error',
              message: statusMsg + (detail ? `。${detail}` : ''),
              latency,
            });
            return;
          }

          const data = await resp.json().catch(() => null);
          let reply = '';
          if (providerId === 'ollama') reply = data?.message?.content || '';
          else if (providerId === 'claude') reply = data?.content?.[0]?.text || '';
          else reply = data?.choices?.[0]?.message?.content || data?.result || '';

          setResult({
            status: 'success',
            message: i('ms.testSuccess'),
            latency,
            modelResponse: reply.slice(0, 100),
          });
        } catch (err: unknown) {
          clearTimeout(timer);
          const latency = Math.round(performance.now() - start);
          if (err instanceof DOMException && err.name === 'AbortError') {
            setResult({
              status: 'error',
              message: i('ms.testTimeout', { seconds: String(timeoutMs / 1000) }),
              latency,
            });
            return;
          }
          const msg = err instanceof Error ? err.message : '';
          const networkMsg =
            msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')
              ? i('ms.testNetworkFail')
              : i('ms.testException', { msg: msg.slice(0, 200) });
          setResult({ status: 'error', message: networkMsg, latency });
        }
      })();
    },
    [allProviders, apiKeys, customUrls, i],
  );

  // Select model — add to store if needed + activate
  const handleSelectModel = useCallback(
    (providerId: string, modelId: string) => {
      const provider = allProviders.find(p => p.id === providerId);
      if (!provider) return;
      const model = provider.models.find(m => m.id === modelId);
      if (!model) return;
      const url = customUrls[providerId] || provider.baseURL;
      const key = apiKeys[providerId] || '';
      const providerType: AIModel['provider'] =
        providerId === 'openai' ? 'openai' : providerId === 'ollama' ? 'ollama' : 'custom';

      const storeModelName = model.id;

      const existing = aiModels.find(
        m => (m.name === storeModelName || m.name === model.name) && m.endpoint === url,
      );

      if (existing) {
        updateAIModel(existing.id, { apiKey: key, name: storeModelName });
        activateAIModel(existing.id);
      } else {
        pendingActivationRef.current = storeModelName;
        addAIModel({
          name: storeModelName,
          provider: providerType,
          endpoint: url,
          apiKey: key,
          isActive: false,
        });
      }
      setSelectionToast(model.name);
      setTimeout(() => setSelectionToast(null), 2500);
    },
    [allProviders, customUrls, apiKeys, aiModels, activateAIModel, addAIModel, updateAIModel],
  );

  // Compute the "active model key" (providerId:modelId)
  const activeModelKey = useMemo(() => {
    if (!activeModelId) return null;
    const activeModel = aiModels.find(m => m.id === activeModelId);
    if (!activeModel) return null;

    for (const provider of allProviders) {
      const url = customUrls[provider.id] || provider.baseURL;
      for (const model of provider.models) {
        if (
          (activeModel.name === model.id || activeModel.name === model.name) &&
          activeModel.endpoint === url
        ) {
          return `${provider.id}:${model.id}`;
        }
      }
    }
    for (const provider of allProviders) {
      for (const model of provider.models) {
        const n = activeModel.name.toLowerCase();
        if (n === model.name.toLowerCase() || n === model.id.toLowerCase()) {
          return `${provider.id}:${model.id}`;
        }
      }
    }
    return null;
  }, [activeModelId, aiModels, allProviders, customUrls]);

  // Add custom provider
  const handleAddProvider = useCallback(() => {
    if (!newProvider.name || !newProvider.baseURL) return;
    const id = `custom-${Date.now()}`;
    const provider: ProviderDef = {
      id,
      name: newProvider.name,
      shortName: newProvider.name.slice(0, 4),
      icon: Bot,
      color: 'text-pink-400',
      colorBg: 'bg-pink-500/10',
      colorBorder: 'border-pink-500/20',
      description: i('ms.customProviderDesc'),
      baseURL: newProvider.baseURL,
      apiKeyUrl: newProvider.apiKeyUrl,
      apiKeyPlaceholder: 'sk-...',
      openaiCompatible: true,
      docsUrl: '',
      models: [],
    };
    setCustomProviders(prev => [...prev, provider]);
    setNewProvider({ name: '', baseURL: '', apiKeyUrl: '' });
    setAddingProvider(false);
    setExpandedProvider(id);
  }, [newProvider, i]);

  const handleRemoveProvider = useCallback((id: string) => {
    setCustomProviders(prev => prev.filter(p => p.id !== id));
  }, []);

  // Ollama scan
  const handleScanOllama = useCallback(() => {
    setOllamaScanning(true);
    setOllamaModels([]);
    setOllamaConnected(false);
    const url = `${ollamaHost.replace(/\/+$/, '')}/api/tags`;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        /** Ollama API model entry shape */
        interface OllamaApiModel {
          name?: string;
          model?: string;
          size?: number;
          details?: { quantization_level?: string; family?: string };
        }
        const models: OllamaDetectedModel[] = (data.models || []).map((m: OllamaApiModel) => ({
          name: (m.name || m.model) as string,
          size: m.size ? `${(m.size / 1e9).toFixed(1)} GB` : 'N/A',
          status: 'online' as const,
          quantization: m.details?.quantization_level || m.details?.family || 'N/A',
        }));
        setOllamaModels(models);
        setOllamaConnected(true);
        setOllamaScanning(false);
      })
      .catch(() => {
        let idx = 0;
        const interval = setInterval(() => {
          if (idx < SIMULATED_OLLAMA_MODELS.length) {
            const m = SIMULATED_OLLAMA_MODELS[idx];
            if (m) setOllamaModels(prev => [...prev, m]);
            idx++;
          } else {
            clearInterval(interval);
            setOllamaScanning(false);
            setOllamaConnected(false);
          }
        }, 350);
      });
  }, [ollamaHost]);

  const handleImportOllama = useCallback(
    (model: OllamaDetectedModel) => {
      addAIModel({
        name: model.name,
        provider: 'ollama',
        endpoint: `${ollamaHost.replace(/\/+$/, '')}/api/chat`,
        apiKey: '',
        isActive: false,
        isDetected: true,
      });
    },
    [addAIModel, ollamaHost],
  );

  if (!modelSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 ${t.overlayBg} backdrop-blur-md`}
        onClick={closeModelSettings}
      />
      <div
        className={`relative w-[920px] max-w-[95vw] max-h-[88vh] ${t.modalBg} border ${t.modalBorder} rounded-2xl flex flex-col overflow-hidden`}
        style={{ boxShadow: t.modalShadow, animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${t.sectionBorder}`}>
          <div
            className={`w-9 h-9 rounded-xl ${t.accentBg} border ${t.accentBorder} flex items-center justify-center`}
          >
            <Sparkles className={`w-4 h-4 ${t.accent}`} />
          </div>
          <div className="flex-1">
            <div className={`text-[14px] ${t.textPrimary}`}>{i('ms.title')}</div>
            <div className={`text-[11px] ${t.textTertiary}`}>{i('ms.subtitle')}</div>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] w-48">
            <Search className="w-3.5 h-3.5 text-white/20" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={i('ms.searchPlaceholder')}
              className="bg-transparent text-[11px] text-white/60 placeholder:text-white/15 focus:outline-none w-full"
            />
          </div>
          <button
            aria-label={i('ms.close')}
            onClick={closeModelSettings}
            className={`p-2 rounded-lg ${t.textMuted} hover:text-white/60 ${t.hoverBg} transition-all`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 px-5 pt-3 pb-0 border-b ${t.sectionBorder} overflow-x-auto`}>
          {[
            { key: 'providers' as const, label: i('ms.tab.providers'), icon: Cloud },
            { key: 'ollama' as const, label: i('ms.tab.ollama'), icon: Server },
            { key: 'mcp' as const, label: i('ms.tab.mcp'), icon: Plug },
            { key: 'diagnostics' as const, label: i('ms.tab.diagnostics'), icon: Activity },
          ].map(({ key, label, icon: TabIcon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[11px] transition-all border-b-2 whitespace-nowrap ${
                activeTab === key
                  ? `${t.activeTabText} border-current ${t.activeBg}`
                  : `${t.textTertiary} border-transparent hover:text-white/50`
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5">
          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="space-y-3">
              {/* Active model indicator */}
              {activeModelId &&
                (() => {
                  const activeModel = aiModels.find(m => m.id === activeModelId);
                  const matchedProvider = activeModelKey
                    ? allProviders.find(p => activeModelKey.startsWith(`${p.id}:`))
                    : null;
                  return (
                    <div
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#00f0ff]/[0.06] border border-[#00f0ff]/15 mb-1"
                      style={{ boxShadow: '0 0 16px -4px rgba(0,240,255,0.1)' }}
                    >
                      {matchedProvider ? (
                        <div
                          className={`w-6 h-6 rounded-lg ${matchedProvider.colorBg} border ${matchedProvider.colorBorder} flex items-center justify-center`}
                        >
                          <matchedProvider.icon className={`w-3 h-3 ${matchedProvider.color}`} />
                        </div>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#00f0ff]">
                            {activeModel?.name || i('ms.unknown')}
                          </span>
                          {matchedProvider && (
                            <span className="text-[9px] text-white/20">
                              {i(matchedProvider.name)}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-white/15 font-mono truncate">
                          {activeModel?.endpoint}
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff]/70 border border-[#00f0ff]/15 shrink-0">
                        {i('ms.currentlyUsing')}
                      </span>
                    </div>
                  );
                })()}

              {/* Provider cards */}
              {filteredProviders.map(provider => {
                const providerDiags: Record<string, DiagnosticResult> = {};
                provider.models.forEach(m => {
                  const d = diagnostics[`${provider.id}:${m.id}`];
                  if (d) providerDiags[m.id] = d;
                });

                return (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    apiKey={apiKeys[provider.id] || ''}
                    customUrl={customUrls[provider.id] || ''}
                    onApiKeyChange={key => setApiKeys(prev => ({ ...prev, [provider.id]: key }))}
                    onUrlChange={url => setCustomUrls(prev => ({ ...prev, [provider.id]: url }))}
                    onAddModel={model => handleProviderAddModel(provider.id, model)}
                    onRemoveModel={modelId => handleProviderRemoveModel(provider.id, modelId)}
                    onTestConnection={modelId => handleTestConnection(provider.id, modelId)}
                    onSelectModel={modelId => handleSelectModel(provider.id, modelId)}
                    activeModelKey={activeModelKey}
                    diagnostics={providerDiags}
                    expanded={expandedProvider === provider.id}
                    onToggle={() =>
                      setExpandedProvider(prev => (prev === provider.id ? null : provider.id))
                    }
                    isCustom={!PROVIDERS.find(p => p.id === provider.id)}
                    onRemoveProvider={
                      !PROVIDERS.find(p => p.id === provider.id)
                        ? () => handleRemoveProvider(provider.id)
                        : undefined
                    }
                  />
                );
              })}

              {/* Add custom provider */}
              {addingProvider ? (
                <div className="rounded-xl border border-dashed border-[#00d4ff]/20 bg-[#00d4ff]/[0.03] p-4 space-y-3">
                  <div className="text-[11px] text-[#00d4ff]/70 mb-1">
                    {i('ms.addProviderTitle')}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                        {i('ms.providerName')}
                      </label>
                      <input
                        value={newProvider.name}
                        onChange={e => setNewProvider(p => ({ ...p, name: e.target.value }))}
                        placeholder={i('ms.providerNamePlaceholder')}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-[#00d4ff]/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                        {i('ms.apiKeyUrlLabel')}
                      </label>
                      <input
                        value={newProvider.apiKeyUrl}
                        onChange={e => setNewProvider(p => ({ ...p, apiKeyUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-[#00d4ff]/40 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/30 uppercase tracking-wider mb-1 block">
                      {i('ms.baseUrl')}
                    </label>
                    <input
                      value={newProvider.baseURL}
                      onChange={e => setNewProvider(p => ({ ...p, baseURL: e.target.value }))}
                      placeholder="https://api.example.com/v1/chat/completions"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/70 placeholder:text-white/10 focus:outline-none focus:border-[#00d4ff]/40 font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddProvider}
                      disabled={!newProvider.name || !newProvider.baseURL}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00d4ff]/15 text-[#00d4ff] text-[11px] hover:bg-[#00d4ff]/25 transition-all disabled:opacity-30 border border-[#00d4ff]/20"
                    >
                      <Plus className="w-3 h-3" /> {i('ms.addProvider')}
                    </button>
                    <button
                      onClick={() => setAddingProvider(false)}
                      className="px-4 py-2 rounded-lg text-white/30 text-[11px] hover:bg-white/[0.04] transition-all"
                    >
                      {i('ms.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingProvider(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/[0.08] text-white/25 hover:text-white/50 hover:border-white/[0.15] transition-all text-[12px]"
                >
                  <Plus className="w-4 h-4" /> {i('ms.addProviderBtn')}
                </button>
              )}

              {/* Tip */}
              <div className="px-4 py-2.5 rounded-xl bg-[#00f0ff]/[0.03] border border-[#00f0ff]/10 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-[#00f0ff]/50 shrink-0 mt-0.5" />
                <div className="text-[10px] text-white/25">
                  <strong className="text-[#00f0ff]/40">{i('ms.providerTip')}</strong>
                  {i('ms.providerTipContent')}
                </div>
              </div>
            </div>
          )}

          {/* Ollama Tab */}
          {activeTab === 'ollama' && (
            <div className="space-y-4">
              <div
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span className="text-[12px] text-white/70">{i('ms.ollamaEndpoint')}</span>
                  <div
                    className={`ml-auto flex items-center gap-1.5 text-[10px] ${ollamaConnected ? 'text-emerald-400' : 'text-white/25'}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${ollamaConnected ? 'bg-emerald-400' : 'bg-white/15'}`}
                    />
                    {ollamaConnected ? i('ms.ollamaConnected') : i('ms.ollamaDisconnected')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    value={ollamaHost}
                    onChange={e => setOllamaHost(e.target.value)}
                    placeholder="http://localhost:11434"
                    aria-label="Ollama Host"
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/70 font-mono focus:outline-none focus:border-amber-500/40"
                  />
                  <button
                    onClick={handleScanOllama}
                    disabled={ollamaScanning}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] hover:bg-amber-500/25 transition-all disabled:opacity-50 border border-amber-500/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${ollamaScanning ? 'animate-spin' : ''}`} />
                    {ollamaScanning ? i('ms.ollamaScanning') : i('ms.ollamaScan')}
                  </button>
                </div>
                <div className="text-[10px] text-white/20">{i('ms.ollamaDesc')}</div>
              </div>

              {ollamaModels.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      {i('ms.detectedModels', { count: ollamaModels.length })}
                    </div>
                    {!ollamaConnected && (
                      <span className="text-[9px] text-amber-400/40">{i('ms.simulatedData')}</span>
                    )}
                  </div>
                  {ollamaModels.map(model => {
                    const alreadyImported = aiModels.some(
                      m => m.name === model.name && m.provider === 'ollama',
                    );
                    return (
                      <div
                        key={model.name}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/15 transition-all"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${model.status === 'online' ? 'bg-emerald-400' : 'bg-white/15'}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] text-white/70">{model.name}</div>
                          <div className="text-[10px] text-white/25">
                            {model.size} · {model.quantization}
                          </div>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            model.status === 'online'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-white/[0.04] text-white/20'
                          }`}
                        >
                          {model.status === 'online' ? i('ms.ollamaOnline') : i('ms.ollamaOffline')}
                        </span>
                        {alreadyImported ? (
                          <span className="text-[10px] text-white/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {i('ms.imported')}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImportOllama(model)}
                            disabled={model.status === 'offline'}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] hover:bg-amber-500/20 transition-all disabled:opacity-30 border border-amber-500/20"
                          >
                            <Plus className="w-3 h-3" /> {i('ms.import')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {ollamaModels.length === 0 && !ollamaScanning && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-4">
                    <Server className="w-7 h-7 text-white/10" />
                  </div>
                  <p className="text-[12px] text-white/25 mb-1">{i('ms.noOllamaModels')}</p>
                  <p className="text-[10px] text-white/15">{i('ms.noOllamaModelsDesc')}</p>
                </div>
              )}

              {ollamaScanning && ollamaModels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 flex items-center justify-center mb-4 relative">
                    <Server className="w-7 h-7 text-amber-400/40" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/30 animate-ping" />
                  </div>
                  <p className="text-[12px] text-amber-400/60 mb-1">{i('ms.ollamaScanningMsg')}</p>
                  <p className="text-[10px] text-white/15">{ollamaHost}/api/tags</p>
                </div>
              )}
            </div>
          )}

          {/* MCP Tab */}
          {activeTab === 'mcp' && <MCPConfigPanel />}

          {/* Diagnostics Tab */}
          {activeTab === 'diagnostics' && (
            <SmartDiagnosticsPanel
              providers={allProviders}
              apiKeys={apiKeys}
              diagnostics={diagnostics}
              onRunDiagnostic={handleTestConnection}
              onSelectModel={handleSelectModel}
              activeModelKey={activeModelKey}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-t ${t.sectionBorder} ${t.surfaceInset}`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-[10px] ${t.textMuted}`}>
              {i('ms.footerStats', {
                providers: allProviders.length,
                models: allProviders.reduce((sum, p) => sum + p.models.length, 0),
              })}
            </span>
            {Object.values(diagnostics).filter(d => d.status === 'success').length > 0 && (
              <span className="text-[10px] text-emerald-400/40">
                {i('ms.online', {
                  count: Object.values(diagnostics).filter(d => d.status === 'success').length,
                })}
              </span>
            )}
          </div>
          <button
            onClick={closeModelSettings}
            className={`px-4 py-1.5 rounded-lg ${t.badgeBg} ${t.textTertiary} text-[11px] ${t.hoverBg} transition-all`}
          >
            {i('ms.done')}
          </button>
        </div>

        {/* Selection toast */}
        {selectionToast && (
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/25 backdrop-blur-sm"
            style={{
              boxShadow: '0 4px 20px rgba(0,240,255,0.15)',
              animation: 'modalIn 0.15s ease-out',
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-[12px] text-[#00f0ff]">
              {i('ms.switchedTo')} <strong>{selectionToast}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Modal animation keyframe */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
