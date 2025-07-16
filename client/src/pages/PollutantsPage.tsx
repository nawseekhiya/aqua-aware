import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  AlertCircle,
  AlertCircle as CircleAlert,
  ThermometerSnowflake,
  X
} from "lucide-react";
import PollutionCard from "../components/ui/PollutionCard";

const pollutants = [
  {
    id: 1,
    name: "Heavy Metals",
    description:
      "Toxic metals like lead, mercury, arsenic, and cadmium from industrial processes and mining.",
    safeLimit: "0.01 mg/L",
    currentLevel: 0.028,
    maxSafe: 0.01,
    impact:
      "Bioaccumulate in organisms, causing neurological damage, organ failure, and developmental issues.",
    sources: ["Industrial discharge", "Mining operations", "E-waste"],
    category: "chemical",
    color: "red",
  },
  {
    id: 2,
    name: "Nitrates",
    description:
      "Compounds from fertilizers, animal waste, and sewage that contribute to algal blooms.",
    safeLimit: "10 mg/L",
    currentLevel: 23.5,
    maxSafe: 10,
    impact:
      'Causes eutrophication, reduces oxygen levels, and can lead to infant methemoglobinemia ("blue baby syndrome").',
    sources: ["Agricultural runoff", "Sewage", "Animal farms"],
    category: "nutrient",
    color: "yellow",
  },
  {
    id: 3,
    name: "Fecal Coliform",
    description:
      "Bacteria from human and animal waste indicating the presence of pathogens.",
    safeLimit: "0 CFU/100mL",
    currentLevel: 2300,
    maxSafe: 1000,
    impact:
      "Causes gastrointestinal illness, typhoid, hepatitis, and other waterborne diseases.",
    sources: ["Sewage discharge", "Animal waste", "Leaking septic systems"],
    category: "biological",
    color: "orange",
  },
  {
    id: 4,
    name: "Pesticides",
    description:
      "Chemical compounds used to control pests that wash into water bodies.",
    safeLimit: "0.1 μg/L",
    currentLevel: 0.35,
    maxSafe: 0.1,
    impact:
      "Disrupt endocrine systems, cause reproductive issues, and harm non-target organisms.",
    sources: [
      "Agricultural runoff",
      "Pest control operations",
      "Manufacturing facilities",
    ],
    category: "chemical",
    color: "red",
  },
  {
    id: 5,
    name: "Pharmaceutical Residues",
    description:
      "Medications and drugs that enter water through human excretion and improper disposal.",
    safeLimit: "< 0.1 μg/L",
    currentLevel: 0.18,
    maxSafe: 0.1,
    impact:
      "Affect aquatic organisms, contribute to antibiotic resistance, and potentially impact human health.",
    sources: [
      "Hospital waste",
      "Household disposal",
      "Pharmaceutical manufacturing",
    ],
    category: "chemical",
    color: "red",
  },
  {
    id: 6,
    name: "Microplastics",
    description:
      "Tiny plastic particles < 5mm that result from plastic breakdown or microbeads in products.",
    safeLimit: "0 particles/L",
    currentLevel: 5.2,
    maxSafe: 1,
    impact:
      "Accumulate in food chains, absorb other pollutants, and can transfer to human tissues.",
    sources: ["Plastic waste", "Synthetic textiles", "Cosmetic products"],
    category: "physical",
    color: "orange",
  },
  {
    id: 7,
    name: "Phosphates",
    description:
      "Compounds from detergents and fertilizers that promote excessive algae growth.",
    safeLimit: "0.1 mg/L",
    currentLevel: 0.8,
    maxSafe: 0.1,
    impact:
      "Causes eutrophication, algal blooms, and oxygen depletion in water bodies.",
    sources: ["Detergents", "Fertilizers", "Sewage"],
    category: "nutrient",
    color: "yellow",
  },
  {
    id: 8,
    name: "Dissolved Oxygen Depletion",
    description:
      "Reduction in oxygen levels due to organic pollution and algal decomposition.",
    safeLimit: "> 5 mg/L",
    currentLevel: 3.2,
    maxSafe: 5,
    impact:
      "Suffocates aquatic life, reduces biodiversity, and creates dead zones.",
    sources: ["Organic waste", "Algal blooms", "Thermal pollution"],
    category: "physical",
    color: "orange",
  },
  {
    id: 9,
    name: "Oil & Petroleum",
    description:
      "Crude oil and its derivatives from spills, leaks, and improper disposal.",
    safeLimit: "< 0.01 mg/L",
    currentLevel: 0.037,
    maxSafe: 0.01,
    impact:
      "Coats aquatic organisms, suffocates marine life, and is toxic when ingested.",
    sources: ["Oil spills", "Industrial discharge", "Urban runoff"],
    category: "chemical",
    color: "red",
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "chemical":
      return <AlertCircle className="h-8 w-8 text-red-500" />;
    case "biological":
      return <CircleAlert className="h-8 w-8 text-orange-500" />;
    case "nutrient":
      return <ThermometerSnowflake className="h-8 w-8 text-yellow-500" />;
    case "physical":
      return <AlertCircle className="h-8 w-8 text-orange-500" />;
    default:
      return <AlertCircle className="h-8 w-8 text-gray-500" />;
  }
};

const PollutantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const filteredPollutants = pollutants.filter((pollutant) => {
    const matchesSearch =
      pollutant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pollutant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || pollutant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "chemical", name: "Chemical", color: "bg-red-500" },
    { id: "biological", name: "Biological", color: "bg-orange-500" },
    { id: "nutrient", name: "Nutrient", color: "bg-yellow-500" },
    { id: "physical", name: "Physical", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          <span className="gradient-text">Water Pollutants</span> in India
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-16">
          Understanding the key pollutants affecting India's water bodies and
          their impacts on ecosystems and human health.
        </p>

        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search pollutants..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-12 pr-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPollutants.length > 0 ? (
            filteredPollutants.map((pollutant) => (
              <div 
                key={pollutant.id}
              >
                <PollutionCard
                  title={pollutant.name}
                  description={pollutant.description}
                  icon={getCategoryIcon(pollutant.category)}
                  color={pollutant.color}
                  currentLevel={pollutant.currentLevel}
                  maxSafe={pollutant.maxSafe}
                  safeLimit={pollutant.safeLimit}
                  impact={pollutant.impact}
                  sources={pollutant.sources}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No pollutants match your search criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PollutantsPage;