import { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
  value: number;
  maxValue: number;
  label: string;
  colorScheme?: 'green' | 'blue' | 'yellow' | 'red' | 'default';
  animated?: boolean;
  showValue?: boolean;
  format?: 'percent' | 'value' | 'custom';
  customFormat?: (value: number, maxValue: number) => string;
}

const ProgressBar = ({
  value,
  maxValue,
  label,
  colorScheme = 'default',
  animated = true,
  showValue = true,
  format = 'percent',
  customFormat,
}: ProgressBarProps) => {
  const [width, setWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const hasAnimated = useRef(false);

  const percentage = (value / maxValue) * 100;
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  
  const getColorClass = () => {
    switch (colorScheme) {
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-600';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-blue-600';
    }
  };

  const formatValue = () => {
    switch (format) {
      case 'percent':
        return `${Math.round(percentage)}%`;
      case 'value':
        return `${value} / ${maxValue}`;
      case 'custom':
        return customFormat ? customFormat(value, maxValue) : `${value}`;
      default:
        return `${Math.round(percentage)}%`;
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        setWidth(safePercentage);
      }
    }, { threshold: 0.1 });
    
    if (progressRef.current) {
      observer.current.observe(progressRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [safePercentage]);

  return (
    <div className="mb-4" ref={progressRef}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        {showValue && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formatValue()}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${getColorClass()} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;