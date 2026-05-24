/**
 * @file states.test.tsx
 * @description YYC³ Comprehensive State Tests — Normal, Loading, Error, Empty, Disabled
 * @coverage All UI States | State Transitions | Visual Feedback | User Experience
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Import components
import { Button } from "../../src/app/components/ui/button";
import { Input } from "../../src/app/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
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
  CardFooter,
} from "../../src/app/components/ui/card";

describe("Comprehensive State Tests", () => {
  // ==========================================
  // 1. NORMAL STATE TESTS (正常状态)
  // ==========================================
  describe("Normal States", () => {
    it("should display button in normal/active state by default", () => {
      render(<Button>Normal Button</Button>);
      const button = screen.getByRole("button");

      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass("opacity-50");
      expect(button).not.toHaveAttribute("aria-disabled");
      expect(button).toBeEnabled();
    });

    it("should show input in normal editable state", () => {
      render(<Input placeholder="Normal Input" />);
      const input = screen.getByPlaceholderText("Normal Input");

      expect(input).not.toBeDisabled();
      expect(input).not.toHaveAttribute("readonly");
      expect(input).toBeEnabled();
    });

    it("should display card with normal content visibility", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Normal Title</CardTitle>
            <CardDescription>Normal Description</CardDescription>
          </CardHeader>
          <CardContent>Normal Content</CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>,
      );

      expect(screen.getByText("Normal Title")).toBeVisible();
      expect(screen.getByText("Normal Description")).toBeVisible();
      expect(screen.getByText("Normal Content")).toBeVisible();
      expect(screen.getByText("Action")).toBeVisible();
    });

    it("should show tabs in normal interactive state", () => {
      render(
        <Tabs defaultValue="normal-tab">
          <TabsList>
            <TabsTrigger value="normal-tab">Active Tab</TabsTrigger>
            <TabsTrigger value="inactive-tab">Inactive Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="normal-tab">Active Content</TabsContent>
          <TabsContent value="inactive-tab">Inactive Content</TabsContent>
        </Tabs>,
      );

      const allTabs = screen.getAllByRole("tab");
      const activeTab = allTabs.find(
        (tab) => tab.getAttribute("data-state") === "active",
      );
      const inactiveTab = allTabs.find(
        (tab) => tab.getAttribute("data-state") === "inactive",
      );

      expect(activeTab).toBeTruthy();
      expect(inactiveTab).toBeTruthy();
      expect(activeTab).toHaveAttribute("data-state", "active");
      expect(inactiveTab).toHaveAttribute("data-state", "inactive");
      expect(screen.getByText("Active Content")).toBeVisible();
      // Inactive tab content should be hidden (either not visible or has hidden attribute)
      const inactiveContent = screen.queryByText("Inactive Content");
      if (inactiveContent) {
        expect(inactiveContent).not.toBeVisible();
      } else {
        // Content might be removed from DOM when inactive
        expect(inactiveContent).toBeNull();
      }
    });

    it("should allow normal interaction flow", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Interactive</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 2. LOADING STATE TESTS (加载状态)
  // ==========================================
  describe("Loading States", () => {
    it("should show loading/disabled state during async operations", () => {
      render(
        <Button disabled aria-busy="true">
          <span className="animate-spin inline-block mr-2">⏳</span>
          Loading...
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should display skeleton loader pattern for content loading", () => {
      const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
        <div data-testid="skeleton-loader">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse mb-2"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      );

      render(
        <Card>
          <CardContent>
            <SkeletonLoader count={5} />
          </CardContent>
        </Card>,
      );

      const skeleton = screen.getByTestId("skeleton-loader");
      expect(skeleton.children.length).toBe(5);
      expect(skeleton.querySelectorAll(".animate-pulse").length).toBe(5);
    });

    it("should show progress indicator during file upload/loading", () => {
      const ProgressBar = ({ progress }: { progress: number }) => (
        <div
          data-testid="progress-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "8px",
              backgroundColor: "#00ff00",
            }}
          />
          <span>{progress}%</span>
        </div>
      );

      const { rerender } = render(<ProgressBar progress={0} />);
      expect(screen.getByTestId("progress-bar")).toHaveAttribute(
        "aria-valuenow",
        "0",
      );

      // Simulate progress update
      rerender(<ProgressBar progress={50} />);
      expect(screen.getByTestId("progress-bar")).toHaveAttribute(
        "aria-valuenow",
        "50",
      );

      rerender(<ProgressBar progress={100} />);
      expect(screen.getByTestId("progress-bar")).toHaveAttribute(
        "aria-valuenow",
        "100",
      );
    });

    it("should handle loading state transitions correctly", async () => {
      const user = userEvent.setup();
      let isLoading = false;

      const AsyncButton = () => {
        const [loading, setLoading] = React.useState(false);

        return (
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              isLoading = true;
              await new Promise((resolve) => setTimeout(resolve, 100));
              setLoading(false);
              isLoading = false;
            }}
          >
            {loading ? "Processing..." : "Click to Load"}
          </Button>
        );
      };

      render(<AsyncButton />);

      expect(screen.getByText("Click to Load")).toBeEnabled();

      await user.click(screen.getByRole("button"));

      await waitFor(
        () => {
          expect(screen.getByText("Processing...")).toBeDisabled();
        },
        { timeout: 500 },
      );

      await waitFor(
        () => {
          expect(screen.getByText("Click to Load")).toBeEnabled();
        },
        { timeout: 1000 },
      );
    });

    it("should show spinner or animation during data fetching", () => {
      const LoadingSpinner = () => (
        <div
          role="status"
          aria-label="Loading"
          className="flex justify-center p-4"
        >
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="ml-2">Loading data...</span>
        </div>
      );

      render(<LoadingSpinner />);

      const statusElement = screen.getByRole("status");
      expect(statusElement).toHaveAttribute("aria-label", "Loading");
      expect(statusElement.querySelector(".animate-spin")).toBeInTheDocument();
      expect(screen.getByText("Loading data...")).toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. ERROR STATE TESTS (错误状态)
  // ==========================================
  describe("Error States", () => {
    it("should display error message with appropriate styling", () => {
      const ErrorMessage = ({
        message,
        onRetry,
      }: {
        message: string;
        onRetry?: () => void;
      }) => (
        <div
          role="alert"
          className="border-red-500 bg-red-50 p-4 rounded-md"
          data-testid="error-message"
        >
          <p className="text-red-700 font-medium">{message}</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="mt-2">
              Retry
            </Button>
          )}
        </div>
      );

      const handleRetry = vi.fn();
      render(
        <ErrorMessage
          message="Failed to load data. Please try again."
          onRetry={handleRetry}
        />,
      );

      const errorAlert = screen.getByTestId("error-message");
      expect(errorAlert).toHaveAttribute("role", "alert");
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /retry/i }),
      ).toBeInTheDocument();
    });

    it("should show field-level error with invalid styling", () => {
      render(
        <div>
          <label htmlFor="email-field">Email Address</label>
          <Input
            id="email-field"
            type="email"
            aria-invalid="true"
            aria-describedby="email-error"
            defaultValue="invalid-email"
            className="border-red-500"
          />
          <p
            id="email-error"
            className="text-red-600 text-sm mt-1"
            role="alert"
          >
            Please enter a valid email address
          </p>
        </div>,
      );

      const input = screen.getByLabelText("Email Address");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "email-error");
      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
      expect(input.className).toContain("border-red-500");
    });

    it("should handle API error states gracefully", () => {
      const ApiErrorState = ({
        errorCode,
        errorMessage,
        onDismiss,
      }: {
        errorCode: string | number;
        errorMessage: string;
        onDismiss?: () => void;
      }) => (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error {errorCode}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{errorMessage}</p>
            <p className="text-sm text-muted-foreground mt-2">
              If this problem persists, please contact support.
            </p>
          </CardContent>
          {onDismiss && (
            <CardFooter>
              <Button variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            </CardFooter>
          )}
        </Card>
      );

      const handleDismiss = vi.fn();
      render(
        <ApiErrorState
          errorCode={500}
          errorMessage="Internal Server Error. Our team has been notified."
          onDismiss={handleDismiss}
        />,
      );

      expect(screen.getByText("Error 500")).toBeInTheDocument();
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      expect(screen.getByText(/contact support/i)).toBeInTheDocument();
    });

    it("should provide recovery actions for errors", async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      const handleReset = vi.fn();

      render(
        <div data-testid="error-recovery">
          <p className="text-destructive font-semibold">
            Something went wrong!
          </p>
          <div className="mt-4 space-x-2">
            <Button onClick={handleRetry}>Try Again</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>,
      );

      await user.click(screen.getByRole("button", { name: /try again/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole("button", { name: /reset/i }));
      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it("should announce errors to screen readers", () => {
      render(
        <>
          <div role="alert" aria-live="assertive" data-testid="sr-error">
            Critical: Unable to save your changes.
          </div>
          <form>
            <Input aria-invalid="true" aria-describedby="error-desc" />
            <span id="error-desc" role="alert">
              This field is required
            </span>
          </form>
        </>,
      );

      const srError = screen.getByTestId("sr-error");
      expect(srError).toHaveAttribute("aria-live", "assertive");
      expect(
        screen.getByText(/unable to save your changes/i),
      ).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. EMPTY STATE TESTS (空状态)
  // ==========================================
  describe("Empty States", () => {
    it("should display friendly empty state message", () => {
      const EmptyState = ({
        title,
        description,
        actionLabel,
        onAction,
      }: {
        title: string;
        description: string;
        actionLabel?: string;
        onAction?: () => void;
      }) => (
        <div data-testid="empty-state" className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-2">{description}</p>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="mt-4">
              {actionLabel}
            </Button>
          )}
        </div>
      );

      const handleCreate = vi.fn();
      render(
        <EmptyState
          title="No items yet"
          description="Get started by creating your first item."
          actionLabel="Create Item"
          onAction={handleCreate}
        />,
      );

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No items yet")).toBeInTheDocument();
      expect(screen.getByText(/get started by creating/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create item/i }),
      ).toBeInTheDocument();
    });

    it("should show empty list/table state", () => {
      const EmptyTable = () => (
        <div data-testid="empty-table">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No records found. Adjust your filters or add new entries.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      render(<EmptyTable />);
      expect(screen.getByText(/no records found/i)).toBeInTheDocument();
      expect(screen.getByText(/adjust your filters/i)).toBeInTheDocument();
    });

    it("should show search empty results state", () => {
      const SearchEmpty = ({ query }: { query: string }) => (
        <div data-testid="search-empty" className="py-8 text-center">
          <p className="text-lg">No results found for "{query}"</p>
          <p className="text-muted-foreground mt-2">
            Try different keywords or check your spelling.
          </p>
          <Button variant="ghost" className="mt-4">
            Clear Search
          </Button>
        </div>
      );

      render(<SearchEmpty query="xyznonexistent" />);
      expect(
        screen.getByText(/no results found for "xyznonexistent"/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /clear search/i }),
      ).toBeInTheDocument();
    });

    it("should handle empty state with illustration/graphic", () => {
      const EmptyWithIllustration = () => (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            data-testid="empty-illustration"
          >
            <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
            <text x="100" y="110" textAnchor="middle" fontSize="48">
              📂
            </text>
          </svg>
          <h3 className="text-xl font-bold mt-6">Nothing here yet</h3>
          <p className="text-gray-500 mt-2 max-w-md text-center">
            Your workspace is empty. Start by adding projects, files, or
            connecting services.
          </p>
        </div>
      );

      render(<EmptyWithIllustration />);
      expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
      expect(screen.getByTestId("empty-illustration")).toBeInTheDocument();
      expect(screen.getByText(/your workspace is empty/i)).toBeInTheDocument();
    });

    it("should provide actionable empty states", async () => {
      const user = userEvent.setup();
      const handleImport = vi.fn();
      const handleCreateNew = vi.fn();

      render(
        <div data-testid="actionable-empty">
          <h3>No Data Available</h3>
          <p>Import existing data or create new entries to get started.</p>
          <div className="space-x-4 mt-6">
            <Button onClick={handleImport}>Import Data</Button>
            <Button variant="outline" onClick={handleCreateNew}>
              Create New
            </Button>
          </div>
        </div>,
      );

      await user.click(screen.getByRole("button", { name: /import data/i }));
      expect(handleImport).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole("button", { name: /create new/i }));
      expect(handleCreateNew).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // 5. DISABLED STATE TESTS (禁用状态)
  // ==========================================
  describe("Disabled States", () => {
    it("should disable button with visual feedback", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
      expect(button).toHaveClass("disabled:opacity-50");
      expect(button).toBeDisabled(); // HTML native disabled attribute
    });

    it("should prevent clicks on disabled elements", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button disabled onClick={handleClick}>
          Can't Click
        </Button>,
      );
      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should disable input field appropriately", () => {
      render(<Input disabled placeholder="Disabled Input" />);
      const input = screen.getByPlaceholderText("Disabled Input");

      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled:pointer-events-none");
      expect(input).toHaveClass("disabled:cursor-not-allowed");
      expect(input).toHaveClass("disabled:opacity-50");
    });

    it("should disable readonly inputs differently than disabled", () => {
      render(
        <div>
          <Input
            readOnly
            defaultValue="Readonly Value"
            data-testid="readonly"
          />
          <Input
            disabled
            defaultValue="Disabled Value"
            data-testid="disabled-input"
          />
        </div>,
      );

      const readonlyInput = screen.getByTestId("readonly");
      const disabledInput = screen.getByTestId("disabled-input");

      expect(readonlyInput).toHaveAttribute("readonly");
      expect(readonlyInput).not.toBeDisabled(); // Readonly is still enabled but not editable

      expect(disabledInput).toBeDisabled();
    });

    it("should disable entire form group when needed", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <fieldset disabled>
          <legend>Disabled Section</legend>
          <Input placeholder="Field 1" data-testid="f1" />
          <Input placeholder="Field 2" data-testid="f2" />
          <Button type="submit">Submit</Button>
        </fieldset>,
      );

      expect(screen.getByTestId("f1")).toBeDisabled();
      expect(screen.getByTestId("f2")).toBeDisabled();
      expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    it("should disable individual tabs", () => {
      render(
        <Tabs defaultValue="active-tab">
          <TabsList>
            <TabsTrigger value="active-tab">Active</TabsTrigger>
            <TabsTrigger value="disabled-tab" disabled>
              Disabled Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active-tab">Content</TabsContent>
        </Tabs>,
      );

      const disabledTab = screen.getByRole("tab", { name: /disabled tab/i });
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveClass("disabled:pointer-events-none");
      expect(disabledTab.className).toContain("disabled:opacity-50");
    });

    it("should show tooltip explaining why disabled", () => {
      render(
        <Button
          disabled
          aria-label="Save changes"
          title="Please fix errors before saving"
        >
          Save
        </Button>,
      );

      const button = screen.getByRole("button", { name: /save changes/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute(
        "title",
        "Please fix errors before saving",
      );
    });

    it("should conditionally disable based on state", async () => {
      const user = userEvent.setup();
      const ConditionalButton = () => {
        const [hasAgreed, setHasAgreed] = React.useState(false);
        return (
          <div>
            <input
              type="checkbox"
              onChange={(e) => setHasAgreed(e.target.checked)}
              data-testid="agree-checkbox"
            />
            <label htmlFor="agree">I agree to terms</label>
            <br />
            <Button disabled={!hasAgreed} data-testid="conditional-btn">
              Continue
            </Button>
          </div>
        );
      };

      render(<ConditionalButton />);

      const btn = screen.getByTestId("conditional-btn");
      expect(btn).toBeDisabled();

      await user.click(screen.getByTestId("agree-checkbox"));
      expect(btn).toBeEnabled();

      await user.click(screen.getByTestId("agree-checkbox"));
      expect(btn).toBeDisabled();
    });
  });

  // ==========================================
  // 6. STATE TRANSITIONS TESTS (状态转换)
  // ==========================================
  describe("State Transitions", () => {
    it("should transition from normal -> loading -> success", async () => {
      const user = userEvent.setup();

      const StateTransition = () => {
        const [state, setState] = React.useState<
          "normal" | "loading" | "success"
        >("normal");

        const handleClick = async () => {
          setState("loading");
          await new Promise((resolve) => setTimeout(resolve, 100));
          setState("success");
          setTimeout(() => setState("normal"), 1000);
        };

        return (
          <div data-testid="state-container">
            <Button
              onClick={handleClick}
              disabled={state === "loading"}
              data-testid="transition-btn"
            >
              {state === "loading" && "⏳ Processing..."}
              {state === "success" && "✅ Success!"}
              {state === "normal" && "Submit"}
            </Button>
            <span data-testid="current-state">{state}</span>
          </div>
        );
      };

      render(<StateTransition />);

      // Initial state
      expect(screen.getByTestId("current-state")).toHaveTextContent("normal");
      expect(screen.getByTestId("transition-btn")).toHaveTextContent("Submit");

      // Click to trigger transition
      await user.click(screen.getByTestId("transition-btn"));

      // Loading state
      await waitFor(
        () => {
          expect(screen.getByTestId("current-state")).toHaveTextContent(
            "loading",
          );
          expect(screen.getByTestId("transition-btn")).toBeDisabled();
          expect(screen.getByTestId("transition-btn")).toHaveTextContent(
            "⏳ Processing...",
          );
        },
        { timeout: 500 },
      );

      // Success state
      await waitFor(
        () => {
          expect(screen.getByTestId("current-state")).toHaveTextContent(
            "success",
          );
          expect(screen.getByTestId("transition-btn")).toHaveTextContent(
            "✅ Success!",
          );
        },
        { timeout: 1000 },
      );

      // Back to normal
      await waitFor(
        () => {
          expect(screen.getByTestId("current-state")).toHaveTextContent(
            "normal",
          );
        },
        { timeout: 2500 },
      );
    });

    it("should transition from normal -> error -> retry", async () => {
      const user = userEvent.setup();
      let shouldFail = true;

      const ErrorTransition = () => {
        const [state, setState] = React.useState<
          "normal" | "loading" | "error"
        >("normal");
        const [errorMsg, setErrorMsg] = React.useState("");

        const handleAction = async () => {
          setState("loading");
          try {
            await new Promise<void>((resolve, reject) =>
              setTimeout(
                () =>
                  shouldFail
                    ? reject(new Error("API Error"))
                    : resolve(undefined),
                100,
              ),
            );
            setState("normal");
          } catch (err) {
            setErrorMsg((err as Error).message);
            setState("error");
          }
        };

        return (
          <div>
            <Button onClick={handleAction} disabled={state === "loading"}>
              {state === "loading" ? "Loading..." : "Execute"}
            </Button>
            {state === "error" && (
              <div role="alert">
                <p className="text-destructive">{errorMsg}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    shouldFail = false;
                    handleAction();
                  }}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        );
      };

      render(<ErrorTransition />);

      // First attempt fails
      await user.click(screen.getByRole("button", { name: /execute/i }));

      await waitFor(
        () => {
          expect(screen.getByRole("alert")).toBeInTheDocument();
          expect(screen.getByText("API Error")).toBeInTheDocument();
          expect(
            screen.getByRole("button", { name: /retry/i }),
          ).toBeInTheDocument();
        },
        { timeout: 500 },
      );

      // Retry succeeds
      await user.click(screen.getByRole("button", { name: /retry/i }));

      await waitFor(
        () => {
          expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("should handle partial/empty states dynamically", async () => {
      const user = userEvent.setup();

      const DynamicContent = () => {
        const [items, setItems] = React.useState<string[]>([]);

        return (
          <div>
            <Button onClick={() => setItems(["Item 1", "Item 2", "Item 3"])}>
              Add Items
            </Button>
            <Button
              variant="ghost"
              onClick={() => setItems([])}
              data-testid="clear-btn"
            >
              Clear All
            </Button>

            {items.length === 0 ? (
              <div data-testid="empty-state">No items to display</div>
            ) : (
              <ul data-testid="item-list">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      };

      render(<DynamicContent />);

      // Initially empty
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("item-list")).not.toBeInTheDocument();

      // Add items
      await user.click(screen.getByRole("button", { name: /add items/i }));

      expect(screen.getByTestId("item-list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem").length).toBe(3);
      expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();

      // Clear items
      await user.click(screen.getByTestId("clear-btn"));

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("item-list")).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // 7. ACCESSIBILITY IN DIFFERENT STATES (不同状态下的无障碍性)
  // ==========================================
  describe("Accessibility Across States", () => {
    it("should maintain accessibility in loading state", () => {
      render(
        <Button disabled aria-busy="true">
          <span aria-hidden="true">⏳</span>
          <span>Loading...</span>
        </Button>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toBeDisabled();
    });

    it('should use role="alert" for error messages', () => {
      render(<div role="alert">Critical error occurred!</div>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should properly label empty states", () => {
      render(
        <div role="status" aria-label="No results">
          <p>Your search returned no results.</p>
        </div>,
      );

      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-label", "No results");
    });

    it("should communicate disabled reason to assistive technology", () => {
      render(
        <Button
          disabled
          aria-label="Delete account"
          title="Cannot delete while you are the only admin"
        >
          Delete
        </Button>,
      );

      const button = screen.getByRole("button", { name: /delete account/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("title");
    });
  });
});
