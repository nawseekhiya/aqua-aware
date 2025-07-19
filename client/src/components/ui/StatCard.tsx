import { useState, useEffect, useRef } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: React.ReactNode;
  accentColor?: string;
  duration?: number;
}

const StatCard = ({
  title,
  value,
  unit,
  description,
  icon,
  accentColor = 'from-blue-600 to-blue-400',
  duration = 2000,
}: StatCardProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        let startTime: number;
        const startValue = 0;
        const endValue = value;
        
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
          
          setCount(currentCount);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });
    
    if (countRef.current) {
      observer.current.observe(countRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [value, duration]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-black dark:text-white" ref={countRef}>
              {count.toLocaleString()}
            </span>
            <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${accentColor} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;