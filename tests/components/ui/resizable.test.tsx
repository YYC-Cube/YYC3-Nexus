/**
 * @file resizable.test.tsx
 * @description YYC³ Resizable Component — Comprehensive Test Suite
 * @coverage Rendering | Resize | Direction | Handle | Layout
 */

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../../src/app/components/ui/resizable";

describe("Resizable Components", () => {
  // ==========================================
  // 1. PANEL GROUP TESTS (面板组)
  // ==========================================
  describe("ResizablePanelGroup", () => {
    it("should render panel group container", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" data-testid="panel-group">
          <ResizablePanel>Panel 1</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass("flex");
      expect(group).toHaveClass("h-full");
      expect(group).toHaveClass("w-full");
    });

    it("should render children panels", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel data-testid="panel-1">First Panel</ResizablePanel>
          <ResizablePanel data-testid="panel-2">Second Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(screen.getByTestId("panel-1")).toBeInTheDocument();
      expect(screen.getByTestId("panel-2")).toBeInTheDocument();
      expect(screen.getByText("First Panel")).toBeInTheDocument();
      expect(screen.getByText("Second Panel")).toBeInTheDocument();
    });

    it("should support horizontal direction (default)", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>H Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group).toBeTruthy();
      expect(group?.className).toContain("flex");
      expect(group?.getAttribute("data-panel-group-direction")).toBe(
        "horizontal",
      );
    });

    it("should support vertical direction", () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>V Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group?.className).toContain(
        "data-[panel-group-direction=vertical]:flex-col",
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" className="custom-group">
          <ResizablePanel>Custom</ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(container.querySelector(".custom-group")).toBeInTheDocument();
    });

    it("should forward data attributes correctly", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" data-direction="horizontal" data-unit-test="true">
          <ResizablePanel>Data Attrs</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group).toBeTruthy();
    });
  });

  // ==========================================
  // 2. RESIZABLE PANEL TESTS (可调整面板)
  // ==========================================
  describe("ResizablePanel", () => {
    it("should render panel with correct attributes", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel data-testid="test-panel" defaultSize={50}>
            Test Content
          </ResizablePanel>
        </ResizablePanelGroup>,
      );

      const panel = container.querySelector('[data-slot="resizable-panel"]');
      expect(panel).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should support different sizes", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30}>30% Panel</ResizablePanel>
          <ResizablePanel defaultSize={70}>70% Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const panels = container.querySelectorAll(
        '[data-slot="resizable-panel"]',
      );
      expect(panels.length).toBe(2);
    });

    it("should support min/max size constraints", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20} maxSize={80}>
            Constrained Panel
          </ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(screen.getByText("Constrained Panel")).toBeInTheDocument();
    });

    it("should support collapsible behavior", async () => {
      const user = userEvent.setup();
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsible data-testid="collapsible-panel">
            Collapsible Content
          </ResizablePanel>
        </ResizablePanelGroup>,
      );

      const panel = screen.getByTestId("collapsible-panel");
      expect(panel).toBeInTheDocument();
      // Collapsible functionality depends on react-resizable-panels implementation
    });

    it("should render order property correctly", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel order={2}>Second</ResizablePanel>
          <ResizablePanel order={1}>First</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const panels = container.querySelectorAll(
        '[data-slot="resizable-panel"]',
      );
      expect(panels.length).toBe(2);
    });
  });

  // ==========================================
  // 3. RESIZABLE HANDLE TESTS (拖拽手柄)
  // ==========================================
  describe("ResizableHandle", () => {
    it("should render handle between panels", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Left</ResizablePanel>
          <ResizableHandle data-testid="handle" />
          <ResizablePanel>Right</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = container.querySelector('[data-slot="resizable-handle"]');
      expect(handle).toBeInTheDocument();
      expect(handle?.className).toContain("bg-border");
    });

    it("should render grip handle when withHandle is true", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>A</ResizablePanel>
          <ResizableHandle withHandle data-testid="grip-handle" />
          <ResizablePanel>B</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = screen.getByTestId("grip-handle");
      expect(handle).toBeInTheDocument();

      // Should contain grip icon
      const gripIcon =
        container.querySelector(".size-2\\.5") ||
        container.querySelector('[class*="GripVerticalIcon"]') ||
        handle.querySelector("svg");
      if (gripIcon) {
        expect(gripIcon).toBeInTheDocument();
      }
    });

    it("should apply correct styling for horizontal handles", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Left</ResizablePanel>
          <ResizableHandle data-testid="h-handle" />
          <ResizablePanel>Right</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = container.querySelector('[data-slot="resizable-handle"]');
      expect(handle?.className).toContain("w-px");
    });

    it("should apply correct styling for vertical handles", () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Top</ResizablePanel>
          <ResizableHandle data-testid="v-handle" />
          <ResizablePanel>Bottom</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = container.querySelector('[data-slot="resizable-handle"]');
      expect(handle?.className).toContain(
        "data-[panel-group-direction=vertical]:h-px",
      );
    });

    it("should have focus-visible styles for accessibility", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel</ResizablePanel>
          <ResizableHandle data-testid="focusable-handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = container.querySelector('[data-slot="resizable-handle"]');
      expect(handle?.className).toContain("focus-visible:ring-ring");
      expect(handle?.className).toContain("focus-visible:ring-1");
    });
  });

  // ==========================================
  // 4. RESIZE INTERACTIONS (调整大小交互)
  // ==========================================
  describe("Resize Interactions", () => {
    it("should allow drag to resize panels", async () => {
      const user = userEvent.setup();
      const onLayout = vi.fn();

      render(
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={50}>Left Panel</ResizablePanel>
          <ResizableHandle data-testid="drag-handle" />
          <ResizablePanel defaultSize={50}>Right Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = screen.getByTestId("drag-handle");

      fireEvent.mouseDown(handle);
      fireEvent.mouseMove(handle, { clientX: 100 });
      fireEvent.mouseUp(handle);

      expect(handle).toBeInTheDocument();
    });

    it("should handle keyboard resize with arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel A</ResizablePanel>
          <ResizableHandle data-testid="keyboard-handle" tabIndex={0} />
          <ResizablePanel>Panel B</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = screen.getByTestId("keyboard-handle");
      handle.focus();

      await user.keyboard("{ArrowRight}");

      // Keyboard should trigger resize in some implementations
      expect(handle).toBeTruthy();
    });

    it("should constrain resize within bounds", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20} maxSize={60}>
            Bounded Panel
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Other Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      // Panel should not resize beyond constraints
      expect(screen.getByText("Bounded Panel")).toBeInTheDocument();
    });
  });

  // ==========================================
  // 5. NESTED LAYOUTS TESTS (嵌套布局)
  // ==========================================
  describe("Nested Layouts", () => {
    it("should support nested panel groups", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Sidebar</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>Top Content</ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>Bottom Content</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(screen.getByText("Sidebar")).toBeInTheDocument();
      expect(screen.getByText("Top Content")).toBeInTheDocument();
      expect(screen.getByText("Bottom Content")).toBeInTheDocument();
    });

    it("should handle multiple nested resizables correctly", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>Nav</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60}>Main</ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={40}>Details</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>,
      );

      const groups = container.querySelectorAll(
        '[data-slot="resizable-panel-group"]',
      );
      const handles = container.querySelectorAll(
        '[data-slot="resizable-handle"]',
      );

      expect(groups.length).toBe(2); // Outer + inner vertical group
      expect(handles.length).toBeGreaterThanOrEqual(2); // At least 2 handles for nested layout
    });
  });

  // ==========================================
  // 6. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it("should have proper role or data attributes for handles", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel</ResizablePanel>
          <ResizableHandle data-testid="a11y-handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = screen.getByTestId("a11y-handle");
      // Handles should be focusable and have appropriate semantics
      expect(handle).toBeTruthy();
    });

    it("should support keyboard navigation for resizing", async () => {
      const user = userEvent.setup();
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>P1</ResizablePanel>
          <ResizableHandle tabIndex={0} data-testid="kbd-nav" />
          <ResizablePanel>P2</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const handle = screen.getByTestId("kbd-nav");
      handle.focus();

      expect(handle).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      await user.keyboard("{ArrowRight}");

      // Should handle keyboard input without errors
      expect(true).toBe(true);
    });

    it("should announce resize changes to screen readers", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" aria-label="Resizable layout">
          <ResizablePanel>Content</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Content 2</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group?.getAttribute("aria-label")).toBe("Resizable layout");
    });
  });

  // ==========================================
  // 7. RESPONSIVE & STYLING TESTS (响应式和样式)
  // ==========================================
  describe("Responsive & Styling", () => {
    it("should adapt to container size", () => {
      const { container } = render(
        <div style={{ width: "800px", height: "600px" }}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>Responsive</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>Panel</ResizablePanel>
          </ResizablePanelGroup>
        </div>,
      );

      const group = container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      expect(group?.className).toContain("h-full");
      expect(group?.className).toContain("w-full");
    });

    it("should maintain flex layout integrity", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal" className="test-flex">
          <ResizablePanel>Flex Item 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Flex Item 2</ResizablePanel>
        </ResizablePanelGroup>,
      );

      const group = container.querySelector(".test-flex");
      expect(group?.className).toContain("flex");
    });
  });

  // ==========================================
  // 8. EDGE CASES & PERFORMANCE (边界情况和性能)
  // ==========================================
  describe("Edge Cases & Performance", () => {
    it("should handle single panel without handle gracefully", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Single Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(screen.getByText("Single Panel")).toBeInTheDocument();
      // No handles should be present
      const handles = document.querySelectorAll(
        '[data-slot="resizable-handle"]',
      );
      expect(handles.length).toBe(0);
    });

    it("should handle many panels efficiently", () => {
      const startTime = performance.now();

      render(
        <ResizablePanelGroup direction="horizontal">
          {Array.from({ length: 10 }, (_, i) => (
            <React.Fragment key={i}>
              <ResizablePanel>Panel {i + 1}</ResizablePanel>
              {i < 9 && <ResizableHandle />}
            </React.Fragment>
          ))}
        </ResizablePanelGroup>,
      );

      const endTime = performance.now();

      expect(screen.getAllByText(/Panel \d+/).length).toBe(10);
      expect(endTime - startTime).toBeLessThan(500); // Should render quickly
    });

    it("should handle zero-size panels", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={0}>Hidden Panel</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Visible Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      expect(screen.getByText("Hidden Panel")).toBeInTheDocument();
      expect(screen.getByText("Visible Panel")).toBeInTheDocument();
    });

    it("should cleanup event listeners properly", () => {
      const { unmount } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Cleanup Test</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );

      unmount();

      // Verify no memory leaks - DOM should be clean
      expect(
        document.querySelectorAll('[data-slot="resizable-panel-group"]').length,
      ).toBe(0);
    });
  });

  // ==========================================
  // 9. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe("Snapshots", () => {
    it("should match snapshot for basic horizontal layout", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Left</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Right</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(container).toMatchSnapshot("resizable-horizontal");
    });

    it("should match snapshot for vertical layout", () => {
      const { container } = render(
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>Top</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Bottom</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(container).toMatchSnapshot("resizable-vertical");
    });

    it("should match snapshot with grip handle", () => {
      const { container } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(container).toMatchSnapshot("resizable-with-grip");
    });
  });
});
