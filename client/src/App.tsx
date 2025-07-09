import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SourcesPage from "./pages/SourcesPage";
import PollutantsPage from "./pages/PollutantsPage";
import TreatmentPage from "./pages/TreatmentPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-black dark:text-white font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="pollutants" element={<PollutantsPage />} />
          <Route path="treatment" element={<TreatmentPage />} />
          <Route path="success" element={<SuccessPage />} />
          {/* Catch-all inside Layout for unknown subroutes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Optional: Catch-all for unmatched top-level routes (if needed) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
