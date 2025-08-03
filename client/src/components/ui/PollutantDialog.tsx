// components/PollutantDialog.tsx
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AlertCircle, ThermometerSnowflake, X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Pollutant {
  id: number;
  name: string;
  description: string;
  safeLimit: string;
  currentLevel: number;
  maxSafe: number;
  impact: string;
  sources: string[];
  category: string;
  color: string;
}

interface PollutantDialogProps {
  pollutant: Pollutant | null;
  onClose: () => void;
}

const getCategoryIcon = (category: string, size = 8) => {
  switch (category) {
    case "chemical":
      return <AlertCircle className={`h-${size} w-${size} text-red-500`} />;
    case "biological":
      return <AlertCircle className={`h-${size} w-${size} text-orange-500`} />;
    case "nutrient":
      return <ThermometerSnowflake className={`h-${size} w-${size} text-yellow-500`} />;
    case "physical":
      return <AlertCircle className={`h-${size} w-${size} text-orange-500`} />;
    default:
      return <AlertCircle className={`h-${size} w-${size} text-gray-500`} />;
  }
};

const PollutantDialog = ({ pollutant, onClose }: PollutantDialogProps) => {
  if (!pollutant) return null;
  
  // Unified risk data structure with explicit colors
  const getRiskData = (current: number, maxSafe: number) => {
    const ratio = current / maxSafe;
    
    const riskData = {
      Critical: {
        level: "Critical",
        colorClass: {
          bg: "bg-red-50",
          darkBg: "dark:bg-red-900/20",
          text: "text-red-600",
          darkText: "dark:text-red-400",
          dot: "bg-red-500"
        },
        chartColor: "#ef4444", // red-500
        impactValue: 100,
        actionText: "Immediate remediation required. Contact environmental authorities and implement containment measures.",
        description: "Extremely hazardous levels requiring urgent intervention"
      },
      High: {
        level: "High",
        colorClass: {
          bg: "bg-orange-50",
          darkBg: "dark:bg-orange-900/20",
          text: "text-orange-600",
          darkText: "dark:text-orange-400",
          dot: "bg-orange-500"
        },
        chartColor: "#f97316", // orange-500
        impactValue: 75,
        actionText: "Urgent mitigation needed. Implement treatment solutions and monitor levels closely.",
        description: "Dangerously high levels posing significant threats"
      },
      Moderate: {
        level: "Moderate",
        colorClass: {
          bg: "bg-yellow-50",
          darkBg: "dark:bg-yellow-900/20",
          text: "text-yellow-600",
          darkText: "dark:text-yellow-400",
          dot: "bg-yellow-500"
        },
        chartColor: "#eab308", // yellow-500
        impactValue: 50,
        actionText: "Preventative measures recommended. Regular monitoring and source reduction advised.",
        description: "Elevated levels requiring attention and prevention"
      },
      Low: {
        level: "Low",
        colorClass: {
          bg: "bg-green-50",
          darkBg: "dark:bg-green-900/20",
          text: "text-green-600",
          darkText: "dark:text-green-400",
          dot: "bg-green-500"
        },
        chartColor: "#22c55e", // green-500
        impactValue: 25,
        actionText: "Maintain current monitoring levels. Continue preventive measures to avoid escalation.",
        description: "Within acceptable range but requires ongoing monitoring"
      }
    };

    if (ratio >= 2) return riskData.Critical;
    if (ratio >= 1) return riskData.High;
    if (ratio >= 0.5) return riskData.Moderate;
    return riskData.Low;
  };

  const riskData = getRiskData(pollutant.currentLevel, pollutant.maxSafe);

  // Prepare data for charts
  const levelComparisonData = {
  labels: ['Current Level', 'Safe Limit'],
  datasets: [
    {
      label: 'Concentration',
      data: [pollutant.currentLevel, pollutant.maxSafe],
      backgroundColor: [
        pollutant.currentLevel > pollutant.maxSafe ? '#ef4444' : '#3b82f6',
        '#10b981'
      ],
      hoverBackgroundColor: [
        pollutant.currentLevel > pollutant.maxSafe ? '#ef4444CC' : '#3b82f6CC', // 80% opacity
        '#10b981CC' // 80% opacity
      ],
      borderColor: [
        pollutant.currentLevel > pollutant.maxSafe ? '#dc2626' : '#2563eb',
        '#059669'
      ],
      borderWidth: 1,
      borderRadius: 4,
    }
  ]
};

  // Fixed impact chart with proper colors
  const impactSourcesData = {
    labels: ['Impact Severity'],
    datasets: [
      {
        label: 'Impact',
        data: [riskData.impactValue],
        backgroundColor: riskData.chartColor,
        borderColor: riskData.chartColor,
        borderWidth: 1,
        hoverBackgroundColor: riskData.chartColor + 'CC', // Add alpha for hover
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-3xl w-full shadow-xl overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {getCategoryIcon(pollutant.category)}
            <h2 className="text-2xl font-bold">
              {pollutant.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {pollutant.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3">Level vs Safe Limit</h3>
            <div className="h-48">
              <Bar 
                data={levelComparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Concentration Level'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Impact Severity</h3>
            <div className="h-48">
              <Bar
                data={impactSourcesData}
                options={{
                  indexAxis: 'y' as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Safe Limit
            </h4>
            <p className="text-lg font-semibold">{pollutant.safeLimit}</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Current Level
            </h4>
            <p className="text-lg font-semibold">{pollutant.currentLevel} 
              <span className="text-sm ml-1 font-normal">
                ({pollutant.currentLevel > pollutant.maxSafe ? 'Above' : 'Below'} safe limit)
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Primary Sources
            </h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {pollutant.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Risk Assessment
            </h4>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${riskData.colorClass.dot}`}></span>
              <span className="font-medium capitalize">{riskData.level} Risk</span>
            </div>
            <p className="text-sm mt-2">
              {pollutant.impact}
            </p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {riskData.description}
            </p>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${riskData.colorClass.bg} ${riskData.colorClass.darkBg}`}>
          <h4 className={`text-sm font-medium mb-2 ${riskData.colorClass.text} ${riskData.colorClass.darkText}`}>
            Recommended Actions
          </h4>
          <p className="text-sm">
            {riskData.actionText}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PollutantDialog;