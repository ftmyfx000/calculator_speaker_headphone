import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultDisplay } from './ResultDisplay';

describe('ResultDisplay', () => {
  it('renders label and formatted value with unit', () => {
    render(
      <ResultDisplay
        label="Frequency"
        value={147.2345}
        unit="Hz"
        precision={2}
      />
    );

    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('147.23')).toBeInTheDocument();
    expect(screen.getByText('Hz')).toBeInTheDocument();
  });

  it('displays dash for null value', () => {
    render(
      <ResultDisplay
        label="Result"
        value={null}
        unit="Hz"
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('Hz')).not.toBeInTheDocument();
  });

  it('displays dash for undefined value', () => {
    render(
      <ResultDisplay
        label="Result"
        value={undefined}
        unit="Hz"
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('displays dash for NaN value', () => {
    render(
      <ResultDisplay
        label="Result"
        value={NaN}
        unit="Hz"
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('uses default precision of 4 when not specified', () => {
    render(
      <ResultDisplay
        label="Result"
        value={3.14159265}
      />
    );

    expect(screen.getByText('3.1416')).toBeInTheDocument();
  });
});
