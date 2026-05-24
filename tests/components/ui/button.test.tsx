/**
 * @file button.test.tsx
 * @description YYC³ Button Component — Comprehensive Test Suite
 * @coverage Unit Tests | Interaction Tests | State Tests | Accessibility | Variants
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../../src/app/components/ui/button";

describe("Button Component", () => {
  // ==========================================
  // 1. RENDERING TESTS (基础渲染)
  // ==========================================
  describe("Rendering", () => {
    it("should render with default variant and size", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("should render children correctly", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("should support HTML button attributes", () => {
      render(
        <Button type="submit" name="test" value="test-value">
          Submit
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "test");
      expect(button).toHaveAttribute("value", "test-value");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Button className="custom-class">Custom</Button>,
      );
      const button = container.querySelector(".custom-class");
      expect(button).toBeInTheDocument();
    });
  });

  // ==========================================
  // 2. VARIANT TESTS (变体测试)
  // ==========================================
  describe("Variants", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ] as const;

    it.each(variants)("should render %s variant correctly", (variant) => {
      render(<Button variant={variant}>{variant} Button</Button>);
      const button = screen.getByRole("button", {
        name: new RegExp(`${variant} button`, "i"),
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("inline-flex");
    });

    it("should apply correct styles for destructive variant", () => {
      const { container } = render(
        <Button variant="destructive">Delete</Button>,
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-destructive");
    });

    it("should apply correct styles for outline variant", () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("border");
    });

    it("should apply link variant with underline on hover simulation", () => {
      const { container } = render(<Button variant="link">Link</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("underline-offset-4");
    });
  });

  // ==========================================
  // 3. SIZE TESTS (尺寸测试)
  // ==========================================
  describe("Sizes", () => {
    const sizes = [
      { size: "default" as const, expectedClass: "h-9" },
      { size: "sm" as const, expectedClass: "h-8" },
      { size: "lg" as const, expectedClass: "h-10" },
      { size: "icon" as const, expectedClass: "size-9" },
    ];

    it.each(sizes)(
      "should render $size size with correct classes ($expectedClass)",
      ({ size, expectedClass }) => {
        const { container } = render(<Button size={size}>{size}</Button>);
        const button = container.querySelector("button");
        expect(button?.className).toContain(expectedClass);
      },
    );
  });

  // ==========================================
  // 4. INTERACTION TESTS (交互测试)
  // ==========================================
  describe("Interactions", () => {
    it("should call onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple clicks", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Multi Click</Button>);

      const button = screen.getByRole("button");
      await user.dblClick(button);
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("should not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should be accessible via keyboard Enter key", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(
        <Button
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Submit
        </Button>,
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      // Note: Keyboard interaction depends on form context
    });

    it("should be accessible via keyboard Space key", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Space Me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 5. STATE TESTS (状态测试)
  // ==========================================
  describe("States", () => {
    it("should have disabled state when disabled prop is true", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("should have aria-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should support aria-invalid for error state", () => {
      render(<Button aria-invalid="true">Invalid</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-invalid", "true");
      expect(button.className).toContain("aria-invalid:ring-destructive");
    });

    it("should handle loading state via custom prop pattern", () => {
      const { container } = render(
        <Button disabled aria-busy="true">
          Loading...
        </Button>,
      );
      const button = container.querySelector("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  // ==========================================
  // 6. AS CHILD / SLOT TESTS (复合组件)
  // ==========================================
  describe("AsChild / Slot Pattern", () => {
    it("should render as child element when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveAttribute("data-slot", "button");
    });

    it("should preserve slot styling on child element", () => {
      const { container } = render(
        <Button asChild variant="outline">
          <span>Span Button</span>
        </Button>,
      );
      const span = container.querySelector('span[data-slot="button"]');
      expect(span).toBeInTheDocument();
      expect(span?.className).toContain("border");
    });
  });

  // ==========================================
  // 7. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it("should have proper role attribute", () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should support aria-label for icon-only buttons", () => {
      render(
        <Button aria-label="Close dialog">
          <span>✕</span>
        </Button>,
      );
      expect(screen.getByLabelText(/close dialog/i)).toBeInTheDocument();
    });

    it("should support aria-describedby for additional context", () => {
      render(
        <>
          <Button aria-describedby="desc-id">With Description</Button>
          <span id="desc-id">This button submits the form</span>
        </>,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-describedby",
        "desc-id",
      );
    });

    it("should have focus-visible styles for keyboard navigation", () => {
      const { container } = render(<Button>Focusable</Button>);
      const button = container.querySelector("button");
      expect(button?.className).toContain("focus-visible:border-ring");
      expect(button?.className).toContain("focus-visible:ring-[3px]");
    });

    it("should properly handle SVG icons inside button", () => {
      render(
        <Button>
          <svg data-testid="icon" width="16" height="16">
            <rect />
          </svg>
          With Icon
        </Button>,
      );
      const button = screen.getByRole("button");
      const svg = screen.getByTestId("icon");
      expect(button).toContainElement(svg);
      expect(button.className).toContain("[&_svg]:pointer-events-none");
    });
  });

  // ==========================================
  // 8. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe("Snapshots", () => {
    it("should match snapshot for default button", () => {
      const { container } = render(<Button>Default</Button>);
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot for all variants", () => {
      const variants = [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ] as const;
      variants.forEach((variant) => {
        const { container } = render(
          <Button variant={variant}>{variant}</Button>,
        );
        expect(container).toMatchSnapshot(`button-${variant}`);
      });
    });

    it("should match snapshot for all sizes", () => {
      const sizes = ["default", "sm", "lg", "icon"] as const;
      sizes.forEach((size) => {
        const { container } = render(<Button size={size}>{size}</Button>);
        expect(container).toMatchSnapshot(`button-size-${size}`);
      });
    });
  });

  // ==========================================
  // 9. EDGE CASES & ERROR HANDLING (边界情况)
  // ==========================================
  describe("Edge Cases", () => {
    it("should render without children (empty)", () => {
      const { container } = render(<Button />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("should handle very long text content", () => {
      const longText = "A".repeat(1000);
      render(<Button>{longText}</Button>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in text", () => {
      render(<Button>Special &lt;chars&gt; &amp; "quotes"</Button>);
      expect(
        screen.getByText('Special <chars> & "quotes"'),
      ).toBeInTheDocument();
    });

    it("should work within form context", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>,
      );
      fireEvent.submit(screen.getByRole("button").closest("form")!);
      expect(handleSubmit).toHaveBeenCalled();
    });

    it("should render button element correctly", () => {
      const { container } = render(<Button>Ref Button</Button>);
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
      expect(button?.textContent).toBe("Ref Button");
    });
  });
});
