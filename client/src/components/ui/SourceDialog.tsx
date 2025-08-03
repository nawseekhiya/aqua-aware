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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const waterCategoryData = {
  green: {
    composition: {
      organic: 65,
      nutrients: 30,
      solids: 5,
    },
    phRange: [6.0, 8.5],
    hardness: '150-300 ppm',
    treatment: 'Biological treatment, Aeration',
    risks: 'Algal blooms, Oxygen depletion',
  },
  grey: {
    composition: {
      chemicals: 45,
      detergents: 35,
      metals: 20,
    },
    phRange: [7.5, 10.0],
    hardness: '200-500 ppm',
    treatment: 'Chemical filtration, Sedimentation',
    risks: 'Toxic to aquatic life, Bioaccumulation',
  },
  black: {
    composition: {
      pathogens: 50,
      toxins: 35,
      organic: 15,
    },
    phRange: [4.5, 6.5],
    hardness: '600-1000 ppm',
    treatment: 'Advanced oxidation, Chlorination',
    risks: 'Human health hazards, Ecosystem collapse',
  },
};

type SourceDialogProps = {
  category: keyof typeof waterCategoryData | null;
  onClose: () => void;
};

const SourceDialog = ({ category, onClose }: SourceDialogProps) => {
  if (!category) return null;
  
  const data = waterCategoryData[category];
  const compositionData = {
    labels: Object.keys(data.composition),
    datasets: [{
      label: 'Composition (%)',
      data: Object.values(data.composition),
      backgroundColor: [
        '#dc2626', '#eab308', '#166534'
      ],
    }]
  };

  const phData = {
    labels: ['pH Range'],
    datasets: [{
      label: 'pH Minimum',
      data: [data.phRange[0]],
      backgroundColor: '#3b82f6',
    },
    {
      label: 'pH Maximum',
      data: [data.phRange[1] - data.phRange[0]],
      backgroundColor: '#64748b',
    }]
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
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold capitalize">
            {category} Water Analysis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3">Composition Breakdown</h3>
            <div className="h-48">
              <Bar 
                data={compositionData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">pH Range</h3>
            <div className="h-48">
              <Bar
                data={phData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { stacked: true, max: 14 },
                    y: { display: false }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Average Hardness
            </h4>
            <p className="text-lg font-semibold">{data.hardness}</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Common Treatment Methods
            </h4>
            <p className="text-sm">{data.treatment}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Associated Risks
          </h4>
          <p className="text-sm">{data.risks}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SourceDialog;