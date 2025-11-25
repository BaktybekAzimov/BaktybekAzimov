import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-secondary-800', 'rounded-xl', 'shadow-card', 'p-6');
  });

  it('has border styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border', 'border-transparent', 'dark:border-secondary-700');
  });

  it('has transition styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('transition-all', 'duration-300', 'ease-out');
  });

  it('does not have hover styling by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('applies hover styling when hover prop is true', () => {
    const { container } = render(<Card hover>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-card');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Card onClick={handleClick}>Clickable Card</Card>);

    await user.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when no onClick provided', async () => {
    const user = userEvent.setup();
    render(<Card>Non-clickable Card</Card>);

    // Should not throw error
    await user.click(screen.getByText('Non-clickable Card'));
  });

  it('works with hover and onClick together', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Card hover onClick={handleClick}>
        Hover and Click
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');

    await user.click(screen.getByText('Hover and Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with complex children', () => {
    render(
      <Card>
        <div>
          <h2>Title</h2>
          <p>Description</p>
        </div>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});

describe('CardHeader Component', () => {
  it('renders header with children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has default margin bottom', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('mb-4');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom-header', 'mb-4');
  });

  it('renders with complex children', () => {
    render(
      <CardHeader>
        <h1>Main Title</h1>
        <span>Subtitle</span>
      </CardHeader>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });
});

describe('CardTitle Component', () => {
  it('renders title with children', () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('H3');
  });

  it('has default styling', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-secondary-900', 'dark:text-secondary-100');
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardContent Component', () => {
  it('renders content with children', () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom-content');
  });

  it('renders with complex children', () => {
    render(
      <CardContent>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </CardContent>
    );

    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });
});

describe('Card Components Integration', () => {
  it('renders complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is the card content')).toBeInTheDocument();
  });

  it('works with hover and onClick on complete card', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Card hover onClick={handleClick}>
        <CardHeader>
          <CardTitle>Clickable Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Click anywhere</p>
        </CardContent>
      </Card>
    );

    await user.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports multiple cards with different styles', () => {
    const { container } = render(
      <>
        <Card className="card-1">Card 1</Card>
        <Card className="card-2" hover>Card 2</Card>
      </>
    );

    const cards = container.querySelectorAll('div');
    expect(cards[0]).toHaveClass('card-1');
    expect(cards[1]).toHaveClass('card-2');
  });
});
