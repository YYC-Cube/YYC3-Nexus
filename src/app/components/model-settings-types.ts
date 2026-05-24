export interface ProviderDef {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  colorBorder: string;
  description: string;
  baseURL: string;
  apiKeyUrl: string;
  apiKeyPlaceholder: string;
  models: ModelDef[];
  openaiCompatible: boolean;
  docsUrl: string;
}

export interface ModelDef {
  id: string;
  name: string;
  description: string;
  contextWindow?: string;
  pricing?: string;
}

export interface MCPServerConfig {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  enabled: boolean;
}

export interface DiagnosticResult {
  providerId: string;
  modelName: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  latency?: number;
  message: string;
  modelResponse?: string;
  timestamp?: number;
}

export interface OllamaDetectedModel {
  name: string;
  size: string;
  status: 'online' | 'offline';
  quantization: string;
}
