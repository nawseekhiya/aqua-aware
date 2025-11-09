type LoaderProps = {
  compact?: boolean;
  message?: string;
};

const Loader = ({ compact = false, message = "Loading..." }: LoaderProps) => {
  if (compact) {
    return (
      <div
        className="flex justify-center items-center py-8"
        role="status"
        aria-live="polite"
      >
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-black dark:text-white font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loader;
