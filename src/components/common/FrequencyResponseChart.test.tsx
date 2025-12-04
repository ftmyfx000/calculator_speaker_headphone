import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrequencyResponseChart } from './FrequencyResponseChart';

describe('FrequencyResponseChart', () => {
  const mockData = [
    { frequency: 20, xRatio: 0.5, pressure: 0.001, spl: 80 },
    { frequency: 40, xRatio: 1.0, pressure: 0.002, spl: 85 },
    { frequency: 80, xRatio: 2.0, pressure: 0.0015, spl: 82 },
    { frequency: 160, xRatio: 4.0, pressure: 0.001, spl: 78 },
  ];

  it('renders without crashing with valid data', () => {
    render(<FrequencyResponseChart data={mockData} />);
    // Check if the chart container is rendered
    const chartContainer = screen.getByRole('region', { hidden: true });
    expect(chartContainer).toBeInTheDocument();
  });

  it('renders with empty data array', () => {
    render(<FrequencyResponseChart data={[]} />);
    // Should render without errors even with empty data
    const chartContainer = screen.getByRole('region', { hidden: true });
    expect(chartContainer).toBeInTheDocument();
  });

  it('displays chart legend', () => {
    render(<FrequencyResponseChart data={mockData} />);
    // Check if legend text is present
    expect(screen.getByText('音圧レベル (dB)')).toBeInTheDocument();
  });
});
