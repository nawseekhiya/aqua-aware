import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../ui/Loader";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * RouteTransition
 * - Resets window scroll to top on route change.
 * - Shows a brief loading overlay between route changes to provide a nicer transition.
 * - Skips the overlay on initial mount so the app doesn't flash on first load.
 */
const RouteTransition = ({
  delay = 300,
}: {
  /** milliseconds to show the loading overlay */
  delay?: number;
}) => {
  const location = useLocation();
  const initialMount = useRef(true);
  const { overlay } = useLoading();

  useEffect(() => {
    // Skip showing the loader on first mount
    if (initialMount.current) {
      initialMount.current = false;
      // still scroll to top for initial render
      try {
        window.scrollTo({ top: 0, left: 0 });
      } catch {
        // noop
      }
      return;
    }

    // On every subsequent location change scroll to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // noop
    }
    return;
  }, [location, delay]);

  if (!overlay) return null;

  return (
    <div className="fixed inset-0 z-50">
      <Loader />
    </div>
  );
};

export default RouteTransition;
