import { useState } from "react";
import { Home, FlaskRound as Flask } from "lucide-react";
import TreatmentPanel from "../components/ui/TreatmentPanel";

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

const treatments: { diy: Treatment[]; lab: Treatment[] } = {
  diy: [
    {
      id: "d1",
      title: "Boiling",
      description:
        "Heat water to rolling boil for at least one minute to kill most pathogens",
      effectiveAgainst: ["Bacteria", "Viruses", "Protozoa"],
      notEffectiveAgainst: [
        "Chemical pollutants",
        "Heavy metals",
        "Pesticides",
      ],
      instructions: [
        "Fill a clean pot with water",
        "Heat until water reaches a rolling boil",
        "Boil for at least 1 minute (3 minutes at elevations above 2,000 meters)",
        "Let cool naturally and store in clean containers",
      ],
      difficulty: "Easy",
      safety: "high",
    },
    {
      id: "d2",
      title: "Solar Disinfection (SODIS)",
      description:
        "Using sunlight and transparent PET bottles to disinfect water",
      effectiveAgainst: ["Bacteria", "Viruses", "Some protozoa"],
      notEffectiveAgainst: [
        "Chemical pollutants",
        "Heavy metals",
        "Highly turbid water",
      ],
      instructions: [
        "Fill clean, transparent PET bottles with water (up to 2L)",
        "Ensure water is not highly turbid (should be able to read newspaper through it)",
        "Place bottles horizontally in direct sunlight for at least 6 hours (cloudy days: 2 days)",
        "Store properly after disinfection",
      ],
      difficulty: "Easy",
      safety: "medium",
    },
    {
      id: "d3",
      title: "Cloth Filtration",
      description:
        "Using folded cotton cloth to remove larger particles and some pathogens",
      effectiveAgainst: [
        "Large particles",
        "Some bacteria",
        "Cholera-causing bacteria",
      ],
      notEffectiveAgainst: [
        "Most pathogens",
        "Chemicals",
        "Dissolved contaminants",
      ],
      instructions: [
        "Take clean cotton cloth (sari cloth works well)",
        "Fold 4-8 times to create multiple layers",
        "Pour water through the cloth into a clean container",
        "Should be combined with other methods for complete safety",
      ],
      difficulty: "Very Easy",
      safety: "low",
    },
    {
      id: "d4",
      title: "Charcoal Filtration",
      description: "Using activated charcoal to adsorb certain contaminants",
      effectiveAgainst: ["Some chemicals", "Chlorine", "Bad tastes and odors"],
      notEffectiveAgainst: [
        "Most pathogens",
        "Heavy metals",
        "Many dissolved substances",
      ],
      instructions: [
        "Create layers in a container: gravel at bottom, sand in middle, crushed charcoal on top",
        "Pour water through the filter slowly",
        "Collect filtered water in clean container",
        "Should be combined with disinfection methods",
      ],
      difficulty: "Medium",
      safety: "medium",
    },
    {
      id: "d5",
      title: "Alum Coagulation",
      description:
        "Using alum (potassium aluminum sulfate) to precipitate particles",
      effectiveAgainst: ["Suspended particles", "Some bacteria", "Turbidity"],
      notEffectiveAgainst: ["Dissolved chemicals", "Viruses", "Heavy metals"],
      instructions: [
        "Add a pinch of alum (approximately 7g per 20L)",
        "Stir rapidly for 1-2 minutes, then slowly for 5 minutes",
        "Let stand for 2-3 hours to allow particles to settle",
        "Carefully pour or siphon clear water from the top",
      ],
      difficulty: "Medium",
      safety: "medium",
    },
  ],
  lab: [
    {
      id: "l1",
      title: "Reverse Osmosis",
      description:
        "Forcing water through a semi-permeable membrane to remove contaminants",
      effectiveAgainst: [
        "Most dissolved substances",
        "Bacteria",
        "Viruses",
        "Heavy metals",
      ],
      notEffectiveAgainst: [
        "Some volatile organic compounds",
        "Certain pesticides",
      ],
      process: [
        "Pre-filtration to remove larger particles",
        "Pressure applied to force water through membrane",
        "Contaminants blocked by membrane structure",
        "Post-treatment disinfection for safety",
      ],
      efficiency: "Very High",
      safety: "high",
    },
    {
      id: "l2",
      title: "UV Disinfection",
      description: "Using ultraviolet light to damage the DNA of pathogens",
      effectiveAgainst: ["Bacteria", "Viruses", "Protozoa"],
      notEffectiveAgainst: [
        "Chemical contaminants",
        "Turbid water",
        "Dissolved substances",
      ],
      process: [
        "Water pre-filtered to remove particles",
        "Exposed to UV-C light (254nm wavelength)",
        "Pathogens' DNA/RNA damaged, preventing reproduction",
        "Requires clear water to be effective",
      ],
      efficiency: "High",
      safety: "high",
    },
    {
      id: "l3",
      title: "Ozonation",
      description:
        "Injecting ozone gas to oxidize contaminants and kill pathogens",
      effectiveAgainst: [
        "Bacteria",
        "Viruses",
        "Many organic compounds",
        "Some pesticides",
      ],
      notEffectiveAgainst: ["Heavy metals", "Some inorganic compounds"],
      process: [
        "Ozone (O₃) generated on-site using electrical discharge",
        "Gas injected into water under pressure",
        "Powerful oxidation reactions destroy contaminants",
        "No persistent residual, often combined with other methods",
      ],
      efficiency: "High",
      safety: "medium",
    },
    {
      id: "l4",
      title: "Advanced Oxidation",
      description:
        "Combining techniques to produce hydroxyl radicals for contaminant breakdown",
      effectiveAgainst: [
        "Persistent organic pollutants",
        "Pharmaceuticals",
        "Industrial chemicals",
      ],
      notEffectiveAgainst: ["Some inorganic compounds"],
      process: [
        "Combination of UV, ozone, hydrogen peroxide, or catalysts",
        "Generates highly reactive hydroxyl radicals",
        "Radicals attack and break down complex pollutants",
        "Effective for otherwise difficult-to-treat contaminants",
      ],
      efficiency: "Very High",
      safety: "high",
    },
    {
      id: "l5",
      title: "Ion Exchange",
      description: "Using resin beads to exchange ions, removing contaminants",
      effectiveAgainst: [
        "Hardness minerals",
        "Heavy metals",
        "Nitrates",
        "Radionuclides",
      ],
      notEffectiveAgainst: ["Organic compounds", "Pathogens", "Particulates"],
      process: [
        "Water passes through resin bed containing charged ions",
        "Target contaminant ions swap places with resin ions",
        "Different resins target specific contaminants",
        "Requires periodic regeneration of resin",
      ],
      efficiency: "High",
      safety: "high",
    },
  ],
};

