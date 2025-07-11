import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Trash2, Factory, Droplets } from "lucide-react";
import Card from "../components/ui/Card";

const categories = [
  { id: "all", name: "All Sources" },
  { id: "green", name: "Green Water", color: "bg-green-500" },
  { id: "grey", name: "Grey Water", color: "bg-gray-500" },
  { id: "black", name: "Black Water", color: "bg-black" },
];

const sources = [
  {
    id: 1,
    title: "Agricultural Runoff",
    description:
      "Pesticides, fertilizers, and sediment from farms that wash into waterways during rain or irrigation.",
    category: "green",
    image:
      "https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    title: "Industrial Discharge",
    description:
      "Waste chemicals, metals, and byproducts released by manufacturing and processing facilities.",
    category: "grey",
    image:
      "https://media.istockphoto.com/id/469872035/photo/industrial-waste-color-image.jpg?s=612x612&w=0&k=20&c=UYKoSoBBdFfJDhZ29nhXjz0pSkma2pewLuxdmdpHqqo=",
  },
  {
    id: 3,
    title: "Urban Sewage",
    description:
      "Wastewater from homes and businesses containing human waste and household chemicals.",
    category: "black",
    image:
      "https://static.euronews.com/articles/stories/07/58/33/46/1536x864_cmsv2_85d2829b-4b44-5226-aec1-59011a5e6517-7583346.jpg",
  },
  {
    id: 4,
    title: "Oil Spills",
    description:
      "Accidental releases of petroleum from tankers, pipelines, and drilling operations.",
    category: "black",
    image:
      "https://stellarix.com/wp-content/uploads/2024/06/Marine-Oil-Spilling.jpg",
  },
  {
    id: 5,
    title: "Household Detergents",
    description:
      "Phosphates and chemicals from soaps, detergents, and cleaning products.",
    category: "grey",
    image:
      "https://h2oglobalnews.com/wp-content/uploads/2025/05/How-Dangerous-Is-Stagnant-Water.webp",
  },
  {
    id: 6,
    title: "Mining Operations",
    description:
      "Heavy metals, acids, and sediment from the extraction and processing of minerals.",
    category: "grey",
    image:
      "https://bkvenergy.com/wp-content/uploads/2024/03/coal-mining-operation.webp",
  },
  {
    id: 7,
    title: "Pharmaceutical Waste",
    description:
      "Unused medications and manufacturing byproducts entering water supplies.",
    category: "grey",
    image:
      "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 8,
    title: "Thermal Pollution",
    description:
      "Heated water from power plants and industrial processes that affects aquatic ecosystems.",
    category: "grey",
    image:
      "https://earthjustice.org/wp-content/uploads/power-plant-wastewater_epa_800.jpg",
  },
  {
    id: 9,
    title: "Religious Waste",
    description:
      "Ritual items, flowers, and idols immersed in water bodies during religious ceremonies.",
    category: "green",
    image:
      "https://www.cleanindiatech.com/blog/wp-content/uploads/2021/01/1598271956.jpg",
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "green":
      return <Droplets className="h-8 w-8 text-green-500" />;
    case "grey":
      return <Factory className="h-8 w-8 text-gray-500" />;
    case "black":
      return <Trash2 className="h-8 w-8 text-black dark:text-white" />;
    default:
      return <Droplets className="h-8 w-8 text-blue-500" />;
  }
};

const SourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  // const [selectedDialogCategory, setSelectedDialogCategory] = useState<
  //   string | null
  // >(null);

  const filteredSources =
    selectedCategory === "all"
      ? sources
      : sources.filter((source) => source.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          <span className="gradient-text">Pollution Sources</span> in India
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-16">
          Understanding the different types of water pollution sources is key to
          developing effective remediation strategies and policies.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow"
              }`}
            >
              {category.id !== "all" && (
                <span
                  className={`w-3 h-3 rounded-full ${category.color}`}
                ></span>
              )}
              {category.id === "all" && <Filter className="h-4 w-4" />}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSources.map((source) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cursor-pointer"
              // onClick={() => setSelectedDialogCategory(source.category)}
            >
              <Card
                title={source.title}
                description={source.description}
                image={source.image}
                icon={getCategoryIcon(source.category)}
                isFlippable={false} // Disable flipping
                // onClick={() => setSelectedDialogCategory(source.category)}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(1).map(
            (
              category // Skip "all" category
            ) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                // onClick={() => setSelectedDialogCategory(category.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-4 h-4 rounded-full ${category.color}`} />
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {category.id === "green" &&
                    "Pollutants that are primarily organic and biodegradable. These include agricultural runoff, plant matter, and certain types of food waste. While less toxic than other categories, they can still cause significant ecological disruption through nutrient imbalance."}
                  {category.id === "grey" &&
                    "Moderately contaminated wastewater from household activities like laundry, dishwashing, and bathing. This category also includes some industrial discharges that contain chemicals, detergents, and other contaminants but at relatively lower concentrations."}
                  {category.id === "black" &&
                    "Highly contaminated wastewater containing fecal matter, pathogenic organisms, and toxic chemicals. This includes sewage, industrial toxic waste, and oil spills. Black water poses significant health risks and requires intensive treatment before discharge."}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
