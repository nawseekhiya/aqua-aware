import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import WaterQualityDetailsDialog from "./WaterQualityDetailsDialog";

interface WaterQualityData {
  city: string;
  quality: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  qualityScore: number;
  lastUpdated: string;
  mainPollutants: string[];
}

const WaterQualityChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityData, setCityData] = useState<WaterQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<WaterQualityData[]>([]);
  const [selectedCityDetails, setSelectedCityDetails] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch city summaries from server on mount
    fetchSummaries();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const API_BASE =
    (import.meta.env.VITE_API_BASE as string) || "http://localhost:3000";

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/water-quality`);
      if (!res.ok) throw new Error(`Failed to fetch summaries: ${res.status}`);
      const data: WaterQualityData[] = await res.json();
      setProcessedData(data);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
    setIsLoading(true);
    setError(null);
    // We already have summaries from the server; find the selected city's summary and show it.
    const data = processedData.find((item) => item.city === city);
    if (data) {
      setCityData(data);
      setIsLoading(false);
    } else {
      // Unexpected: try refetching summaries once
      fetchSummaries()
        .then(() => {
          const refetched = processedData.find((p) => p.city === city);
          if (refetched) setCityData(refetched);
          else setError("No data available for selected city");
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent":
        return "bg-emerald-500";
      case "Good":
        return "bg-green-500";
      case "Fair":
        return "bg-yellow-500";
      case "Poor":
        return "bg-orange-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          City Water Quality Checker
        </h3>

        <div className="relative mb-6" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-left flex items-center justify-between text-black dark:text-white transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30"
          >
            <span>{selectedCity || "Select a city"}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {processedData.map((item) => (
                  <li key={item.city}>
                    <button
                      type="button"
                      onClick={() => handleCitySelect(item.city)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white transition-colors duration-200"
                    >
                      {item.city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {cityData && !isLoading && !error && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Water Quality
                </p>
                <h4 className="text-2xl font-bold text-black dark:text-white">
                  {cityData.quality}
                </h4>
              </div>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${getQualityColor(
                  cityData.quality
                )}`}
              >
                <span className="text-white font-bold">
                  {Math.round(cityData.qualityScore)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Main Takeaways
              </p>
              <div className="flex flex-wrap gap-2">
                {cityData.mainPollutants.map((pollutant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  >
                    {pollutant}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated:{" "}
                {new Date(cityData.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <button
              onClick={() => setSelectedCityDetails(cityData.city)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              View Detailed Analysis
            </button>
          </div>
        )}
      </div>

      {selectedCityDetails && (
        <WaterQualityDetailsDialog
          city={selectedCityDetails}
          onClose={() => setSelectedCityDetails(null)}
        />
      )}
    </div>
  );
};

export default WaterQualityChecker;
