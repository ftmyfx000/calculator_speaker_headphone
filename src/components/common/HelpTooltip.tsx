import React, { useState, useRef, useEffect } from 'react';

interface HelpTooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsVisible(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="inline-block relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={(e) => {
          // Only hide if focus is moving outside the tooltip
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setIsVisible(false);
          }
        }}
        className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 transition-colors duration-150"
        aria-label="ヘルプ情報を表示"
        aria-expanded={isVisible}
        aria-haspopup="true"
      >
        {children || '?'}
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          onKeyDown={handleKeyDown}
          className="absolute z-20 w-56 sm:w-64 p-2 sm:p-3 mt-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg left-0 sm:left-auto sm:right-0"
          style={{ top: '100%' }}
        >
          <div className="relative">
            {content}
            <div className="absolute -top-4 sm:-top-5 left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
          </div>
        </div>
      )}
    </div>
  );
};
