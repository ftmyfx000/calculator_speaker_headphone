import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SPLCalculator } from './SPLCalculator';

describe('SPLCalculator', () => {
  it('renders the component with title', () => {
    render(<SPLCalculator />);
    expect(screen.getByText('SPL計算機（音圧レベル）')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    render(<SPLCalculator />);
    
    expect(screen.getByLabelText(/空気密度/)).toBeInTheDocument();
    expect(screen.getByLabelText(/有効半径/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mms/)).toBeInTheDocument();
    expect(screen.getByLabelText(/F0/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Re/)).toBeInTheDocument();
    expect(screen.getByLabelText(/マイク距離/)).toBeInTheDocument();
    expect(screen.getByLabelText(/入力電圧/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rms/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bl/)).toBeInTheDocument();
    expect(screen.getByLabelText(/周波数/)).toBeInTheDocument();
  });

  it('renders result display sections', () => {
    render(<SPLCalculator />);
    
    expect(screen.getByText(/Qts \(総合Q値\)/)).toBeInTheDocument();
    expect(screen.getByText(/音圧/)).toBeInTheDocument();
    expect(screen.getByText(/SPL \(音圧レベル\)/)).toBeInTheDocument();
  });
});