const TreatmentPage = () => {
  const [activeTab, setActiveTab] = useState<"diy" | "lab">("diy");
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(
    null
  );

  const handleTabChange = (tab: "diy" | "lab") => {
    setActiveTab(tab);
    setSelectedTreatment(null);
  };

  const handleTreatmentSelect = (id: string) => {
    setSelectedTreatment(id === selectedTreatment ? null : id);
  };

  const currentTreatments =
    activeTab === "diy" ? treatments.diy : treatments.lab;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          Water <span className="gradient-text">Treatment Methods</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-16">
          Discover effective ways to treat polluted water, from simple DIY
          solutions to advanced laboratory techniques.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-1 shadow-md inline-flex">
            <button
              onClick={() => handleTabChange("diy")}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                activeTab === "diy"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>DIY Methods</span>
            </button>
            <button
              onClick={() => handleTabChange("lab")}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                activeTab === "lab"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Flask className="h-5 w-5" />
              <span>Lab Techniques</span>
            </button>
          </div>
        </div>

        {/* Treatment Panel Component */}
        <TreatmentPanel
          activeTab={activeTab}
          selectedTreatment={selectedTreatment}
          currentTreatments={currentTreatments}
          onSelectTreatment={handleTreatmentSelect}
        />
      </div>
    </div>
  );
};

export default TreatmentPage;
