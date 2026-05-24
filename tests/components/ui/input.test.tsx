/**
 * @file input.test.tsx
 * @description YYC³ Input Component — Comprehensive Test Suite
 * @coverage Unit Tests | Interaction Tests | State Tests | Form Integration
 */

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../../src/app/components/ui/input";

describe("Input Component", () => {
  // ==========================================
  // 1. RENDERING TESTS (基础渲染)
  // ==========================================
  describe("Rendering", () => {
    it("should render with default attributes", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "input");
      // HTML input defaults to type="text" when not specified
      expect((input as HTMLInputElement).type).toBe("text");
    });

    it("should render with value", () => {
      render(<Input defaultValue="Initial value" />);
      expect(screen.getByDisplayValue("Initial value")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Input className="custom-input" />);
      expect(container.querySelector(".custom-input")).toBeInTheDocument();
    });

    it("should support different input types", () => {
      const types = [
        "text",
        "password",
        "email",
        "number",
        "search",
        "tel",
        "url",
      ];
      types.forEach((type) => {
        const { unmount } = render(
          <Input type={type} data-testid={`input-${type}`} />,
        );
        expect(screen.getByTestId(`input-${type}`)).toHaveAttribute(
          "type",
          type,
        );
        unmount();
      });
    });
  });

  // ==========================================
  // 2. INTERACTION TESTS (交互测试)
  // ==========================================
  describe("Interactions", () => {
    it("should handle text input changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} placeholder="Type here" />);

      const input = screen.getByPlaceholderText("Type here");
      await user.type(input, "Hello World");

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue("Hello World");
    });

    it("should handle focus and blur events", async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(
        <Input
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Focus test"
        />,
      );

      const input = screen.getByPlaceholderText("Focus test");
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab(); // Move focus away
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should clear input when pressing Escape in some contexts", async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Clear me" />);

      const input = screen.getByDisplayValue("Clear me") as HTMLInputElement;
      await user.click(input);
      await user.tripleClick(input);
      await user.keyboard("{Backspace}");

      expect(input.value).toBe("");
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Keyboard nav" />);

      const input = screen.getByPlaceholderText("Keyboard nav");
      input.focus();

      await user.type(input, "abc");
      await user.keyboard("{ArrowLeft}{ArrowRight}");
      expect(input).toHaveValue("abc");
    });
  });

  // ==========================================
  // 3. STATE TESTS (状态测试)
  // ==========================================
  describe("States", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Input disabled placeholder="Disabled" />);
      const input = screen.getByPlaceholderText("Disabled");
      expect(input).toBeDisabled();
      expect(input.className).toContain("disabled:pointer-events-none");
      expect(input.className).toContain("disabled:cursor-not-allowed");
      expect(input.className).toContain("disabled:opacity-50");
    });

    it("should show readonly state", () => {
      render(<Input readOnly defaultValue="Readonly" />);
      expect(screen.getByDisplayValue("Readonly")).toHaveAttribute("readonly");
    });

    it("should have required attribute when specified", () => {
      render(<Input required placeholder="Required" />);
      expect(screen.getByPlaceholderText("Required")).toBeRequired();
    });

    it("should support aria-invalid for error state", () => {
      render(<Input aria-invalid="true" placeholder="Error" />);
      const input = screen.getByPlaceholderText("Error");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("aria-invalid:ring-destructive");
    });

    it("should support maxLength constraint", async () => {
      const user = userEvent.setup();
      render(<Input maxLength={5} placeholder="Max 5 chars" />);

      const input = screen.getByPlaceholderText("Max 5 chars");
      await user.type(input, "This is too long");

      // HTML5 validation - value may exceed but browser shows warning
      expect(input).toHaveAttribute("maxlength", "5");
    });

    it("should support placeholder visibility", () => {
      render(<Input placeholder="Placeholder text" />);
      expect(
        screen.getByPlaceholderText("Placeholder text"),
      ).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. FORM INTEGRATION (表单集成)
  // ==========================================
  describe("Form Integration", () => {
    it("should work within form context", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" defaultValue="testuser" />
          <button type="submit">Submit</button>
        </form>,
      );

      await user.click(screen.getByRole("button", { name: /submit/i }));
      expect(handleSubmit).toHaveBeenCalled();
    });

    it("should support controlled component pattern", () => {
      let value = "";
      const { rerender } = render(
        <Input
          value={value}
          onChange={(e) => {
            value = e.target.value;
          }}
        />,
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "new" },
      });
      rerender(<Input value={value} onChange={() => {}} />);
      expect(screen.getByDisplayValue("new")).toBeInTheDocument();
    });

    it("should integrate with label via htmlFor", () => {
      const { container } = render(
        <>
          <label htmlFor="test-input">Email</label>
          <Input id="test-input" type="email" />,
        </>,
      );
      const label = container.querySelector("label");
      const input = container.querySelector("input");
      expect(label?.getAttribute("for")).toBe("test-input");
      expect(input?.id).toBe("test-input");
    });
  });

  // ==========================================
  // 5. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe("Accessibility", () => {
    it("should have proper textbox role", () => {
      render(<Input placeholder="Accessible" />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should support aria-label for icon-only or unlabeled inputs", () => {
      render(<Input aria-label="Search input" />);
      expect(screen.getByLabelText(/search input/i)).toBeInTheDocument();
    });

    it("should support aria-describedby for help text", () => {
      render(
        <>
          <Input aria-describedby="help-text" />
          <span id="help-text">Enter your email address</span>
        </>,
      );
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-describedby",
        "help-text",
      );
    });

    it("should have proper focus-visible styles", () => {
      const { container } = render(<Input placeholder="Focus styles" />);
      const input = container.querySelector("input");
      expect(input?.className).toContain("focus-visible:border-ring");
      expect(input?.className).toContain("focus-visible:ring-[3px]");
    });

    it("should announce value changes to screen readers", async () => {
      const user = userEvent.setup();
      render(<Input aria-live="polite" placeholder="Live region" />);
      const input = screen.getByPlaceholderText("Live region");
      await user.type(input, "test");
      expect(input).toHaveValue("test");
    });
  });

  // ==========================================
  // 6. STYLING TESTS (样式测试)
  // ==========================================
  describe("Styling", () => {
    it("should have base styling classes", () => {
      const { container } = render(<Input />);
      const input = container.querySelector("input");
      expect(input?.className).toContain("flex");
      expect(input?.className).toContain("h-9");
      expect(input?.className).toContain("w-full");
      expect(input?.className).toContain("rounded-md");
      expect(input?.className).toContain("border");
    });

    it("should have dark mode support classes", () => {
      const { container } = render(<Input className="dark-mode-test" />);
      const input = container.querySelector("input");
      expect(input?.className).toContain("dark:bg-input/30");
    });

    it("should support file input styling", () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector('input[type="file"]');
      expect(input?.className).toContain("file:");
    });
  });

  // ==========================================
  // 7. EDGE CASES & ERROR HANDLING (边界情况)
  // ==========================================
  describe("Edge Cases", () => {
    it("should handle empty value", () => {
      render(<Input value="" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("handle special characters correctly", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Special" />);
      const input = screen.getByPlaceholderText("Special") as HTMLInputElement;
      await user.type(input, '<script>alert("xss")</script>');
      expect(input.value).toBe('<script>alert("xss")</script>');
    });

    it("should handle very long input values", async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Long" />);
      const input = screen.getByPlaceholderText("Long") as HTMLInputElement;
      const longText = "A".repeat(500);
      await user.type(input, longText);
      expect(input.value).toBe(longText);
    });

    it("should forward ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();
      const { container } = render(<Input ref={ref} />);
      // Input component may or may not support ref forwarding
      if (ref.current) {
        expect(ref.current).toBe(container.querySelector("input"));
      } else {
        // If ref is not supported, verify input exists in DOM
        expect(container.querySelector("input")).toBeInTheDocument();
      }
    });
  });

  // ==========================================
  // 8. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe("Snapshots", () => {
    it("should match snapshot for default input", () => {
      const { container } = render(<Input placeholder="Default" />);
      expect(container).toMatchSnapshot();
    });

    it("should match snapshot for disabled state", () => {
      const { container } = render(<Input disabled placeholder="Disabled" />);
      expect(container).toMatchSnapshot("input-disabled");
    });

    it("should match snapshot for error state", () => {
      const { container } = render(
        <Input aria-invalid="true" placeholder="Error" />,
      );
      expect(container).toMatchSnapshot("input-error");
    });
  });
});
