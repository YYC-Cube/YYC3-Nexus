/**
 * @file error-handling.test.ts
 * @description 错误处理与恢复能力测试 - 网络错误友好提示 + 应用故障恢复
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-24
 * @status stable
 * @license MIT
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

// ==========================================
// Mock 数据和工具函数
// ==========================================

interface NetworkError {
  name: string;
  message: string;
  code?: string;
  status?: number;
}

interface ErrorRecoveryState {
  hasError: boolean;
  error: NetworkError | null;
  retryCount: number;
  lastErrorTime: number | null;
  isRecovering: boolean;
}

class ErrorBoundary {
  private state: ErrorRecoveryState = {
    hasError: false,
    error: null,
    retryCount: 0,
    lastErrorTime: null,
    isRecovering: false,
  };

  private maxRetries = 3;
  private recoveryDelay = 1000;

  getState(): ErrorRecoveryState {
    return { ...this.state };
  }

  captureError(error: NetworkError): void {
    this.state.hasError = true;
    this.state.error = error;
    this.state.lastErrorTime = Date.now();
    this.state.retryCount++;
  }

  clearError(): void {
    this.state.hasError = false;
    this.state.error = null;
    this.state.isRecovering = false;
  }

  async recover(recoveryFn: () => Promise<void>): Promise<boolean> {
    if (this.state.retryCount >= this.maxRetries) {
      return false;
    }

    this.state.isRecovering = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, this.recoveryDelay));
      await recoveryFn();
      this.clearError();
      return true;
    } catch (error) {
      this.captureError(error as NetworkError);
      return false;
    } finally {
      this.state.isRecovering = false;
    }
  }

  canRetry(): boolean {
    return this.state.retryCount < this.maxRetries;
  }

  getTimeSinceLastError(): number {
    if (!this.state.lastErrorTime) return Infinity;
    return Date.now() - this.state.lastErrorTime;
  }
}

// ==========================================
// 网络错误分类器
// ==========================================

class NetworkErrorClassifier {
  static classify(error: unknown): {
    type: "network" | "timeout" | "server" | "auth" | "unknown";
    userFriendlyMessage: string;
    shouldRetry: boolean;
  } {
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        return {
          type: "timeout",
          userFriendlyMessage: "⏰ 网络请求超时，请检查您的网络连接后重试",
          shouldRetry: true,
        };
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        return {
          type: "network",
          userFriendlyMessage: "🌐 网络连接失败，请检查您的网络设置或稍后重试",
          shouldRetry: true,
        };
      }

      if ((error as any).status === 401 || (error as any).status === 403) {
        return {
          type: "auth",
          userFriendlyMessage: "🔐 认证失败，请重新登录后继续操作",
          shouldRetry: false,
        };
      }

      if ((error as any).status && (error as any).status >= 500) {
        return {
          type: "server",
          userFriendlyMessage: `⚠️ 服务器暂时不可用（错误码：${(error as any).status}），我们正在努力修复`,
          shouldRetry: true,
        };
      }
    }

    return {
      type: "unknown",
      userFriendlyMessage: "❌ 发生未知错误，请刷新页面或联系技术支持",
      shouldRetry: false,
    };
  }
}

// ==========================================
// 测试套件
// ==========================================

describe("错误处理与恢复能力", () => {
  describe("1. 网络错误友好提示", () => {
    it("应该正确识别超时错误并返回友好的中文提示", () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "AbortError";

      const result = NetworkErrorClassifier.classify(timeoutError);

      expect(result.type).toBe("timeout");
      expect(result.userFriendlyMessage).toContain("超时");
      expect(result.userFriendlyMessage).toContain("网络连接");
      expect(result.shouldRetry).toBe(true);
    });

    it("应该正确识别网络连接失败并提供建议", () => {
      const networkError = new Error("Failed to fetch");

      const result = NetworkErrorClassifier.classify(networkError);

      expect(result.type).toBe("network");
      expect(result.userFriendlyMessage).toContain("网络连接失败");
      expect(result.userFriendlyMessage).toContain("检查");
      expect(result.shouldRetry).toBe(true);
    });

    it("应该正确处理认证错误并提示重新登录", () => {
      const authError = new Error("Unauthorized");
      (authError as any).status = 401;

      const result = NetworkErrorClassifier.classify(authError);

      expect(result.type).toBe("auth");
      expect(result.userFriendlyMessage).toContain("认证失败");
      expect(result.userFriendlyMessage).toContain("重新登录");
      expect(result.shouldRetry).toBe(false);
    });

    it("应该正确处理服务器错误并显示状态码", () => {
      const serverError = new Error("Internal Server Error");
      (serverError as any).status = 503;

      const result = NetworkErrorClassifier.classify(serverError);

      expect(result.type).toBe("server");
      expect(result.userFriendlyMessage).toContain("503");
      expect(result.userFriendlyMessage).toContain("服务器");
      expect(result.shouldRetry).toBe(true);
    });

    it("应该对未知错误提供通用的友好提示", () => {
      const unknownError = new Error("Something went wrong");

      const result = NetworkErrorClassifier.classify(unknownError);

      expect(result.type).toBe("unknown");
      expect(result.userFriendlyMessage).toContain("未知错误");
      expect(result.userFriendlyMessage).toContain("联系技术支持");
      expect(result.shouldRetry).toBe(false);
    });

    it("应该正确处理非 Error 类型的异常", () => {
      const result = NetworkErrorClassifier.classify("string error");

      expect(result.type).toBe("unknown");
      expect(result.userFriendlyMessage).toBeTruthy();
    });
  });

  describe("2. 应用故障恢复能力", () => {
    let errorBoundary: ErrorBoundary;

    beforeEach(() => {
      errorBoundary = new ErrorBoundary();
    });

    it("应该能够捕获并记录错误状态", () => {
      const testError: NetworkError = {
        name: "NetworkError",
        message: "Connection refused",
        code: "ECONNREFUSED",
      };

      errorBoundary.captureError(testError);
      const state = errorBoundary.getState();

      expect(state.hasError).toBe(true);
      expect(state.error).toEqual(testError);
      expect(state.retryCount).toBe(1);
      expect(state.lastErrorTime).not.toBeNull();
    });

    it("应该支持多次错误捕获并记录重试次数", () => {
      for (let i = 0; i < 3; i++) {
        errorBoundary.captureError({
          name: "NetworkError",
          message: `Attempt ${i + 1}`,
        });
      }

      expect(errorBoundary.getState().retryCount).toBe(3);
      expect(errorBoundary.canRetry()).toBe(false);
    });

    it("应该在达到最大重试次数后禁止重试", () => {
      const maxRetries = 3;

      for (let i = 0; i <= maxRetries; i++) {
        errorBoundary.captureError({ name: "Error", message: `Error ${i}` });
      }

      expect(errorBoundary.canRetry()).toBe(false);
    });

    it("应该支持成功恢复并清除错误状态", async () => {
      errorBoundary.captureError({ name: "Error", message: "Test error" });

      const recoveryFn = vi.fn().mockResolvedValue(undefined);
      const recovered = await errorBoundary.recover(recoveryFn);

      expect(recovered).toBe(true);
      expect(errorBoundary.getState().hasError).toBe(false);
      expect(errorBoundary.getState().error).toBeNull();
      expect(recoveryFn).toHaveBeenCalled();
    });

    it("应该在恢复失败时保留错误状态", async () => {
      errorBoundary.captureError({ name: "Error", message: "Initial error" });

      const newError = new Error("Recovery failed");
      const recoveryFn = vi.fn().mockRejectedValue(newError);

      const recovered = await errorBoundary.recover(recoveryFn);

      expect(recovered).toBe(false);
      expect(errorBoundary.getState().hasError).toBe(true);
      expect(errorBoundary.getState().retryCount).toBe(2);
      expect(errorBoundary.getState().error?.message).toBe("Recovery failed");
    });

    it("应该计算距离上次错误的时间", () => {
      const beforeCapture = Date.now();
      errorBoundary.captureError({ name: "Error", message: "Test" });
      const afterCapture = Date.now();

      const timeSinceError = errorBoundary.getTimeSinceLastError();

      expect(timeSinceError).toBeGreaterThanOrEqual(0);
      expect(timeSinceError).toBeLessThanOrEqual(
        afterCapture - beforeCapture + 100,
      );
    });

    it("应该在无错误时返回无限大时间", () => {
      const timeSinceError = errorBoundary.getTimeSinceLastError();
      expect(timeSinceError).toBe(Infinity);
    });

    it("应该在恢复过程中标记 isRecovering 状态", async () => {
      errorBoundary.captureError({ name: "Error", message: "Test" });

      let isRecoveringDuringExecution = false;
      const recoveryFn = vi.fn().mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            isRecoveringDuringExecution = errorBoundary.getState().isRecovering;
            resolve();
          }),
      );

      const recovered = await errorBoundary.recover(recoveryFn);

      expect(isRecoveringDuringExecution).toBe(true);
      expect(recovered).toBe(true);
      expect(errorBoundary.getState().isRecovering).toBe(false);
    });

    it("应该支持手动清除错误状态", () => {
      errorBoundary.captureError({ name: "Error", message: "Test" });
      expect(errorBoundary.getState().hasError).toBe(true);

      errorBoundary.clearError();

      expect(errorBoundary.getState().hasError).toBe(false);
      expect(errorBoundary.getState().error).toBeNull();
      expect(errorBoundary.getState().isRecovering).toBe(false);
    });

    it("应该保持错误历史的独立性（不互相影响）", () => {
      const boundary1 = new ErrorBoundary();
      const boundary2 = new ErrorBoundary();

      boundary1.captureError({ name: "Error", message: "Error in 1" });
      boundary2.captureError({ name: "Error", message: "Error in 2" });

      expect(boundary1.getState().error?.message).toBe("Error in 1");
      expect(boundary2.getState().error?.message).toBe("Error in 2");
      expect(boundary1.getState().retryCount).toBe(1);
      expect(boundary2.getState().retryCount).toBe(1);
    });
  });
});
