/**
 * @file card.test.tsx
 * @description YYC³ Card Component — Comprehensive Test Suite
 * @coverage Unit Tests | Composition Tests | Accessibility | Styling
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../../../src/app/components/ui/card';

describe('Card Components', () => {
  // ==========================================
  // 1. CARD CONTAINER TESTS (卡片容器)
  // ==========================================
  describe('Card Container', () => {
    it('should render card container with correct attributes', () => {
      render(
        <Card data-testid="card-container">
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('card-container');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-slot', 'card');
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('border');
    });

    it('should render children inside card', () => {
      render(
        <Card>
          <span data-testid="child">Child Element</span>
        </Card>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should apply custom className to card', () => {
      const { container } = render(<Card className="custom-card">Custom</Card>);
      expect(container.querySelector('.custom-card')).toBeInTheDocument();
    });

    it('should support click events on card', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Card onClick={handleClick} data-testid="clickable-card">
          Clickable
        </Card>
      );

      await user.click(screen.getByTestId('clickable-card'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // 2. CARD HEADER TESTS (卡片头部)
  // ==========================================
  describe('CardHeader', () => {
    it('should render header with correct structure', () => {
      render(
        <Card>
          <CardHeader data-testid="header">
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
      );
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'card-header');
      expect(header).toHaveClass('grid');
    });

    it('should support action slot alongside title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardAction>
              <button>Action Button</button>
            </CardAction>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText('Action Button')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. CARD TITLE & DESCRIPTION (标题和描述)
  // ==========================================
  describe('CardTitle & CardDescription', () => {
    it('should render title as heading level 4', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
          </CardHeader>
        </Card>
      );
      const title = screen.getByRole('heading', { name: /dashboard overview/i, level: 4 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'card-title');
    });

    it('should render description with muted styling', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardDescription>This is a description text</CardDescription>
          </CardHeader>
        </Card>
      );
      const desc = container.querySelector('[data-slot="card-description"]');
      expect(desc).toBeInTheDocument();
      expect(desc).toHaveClass('text-muted-foreground');
    });

    it('should allow custom className on title', () => {
      const { container } = render(
        <CardHeader>
          <CardTitle className="text-2xl">Large Title</CardTitle>
        </CardHeader>
      );
      expect(container.querySelector('.text-2xl')).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. CARD CONTENT & FOOTER (内容和底部)
  // ==========================================
  describe('CardContent & CardFooter', () => {
    it('should render content area with padding', () => {
      const { container } = render(
        <Card>
          <CardContent data-testid="content">
            Main content goes here
          </CardContent>
        </Card>
      );
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'card-content');
      expect(content).toHaveClass('px-6');
    });

    it('should render footer with flex layout', () => {
      const { container } = render(
        <Card>
          <CardFooter data-testid="footer">
            <button>Cancel</button>
            <button>Save</button>
          </CardFooter>
        </Card>
      );
      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
      expect(footer).toHaveClass('flex');
    });

    it('should adjust padding when last child', () => {
      const { container } = render(
        <Card>
          <CardContent>Last Content</CardContent>
        </Card>
      );
      const content = container.querySelector('[data-slot="card-content"]');
      expect(content?.className).toContain('[&:last-child]:pb-6');
    });
  });

  // ==========================================
  // 5. CARD ACTION COMPONENT (操作区)
  // ==========================================
  describe('CardAction', () => {
    it('should position action to the right', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardAction data-testid="action">
              <button>Edit</button>
            </CardAction>
          </CardHeader>
        </Card>
      );
      const action = screen.getByTestId('action');
      expect(action).toHaveAttribute('data-slot', 'card-action');
      expect(action.className).toContain('justify-self-end');
    });

    it('should span two rows in grid layout', () => {
      const { container } = render(
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction><span>Action</span></CardAction>
        </CardHeader>
      );
      const action = container.querySelector('[data-slot="card-action"]');
      expect(action?.className).toContain('row-span-2');
    });
  });

  // ==========================================
  // 6. COMPOSITION / INTEGRATION TESTS (组合测试)
  // ==========================================
  describe('Full Card Composition', () => {
    it('should compose complete card with all sub-components', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
            <CardAction>
              <button aria-label="Edit profile">✏️</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Name: John Doe</p>
            <p>Email: john@example.com</p>
          </CardContent>
          <CardFooter>
            <button>Cancel</button>
            <button>Save Changes</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { name: /user profile/i })).toBeInTheDocument();
      expect(screen.getByText(/manage your account settings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/edit profile/i)).toBeInTheDocument();
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('should support nested interactive elements', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleDelete = vi.fn();

      render(
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete</button>
          </CardContent>
        </Card>
      );

      await user.click(screen.getByText('Save'));
      expect(handleSave).toHaveBeenCalledTimes(1);

      await user.click(screen.getByText('Delete'));
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // 7. ACCESSIBILITY TESTS (无障碍测试)
  // ==========================================
  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Important Section</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByRole('heading', { name: /important section/i })).toBeInTheDocument();
    });

    it('should support aria-labelledby for card grouping', () => {
      render(
        <Card aria-labelledby="card-title-id">
          <CardHeader>
            <CardTitle id="card-title-id">Labeled Card</CardTitle>
          </CardHeader>
        </Card>
      );
      const card = document.querySelector('[aria-labelledby]');
      expect(card).toBeInTheDocument();
      expect(card?.getAttribute('aria-labelledby')).toBe('card-title-id');
    });

    it('should support keyboard navigation within card', async () => {
      const user = userEvent.setup();
      render(
        <Card>
          <CardContent>
            <button tabIndex={0}>First Button</button>
            <button tabIndex={0}>Second Button</button>
          </CardContent>
        </Card>
      );

      await user.tab();
      expect(screen.getByText('First Button')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Second Button')).toHaveFocus();
    });
  });

  // ==========================================
  // 8. RESPONSIVE & STYLING TESTS (响应式和样式)
  // ==========================================
  describe('Responsive & Styling', () => {
    it('should use CSS Grid for responsive header layout', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Responsive Title</CardTitle>
          </CardHeader>
        </Card>
      );
      const header = container.querySelector('[data-slot="card-header"]');
      expect(header?.className).toContain('@container/card-header');
    });

    it('should support dark mode classes', () => {
      const { container } = render(
        <Card className="dark:test-dark">
          Dark Mode Card
        </Card>
      );
      expect(container.querySelector('.dark\\:test-dark')).toBeInTheDocument();
    });

    it('should maintain border styling consistency', () => {
      const { container } = render(<Card>Bordered</Card>);
      const card = container.querySelector('[data-slot="card"]');
      expect(card?.className).toContain('border');
    });
  });

  // ==========================================
  // 9. SNAPSHOT TESTS (快照测试)
  // ==========================================
  describe('Snapshots', () => {
    it('should match snapshot for basic card', () => {
      const { container } = render(
        <Card>
          <CardContent>Basic Card</CardContent>
        </Card>
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for full composition', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Full Card</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );
      expect(container).toMatchSnapshot('card-full-composition');
    });

    it('should match snapshot with action button', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>With Action</CardTitle>
            <CardAction><button>Action</button></CardAction>
          </CardHeader>
        </Card>
      );
      expect(container).toMatchSnapshot('card-with-action');
    });
  });

  // ==========================================
  // 10. EDGE CASES (边界情况)
  // ==========================================
  describe('Edge Cases', () => {
    it('should render empty card without errors', () => {
      const { container } = render(<Card></Card>);
      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    });

    it('should handle many child elements', () => {
      render(
        <Card>
          <CardContent>
            {Array.from({ length: 100 }, (_, i) => (
              <p key={i}>Item {i}</p>
            ))}
          </CardContent>
        </Card>
      );
      expect(screen.getAllByText(/Item \d+/).length).toBe(100);
    });

    it('should handle dynamic content updates', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Card>
          <CardContent>Static Content</CardContent>
        </Card>
      );
      expect(screen.getByText('Static Content')).toBeInTheDocument();

      rerender(
        <Card>
          <CardContent>Dynamic Content</CardContent>
        </Card>
      );
      expect(screen.getByText('Dynamic Content')).toBeInTheDocument();
    });
  });
});