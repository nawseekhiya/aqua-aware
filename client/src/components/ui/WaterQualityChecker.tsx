import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import WaterQualityDetailsDialog from "./WaterQualityDetailsDialog";
import Loader from "./Loader";

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
  // `isLoading` is used for fetching a selected city's full data.
  // Use a separate `summariesLoading` flag for the initial list fetch so
  // the small in-component spinner only appears when the user requests
  // a city's data.
  const [isLoading, setIsLoading] = useState(false);
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<WaterQualityData[]>([]);
  const [selectedCityDetails, setSelectedCityDetails] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_BASE =
    (import.meta.env.VITE_API_BASE as string) || "http://localhost:3000";

  const fetchSummaries = async () => {
    setSummariesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/water-quality`);
      if (!res.ok) throw new Error(`Failed to fetch summaries: ${res.status}`);
      const data: WaterQualityData[] = await res.json();
      setProcessedData(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setSummariesLoading(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCitySelect = async (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the city summary from the server so the spinner shows during a real network request
      const res = await fetch(
        `${API_BASE}/api/v1/water-quality/${encodeURIComponent(city)}`
      );
      if (!res.ok)
        throw new Error(`Failed to fetch city summary: ${res.status}`);
      const json = await res.json();
      // API returns { summary, measurements } — use summary if available
      const summary = json.summary || json;
      if (summary) {
        // normalize shape to WaterQualityData
        const rawPollutants =
          summary.main_pollutants ?? summary.mainPollutants ?? [];
        let mainPollutants: string[] = [];
        if (Array.isArray(rawPollutants)) {
          mainPollutants = rawPollutants as string[];
        } else if (typeof rawPollutants === "string") {
          // try JSON parse (some APIs store arrays as JSON strings), otherwise split by comma
          try {
            const parsed = JSON.parse(rawPollutants);
            if (Array.isArray(parsed)) mainPollutants = parsed.map(String);
            else mainPollutants = [String(parsed)];
          } catch {
            mainPollutants = rawPollutants
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          }
        }

        const mapped: WaterQualityData = {
          city: summary.city || city,
          quality: (summary.quality as WaterQualityData["quality"]) || "Fair",
          qualityScore: Number(
            summary.qualityScore ?? summary.quality_score ?? 0
          ),
          lastUpdated:
            summary.lastUpdated ||
            summary.last_updated ||
            new Date().toISOString(),
          mainPollutants,
        };
        setCityData(mapped);
      } else {
        setError("No data available for selected city");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
            aria-busy={summariesLoading ? "true" : "false"}
            disabled={summariesLoading}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-left flex items-center justify-between text-black dark:text-white transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30"
          >
            <span>
              {selectedCity ||
                (summariesLoading ? "Loading cities..." : "Select a city")}
            </span>
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
          // use compact Loader component for the inline spinner
          <Loader compact={true} />
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
