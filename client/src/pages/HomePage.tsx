import { ArrowDown, Droplet, AlertTriangle, Activity } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import WaterQualityChecker from "../components/ui/WaterQualityChecker";

const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          Video Placeholder
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-fade-in leading-tight md:leading-[1.1]">
            Protecting India's Water Resources
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Understanding water pollution in India and working towards cleaner,
            safer water for all.
          </p>
          <button
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => {
              const statsSection = document.getElementById("stats-section");
              if (statsSection) {
                statsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Explore Data
            <ArrowDown className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats-section"
        className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            The Impact of <span className="gradient-text">Water Pollution</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Affected Rivers"
              value={275}
              unit="rivers"
              description="Rivers in India classified as severely polluted"
              icon={<Droplet className="h-6 w-6" />}
              accentColor="from-blue-600 to-blue-400"
            />
            <StatCard
              title="Population Impact"
              value={600}
              unit="million"
              description="People facing high to extreme water stress"
              icon={<Activity className="h-6 w-6" />}
              accentColor="from-orange-500 to-orange-300"
            />
            <StatCard
              title="Health Issues"
              value={38}
              unit="%"
              description="Of all diseases in India are water-related"
              icon={<AlertTriangle className="h-6 w-6" />}
              accentColor="from-red-500 to-red-300"
            />
            <StatCard
              title="Water Treatment"
              value={37}
              unit="%"
              description="Of urban sewage receives proper treatment"
              icon={<Droplet className="h-6 w-6" />}
              accentColor="from-green-500 to-green-300"
            />
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="gradient-text">Key Issues</span> & Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Industrial Pollution
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Industries discharge untreated effluents into water bodies,
                containing heavy metals, chemicals, and toxic substances that
                severely degrade water quality.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>Chemical manufacturing</li>
                <li>Textile dyeing and printing</li>
                <li>Leather tanning</li>
                <li>Mining operations</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Urban Sewage
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Rapid urbanization has overwhelmed sewage treatment capacity,
                leading to the discharge of untreated sewage directly into
                rivers and lakes.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>Inadequate treatment capacity</li>
                <li>Aging infrastructure</li>
                <li>Population growth in urban areas</li>
                <li>Informal settlements without proper sanitation</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Agricultural Runoff
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pesticides, fertilizers, and animal waste from agricultural
                activities contaminate surface and groundwater through runoff
                during rainfall.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>Chemical fertilizers</li>
                <li>Pesticides and herbicides</li>
                <li>Animal farming waste</li>
                <li>Soil erosion and sedimentation</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Religious & Cultural Practices
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Traditional religious practices often involve immersion of idols
                and offerings in water bodies, adding to pollution loads.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>Idol immersion during festivals</li>
                <li>Floral and food offerings</li>
                <li>Cremation ashes</li>
                <li>Religious gatherings near river banks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* City Quality Checker Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Check Your{" "}
            <span className="gradient-text">City's Water Quality</span>
          </h2>

          <div className="max-w-lg mx-auto">
            <WaterQualityChecker />
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Want to learn more about water pollution sources and their
              impacts?
            </p>
            <a
              href="/sources"
              className="inline-flex items-center px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 font-medium rounded-xl transition-colors duration-300"
            >
              Explore Pollution Sources
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
