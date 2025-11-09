type SkeletonVariant = "image" | "card" | "text" | "pulse";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
}

/**
 * Reusable skeleton component for loading states.
 *
 * Variants:
 * - "image": Full-size pulsing skeleton for image areas
 * - "card": Card-style skeleton with multiple lines (for dialog cards)
 * - "text": Single text line skeleton
 * - "pulse": Simple rectangular pulse (default)
 */
const Skeleton = ({
  variant = "pulse",
  className = "",
  width,
  height,
}: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  // Image skeleton - full size pulsing background
  if (variant === "image") {
    return (
      <div
        className={`w-full h-full ${baseClasses} rounded-md ${className}`}
        style={{ width, height }}
      />
    );
  }

  // Card skeleton - multiple lines for dialog parameter cards
  if (variant === "card") {
    return (
      <div
        className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-xl ${baseClasses} ${className}`}
      >
        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4" />
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-2" />
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full w-5/6" />
      </div>
    );
  }

  // Text skeleton - single line
  if (variant === "text") {
    return (
      <div
        className={`h-4 ${baseClasses} rounded ${className}`}
        style={{ width: width || "100%", height }}
      />
    );
  }

  // Default pulse skeleton
  return (
    <div
      className={`${baseClasses} rounded-md ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
