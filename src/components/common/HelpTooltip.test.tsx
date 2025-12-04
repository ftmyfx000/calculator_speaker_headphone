import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpTooltip } from './HelpTooltip';

describe('HelpTooltip', () => {
  it('renders help button', () => {
    render(<HelpTooltip content="This is help text" />);

    expect(screen.getByRole('button', { name: /ヘルプ情報を表示/ })).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip content="This is help text" />);

    const button = screen.getByRole('button');
    await user.hover(button);

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('shows tooltip on click', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip content="This is help text" />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('renders custom children instead of default question mark', () => {
    render(
      <HelpTooltip content="Help text">
        <span>i</span>
      </HelpTooltip>
    );

    expect(screen.getByText('i')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HelpTooltip content="Help text" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'ヘルプ情報を表示');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
