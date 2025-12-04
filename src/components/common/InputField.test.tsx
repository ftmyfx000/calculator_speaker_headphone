import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from './InputField';

describe('InputField', () => {
  it('renders with label and unit', () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="Test Input"
        value="123"
        unit="Hz"
        onChange={onChange}
      />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByText('Hz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Test Input"
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText('Test Input');
    await user.type(input, '456');

    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="Test Input"
        value="invalid"
        onChange={onChange}
        error="Invalid value"
      />
    );

    expect(screen.getByText('Invalid value')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="Test Input"
        value="invalid"
        onChange={onChange}
        error="Invalid value"
      />
    );

    const input = screen.getByLabelText('Test Input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
