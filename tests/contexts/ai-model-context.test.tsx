import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { AIModelProvider, useAIModel } from '../../src/app/components/context/ai-model-context';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AIModelProvider>{children}</AIModelProvider>;
}

describe('AIModel Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with no models', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    expect(result.current.aiModels).toEqual([]);
    expect(result.current.activeModelId).toBeNull();
  });

  it('should start with settings closed', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    expect(result.current.modelSettingsOpen).toBe(false);
  });

  it('should open and close model settings', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => result.current.openModelSettings());
    expect(result.current.modelSettingsOpen).toBe(true);
    act(() => result.current.closeModelSettings());
    expect(result.current.modelSettingsOpen).toBe(false);
  });

  it('should add an AI model', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'GPT-4',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1',
        apiKey: 'sk-test',
        isActive: false,
      });
    });
    expect(result.current.aiModels.length).toBe(1);
    expect(result.current.aiModels[0].name).toBe('GPT-4');
    expect(result.current.aiModels[0].id).toBeTruthy();
  });

  it('should remove an AI model', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'Test',
        provider: 'ollama',
        endpoint: 'http://localhost',
        apiKey: '',
        isActive: false,
      });
    });
    const id = result.current.aiModels[0].id;
    act(() => result.current.removeAIModel(id));
    expect(result.current.aiModels.length).toBe(0);
  });

  it('should update an AI model', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'Old',
        provider: 'custom',
        endpoint: 'http://old',
        apiKey: '',
        isActive: false,
      });
    });
    const id = result.current.aiModels[0].id;
    act(() => result.current.updateAIModel(id, { name: 'New', endpoint: 'http://new' }));
    expect(result.current.aiModels[0].name).toBe('New');
    expect(result.current.aiModels[0].endpoint).toBe('http://new');
  });

  it('should activate an AI model', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'M1',
        provider: 'openai',
        endpoint: 'http://a',
        apiKey: 'k1',
        isActive: false,
      });
      result.current.addAIModel({
        name: 'M2',
        provider: 'ollama',
        endpoint: 'http://b',
        apiKey: '',
        isActive: false,
      });
    });
    const id2 = result.current.aiModels[1].id;
    act(() => result.current.activateAIModel(id2));
    expect(result.current.activeModelId).toBe(id2);
    expect(result.current.aiModels[0].isActive).toBe(false);
    expect(result.current.aiModels[1].isActive).toBe(true);
  });

  it('should clear active model id when removed', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'Active',
        provider: 'openai',
        endpoint: 'http://a',
        apiKey: 'k1',
        isActive: false,
      });
    });
    const id = result.current.aiModels[0].id;
    act(() => result.current.activateAIModel(id));
    expect(result.current.activeModelId).toBe(id);
    act(() => result.current.removeAIModel(id));
    expect(result.current.activeModelId).toBeNull();
  });

  it('should persist models to localStorage', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'Persist',
        provider: 'custom',
        endpoint: 'http://test',
        apiKey: 'key',
        isActive: false,
      });
    });
    const stored = localStorage.getItem('yyc3_ai_models');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe('Persist');
  });

  it('should persist active model id to localStorage', () => {
    const { result } = renderHook(() => useAIModel(), { wrapper });
    act(() => {
      result.current.addAIModel({
        name: 'X',
        provider: 'openai',
        endpoint: 'http://a',
        apiKey: 'k',
        isActive: false,
      });
    });
    const id = result.current.aiModels[0].id;
    act(() => result.current.activateAIModel(id));
    expect(localStorage.getItem('yyc3_active_model_id')).toBe(id);
  });
});
