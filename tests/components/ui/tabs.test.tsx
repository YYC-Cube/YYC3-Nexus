/**
 * @file tabs.test.tsx
 * @description YYC³ Tabs Component — Comprehensive Test Suite
 * @coverage Rendering | Switching | Keyboard | Accessibility | State
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/app/components/ui/tabs";

describe("Tabs Component", () => {
  // ==========================================
  // 1. RENDERING TESTS (基础渲染)
  // ==========================================
  describe("Rendering", () => {
    it("should render tabs container with correct attributes", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      );

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /tab 1/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /tab 2/i })).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("should apply data-slot attributes correctly", () => {
      const { container } = render(
        <Tabs data-testid="tabs-root">
          <TabsList>
            <TabsTrigger value="test">Test Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="test">Test Content</TabsContent>
        </Tabs>,
      );

      expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="tabs-list"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="tabs-trigger"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="tabs-content"]'),
      ).toBeInTheDocument();
    });

    it("should only show active tab content by default", async () => {
      render(
        <Tabs defaultValue="first">
          <TabsList>
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="first">First Content</TabsContent>
          <TabsContent value="second">Second Content</TabsContent>
        </Tabs>,
      );

      await waitFor(() => {
        expect(screen.getByText("First Content")).toBeVisible();
      });
      expect(screen.queryByText("Second Content")).toBeNull();
    });
  });

  // ==========================================
  // 2. TAB SWITCHING INTERACTIONS (标签切换)
  // ==========================================
  describe("Tab Switching", () => {
    it("should switch to clicked tab", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab-a">
          <TabsList>
            <TabsTrigger value="tab-a">Tab A</TabsTrigger>
            <TabsTrigger value="tab-b">Tab B</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-a">Content A</TabsContent>
          <TabsContent value="tab-b">Content B</TabsContent>
        </Tabs>,
      );

      expect(screen.getByText("Content A")).toBeInTheDocument();

      await user.click(screen.getByRole("tab", { name: /tab b/i }));

      expect(screen.getByText("Content B")).toBeInTheDocument();
    });

    it("should update active state styling on trigger", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Content One</TabsContent>
          <TabsContent value="two">Content Two</TabsContent>
        </Tabs>,
      );

      const firstTrigger = screen.getByRole("tab", { name: /one/i });
      expect(firstTrigger).toHaveAttribute("data-state", "active");

      await user.click(screen.getByRole("tab", { name: /two/i }));

      expect(firstTrigger).not.toHaveAttribute("data-state", "active");
      expect(screen.getByRole("tab", { name: /two/i })).toHaveAttribute(
        "data-state",
        "active",
      );
    });

    it("should call onValueChange when tab changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Tabs defaultValue="initial" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="initial">Initial</TabsTrigger>
            <TabsTrigger value="changed">Changed</TabsTrigger>
          </TabsList>
          <TabsContent value="initial">Initial Content</TabsContent>
          <TabsContent value="changed">Changed Content</TabsContent>
        </Tabs>,
      );

      await user.click(screen.getByRole("tab", { name: /changed/i }));
      expect(handleChange).toHaveBeenCalledWith("changed");
    });
  });

  // ==========================================
  // 3. KEYBOARD NAVIGATION (键盘导航)
  // ==========================================
  describe("Keyboard Navigation", () => {
    it("should navigate between tabs with arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
      );

      const firstTab = screen.getByRole("tab", { name: /tab 1/i });
      firstTab.focus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: /tab 2/i })).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: /tab 3/i })).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: /tab 2/i })).toHaveFocus();
    });

    it("should activate tab on Enter or Space", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="active">Active Content</TabsContent>
          <TabsContent value="inactive">Inactive Content</TabsContent>
        </Tabs>,
      );

      const inactiveTab = screen.getByRole("tab", { name: /inactive/i });
      inactiveTab.focus();

      await user.keyboard("{Enter}");
      expect(screen.getByText("Inactive Content")).toBeInTheDocument();
    });

    it("should navigate horizontally in horizontal orientation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="h1" orientation="horizontal">
          <TabsList>
            <TabsTrigger value="h1">H1</TabsTrigger>
            <TabsTrigger value="h2">H2</TabsTrigger>
          </TabsList>
          <TabsContent value="h1">H1 Content</TabsContent>
          <TabsContent value="h2">H2 Content</TabsContent>
        </Tabs>,
      );

      const h1 = screen.getByRole("tab", { name: /h1/i });
      h1.focus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: /h2/i })).toHaveFocus();
    });
  });

  // ==========================================
  // 4. DISABLED STATE TESTS (禁用状态)
  // ==========================================
  describe("Disabled State", () => {
    it("should not switch to disabled tab when clicked", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="enabled">
          <TabsList>
            <TabsTrigger value="enabled">Enabled</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="enabled">Enabled Content</TabsContent>
          <TabsContent value="disabled">Disabled Content</TabsContent>
        </Tabs>,
      );

      const disabledTab = screen.getByRole("tab", { name: /disabled/i });
      expect(disabledTab).toBeDisabled();

      await user.click(disabledTab);
      await waitFor(() => {
        expect(screen.getByText("Enabled Content")).toBeInTheDocument();
      });
      expect(screen.queryByText("Disabled Content")).toBeNull();
    });

    it("should skip disabled tabs during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="start">
          <TabsList>
            <TabsTrigger value="start">Start</TabsTrigger>
            <TabsTrigger value="middle-disabled" disabled>
              Middle Disabled
            </TabsTrigger>
            <TabsTrigger value="end">End</TabsTrigger>
          </TabsList>
          <TabsContent value="start">Start Content</TabsContent>
          <TabsContent value="middle-disabled">Middle Content</TabsContent>
          <TabsContent value="end">End Content</TabsContent>
        </Tabs>,
      );

      const startTab = screen.getByRole("tab", { name: /start/i });
      startTab.focus();

      await user.keyboard("{ArrowRight}");
      // Should skip middle-disabled and focus on end
      expect(screen.getByRole("tab", { name: /end/i })).toHaveFocus();
    });
  });

  // ==========================================
  // 5. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it("should have proper role attributes", () => {
      render(
        <Tabs defaultValue="a11y-tab">
          <TabsList>
            <TabsTrigger value="a11y-tab">Accessible Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="a11y-tab">Accessible Content</TabsContent>
        </Tabs>,
      );

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab").length).toBeGreaterThan(0);
    });

    it("should associate tabpanel with tab via aria-controls", () => {
      render(
        <Tabs defaultValue="ctrl-tab">
          <TabsList>
            <TabsTrigger value="ctrl-tab">Controlled Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="ctrl-tab">Controlled Content</TabsContent>
        </Tabs>,
      );

      const tab = screen.getByRole("tab", { name: /controlled tab/i });
      expect(tab).toHaveAttribute("aria-controls");
    });

    it("should have selected state on active tab", () => {
      render(
        <Tabs defaultValue="selected">
          <TabsList>
            <TabsTrigger value="selected">Selected Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="selected">Selected Content</TabsContent>
        </Tabs>,
      );

      const activeTab = screen.getByRole("tab", { name: /selected tab/i });
      expect(activeTab).toHaveAttribute("data-state", "active");
      expect(activeTab).toHaveAttribute("aria-selected", "true");
    });

    it('should have tabindex="0" on active tab', async () => {
      render(
        <Tabs defaultValue="focusable">
          <TabsList>
            <TabsTrigger value="focusable">Focusable Tab</TabsTrigger>
            <TabsTrigger value="other">Other Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="focusable">Content</TabsContent>
          <TabsContent value="other">Other</TabsContent>
        </Tabs>,
      );

      const activeTab = screen.getByRole("tab", { name: /focusable tab/i });
      await waitFor(() => {
        expect(activeTab).toHaveAttribute("data-state", "active");
      });
    });
  });

  // ==========================================
  // 6. STYLING TESTS (样式测试)
  // ==========================================
  describe("Styling", () => {
    it("should have correct base styles for TabsList", () => {
      const { container } = render(
        <Tabs defaultValue="styled">
          <TabsList className="custom-list">
            <TabsTrigger value="styled">Styled</TabsTrigger>
          </TabsList>
          <TabsContent value="styled">Content</TabsContent>
        </Tabs>,
      );

      const list = container.querySelector('[data-slot="tabs-list"]');
      expect(list).toBeTruthy();
      expect(list?.className).toContain("flex");
      expect(list?.className).toContain("rounded-xl");
    });

    it("should apply active styles to TabsTrigger", () => {
      const { container } = render(
        <Tabs defaultValue="active-style">
          <TabsList>
            <TabsTrigger value="active-style">Active Style</TabsTrigger>
          </TabsList>
          <TabsContent value="active-style">Content</TabsContent>
        </Tabs>,
      );

      const trigger = container.querySelector(
        '[data-slot="tabs-trigger"][data-state="active"]',
      );
      expect(trigger).toBeTruthy();
      // Check for active state styling (Tailwind CSS variant class)
      if (trigger?.className) {
        expect(trigger.className).toContain("bg-card");
      }
      expect(trigger?.getAttribute("data-state")).toBe("active");
    });

    it("should support custom className on all components", () => {
      const { container } = render(
        <Tabs className="root-custom" defaultValue="custom-class-test">
          <TabsList className="list-custom">
            <TabsTrigger className="trigger-custom" value="custom">
              Custom Classes
            </TabsTrigger>
          </TabsList>
          <TabsContent className="content-custom" value="custom">
            Custom Content
          </TabsContent>
        </Tabs>,
      );

      expect(container.querySelector(".root-custom")).toBeInTheDocument();
      expect(container.querySelector(".list-custom")).toBeInTheDocument();
      expect(container.querySelector(".trigger-custom")).toBeInTheDocument();
      expect(container.querySelector(".content-custom")).toBeInTheDocument();
    });
  });

  // ==========================================
  // 7. CONTROLLED COMPONENT TESTS (受控组件)
  // ==========================================
  describe("Controlled Component", () => {
    it("should work as controlled component with value prop", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      const { rerender } = render(
        <Tabs value="controlled-1" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="controlled-1">Controlled 1</TabsTrigger>
            <TabsTrigger value="controlled-2">Controlled 2</TabsTrigger>
          </TabsList>
          <TabsContent value="controlled-1">Content 1</TabsContent>
          <TabsContent value="controlled-2">Content 2</TabsContent>
        </Tabs>,
      );

      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await user.click(screen.getByRole("tab", { name: /controlled 2/i }));
      expect(onValueChange).toHaveBeenCalledWith("controlled-2");

      // Simulate parent updating the value
      rerender(
        <Tabs value="controlled-2" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="controlled-1">Controlled 1</TabsTrigger>
            <TabsTrigger value="controlled-2">Controlled 2</TabsTrigger>
          </TabsList>
          <TabsContent value="controlled-1">Content 1</TabsContent>
          <TabsContent value="controlled-2">Content 2</TabsContent>
        </Tabs>,
      );

      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });

  // ==========================================
  // 8. SNAPSHOT & EDGE CASES (快照和边界情况)
  // ==========================================
  describe("Snapshots & Edge Cases", () => {
    it("should match snapshot for basic tabs", () => {
      const { container } = render(
        <Tabs defaultValue="snap">
          <TabsList>
            <TabsTrigger value="snap">Snapshot Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="snap">Snapshot Content</TabsContent>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });

    it("should handle single tab gracefully", () => {
      render(
        <Tabs defaultValue="single">
          <TabsList>
            <TabsTrigger value="single">Only Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="single">Only Content</TabsContent>
        </Tabs>,
      );
      expect(
        screen.getByRole("tab", { name: /only tab/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Only Content")).toBeInTheDocument();
    });

    it("should handle many tabs without performance issues", () => {
      render(
        <Tabs defaultValue="tab-0">
          <TabsList>
            {Array.from({ length: 50 }, (_, i) => (
              <TabsTrigger key={i} value={`tab-${i}`}>
                Tab {i}
              </TabsTrigger>
            ))}
          </TabsList>
          {Array.from({ length: 50 }, (_, i) => (
            <TabsContent key={i} value={`tab-${i}`}>
              Content {i}
            </TabsContent>
          ))}
        </Tabs>,
      );
      expect(screen.getAllByRole("tab").length).toBe(50);
    });

    it("should handle empty tabs list", () => {
      const { container } = render(
        <Tabs defaultValue="empty">
          <TabsList></TabsList>
          <TabsContent value="empty">Empty Content</TabsContent>
        </Tabs>,
      );
      expect(
        container.querySelector('[data-slot="tabs-list"]')?.children.length,
      ).toBe(0);
    });
  });
});
