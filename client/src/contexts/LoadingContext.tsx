import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";

type LoadingContextValue = {
  loading: boolean; // any loading in progress
  overlay: boolean; // whether overlay should be shown
  startLoading: (opts?: { overlay?: boolean }) => void;
  stopLoading: (opts?: { overlay?: boolean }) => void;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined
);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const totalCounter = useRef(0);
  const overlayCounter = useRef(0);

  const startLoading = useCallback((opts?: { overlay?: boolean }) => {
    const showOverlay = opts?.overlay ?? true;
    totalCounter.current = totalCounter.current + 1;
    if (totalCounter.current > 0) setLoading(true);
    if (showOverlay) {
      overlayCounter.current = overlayCounter.current + 1;
      if (overlayCounter.current > 0) setOverlay(true);
    }
  }, []);

  const stopLoading = useCallback((opts?: { overlay?: boolean }) => {
    const hideOverlay = opts?.overlay ?? true;
    totalCounter.current = Math.max(0, totalCounter.current - 1);
    if (totalCounter.current === 0) setLoading(false);
    if (hideOverlay) {
      overlayCounter.current = Math.max(0, overlayCounter.current - 1);
      if (overlayCounter.current === 0) setOverlay(false);
    }
  }, []);

  return (
    <LoadingContext.Provider
      value={{ loading, overlay, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export default LoadingContext;
