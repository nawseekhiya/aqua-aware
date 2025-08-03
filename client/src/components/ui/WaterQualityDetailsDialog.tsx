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

const CITY_STATION_MAP: { [key: string]: string } = {
  Bangalore: "IND01116",
  Chennai: "IND01237",
  Mumbai: "IND00747",
  Delhi: "IND00257",
  Kolkata: "IND00210",
  Hyderabad: "IND01734",
  Pune: "IND00761",
  Cochin: "IND00828",
  Varanasi: "IND00917",
};

const CSV_DATA = `GEMS.Station.Number;"Sample.Date";"Sample.Time";"Depth";"Parameter.Code";"Analysis.Method.Code";"Value.Flags";"Value";"Unit";"Data.Quality"
IND01116;"2020-04-02";"00:00";0.3;"H-T";"0";"";406.4;"mg/l";"Unknown"
IND01237;"2021-03-01";"00:00";0.3;"H-T";"0";"";192.3;"mg/l";"Unknown"
IND00747;"2021-11-01";"00:00";0.3;"H-Ca";"0";"";94.6;"mg/l";"Unknown"
IND00257;"2021-10-11";"00:00";0.3;"H-T";"0";"";149.87;"mg/l";"Unknown"
IND00210;"2021-07-22";"00:00";0.3;"H-Ca";"0";"";159.5;"mg/l";"Unknown"
IND00761;"2021-08-12";"00:00";0.3;"H-T";"0";"";89.02;"mg/l";"Unknown"
IND00828;"2021-09-02";"00:00";0.3;"H-Ca";"0";"";68.2;"mg/l";"Unknown"
IND00917;"2021-09-11";"00:00";0.3;"H-T";"0";"";122.16;"mg/l";"Unknown"
IND01116;"2021-03-03";"00:00";0.3;"pH";"0";"";6.7;"---";"Unknown"
IND01237;"2021-03-05";"00:00";0.3;"pH";"0";"";7.6;"---";"Unknown"
IND00747;"2021-03-02";"00:00";0.3;"pH";"0";"";7;"---";"Unknown"
IND00257;"2021-03-03";"00:00";0.3;"pH";"0";"";7.7;"---";"Unknown"
IND00210;"2021-03-16";"00:00";0.3;"pH";"0";"";7.83;"---";"Unknown"
IND01734;"2021-03-08";"00:00";0.3;"pH";"0";"";7.18;"---";"Unknown"
IND00761;"2021-03-04";"00:00";0.3;"pH";"0";"";7.1;"---";"Unknown"
IND00828;"2021-03-02";"00:00";0.3;"pH";"0";"";7;"---";"Unknown"
IND00917;"2021-03-03";"00:00";0.3;"pH";"0";"";8.42;"---";"Unknown"
IND01116;"2021-07-12";"00:00";0.3;"Cl-Dis";"0";"";6;"mg/l";"Unknown"
IND01237;"2021-08-11";"00:00";0.3;"Cl-Dis";"0";"";17.85;"mg/l";"Unknown"
IND00747;"2021-08-11";"00:00";0.3;"Cl-Dis";"0";"";13.22;"mg/l";"Unknown"
IND00257;"2021-08-21";"00:00";0.3;"Cl-Dis";"0";"";86.25;"mg/l";"Unknown"
IND00210;"2021-09-21";"00:00";0.3;"Cl-Dis";"0";"";91.06;"mg/l";"Unknown"
IND01734;"2021-09-21";"00:00";0.3;"Cl-Dis";"0";"";30;"mg/l";"Unknown"
IND00761;"2021-11-01";"00:00";0.3;"Cl-Dis";"0";"";38;"mg/l";"Unknown"
IND00828;"2021-01-09";"00:00";0.3;"Cl-Dis";"0";"";109.2;"mg/l";"Unknown"
IND00917;"2021-08-23";"00:00";0.3;"Cl-Dis";"0";"";94.6;"mg/l";"Unknown"
IND01116;"2020-12-16";"00:00";0.3;"F-Dis";"0";"";0.38;"mg/l";"Unknown"
IND01237;"2020-12-05";"00:00";0.3;"F-Dis";"0";"";0.2;"mg/l";"Unknown"
IND00747;"2020-12-05";"00:00";0.3;"F-Dis";"0";"";0.2;"mg/l";"Unknown"
IND00257;"2020-12-08";"00:00";0.3;"F-Dis";"0";"";0.32;"mg/l";"Unknown"
IND00210;"2020-11-26";"00:00";0.3;"F-Dis";"0";"";0.36;"mg/l";"Unknown"
IND01734;"2020-11-04";"00:00";0.3;"F-Dis";"0";"";0.2;"mg/l";"Unknown"
IND00761;"2020-11-12";"00:00";0.3;"F-Dis";"0";"";0.05;"mg/l";"Unknown"
IND00828;"2020-07-07";"00:00";0.3;"F-Dis";"0";"";0.08;"mg/l";"Unknown"
IND00917;"2020-12-29";"00:00";0.3;"F-Dis";"0";"";0.25;"mg/l";"Unknown"
IND01237;"2020-01-02";"00:00";0.3;"TS";"0";"";16;"mg/l";"Unknown"
IND00257;"2020-01-06";"00:00";0.3;"TS";"0";"";58;"mg/l";"Unknown"
IND00210;"2020-01-20";"00:00";0.3;"TS";"0";"";28;"mg/l";"Unknown"
IND01734;"2020-01-04";"00:00";0.3;"TS";"0";"";13;"mg/l";"Unknown"
IND00828;"2020-01-22";"00:00";0.3;"TS";"0";"";35;"mg/l";"Unknown"
IND01116;"2020-10-21";"00:00";0.3;"Pb-Dis";"0";"";0.008;"mg/l";"Unknown"
IND01237;"2020-10-03";"00:00";0.3;"Pb-Dis";"0";"";0.1;"mg/l";"Unknown"
IND00747;"2020-02-17";"00:00";0.3;"Pb-Dis";"0";"";0.01212;"mg/l";"Unknown"
IND00257;"2020-10-08";"00:00";0.3;"Pb-Dis";"0";"";0.1;"mg/l";"Unknown"
IND00210;"2020-04-13";"00:00";0.3;"Pb-Dis";"0";"";0.079;"mg/l";"Unknown"
IND01734;"2020-10-08";"00:00";0.3;"Pb-Dis";"0";"";0.016;"mg/l";"Unknown"
IND00761;"2018-04-05";"00:00";0.3;"Pb-Dis";"0";"";0.00085;"mg/l";"Unknown"
IND00828;"2020-10-17";"00:00";0.3;"Pb-Dis";"0";"";0.037;"mg/l";"Unknown"
IND00917;"2020-01-04";"00:00";0.3;"Pb-Dis";"0";"";13;"mg/l";"Unknown"`; // Paste the same CSV data here

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

  useEffect(() => {
    const parseCSVData = () => {
      const stationId = CITY_STATION_MAP[city];
      if (!stationId) return;

      const rows = CSV_DATA.split("\n")
        .slice(1)
        .map((row) =>
          row.split(";").map((cell) => cell.replace(/"/g, "").trim())
        );

      const cityData = rows.filter((row) => row[0] === stationId);
      const parameterMap: { [key: string]: ParameterData } = {};

      cityData.forEach((row) => {
        const paramCode = row[4];
        const value = parseFloat(row[7]);
        const unit = row[8];
        const date = row[1];

        const parameter = getParameterDetails(paramCode, value, unit, date);
        if (parameter) {
          parameterMap[paramCode] = parameter;
        }
      });

      setParameters(Object.values(parameterMap));
    };

    parseCSVData();
  }, [city]);

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
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
              {parameters.map((param) => (
                <motion.div
                  key={param.name}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
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
                      className={`absolute left-0 top-0 h-full rounded-full ${getBarColor(param)}`}
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
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaterQualityDetailsDialog;
