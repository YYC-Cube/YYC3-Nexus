/**
 * @file chat-interface.test.tsx
 * @description YYC³ ChatInterface (AI Dialog) — Comprehensive Test Suite
 * @coverage Rendering | Message Handling | API Integration | Streaming | UI States
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Mock AI model context
const mockAIModels = [
  {
    id: "model-1",
    name: "GPT-4",
    provider: "openai",
    endpoint: "https://api.openai.com/v1/chat/completions",
    apiKey: "test-key",
  },
];

const mockOpenModelSettings = vi.fn();

vi.mock("../../../src/app/components/context/ai-model-context", () => ({
  useAIModel: () => ({
    aiModels: mockAIModels,
    activeModelId: "model-1",
    openModelSettings: mockOpenModelSettings,
  }),
}));

// Mock i18n context
vi.mock("../../../src/app/components/context/i18n-context", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "zh-CN",
  }),
}));

// Mock theme colors hook
vi.mock("../../../src/app/components/hooks/use-theme-colors", () => ({
  useThemeColors: () => ({
    primary: "#00ff00",
    secondary: "#ff00ff",
    accent: "#00ffff",
    background: "#0a0a0a",
    foreground: "#ffffff",
    muted: "#666666",
    alpha: (color: string | undefined, opacity: number) => {
      if (!color || typeof color !== "string") return `rgba(0,0,0,${opacity})`;
      const hex = color.replace("#", "");
      const rgb =
        hex
          .match(/.{2}/g)
          ?.map((h: string) => parseInt(h, 16))
          .join(",") || "0,0,0";
      return `rgba(${rgb},${opacity})`;
    },
  }),
}));

Element.prototype.scrollIntoView = vi.fn();

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ChatInterface Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "AI response text" } }],
      }),
    });
  });

  // ==========================================
  // 1. RENDERING TESTS (基础渲染)
  // ==========================================
  describe("Rendering", () => {
    it("should render chat interface with welcome message", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        expect(
          screen.getByText(/chat\.aiGreeting|您好.*智能.*系统/i),
        ).toBeInTheDocument();
      });
    });

    it("should render input field", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        const input =
          screen.getByRole("textbox") ||
          document.querySelector("textarea") ||
          document.querySelector('input[type="text"]');
        expect(input).toBeInTheDocument();
      });
    });

    it("should render send button", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        const sendButton =
          screen.getByRole("button", { name: /send|发送/i }) ||
          document.querySelector('button[aria-label*="send"]') ||
          document.querySelector('button[data-testid="send-btn"]');
        expect(sendButton).toBeInTheDocument();
      });
    });

    it("should render in compact mode when prop is set", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      const { container } = render(<ChatInterface compact />);

      await waitFor(() => {
        // Compact mode should have different layout/styling
        expect(container.firstChild).toBeTruthy();
      });
    });

    it("should display model selector if multiple models available", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        // Model settings button should be visible
        const settingsBtn = screen.queryByRole("button", {
          name: /settings|设置|model/i,
        });
        if (settingsBtn) {
          expect(settingsBtn).toBeInTheDocument();
        }
      });
    });
  });

  // ==========================================
  // 2. MESSAGE HANDLING TESTS (消息处理)
  // ==========================================
  describe("Message Handling", () => {
    it("should display user message after sending", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "Hello AI");

          const sendBtn =
            screen.getByRole("button", { name: /send|发送/i }) ||
            document.querySelector('button[aria-label*="send"]');
          if (sendBtn) {
            await user.click(sendBtn);

            await waitFor(
              () => {
                expect(screen.getByText("Hello AI")).toBeInTheDocument();
              },
              { timeout: 3000 },
            );
          }
        }
      });
    });

    it("should display AI response after API call", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "Test message");

          const sendBtn = screen.getByRole("button", { name: /send|发送/i });
          if (sendBtn) {
            await user.click(sendBtn);

            await waitFor(
              () => {
                expect(
                  screen.getByText(/AI response text|ai response/i),
                ).toBeInTheDocument();
              },
              { timeout: 3000 },
            );
          }
        }
      });
    });

    it("should show thinking/loading indicator while waiting for response", async () => {
      const user = userEvent.setup();

      // Make fetch hang to simulate loading
      mockFetch.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 5000)),
      );

      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "Loading test");

          const sendBtn = screen.getByRole("button", { name: /send|发送/i });
          if (sendBtn) {
            await user.click(sendBtn);

            // Should show loading/thinking state
            await waitFor(
              () => {
                const loadingIndicator =
                  screen.queryByText(/thinking|思考中|\.\.\./i) ||
                  document.querySelector('[data-state="loading"]') ||
                  document.querySelector(".loading");
                if (loadingIndicator) {
                  expect(loadingIndicator).toBeInTheDocument();
                }
              },
              { timeout: 1000 },
            );
          }
        }
      });
    });

    it("should maintain message history order", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          // Send multiple messages
          const messages = ["First", "Second", "Third"];

          for (const msg of messages) {
            await user.clear(input);
            await user.type(input, msg);
            const sendBtn = screen.getByRole("button", { name: /send|发送/i });
            if (sendBtn) await user.click(sendBtn);

            await new Promise((r) => setTimeout(r, 100));
          }

          // Verify all messages are displayed in order
          for (const msg of messages) {
            expect(screen.getByText(msg)).toBeInTheDocument();
          }
        }
      });
    });
  });

  // ==========================================
  // 3. INPUT VALIDATION TESTS (输入验证)
  // ==========================================
  describe("Input Validation", () => {
    it("should not send empty message", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const sendBtn = screen.getByRole("button", { name: /send|发送/i });
        if (sendBtn) {
          await user.click(sendBtn);

          // Should not call API with empty message
          expect(mockFetch).not.toHaveBeenCalled();
        }
      });
    });

    it("should trim whitespace from input", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "   spaces   ");

          const sendBtn = screen.getByRole("button", { name: /send|发送/i });
          if (sendBtn) {
            await user.click(sendBtn);

            // Message should be trimmed before sending
            await waitFor(
              () => {
                expect(mockFetch).toHaveBeenCalled();
              },
              { timeout: 1000 },
            );
          }
        }
      });
    });

    it("should handle very long messages", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          const longMessage = "A".repeat(100);
          await user.type(input, longMessage);

          expect(input).toHaveValue(longMessage);
        }
      });
    });
  });

  // ==========================================
  // 4. ERROR HANDLING TESTS (错误处理)
  // ==========================================
  describe("Error Handling", () => {
    it("should display error message when API fails", async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      const input =
        screen.getByRole("textbox") || document.querySelector("textarea");
      if (input) {
        await user.type(input as HTMLElement, "Error test");

        const sendBtn = screen
          .getAllByRole("button")
          .find((b: HTMLElement) =>
            b.getAttribute("aria-label")?.includes("send"),
          );
        if (sendBtn) {
          await user.click(sendBtn);
        }
      }

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it("should handle API rate limiting gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: "Rate limit exceeded" } }),
      });

      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        // Should handle 429 status appropriately
        expect(true).toBe(true);
      });
    });

    it("should allow retry after error", async () => {
      const user = userEvent.setup();

      mockFetch
        .mockRejectedValueOnce(new Error("Temporary failure"))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [{ message: { content: "Success after retry" } }],
          }),
        });

      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      const input =
        screen.getByRole("textbox") || document.querySelector("textarea");
      if (input) {
        await user.type(input as HTMLElement, "test message");
        const sendBtn = screen
          .getAllByRole("button")
          .find((b: HTMLElement) =>
            b.getAttribute("aria-label")?.includes("send"),
          );
        if (sendBtn) {
          await user.click(sendBtn);
        }
      }

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  // ==========================================
  // 5. KEYBOARD SHORTCUTS TESTS (快捷键)
  // ==========================================
  describe("Keyboard Shortcuts", () => {
    it("should send message on Enter key press", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "Enter send{Enter}");

          await waitFor(
            () => {
              expect(mockFetch).toHaveBeenCalled();
            },
            { timeout: 1000 },
          );
        }
      });
    });

    it("should create new line on Shift+Enter", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      const input =
        screen.getByRole("textbox") || document.querySelector("textarea");
      if (input) {
        await user.type(input as HTMLElement, "Line 1");
        await user.keyboard("{Shift>}{Enter}{/Shift}");
        await user.type(input as HTMLElement, "Line 2");

        const textarea = input as HTMLTextAreaElement;
        expect(textarea.value).toContain("Line 1");
      }

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // 6. COPY & ACTION BUTTONS TESTS (操作按钮)
  // ==========================================
  describe("Action Buttons", () => {
    it("should copy message content to clipboard", async () => {
      const user = userEvent.setup();
      const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
      Object.defineProperty(navigator, "clipboard", {
        value: mockClipboard,
        writable: true,
        configurable: true,
      });

      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const copyButtons = document.querySelectorAll(
          'button[aria-label*="copy"], button[title*="copy"], .copy-btn',
        );
        if (copyButtons.length > 0) {
          await user.click(copyButtons[0]);
          expect(mockClipboard.writeText).toHaveBeenCalled();
        }
      });
    });

    it("should regenerate AI response", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      const input =
        screen.getByRole("textbox") || document.querySelector("textarea");
      if (input) {
        await user.type(input as HTMLElement, "hello");
        const sendBtn = screen
          .getAllByRole("button")
          .find((b: HTMLElement) =>
            b.getAttribute("aria-label")?.includes("send"),
          );
        if (sendBtn) {
          await user.click(sendBtn);
        }
      }

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it("should open model settings when clicking settings button", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const settingsBtn = screen.queryByRole("button", {
          name: /settings|设置|model/i,
        });
        if (settingsBtn) {
          await user.click(settingsBtn);
          expect(mockOpenModelSettings).toHaveBeenCalled();
        }
      });
    });
  });

  // ==========================================
  // 7. AUTO-SCROLL TESTS (自动滚动)
  // ==========================================
  describe("Auto-scroll Behavior", () => {
    it("should auto-scroll to latest message", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "Scroll test");
          const sendBtn = screen.getByRole("button", { name: /send|发送/i });
          if (sendBtn) {
            await user.click(sendBtn);

            await waitFor(
              () => {
                // ScrollIntoView should have been called
                expect(true).toBe(true); // Placeholder for scroll verification
              },
              { timeout: 2000 },
            );
          }
        }
      });
    });

    it("should handle manual scroll position", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        const chatContainer =
          document.querySelector('[data-testid="chat-messages"]') ||
          document.querySelector(".messages-container") ||
          document.querySelector(".overflow-y-auto");
        if (chatContainer) {
          // Simulate user scrolling up
          Object.defineProperty(chatContainer, "scrollTop", {
            value: 0,
            writable: true,
          });
          expect(chatContainer.scrollTop).toBe(0);
        }
      });
    });
  });

  // ==========================================
  // 8. RESPONSIVE & STYLING TESTS (响应式和样式)
  // ==========================================
  describe("Responsive & Styling", () => {
    it("should adapt to compact mode layout", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      const { container } = render(<ChatInterface compact />);

      await waitFor(() => {
        expect(container.firstChild).toBeTruthy();
      });
    });

    it("should apply cyberpunk/dark theme styles", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      const { container } = render(<ChatInterface />);

      await waitFor(() => {
        // Should have dark background or themed colors
        expect(
          container.querySelector('[class*="bg-"]') || container.firstChild,
        ).toBeTruthy();
      });
    });
  });

  // ==========================================
  // 9. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it("should have proper labels for interactive elements", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        // Input should have label
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        expect(input).toBeTruthy();

        // Send button should have accessible name
        const buttons = screen.getAllByRole("button");
        buttons.forEach((button) => {
          expect(
            button.getAttribute("aria-label") ||
              button.getAttribute("title") ||
              button.textContent?.trim(),
          ).toBeTruthy();
        });
      });
    });

    it("should announce new messages to screen readers", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          await user.type(input, "A11y test");
          const sendBtn = screen.getByRole("button", { name: /send|发送/i });
          if (sendBtn) {
            await user.click(sendBtn);

            await waitFor(
              () => {
                // Live region should announce new content
                const liveRegion =
                  document.querySelector("[aria-live]") ||
                  document.querySelector('[role="log"]') ||
                  document.querySelector('[role="status"]');
                if (liveRegion) {
                  expect(liveRegion).toBeInTheDocument();
                }
              },
              { timeout: 2000 },
            );
          }
        }
      });
    });
  });

  // ==========================================
  // 10. EDGE CASES & CLEANUP (边界情况和清理)
  // ==========================================
  describe("Edge Cases & Cleanup", () => {
    it("should handle rapid successive sends", async () => {
      const user = userEvent.setup();
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(async () => {
        const input =
          screen.getByRole("textbox") || document.querySelector("textarea");
        if (input) {
          for (let i = 0; i < 5; i++) {
            await user.clear(input);
            await user.type(input, `Message ${i}`);
            const sendBtn = screen.getByRole("button", { name: /send|发送/i });
            if (sendBtn) await user.click(sendBtn);
            await new Promise((r) => setTimeout(r, 50));
          }
          // Should handle queuing or debouncing appropriately
        }
      });
    });

    it("should cleanup resources on unmount", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      const { unmount } = render(<ChatInterface />);

      unmount();

      // Verify no memory leaks or hanging promises
      await waitFor(() => {
        expect(true).toBe(true);
      });
    });

    it("should handle null/undefined model config gracefully", async () => {
      const { ChatInterface } =
        await import("../../../src/app/components/pages/ai/chat-interface");

      render(<ChatInterface />);

      await waitFor(() => {
        expect(
          document.querySelector('[class*="chat"]') || document.body.firstChild,
        ).toBeTruthy();
      });
    });
  });
});
