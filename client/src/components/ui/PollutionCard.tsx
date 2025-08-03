import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

interface PollutionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  color: string;
  currentLevel: number;
  maxSafe: number;
  safeLimit: string;
  impact: string;
  sources: string[];
}

const PollutionCard = ({
  title,
  description,
  icon,
  image,
  color,
  currentLevel,
  maxSafe,
  safeLimit,
  impact,
  sources
}: PollutionCardProps) => {
  const getProgressColor = () => {
    switch (color) {
      case 'red': return 'red';
      case 'yellow': return 'yellow';
      case 'orange': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full min-h-[320px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Front Side */}
      <div className="h-full flex flex-col">
        {image && (
          <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
            {description}
          </p>
          
          {/* Always-visible Progress Bar */}
          <ProgressBar
            value={currentLevel}
            maxValue={maxSafe}
            label={`${safeLimit} (safe limit)`}
            colorScheme={getProgressColor()}
            format="custom"
            customFormat={() => `${currentLevel.toFixed(2)}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PollutionCard;