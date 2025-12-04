import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrossoverNetworkCalculator } from './CrossoverNetworkCalculator';

describe('CrossoverNetworkCalculator', () => {
  it('renders the calculator title', () => {
    render(<CrossoverNetworkCalculator />);
    expect(screen.getByText('クロスオーバーネットワーク計算機')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    render(<CrossoverNetworkCalculator />);
    
    expect(screen.getByLabelText('ウーファーインピーダンス')).toBeInTheDocument();
    expect(screen.getByLabelText('ツイーターインピーダンス')).toBeInTheDocument();
    expect(screen.getByLabelText('カットオフ周波数')).toBeInTheDocument();
    expect(screen.getByLabelText('ウーファーSPL（オプション）')).toBeInTheDocument();
    expect(screen.getByLabelText('ツイーターSPL（オプション）')).toBeInTheDocument();
  });

  it('has default values for impedances', () => {
    render(<CrossoverNetworkCalculator />);
    
    const wooferInput = screen.getByLabelText('ウーファーインピーダンス') as HTMLInputElement;
    const tweeterInput = screen.getByLabelText('ツイーターインピーダンス') as HTMLInputElement;
    
    expect(wooferInput.value).toBe('8');
    expect(tweeterInput.value).toBe('8');
  });
});
