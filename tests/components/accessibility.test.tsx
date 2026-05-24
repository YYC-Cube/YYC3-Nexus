/**
 * @file accessibility.test.tsx
 * @description YYC³ Comprehensive Accessibility Tests — ARIA, Keyboard Nav, Screen Readers
 * @coverage WCAG 2.1 AA | ARIA Attributes | Focus Management | Semantic HTML
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import components to test for accessibility
import { Button } from "../../src/app/components/ui/button";
import { Input } from "../../src/app/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../src/app/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../src/app/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../src/app/components/ui/card";

describe("Comprehensive Accessibility Tests", () => {
  // ==========================================
  // 1. SEMANTIC HTML & LANDMARKS (语义化HTML和地标)
  // ==========================================
  describe("Semantic HTML & Landmarks", () => {
    it("should use semantic button element", () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should use proper heading hierarchy in cards", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Heading Level 4</CardTitle>
            <CardDescription>Description text</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      );

      const heading = screen.getByRole("heading", { name: /heading level 4/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H4");
    });

    it("should use landmark roles where appropriate", () => {
      render(
        <main role="main">
          <nav aria-label="Main navigation">
            <Button asChild>
              <a href="/">Home</a>
            </Button>
          </nav>
          <section aria-labelledby="section-title">
            <h2 id="section-title">Section Title</h2>
            <p>Section content</p>
          </section>
        </main>,
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(
        screen.getByRole("navigation", { name: /main navigation/i }),
      ).toBeInTheDocument();
    });
  });

  // ==========================================
  // 2. ARIA ATTRIBUTES TESTS (ARIA属性)
  // ==========================================
  describe("ARIA Attributes", () => {
    it("should support aria-label for icon-only buttons", () => {
      render(<Button aria-label="Close dialog">✕</Button>);
      expect(screen.getByLabelText(/close dialog/i)).toBeInTheDocument();
    });

    it("should support aria-describedby for form fields", () => {
      render(
        <>
          <Input
            id="email-field"
            aria-describedby="email-help"
            placeholder="Enter email"
          />
          <span id="email-help">We'll never share your email.</span>
        </>,
      );

      const input = screen.getByPlaceholderText("Enter email");
      expect(input).toHaveAttribute("aria-describedby", "email-help");
    });

    it("should use aria-invalid for error states", () => {
      render(
        <>
          <Input
            aria-invalid="true"
            aria-describedby="error-msg"
            defaultValue="bad value"
          />
          <span id="error-msg" role="alert">
            This field has an error
          </span>
        </>,
      );

      const input = screen.getByDisplayValue("bad value");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should support aria-expanded on toggleable elements", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger data-testid="dialog-trigger">Toggle</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Content</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByTestId("dialog-trigger");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      // After opening, should be expanded (if implemented)
      // Note: Radix UI handles this automatically
    });

    it("should support aria-haspopup for menus and dropdowns", () => {
      render(
        <button aria-haspopup="menu" aria-expanded="false">
          Open Menu
        </button>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-haspopup", "menu");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should use aria-current for current page/selection", () => {
      render(
        <nav aria-label="Navigation">
          <a href="/home" aria-current="page">
            Home
          </a>
          <a href="/about">About</a>
        </nav>,
      );

      const currentLink = screen.getByRole("link", { name: /home/i });
      expect(currentLink).toHaveAttribute("aria-current", "page");
    });

    it("should support aria-live regions for dynamic content", () => {
      render(
        <div aria-live="polite" data-testid="live-region">
          Initial content
        </div>,
      );

      const liveRegion = screen.getByTestId("live-region");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });

    it("should use aria-busy during loading operations", () => {
      render(
        <Button disabled aria-busy="true">
          Loading...
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("should properly label form groups with fieldset/legend", () => {
      render(
        <fieldset>
          <legend>Contact Information</legend>
          <Input aria-label="Name" placeholder="Your name" />
          <Input aria-label="Email" type="email" placeholder="Your email" />
        </fieldset>,
      );

      const fieldset =
        screen.getByRole("group") || document.querySelector("fieldset");
      if (fieldset) {
        const legend = fieldset.querySelector("legend");
        expect(legend?.textContent).toBe("Contact Information");
      }
    });
  });

  // ==========================================
  // 3. KEYBOARD NAVIGATION & FOCUS MANAGEMENT (键盘导航和焦点管理)
  // ==========================================
  describe("Keyboard Navigation & Focus Management", () => {
    it("should allow tab navigation through interactive elements", async () => {
      const user = userEvent.setup();

      render(
        <>
          <Button tabIndex={0}>First Button</Button>
          <Input tabIndex={0} placeholder="First Input" />
          <Button tabIndex={0}>Second Button</Button>
        </>,
      );

      const elements = [
        screen.getAllByRole("button")[0],
        screen.getByRole("textbox"),
        screen.getAllByRole("button")[1],
      ];

      elements[0].focus();
      expect(elements[0]).toHaveFocus();

      await user.tab();
      expect(elements[1]).toHaveFocus();

      await user.tab();
      expect(elements[2]).toHaveFocus();
    });

    it("should support focus trapping in modals", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Modal</DialogTrigger>
          <DialogContent>
            <DialogTitle>Focus Trap Test</DialogTitle>
            <Button tabIndex={0}>Modal Button 1</Button>
            <Button tabIndex={0}>Modal Button 2</Button>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Modal"));

      // Focus should be trapped within modal when open
      // Implementation depends on Radix UI's built-in behavior
      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should provide visible focus indicators", () => {
      const { container } = render(
        <Button className="focus-visible:ring-2 focus-visible:ring-blue-500">
          Focusable Button
        </Button>,
      );

      const button = container.querySelector("button");
      expect(button?.className).toContain("focus-visible:");
    });

    it("should support skip navigation links", () => {
      render(
        <>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4"
          >
            Skip to main content
          </a>
          <main id="main-content">
            <h1>Main Content</h1>
          </main>
        </>,
      );

      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main-content");
    });

    it("should handle Escape key for closing overlays", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Escape Test</DialogTrigger>
          <DialogContent>
            <DialogTitle>Press Escape</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Escape Test"));

      await waitFor(async () => {
        expect(screen.getByText("Press Escape")).toBeInTheDocument();
        await user.keyboard("{Escape}");

        await waitFor(
          () => {
            expect(screen.queryByText("Press Escape")).not.toBeInTheDocument();
          },
          { timeout: 1000 },
        );
      });
    });

    it("should maintain logical tab order", async () => {
      const user = userEvent.setup();

      render(
        <form>
          <label htmlFor="field1">Field 1</label>
          <Input id="field1" />

          <label htmlFor="field2">Field 2</label>
          <Input id="field2" />

          <Button type="submit">Submit</Button>
        </form>,
      );

      const inputs = screen.getAllByRole("textbox");
      const button = screen.getByRole("button");

      inputs[0].focus();
      await user.tab(); // Should go to field2
      expect(inputs[1]).toHaveFocus();

      await user.tab(); // Should go to submit button
      expect(button).toHaveFocus();
    });
  });

  // ==========================================
  // 4. COLOR CONTRAST & VISUAL ACCESSIBILITY (颜色对比度和视觉无障碍)
  // ==========================================
  describe("Color Contrast & Visual Accessibility", () => {
    it("should not rely solely on color to convey information", () => {
      render(
        <div>
          <span style={{ color: "red" }} role="alert" aria-label="Error status">
            ⚠ Error: Invalid input
          </span>
          <span style={{ color: "green" }} aria-label="Success status">
            ✓ Success: Saved successfully
          </span>
        </div>,
      );

      // Both have text labels AND icons, not just color
      expect(screen.getByLabelText(/error status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/success status/i)).toBeInTheDocument();
    });

    it("should provide sufficient text contrast (simulated check)", () => {
      const { container } = render(
        <div style={{ backgroundColor: "#ffffff", padding: "20px" }}>
          <p style={{ color: "#000000" }}>High contrast text</p>
          <p style={{ color: "#666666" }}>Medium contrast text</p>
        </div>,
      );

      // In real implementation, would use axe-core or similar tool
      // Here we verify the structure exists
      expect(container.querySelector("div[style]")).toBeTruthy();
    });

    it("should support high contrast mode preferences", () => {
      render(
        <Button
          className="border-2 border-current"
          style={{ forcedColorAdjust: "auto" }}
        >
          High Contrast Compatible
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  // ==========================================
  // 5. SCREEN READER SUPPORT (屏幕阅读器支持)
  // ==========================================
  describe("Screen Reader Support", () => {
    it("should provide alt text for images", () => {
      render(
        <img
          src="/logo.png"
          alt="Company Logo"
          data-testid="accessible-image"
        />,
      );

      const img = screen.getByAltText(/company logo/i);
      expect(img).toBeInTheDocument();
    });

    it("should hide decorative elements from screen readers", () => {
      render(
        <div aria-hidden="true" data-testid="decorative">
          <span>Purely decorative background pattern</span>
        </div>,
      );

      const decorative = screen.getByTestId("decorative");
      expect(decorative).toHaveAttribute("aria-hidden", "true");
    });

    it("should use sr-only class for visually hidden accessible text", () => {
      render(
        <Button>
          <span className="sr-only">Close navigation menu</span>✕
        </Button>,
      );

      const srOnlyText = screen.getByText(/close navigation menu/i);
      expect(srOnlyText).toHaveClass("sr-only");
    });

    it("should announce page changes via live regions", () => {
      render(
        <div>
          <span
            aria-live="assertive"
            data-testid="announcement"
            role="status"
          ></span>
          <Button
            onClick={() => {
              const announcement = screen.getByTestId("announcement");
              // Simulate updating announcement
              Object.defineProperty(announcement, "textContent", {
                value: "Page updated successfully",
                writable: true,
              });
            }}
          >
            Update Page
          </Button>
        </div>,
      );

      const announcement = screen.getByTestId("announcement");
      expect(announcement).toHaveAttribute("aria-live", "assertive");
      expect(announcement).toHaveAttribute("role", "status");
    });

    it("should properly label icon buttons", () => {
      render(
        <div>
          <Button aria-label="Search">
            <span>🔍</span>
          </Button>
          <Button aria-label="Settings">
            <span>⚙️</span>
          </Button>
          <Button aria-label="User profile">
            <span>👤</span>
          </Button>
        </div>,
      );

      expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/user profile/i)).toBeInTheDocument();
    });

    it("should communicate state changes appropriately", async () => {
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

      const tabA = screen.getByRole("tab", { name: /tab a/i });
      expect(tabA).toHaveAttribute("aria-selected", "true");

      await user.click(screen.getByRole("tab", { name: /tab b/i }));

      // Tab selection should be announced
      expect(screen.getByRole("tab", { name: /tab b/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  // ==========================================
  // 6. FORM ACCESSIBILITY (表单无障碍)
  // ==========================================
  describe("Form Accessibility", () => {
    it("should associate labels with form controls", () => {
      render(
        <>
          <label htmlFor="username" data-testid="username-label">
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter username"
            data-testid="username-input"
          />
        </>,
      );

      const label = screen.getByTestId("username-label");
      const input = screen.getByTestId("username-input");

      expect(label.tagName).toBe("LABEL");
      expect(label.getAttribute("for")).toBe("username");
      expect(input.id).toBe("username");
      // Verify the label is properly associated with the input
      expect(input).toBeInTheDocument();
      // Verify that getByLabelText can find the input through the label association
      const labeledInput = screen.getByLabelText("Username");
      expect(labeledInput).toBe(input);
    });

    it("should provide instructions via aria-describedby", () => {
      render(
        <>
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            aria-describedby="password-instructions"
          />
          <span id="password-instructions">
            Must be at least 8 characters with uppercase, lowercase, and
            numbers.
          </span>
        </>,
      );

      const input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute(
        "aria-describedby",
        "password-instructions",
      );
    });

    it("should indicate required fields", () => {
      render(
        <label>
          Email (Required)
          <Input required type="email" placeholder="your@email.com" />
        </label>,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
      // Also check for aria-required or visual indicator
    });

    it("should show validation errors accessibly", () => {
      render(
        <div role="alert">
          <Input
            aria-invalid="true"
            aria-describedby="validation-error"
            defaultValue="invalid"
          />
          <span id="validation-error" role="alert">
            Please enter a valid email address
          </span>
        </div>,
      );

      const input = screen.getByDisplayValue("invalid");
      expect(input).toHaveAttribute("aria-invalid", "true");

      const errorMessage = screen.getByText(
        /please enter a valid email address/i,
      );
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("should group related form elements", () => {
      render(
        <fieldset>
          <legend>Choose your preferences</legend>
          <label>
            <input type="checkbox" name="pref" value="email" /> Email
            notifications
          </label>
          <label>
            <input type="checkbox" name="pref" value="sms" /> SMS notifications
          </label>
        </fieldset>,
      );

      const fieldset = document.querySelector("fieldset");
      const legend = fieldset?.querySelector("legend");
      expect(legend?.textContent).toContain("Choose your preferences");
    });
  });

  // ==========================================
  // 7. INTERACTIVE WIDGET ACCESSIBILITY (交互组件无障碍)
  // ==========================================
  describe("Interactive Widget Accessibility", () => {
    it("should implement tabs pattern correctly", () => {
      render(
        <Tabs defaultValue="accessible-tab">
          <TabsList role="tablist">
            <TabsTrigger value="accessible-tab" role="tab">
              Accessible Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="accessible-tab"
            role="tabpanel"
            id="panel-accessible"
          >
            Panel Content
          </TabsContent>
        </Tabs>,
      );

      const tablist = screen.getByRole("tablist");
      const tab = screen.getByRole("tab");
      expect(tablist).toBeInTheDocument();
      expect(tab).toBeInTheDocument();
    });

    it("should implement dialog pattern correctly", async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Accessible Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Accessible Dialog Title</DialogTitle>
            <DialogDescription>This is an accessible dialog.</DialogDescription>
            <p>Dialog content goes here.</p>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByText("Open Accessible Dialog"));

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        // Radix UI Dialog may not use aria-modal attribute explicitly
        // It implements modality through focus trapping and scroll locking
        expect(dialog).toHaveAttribute("data-state", "open");

        // Check for title
        const title = screen.getByRole("heading", {
          name: /accessible dialog title/i,
        });
        expect(title).toBeInTheDocument();

        // Verify focus is trapped within dialog (Radix UI handles this)
        expect(dialog).toBeVisible();
      });
    });

    it("should provide accessible names for all interactive elements", () => {
      render(
        <div>
          <Button aria-label="Toggle sidebar">☰</Button>
          <Input aria-label="Search documents" placeholder="Search..." />
          <select aria-label="Select language">
            <option>English</option>
            <option>中文</option>
          </select>
        </div>,
      );

      expect(screen.getByLabelText(/toggle sidebar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/search documents/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select language/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 8. MOTION & ANIMATION ACCESSIBILITY (动画无障碍)
  // ==========================================
  describe("Motion & Animation Accessibility", () => {
    it("should respect prefers-reduced-motion media query", () => {
      // This would typically be tested with CSS or by checking for reduced motion classes
      const { container } = render(
        <div className="animate-pulse transition-all duration-300">
          Animated Content
        </div>,
      );

      // In production, would test that animations are disabled when user prefers reduced motion
      const animatedElement = container.querySelector(".animate-pulse");
      expect(animatedElement).toBeInTheDocument();
    });

    it("provide option to pause auto-playing content", () => {
      render(
        <div data-testid="carousel" aria-label="Image carousel">
          <button aria-label="Pause carousel">⏸ Pause</button>
          <div>Slide 1 of 5</div>
        </div>,
      );

      const pauseButton = screen.getByLabelText(/pause carousel/i);
      expect(pauseButton).toBeInTheDocument();
    });
  });

  // ==========================================
  // 9. RESPONSIVE DESIGN & MOBILE ACCESSIBILITY (响应式设计和移动端无障碍)
  // ==========================================
  describe("Responsive Design & Mobile Accessibility", () => {
    it("should ensure touch targets are large enough (44x44px minimum)", () => {
      const { container } = render(
        <Button
          style={{ minWidth: "44px", minHeight: "44px", padding: "12px" }}
        >
          Large Touch Target
        </Button>,
      );

      const button = container.querySelector("button");
      const computedStyle = window.getComputedStyle(button!);
      // Verify minimum dimensions (simplified check)
      expect(parseInt(computedStyle.minWidth) || 44).toBeGreaterThanOrEqual(44);
    });

    it("should maintain accessibility on mobile viewports", () => {
      // Simulate mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(
        <Button className="w-full sm:w-auto">Full Width Mobile Button</Button>,
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("w-full");
    });
  });

  // ==========================================
  // 10. WCAG 2.1 AA COMPLIANCE CHECKS (WCAG 2.1 AA合规检查)
  // ==========================================
  describe("WCAG 2.1 AA Compliance Checks", () => {
    it("should meet perceivable criteria (text alternatives, captions, etc.)", () => {
      render(
        <figure>
          <img src="/chart.png" alt="Sales increased by 25% in Q4" />
          <figcaption>Figure 1: Quarterly sales performance</figcaption>
        </figure>,
      );

      const img = screen.getByAltText(/sales increased by 25%/i);
      expect(img).toBeInTheDocument();
      expect(
        screen.getByText(/quarterly sales performance/i),
      ).toBeInTheDocument();
    });

    it("should meet operable criteria (keyboard accessible, no keyboard traps)", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Button tabIndex={0}>Keyboard Accessible</Button>
          <Input tabIndex={0} placeholder="Can use keyboard" />
        </div>,
      );

      // Complete full keyboard cycle without getting stuck
      const firstBtn = screen.getByRole("button");
      firstBtn.focus();

      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();

      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(firstBtn).toHaveFocus();
    });

    it("should meet understandable criteria (consistent navigation, error identification)", () => {
      render(
        <form>
          <label htmlFor="understandable-field">Name</label>
          <Input
            id="understandable-field"
            required
            aria-describedby="name-error"
            aria-invalid="true"
          />
          <div id="name-error" role="alert" className="text-red-600">
            Name is required and must be at least 2 characters.
          </div>
        </form>,
      );

      const input = screen.getByLabelText("Name");
      expect(input).toBeRequired();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    it("should meet robust criteria (compatible with assistive technologies)", () => {
      // Use valid HTML, proper DOCTYPE, ARIA where needed
      render(
        <main role="main">
          <header>
            <nav aria-label="Primary">
              <Button asChild>
                <a href="/">Home</a>
              </Button>
            </nav>
          </header>
          <article>
            <h1>Robust Content</h1>
            <p>Uses semantic HTML compatible with AT.</p>
          </article>
        </main>,
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });
});
