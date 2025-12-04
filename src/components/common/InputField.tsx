import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  unit?: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  unit,
  onChange,
  error,
  id,
}) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="mb-3 sm:mb-4">
      <label
        htmlFor={inputId}
        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            flex-1 px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md shadow-sm text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-1
            transition-colors duration-150
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {unit && (
          <span className="text-xs sm:text-sm text-gray-600 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-right" style={{ fontFamily: 'Arial, sans-serif' }}>
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-xs sm:text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
