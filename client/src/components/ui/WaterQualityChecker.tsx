import { useState, useEffect, useRef, type SetStateAction } from 'react';
import { ChevronDown } from 'lucide-react';
import { parse } from 'papaparse';
import WaterQualityDetailsDialog from './WaterQualityDetailsDialog';

interface WaterQualityData {
  city: string;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  qualityScore: number;
  lastUpdated: string;
  mainPollutants: string[];
}

interface CSVRow {
  'GEMS.Station.Number': string;
  'Sample.Date': string;
  'Parameter.Code': string;
  'Value': string;
  'Unit': string;
}

const CITY_STATION_MAP: { [key: string]: string } = {
  'Bangalore': 'IND01116',
  'Chennai': 'IND01237',
  'Mumbai': 'IND00747',
  'Delhi': 'IND00257',
  'Kolkata': 'IND00210',
  'Hyderabad': 'IND01734',
  'Pune': 'IND00761',
  'Cochin': 'IND00828',
  'Varanasi': 'IND00917'
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
IND00917;"2020-01-04";"00:00";0.3;"Pb-Dis";"0";"";13;"mg/l";"Unknown"`;

const WaterQualityChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityData, setCityData] = useState<WaterQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<WaterQualityData[]>([]);
  const [selectedCityDetails, setSelectedCityDetails] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    parseCSVData();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseCSVData = () => {
    parse<CSVRow>(CSV_DATA, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      transformHeader: (header: string) => header.replace(/"/g, '').trim(),
      transform: (value: string) => value.replace(/"/g, '').trim(),
      complete: (result: { errors: string | any[]; data: CSVRow[]; }) => {
        if (result.errors.length > 0) {
          setError('Error parsing CSV data');
          return;
        }
        setProcessedData(processWaterData(result.data));
      },
      error: (err: { message: SetStateAction<string | null>; }) => setError(err.message)
    });
  };

  const processWaterData = (rawData: CSVRow[]): WaterQualityData[] => {
    const cityMap = new Map<string, WaterQualityData>();

    Object.keys(CITY_STATION_MAP).forEach(city => {
      cityMap.set(city, {
        city,
        quality: 'Excellent',
        qualityScore: 100,
        lastUpdated: '2000-01-01',
        mainPollutants: []
      });
    });

    rawData.forEach(row => {
      const cityEntry = Object.entries(CITY_STATION_MAP).find(
        ([_, station]) => station === row['GEMS.Station.Number']
      );
      if (!cityEntry) return;

      const [city] = cityEntry;
      const cityData = cityMap.get(city)!;
      const value = parseFloat(row.Value);
      const parameter = row['Parameter.Code'];
      const date = row['Sample.Date'];

      if (date > cityData.lastUpdated) {
        cityData.lastUpdated = date;
      }

      let scoreImpact = 0;
      const pollutants = new Set(cityData.mainPollutants);

      switch(parameter) {
        case 'pH':
          if (value < 6.5 || value > 8.5) {
            scoreImpact = 15;
            pollutants.add('pH imbalance');
          }
          break;
        case 'Pb-Dis':
          if (value > 0.01) {
            scoreImpact = Math.min(value * 50, 80);
            pollutants.add('Lead contamination');
          }
          break;
        case 'Cl-Dis':
          if (value > 5) {
            scoreImpact = value * 0.5;
            pollutants.add('High chlorine');
          }
          break;
        case 'F-Dis':
          if (value < 0.5) {
            scoreImpact = 5;
            pollutants.add('Low fluoride');
          }
          break;
        case 'TS':
          if (value > 50) {
            scoreImpact = value * 0.3;
            pollutants.add('High total solids');
          }
          break;
        case 'H-T':
        case 'H-Ca':
          if (value > 150) {
            scoreImpact = (value - 150) * 0.2;
            pollutants.add('Water hardness');
          }
          break;
      }

      cityData.qualityScore = Math.abs(cityData.qualityScore - scoreImpact);
      cityData.mainPollutants = Array.from(pollutants);
    });

    cityMap.forEach(data => {
      if (data.qualityScore >= 80) data.quality = 'Excellent';
      else if (data.qualityScore >= 60) data.quality = 'Good';
      else if (data.qualityScore >= 40) data.quality = 'Fair';
      else if (data.qualityScore >= 20) data.quality = 'Poor';
      else data.quality = 'Critical';
    });

    return Array.from(cityMap.values());
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const data = processedData.find(item => item.city === city);
      if (data) {
        setCityData(data);
      } else {
        setError('No data available for selected city');
      }
      setIsLoading(false);
    }, 300);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Good': return 'bg-green-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
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
            <span>{selectedCity || 'Select a city'}</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Water Quality</p>
                <h4 className="text-2xl font-bold text-black dark:text-white">{cityData.quality}</h4>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getQualityColor(cityData.quality)}`}>
                <span className="text-white font-bold">{Math.round(cityData.qualityScore)}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Main Takeaways</p>
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
                Last updated: {new Date(cityData.lastUpdated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
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