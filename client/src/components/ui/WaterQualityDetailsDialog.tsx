import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface WaterQualityDetailsDialogProps {
  city: string;
  onClose: () => void;
}

interface ParameterData {
  name: string;
  value: number;
  unit: string;
  date: string;
  safeRange: string;
  type?: string;
}

const parseSafeRange = (
  safeRange: string
): { min: number | null; max: number | null } => {
  const cleaned = safeRange.replace(/[^0-9.<>-]/g, "");

  if (cleaned.startsWith("<")) {
    return { min: null, max: parseFloat(cleaned.slice(1)) };
  }
  if (cleaned.includes("-")) {
    const [min, max] = cleaned.split("-").map(parseFloat);
    return { min, max };
  }
  return { min: null, max: null };
};

const calculateBarWidth = (param: ParameterData): number => {
  const { min, max } = parseSafeRange(param.safeRange);

  if (min !== null && max !== null) {
    const clampedValue = Math.min(Math.max(param.value, min), max);
    return ((clampedValue - min) / (max - min)) * 100;
  }
  if (max !== null) {
    return Math.min((param.value / max) * 100, 100);
  }
  return 0;
};

const getBarColor = (param: ParameterData) => {
  const { min, max } = parseSafeRange(param.safeRange);
  let isUnsafe = false;

  if (min !== null && max !== null) {
    isUnsafe = param.value < min || param.value > max;
  } else if (max !== null) {
    isUnsafe = param.value > max;
  } else if (min !== null) {
    isUnsafe = param.value < min;
  }

  return isUnsafe ? "bg-red-500" : "bg-green-500";
};

const WaterQualityDetailsDialog = ({
  city,
  onClose,
}: WaterQualityDetailsDialogProps) => {
  const [parameters, setParameters] = useState<ParameterData[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const getParameterDetails = (
    code: string,
    value: number,
    unit: string,
    date: string
  ): ParameterData | null => {
    const params: { [key: string]: Partial<ParameterData> } = {
      pH: {
        name: "pH Level",
        safeRange: "6.5 - 8.5",
        type: "Alkalinity/Acidity",
      },
      "H-T": {
        name: "Total Hardness",
        safeRange: "< 300 mg/L",
        type: "Calcium/Magnesium",
      },
      "H-Ca": {
        name: "Calcium Hardness",
        safeRange: "75-150 mg/L",
      },
      "Cl-Dis": {
        name: "Chlorine",
        safeRange: "< 4 mg/L",
      },
      "F-Dis": {
        name: "Fluoride",
        safeRange: "0.7-1.5 mg/L",
      },
      TS: {
        name: "Total Solids",
        safeRange: "< 500 mg/L",
      },
      "Pb-Dis": {
        name: "Lead",
        safeRange: "< 0.01 mg/L",
      },
    };

    const base = params[code];
    return base ? ({ ...base, value, unit, date } as ParameterData) : null;
  };

  useEffect(() => {
    // Fetch measurements for the selected city from the server and map them to parameters
    const API_BASE =
      (import.meta.env.VITE_API_BASE as string) || "http://localhost:3000";

    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      setParameters([]);
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/water-quality/${encodeURIComponent(city)}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch city details: ${res.status}`);
        const json = await res.json();
        const measurements: any[] = json.measurements || [];

        const parameterMap: { [key: string]: ParameterData } = {};
        measurements.forEach((m) => {
          const code =
            m.parameter_code ||
            (m as any).parameterCode ||
            (m as any).parameter;
          if (!code) return;
          const value = Number(m.value);
          const unit = m.unit || "";
          const date =
            m.sample_date || m.sampleDate || m.sampleDateString || "";

          const parameter = getParameterDetails(code, value, unit, date);
          if (!parameter) return;

          // keep the latest measurement for each parameter
          const existing = parameterMap[code];
          if (!existing || new Date(parameter.date) > new Date(existing.date)) {
            parameterMap[code] = parameter;
          }
        });

        setParameters(Object.values(parameterMap));
      } catch (err) {
        setParameters([]);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [city]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="text-2xl font-bold text-gray-800 dark:text-white"
              >
                {city} Water Quality Details
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <X size={24} />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {isLoadingDetails ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-2" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full w-5/6" />
                  </motion.div>
                ))
              ) : parameters.length ? (
                parameters.map((param) => (
                  <motion.div
                    key={param.name}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {param.name}
                        </h3>
                        {param.type && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {param.type}
                          </p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {param.value.toFixed(2)}{" "}
                        {param.name === "pH Level" ? "" : param.unit}
                      </span>
                    </div>

                    <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateBarWidth(param)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`absolute left-0 top-0 h-full rounded-full ${getBarColor(
                          param
                        )}`}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Safe range: {param.safeRange}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {new Date(param.date).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-gray-600 dark:text-gray-300">
                  No measurements found.
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaterQualityDetailsDialog;
