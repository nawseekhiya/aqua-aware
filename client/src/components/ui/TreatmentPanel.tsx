import { motion } from "framer-motion";
import {
  Home,
  FlaskRound as Flask,
  ChevronRight,
  Check,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface Treatment {
  id: string;
  title: string;
  description: string;
  effectiveAgainst: string[];
  notEffectiveAgainst: string[];
  instructions?: string[];
  process?: string[];
  difficulty?: string;
  efficiency?: string;
  safety: "high" | "medium" | "low";
}

interface Props {
  activeTab: "diy" | "lab";
  selectedTreatment: string | null;
  currentTreatments: Treatment[];
  onSelectTreatment: (id: string) => void;
}

const getSafetyIcon = (safety: string) => {
  switch (safety) {
    case "high":
      return <Check className="h-5 w-5 text-green-500" />;
    case "medium":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "low":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const getSafetyText = (safety: string) => {
  switch (safety) {
    case "high":
      return "High Safety";
    case "medium":
      return "Medium Safety";
    case "low":
      return "Low Safety";
    default:
      return "";
  }
};

const getSafetyClass = (safety: string) => {
  switch (safety) {
    case "high":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "low":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "";
  }
};

export default function TreatmentPanel({
  activeTab,
  selectedTreatment,
  currentTreatments,
  onSelectTreatment,
}: Props) {
  const selectedTreatmentData = currentTreatments.find(
    (t) => t.id === selectedTreatment
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              {activeTab === "diy"
                ? "DIY Treatment Methods"
                : "Laboratory Techniques"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {activeTab === "diy"
                ? "Simple methods you can implement at home with basic materials"
                : "Advanced techniques requiring specialized equipment and expertise"}
            </p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentTreatments.map((treatment) => (
              <li key={treatment.id}>
                <button
                  onClick={() => onSelectTreatment(treatment.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-300 ${
                    selectedTreatment === treatment.id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-4 p-2 rounded-full ${
                        selectedTreatment === treatment.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {activeTab === "diy" ? (
                        <Home className="h-5 w-5" />
                      ) : (
                        <Flask className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex flex-col pr-2">
                      <h3
                        className={`font-medium ${
                          selectedTreatment === treatment.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {treatment.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {treatment.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`lg:rotate-0 md:rotate-90 sm:rotate-90 rotate-90 h-5 w-5 transition-transform duration-300 ${
                      selectedTreatment === treatment.id
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedTreatmentData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden h-full"
          >
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                {selectedTreatmentData.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedTreatmentData.description}
              </p>

              <div className="flex items-center space-x-3 mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSafetyClass(
                    selectedTreatmentData.safety
                  )}`}
                >
                  {getSafetyIcon(selectedTreatmentData.safety)}
                  <span className="ml-1">
                    {getSafetyText(selectedTreatmentData.safety)}
                  </span>
                </span>
                {activeTab === "diy" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {
                      (selectedTreatmentData as { difficulty?: string })
                        .difficulty
                    }{" "}
                    Difficulty
                  </span>
                )}
                {activeTab === "lab" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {
                      (selectedTreatmentData as { efficiency?: string })
                        .efficiency
                    }{" "}
                    Efficiency
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                    Effective Against
                  </h3>
                  <ul className="space-y-2">
                    {selectedTreatmentData.effectiveAgainst.map(
                      (item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                    Not Effective Against
                  </h3>
                  <ul className="space-y-2">
                    {selectedTreatmentData.notEffectiveAgainst.map(
                      (item, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-3">
                  {activeTab === "diy" ? "Instructions" : "Process"}
                </h3>
                <ol className="space-y-3">
                  {(activeTab === "diy"
                    ? (selectedTreatmentData as { instructions?: string[] })
                        .instructions
                    : (selectedTreatmentData as { process?: string[] }).process
                  )?.map((step: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="mb-4 text-gray-400">
                {activeTab === "diy" ? (
                  <Home className="h-12 w-12 mx-auto" />
                ) : (
                  <Flask className="h-12 w-12 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                Select a treatment method
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from the list to view detailed information
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
