import React, { useState } from 'react';

interface VariableDefinition {
  symbol: string;
  description: string;
  unit?: string;
}

interface FormulaDisplayProps {
  formula: string;
  variables?: VariableDefinition[];
  highlightSymbol?: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  variables = [],
  highlightSymbol,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to render formula with highlighted symbol
  const renderFormula = () => {
    if (!highlightSymbol) {
      return formula;
    }

    // Split formula by the highlight symbol and wrap it with highlighting
    const parts = formula.split(new RegExp(`(${highlightSymbol}(?![a-zA-Z]))`));
    return parts.map((part, index) => {
      if (part === highlightSymbol) {
        return (
          <span key={index} className="bg-yellow-200 font-bold px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 rounded-md border border-blue-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">計算式</h4>
          <div className="font-mono text-xs sm:text-sm text-blue-800 bg-white p-2 rounded border border-blue-100 overflow-x-auto">
            {renderFormula()}
          </div>
        </div>
        {variables.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 whitespace-nowrap self-start sm:self-auto"
            aria-expanded={isExpanded}
            aria-controls="variable-definitions"
            aria-label={isExpanded ? '変数の定義を隠す' : '変数の定義を表示'}
          >
            {isExpanded ? '変数を隠す ▲' : '変数を表示 ▼'}
          </button>
        )}
      </div>
      
      {isExpanded && variables.length > 0 && (
        <div
          id="variable-definitions"
          className="mt-3 pt-3 border-t border-blue-200"
        >
          <h5 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">変数の定義</h5>
          <dl className="space-y-1">
            {variables.map((variable, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-xs sm:text-sm">
                <dt className="font-mono font-semibold text-blue-800 sm:min-w-[3rem]">
                  {variable.symbol}:
                </dt>
                <dd className="text-blue-900">
                  {variable.description}
                  {variable.unit && (
                    <span className="text-blue-700 ml-1">({variable.unit})</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};
