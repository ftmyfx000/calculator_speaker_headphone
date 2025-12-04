import React from 'react';

interface ResultDisplayProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
  precision?: number;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  label,
  value,
  unit,
  precision = 4,
}) => {
  const formatValue = (val: number | null | undefined): string => {
    if (val === null || val === undefined || isNaN(val)) {
      return '—';
    }
    return val.toFixed(precision);
  };

  return (
    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200" role="status" aria-live="polite">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
        <span className="text-xs sm:text-sm font-medium text-gray-700" id={`result-label-${label.replace(/\s+/g, '-')}`}>
          {label}
        </span>
        <div className="flex items-center gap-1 sm:gap-2" aria-labelledby={`result-label-${label.replace(/\s+/g, '-')}`}>
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            {formatValue(value)}
          </span>
          {unit && value !== null && value !== undefined && !isNaN(value) && (
            <span className="text-xs sm:text-sm text-gray-600 font-medium" aria-label="単位">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
