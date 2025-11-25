import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../components/ui/Button';
import { Mail } from 'lucide-react';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary-100');
  });

  it('renders danger variant', () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-error-600');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-secondary-700');
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('renders small size', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('renders medium size by default', () => {
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('renders large size', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders with icon', () => {
    render(
      <Button icon={<Mail data-testid="mail-icon" />}>
        Button with Icon
      </Button>
    );
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with Icon')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not trigger onClick when loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} isLoading>Loading Button</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('hides children text when loading', () => {
    render(<Button isLoading>Original Text</Button>);
    expect(screen.queryByText('Original Text')).not.toBeInTheDocument();
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
  });

  it('hides icon when loading', () => {
    render(
      <Button isLoading icon={<Mail data-testid="mail-icon" />}>
        Loading
      </Button>
    );
    expect(screen.queryByTestId('mail-icon')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through HTML button attributes', () => {
    render(
      <Button type="submit" name="submit-button" data-testid="submit">
        Submit
      </Button>
    );
    const button = screen.getByTestId('submit');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'submit-button');
  });

  it('renders different variant and size combinations', () => {
    const { rerender } = render(
      <Button variant="secondary" size="sm">Button</Button>
    );
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary-100', 'px-3', 'py-1.5');

    rerender(<Button variant="danger" size="lg">Button</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-error-600', 'px-6', 'py-3');
  });

  it('has proper accessibility attributes', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('supports submit type', () => {
    render(<Button type="submit">Submit Form</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('has disabled styling when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('has disabled styling when loading', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });
});
