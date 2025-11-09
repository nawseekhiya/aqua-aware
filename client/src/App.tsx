import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SourcesPage from "./pages/SourcesPage";
import PollutantsPage from "./pages/PollutantsPage";
import TreatmentPage from "./pages/TreatmentPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";
import { LoadingProvider } from "./contexts/LoadingContext";
import Loader from "./components/ui/Loader";

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
    return <Loader />;
  }

  return (
    <LoadingProvider>
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
    </LoadingProvider>
  );
}

export default App;
