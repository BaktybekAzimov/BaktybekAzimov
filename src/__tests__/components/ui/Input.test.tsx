import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../../components/ui/Input';
import { Mail } from 'lucide-react';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email Address" />);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Input label="Username" required />);
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-error-500');
  });

  it('does not show asterisk when not required', () => {
    render(<Input label="Optional Field" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Input icon={<Mail data-testid="mail-icon" />} />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('applies left padding when icon is present', () => {
    render(<Input icon={<Mail />} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pl-10');
  });

  it('does not apply left padding when no icon', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveClass('pl-10');
  });

  it('displays error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-error-500');
  });

  it('displays helper text', () => {
    render(<Input helperText="Enter a valid email address" />);
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <Input
        helperText="Helper text"
        error="Error message"
      />
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test input');

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be controlled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <Input value="" onChange={handleChange} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');

    await user.type(input, 'a');
    expect(handleChange).toHaveBeenCalled();

    rerender(<Input value="test" onChange={handleChange} />);
    expect(input.value).toBe('test');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    input = document.querySelector('input[type="password"]')!;
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="text" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('can be disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies disabled styling when disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('disabled:bg-secondary-50', 'disabled:cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('passes through HTML input attributes', () => {
    render(
      <Input
        name="email"
        id="email-input"
        maxLength={50}
        autoComplete="email"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-input');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('renders with all props combined', () => {
    render(
      <Input
        label="Email"
        placeholder="your@email.com"
        icon={<Mail data-testid="icon" />}
        helperText="We'll never share your email"
        required
      />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('has proper focus styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary-500');
  });

  it('has proper dark mode styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('dark:bg-secondary-800', 'dark:text-secondary-100');
  });

  it('error message has proper styling', () => {
    render(<Input error="Error" />);
    const errorText = screen.getByText('Error');
    expect(errorText).toHaveClass('text-error-600', 'dark:text-error-400');
  });

  it('helper text has proper styling', () => {
    render(<Input helperText="Helper" />);
    const helperText = screen.getByText('Helper');
    expect(helperText).toHaveClass('text-secondary-500', 'dark:text-secondary-400');
  });

  it('works with ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref as any} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('can focus input programmatically with ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref as any} />);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});
