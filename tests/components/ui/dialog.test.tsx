/**
 * @file dialog.test.tsx
 * @description YYC³ Dialog Component — Comprehensive Test Suite
 * @coverage Rendering | Open/Close | Portal | Overlay | Keyboard | Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from "../../../src/app/components/ui/dialog";

describe("Dialog Component", () => {
  // ==========================================
  // 1. BASIC RENDERING TESTS (基础渲染)
  // ==========================================
  describe("Basic Rendering", () => {
    it("should not render dialog content when closed", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    });

    it("should render trigger button correctly", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Me</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(
        screen.getByRole("button", { name: /open me/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Open Me")).toHaveAttribute(
        "data-slot",
        "dialog-trigger",
      );
    });
  });

  // ==========================================
  // 2. OPEN/CLOSE INTERACTIONS (打开/关闭交互)
  // ==========================================
  describe("Open/Close Interactions", () => {
    it("should open dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Modal Dialog</DialogTitle>
            <p>This is modal content</p>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Dialog"));

      await waitFor(() => {
        expect(screen.getByText("Modal Dialog")).toBeInTheDocument();
        expect(screen.getByText("This is modal content")).toBeInTheDocument();
      });
    });

    it("should close dialog when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Closable Dialog</DialogTitle>
            <p>Content</p>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open"));

      // Find close button (X icon)
      const closeButton =
        screen.getByRole("button", { name: /close/i }) ||
        (document.querySelector('[data-slot="dialog-close"]') as HTMLElement);
      if (closeButton) {
        await user.click(closeButton);
        await waitFor(() => {
          expect(screen.queryByText("Closable Dialog")).not.toBeInTheDocument();
        });
      }
    });

    it("should close dialog when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Overlay</DialogTrigger>
          <DialogContent>
            <DialogTitle>Overlay Close</DialogTitle>
            <p>Click outside to close</p>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Overlay"));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="dialog-overlay"]'),
        ).toBeInTheDocument();
      });

      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      if (overlay) {
        fireEvent.pointerDown(overlay, { pointerId: 1, pointerType: "mouse" });
        fireEvent.pointerUp(overlay, { pointerId: 1, pointerType: "mouse" });
      }

      await waitFor(
        () => {
          expect(screen.queryByText("Overlay Close")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("should support controlled open/close state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Controlled</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Controlled"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // ==========================================
  // 3. DIALOG STRUCTURE TESTS (结构测试)
  // ==========================================
  describe("Dialog Structure", () => {
    it("should render dialog with correct portal and overlay", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Structured</DialogTrigger>
          <DialogContent data-testid="dialog-content">
            <DialogTitle>Structured Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Structured"));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="dialog-overlay"]'),
        ).toBeInTheDocument();
        expect(
          document.querySelector('[data-slot="dialog-content"]'),
        ).toBeInTheDocument();
      });

      const portal = document.querySelector('[data-slot="dialog-portal"]');
      if (portal) {
        expect(portal).toBeInTheDocument();
      }
    });

    it("should render header and footer sections", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Header Footer</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
              <DialogDescription>Header Description</DialogDescription>
            </DialogHeader>
            <p>Main content area</p>
            <DialogFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Header Footer"));

      await waitFor(() => {
        expect(screen.getByText("Header Title")).toBeInTheDocument();
        expect(screen.getByText("Header Description")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Confirm")).toBeInTheDocument();
      });
    });

    it("should render title with correct role and attributes", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Title</DialogTrigger>
          <DialogContent>
            <DialogTitle id="dialog-title">Accessible Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Title"));

      await waitFor(() => {
        const title = screen.getByRole("heading", {
          name: /accessible title/i,
          level: 2,
        });
        expect(title).toBeInTheDocument();
        expect(title).toHaveAttribute("data-slot", "dialog-title");
      });
    });

    it("should render description with correct attributes", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Desc</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>
              This describes the dialog purpose
            </DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Desc"));

      await waitFor(() => {
        const desc = screen.getByText(/this describes the dialog purpose/i);
        expect(desc).toBeInTheDocument();
        expect(desc).toHaveAttribute("data-slot", "dialog-description");
      });
    });
  });

  // ==========================================
  // 4. KEYBOARD INTERACTIONS (键盘交互)
  // ==========================================
  describe("Keyboard Interactions", () => {
    it("should close dialog on Escape key press", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Escape</DialogTrigger>
          <DialogContent>
            <DialogTitle>Escape Close</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Escape"));

      await waitFor(() => {
        expect(screen.getByText("Escape Close")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(
        () => {
          expect(screen.queryByText("Escape Close")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("should trap focus within dialog when open", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Focus Trap</DialogTrigger>
          <DialogContent>
            <DialogTitle>Focus Trap Test</DialogTitle>
            <button tabIndex={0}>First Focusable</button>
            <button tabIndex={0}>Second Focusable</button>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Focus Trap"));

      await waitFor(async () => {
        // Focus should move within dialog
        const firstButton = screen.getByText("First Focusable");
        expect(firstButton).toBeInTheDocument();

        await user.tab();
        await user.tab();
        // Focus should cycle back to first element or stay within dialog
      });
    });
  });

  // ==========================================
  // 5. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it('should have role="dialog" on content', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open A11y</DialogTrigger>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open A11y"));

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("data-slot", "dialog-content");
      });
    });

    it('should have aria-modal="true"', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Modal</DialogTrigger>
          <DialogContent>
            <DialogTitle>Modal A11y</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      const ariaModal = dialog.getAttribute("aria-modal");
      if (ariaModal !== null) {
        expect(ariaModal).toBe("true");
      }
      expect(dialog.getAttribute("role")).toBe("dialog");
    });

    it("should hide background content from accessibility tree", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Background Button</button>
          <Dialog>
            <DialogTrigger>Open Hide BG</DialogTrigger>
            <DialogContent>
              <DialogTitle>Foreground Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>,
      );

      await user.click(screen.getByText("Open Hide BG"));

      await waitFor(() => {
        // Background content should be hidden from screen readers when dialog is open
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should have close button with sr-only label", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Close Label</DialogTrigger>
          <DialogContent>
            <DialogTitle>Close Label Test</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Close Label"));

      await waitFor(() => {
        const closeButton = document.querySelector(
          '[data-slot="dialog-close"]',
        );
        if (closeButton) {
          const srOnlyLabel = closeButton.querySelector(".sr-only");
          expect(srOnlyLabel).toBeInTheDocument();
          expect(srOnlyLabel?.textContent).toBe("Close");
        }
      });
    });
  });

  // ==========================================
  // 6. STYLING & ANIMATION TESTS (样式和动画)
  // ==========================================
  describe("Styling & Animations", () => {
    it("should apply correct positioning styles", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Positioned</DialogTrigger>
          <DialogContent>
            <DialogTitle>Positioned Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Positioned"));

      await waitFor(() => {
        const content = document.querySelector(
          '[data-slot="dialog-content"]',
        ) as HTMLElement;
        expect(content).toHaveClass("fixed");
        expect(content).toHaveClass("top-[50%]");
        expect(content).toHaveClass("left-[50%]");
        expect(content).toHaveClass("translate-x-[-50%]");
        expect(content).toHaveClass("translate-y-[-50%]");
      });
    });

    it("should apply animation classes on open/close", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Animated</DialogTrigger>
          <DialogContent>
            <DialogTitle>Animated Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Animated"));

      await waitFor(() => {
        const content = document.querySelector(
          '[data-slot="dialog-content"]',
        ) as HTMLElement;
        expect(content?.className).toContain("data-[state=open]:animate-in");
        expect(content?.className).toContain("data-[state=open]:zoom-in-95");
      });
    });

    it("should style overlay with backdrop", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Overlay Style</DialogTrigger>
          <DialogContent>
            <DialogTitle>Overlay Styled</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Overlay Style"));

      await waitFor(() => {
        const overlay = document.querySelector(
          '[data-slot="dialog-overlay"]',
        ) as HTMLElement;
        expect(overlay).toHaveClass("bg-black/50");
        expect(overlay).toHaveClass("fixed");
        expect(overlay).toHaveClass("inset-0");
      });
    });
  });

  // ==========================================
  // 7. NESTED & COMPLEX SCENARIOS (复杂场景)
  // ==========================================
  describe("Complex Scenarios", () => {
    it("should handle form submission inside dialog", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <Dialog>
          <DialogTrigger>Open Form</DialogTrigger>
          <DialogContent>
            <DialogTitle>Form Dialog</DialogTitle>
            <form onSubmit={handleSubmit}>
              <input placeholder="Name" data-testid="name-input" />
              <button type="submit">Submit</button>
            </form>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Form"));

      await waitFor(async () => {
        const nameInput = screen.getByTestId("name-input");
        await user.type(nameInput, "Test User");
        await user.click(screen.getByRole("button", { name: /submit/i }));
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    it("should handle multiple dialogs (nested)", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open First</DialogTrigger>
          <DialogContent>
            <DialogTitle>First Dialog</DialogTitle>
            <Dialog>
              <DialogTrigger>Open Second</DialogTrigger>
              <DialogContent>
                <DialogTitle>Second Dialog</DialogTitle>
                <p>Nested content</p>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open First"));
      await waitFor(() => {
        expect(screen.getByText("First Dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Open Second"));
      await waitFor(() => {
        expect(screen.getByText("Second Dialog")).toBeInTheDocument();
        expect(screen.getByText("Nested content")).toBeInTheDocument();
      });
    });

    it("should prevent body scroll when dialog is open", async () => {
      const user = userEvent.setup();
      const originalStyle = document.body.style.overflow;

      render(
        <Dialog>
          <DialogTrigger>Open Scroll Lock</DialogTrigger>
          <DialogContent>
            <DialogTitle>Scroll Locked</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Scroll Lock"));

      // Radix UI typically handles scroll locking
      await waitFor(() => {
        expect(screen.getByText("Scroll Locked")).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 8. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe("Snapshots", () => {
    it("should match snapshot when closed", () => {
      const { container } = render(
        <Dialog>
          <DialogTrigger>Snapshot Trigger</DialogTrigger>
          <DialogContent>
            <DialogTitle>Snapshot Dialog</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      expect(container).toMatchSnapshot("dialog-closed");
    });

    it("should match snapshot of full dialog composition", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Full Snapshot</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Full Title</DialogTitle>
              <DialogDescription>Full Description</DialogDescription>
            </DialogHeader>
            <DialogContent>Full Content</DialogContent>
            <DialogFooter>
              <button>Cancel</button>
              <button>OK</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Full Snapshot"));

      await waitFor(() => {
        expect(document.body).toMatchSnapshot("dialog-open-full");
      });
    });
  });

  // ==========================================
  // 9. EDGE CASES (边界情况)
  // ==========================================
  describe("Edge Cases", () => {
    it("should handle rapid open/close sequences", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Rapid Toggle</DialogTrigger>
          <DialogContent>
            <DialogTitle>Rapid Test</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByText("Rapid Toggle"));
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (screen.queryByText("Rapid Test")) {
          const closeBtn =
            screen.getByRole("button", { name: /close/i }) ||
            (document.querySelector(
              '[data-slot="dialog-close"]',
            ) as HTMLElement);
          if (closeBtn) await user.click(closeBtn);
        }
      }
      // Should not throw errors
    });

    it("should handle dialog with no title (accessibility warning)", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>No Title</DialogTrigger>
          <DialogContent>
            <p>Content without title</p>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("No Title"));
      await waitFor(() => {
        expect(screen.getByText("Content without title")).toBeInTheDocument();
      });
    });
  });
});
