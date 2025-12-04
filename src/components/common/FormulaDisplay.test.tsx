import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormulaDisplay } from './FormulaDisplay';

describe('FormulaDisplay', () => {
  it('renders formula string', () => {
    render(
      <FormulaDisplay
        formula="F0 = sqrt(Kms/Mms)/(2π)"
      />
    );

    expect(screen.getByText('F0 = sqrt(Kms/Mms)/(2π)')).toBeInTheDocument();
  });

  it('shows expand button when variables are provided', () => {
    const variables = [
      { symbol: 'F0', description: 'Resonance frequency', unit: 'Hz' },
      { symbol: 'Kms', description: 'Mechanical stiffness', unit: 'N/m' },
    ];

    render(
      <FormulaDisplay
        formula="F0 = sqrt(Kms/Mms)/(2π)"
        variables={variables}
      />
    );

    expect(screen.getByText(/変数を表示/)).toBeInTheDocument();
  });

  it('expands to show variable definitions when button is clicked', async () => {
    const user = userEvent.setup();
    const variables = [
      { symbol: 'F0', description: 'Resonance frequency', unit: 'Hz' },
      { symbol: 'Kms', description: 'Mechanical stiffness', unit: 'N/m' },
    ];

    render(
      <FormulaDisplay
        formula="F0 = sqrt(Kms/Mms)/(2π)"
        variables={variables}
      />
    );

    const button = screen.getByText(/変数を表示/);
    await user.click(button);

    expect(screen.getByText('Resonance frequency')).toBeInTheDocument();
    expect(screen.getByText('Mechanical stiffness')).toBeInTheDocument();
    expect(screen.getByText(/変数を隠す/)).toBeInTheDocument();
  });

  it('does not show expand button when no variables provided', () => {
    render(
      <FormulaDisplay
        formula="F0 = sqrt(Kms/Mms)/(2π)"
      />
    );

    expect(screen.queryByText(/変数を表示/)).not.toBeInTheDocument();
  });
});
