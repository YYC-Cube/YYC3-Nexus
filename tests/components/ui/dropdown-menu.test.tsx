/**
 * @file dropdown-menu.test.tsx
 * @description YYC³ DropdownMenu Component — Comprehensive Test Suite
 * @coverage Rendering | Trigger | Items | Keyboard | Submenus | Accessibility
 */

import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from "../../../src/app/components/ui/dropdown-menu";

describe("DropdownMenu Component", () => {
  // ==========================================
  // 1. BASIC RENDERING (基础渲染)
  // ==========================================
  describe("Basic Rendering", () => {
    it("should render trigger button correctly", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(
        screen.getByRole("button", { name: /open menu/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Open Menu")).toHaveAttribute(
        "data-slot",
        "dropdown-menu-trigger",
      );
    });

    it("should not show menu items by default", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Hidden Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.queryByText("Hidden Item")).not.toBeInTheDocument();
    });

    it("should apply data-slot attributes to all parts", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Label</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>Grouped Item</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(
        container.querySelector('[data-slot="dropdown-menu-trigger"]'),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /test/i }));

      await waitFor(() => {
        expect(
          document.querySelector('[data-slot="dropdown-menu-content"]'),
        ).toBeInTheDocument();
        expect(
          document.querySelector('[data-slot="dropdown-menu-item"]'),
        ).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 2. OPEN/CLOSE INTERACTIONS (打开/关闭交互)
  // ==========================================
  describe("Open/Close Interactions", () => {
    it("should open menu when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Click to Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option A</DropdownMenuItem>
            <DropdownMenuItem>Option B</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /click to open/i }));

      await waitFor(() => {
        expect(screen.getByText("Option A")).toBeInTheDocument();
        expect(screen.getByText("Option B")).toBeInTheDocument();
      });
    });

    it("should close menu when item is selected", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Select Item</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => {}}>
              Selectable Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /select item/i }));

      await waitFor(async () => {
        const item = screen.getByText("Selectable Item");
        await user.click(item);

        await waitFor(
          () => {
            expect(
              screen.queryByText("Selectable Item"),
            ).not.toBeInTheDocument();
          },
          { timeout: 1000 },
        );
      });
    });

    it("should close menu when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <>
          <div data-testid="outside" style={{ pointerEvents: "auto" }}>
            Outside Element
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>Open Then Click Outside</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Menu Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>,
      );

      await user.click(
        screen.getByRole("button", { name: /open then click outside/i }),
      );

      await waitFor(() => {
        expect(screen.getByText("Menu Item")).toBeInTheDocument();
      });

      await fireEvent.pointerDown(screen.getByTestId("outside"));

      await waitFor(
        () => {
          expect(screen.queryByText("Menu Item")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("should close menu on Escape key press", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Escape Close</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Escape Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /escape close/i }));

      await waitFor(() => {
        expect(screen.getByText("Escape Item")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(
        () => {
          expect(screen.queryByText("Escape Item")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });
  });

  // ==========================================
  // 3. MENU ITEMS INTERACTIONS (菜单项交互)
  // ==========================================
  describe("Menu Items Interactions", () => {
    it("should call onSelect when item is clicked", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Items Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleSelect}>
              Clickable Item
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSelect}>
              Another Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /items test/i }));

      await waitFor(async () => {
        await user.click(screen.getByText("Clickable Item"));
        expect(handleSelect).toHaveBeenCalledTimes(1);
      });
    });

    it("should render destructive variant item", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Destructive Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">
              Delete Action
            </DropdownMenuItem>
            <DropdownMenuItem>Normal Action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(
        screen.getByRole("button", { name: /destructive test/i }),
      );

      await waitFor(() => {
        const destructiveItem = document.querySelector(
          '[data-variant="destructive"]',
        );
        expect(destructiveItem).toBeInTheDocument();
        expect(destructiveItem?.textContent).toContain("Delete Action");
      });
    });

    it("should render inset items with additional left padding", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Inset Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
            <DropdownMenuItem>Normal Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /inset test/i }));

      await waitFor(() => {
        const insetItem = document.querySelector('[data-inset="true"]');
        expect(insetItem).toBeInTheDocument();
        expect(insetItem?.className).toContain("data-[inset]:pl-8");
      });
    });

    it("should support disabled menu items", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Disabled Item Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={handleSelect}>
              Disabled Option
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSelect}>
              Enabled Option
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(
        screen.getByRole("button", { name: /disabled item test/i }),
      );

      await waitFor(async () => {
        const disabledItem = screen.getByText("Disabled Option");
        expect(disabledItem).toHaveAttribute("aria-disabled", "true");

        await user.click(disabledItem);
        expect(handleSelect).not.toHaveBeenCalled();
      });
    });
  });

  // ==========================================
  // 4. CHECKBOX ITEMS (复选框项目)
  // ==========================================
  describe("Checkbox Items", () => {
    it("should render checkbox item with correct role and attributes", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Checkbox Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              onSelect={(e: Event) => e.preventDefault()}
            >
              Toggle Feature
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /checkbox menu/i }));

      await waitFor(() => {
        const checkboxItem = screen.getByRole("menuitemcheckbox", {
          name: /toggle feature/i,
        });
        expect(checkboxItem).toBeInTheDocument();
        expect(checkboxItem).toHaveAttribute("data-state", "unchecked");
      });
    });

    it("should support default checked state", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Default Checked</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked
              onCheckedChange={() => {}}
              onSelect={(e: Event) => e.preventDefault()}
            >
              Pre-checked
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(
        screen.getByRole("button", { name: /default checked/i }),
      );

      await waitFor(() => {
        const checkboxItem = screen.getByRole("menuitemcheckbox", {
          name: /pre-checked/i,
        });
        expect(checkboxItem).toHaveAttribute("data-state", "checked");
      });
    });
  });

  // ==========================================
  // 5. SEPARATOR & LABEL (分隔符和标签)
  // ==========================================
  describe("Separators & Labels", () => {
    it("should render separator between groups", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>With Separator</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item Above</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item Below</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /with separator/i }));

      await waitFor(() => {
        const separator = document.querySelector('[role="separator"]');
        expect(separator).toBeInTheDocument();
      });
    });

    it("should render non-interactive label", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>With Label</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section Title</DropdownMenuLabel>
            <DropdownMenuItem>Section Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /with label/i }));

      await waitFor(() => {
        expect(screen.getByText("Section Title")).toBeInTheDocument();
        expect(screen.getByText("Section Item")).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 6. KEYBOARD NAVIGATION (键盘导航)
  // ==========================================
  describe("Keyboard Navigation", () => {
    it("should navigate items with arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Keyboard Nav</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>First</DropdownMenuItem>
            <DropdownMenuItem>Second</DropdownMenuItem>
            <DropdownMenuItem>Third</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /keyboard nav/i }));

      await waitFor(async () => {
        await user.keyboard("{ArrowDown}");
        // First item should be focused/highlighted
        await user.keyboard("{ArrowDown}");
        // Second item
        await user.keyboard("{ArrowUp}");
        // Back to first
      });
    });

    it("should activate item on Enter key", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Enter Key</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleSelect}>
              Enter Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /enter key/i }));

      await waitFor(async () => {
        await user.keyboard("{ArrowDown}{Enter}");
        expect(handleSelect).toHaveBeenCalled();
      });
    });
  });

  // ==========================================
  // 7. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it('should have haspopup="true" on trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>A11y Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole("button", { name: /a11y trigger/i });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("should have expanded state when open", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Expanded Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole("button", { name: /expanded test/i });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should have menu role on content", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu Role</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu Role Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /menu role/i }));

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should have menuitem role on items", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menuitem Role</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Regular Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /menuitem role/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: /regular item/i }),
        ).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 8. POSITIONING & ANIMATION (定位和动画)
  // ==========================================
  describe("Positioning & Animation", () => {
    it("should position content relative to trigger", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Position Test</DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem>Positioned Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /position test/i }));

      await waitFor(() => {
        const content = document.querySelector(
          '[data-slot="dropdown-menu-content"]',
        ) as HTMLElement;
        expect(content).toBeInTheDocument();
        expect(content.className).toContain("z-50");
      });
    });

    it("should apply animation classes", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Animation Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Animated Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /animation test/i }));

      await waitFor(() => {
        const content = document.querySelector(
          '[data-slot="dropdown-menu-content"]',
        ) as HTMLElement;
        expect(content?.className).toContain("data-[state=open]:animate-in");
        expect(content?.className).toContain("data-[state=open]:zoom-in-95");
      });
    });
  });

  // ==========================================
  // 9. EDGE CASES & COMPLEX SCENARIOS (复杂场景)
  // ==========================================
  describe("Edge Cases & Complex Scenarios", () => {
    it("should handle rapid open/close sequences", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Rapid Toggle</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rapid Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByRole("button", { name: /rapid toggle/i }));
        await waitFor(() => {
          expect(screen.getByText("Rapid Item")).toBeInTheDocument();
        });
        await user.keyboard("{Escape}");
        await waitFor(() => {
          expect(screen.queryByText("Rapid Item")).not.toBeInTheDocument();
        });
      }
    });

    it("should handle nested dropdowns (submenus)", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Nested Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Parent Item</DropdownMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem>Submenu Trigger</DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Submenu Item</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /nested menu/i }));

      await waitFor(() => {
        expect(screen.getByText("Parent Item")).toBeInTheDocument();
        expect(screen.getByText("Submenu Trigger")).toBeInTheDocument();
      });
    });

    it("should handle empty dropdown content", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Empty Menu</DropdownMenuTrigger>
          <DropdownMenuContent></DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole("button", { name: /empty menu/i }));

      await waitFor(() => {
        const content = document.querySelector(
          '[data-slot="dropdown-menu-content"]',
        );
        expect(content?.children.length).toBe(0);
      });
    });
  });

  // ==========================================
  // 10. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe("Snapshots", () => {
    it("should match snapshot when closed", () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Snapshot Closed</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Snapshot Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(container.firstChild).toMatchSnapshot("dropdown-closed");
    });

    it("should match snapshot for full composition", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Full Snapshot</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Full Snapshot"));

      await waitFor(() => {
        expect(document.body).toMatchSnapshot("dropdown-open-full");
      });
    });
  });
});
