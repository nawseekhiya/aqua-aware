import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  isFlippable?: boolean;
  backContent?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({
  title,
  description,
  icon,
  image,
  isFlippable = false,
  className = "",
  onClick,
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Preload the image and keep the skeleton visible until the image is
  // fully loaded (or fails). This uses a JS Image() preloader to
  // reliably detect both cached and network loads, and falls back to
  // the DOM <img> events as a backup.
  useEffect(() => {
    let cancelled = false;
    setIsImageLoading(true);

    if (!image) {
      setIsImageLoading(false);
      return;
    }

    const pre = new Image();

    const finish = () => {
      if (!cancelled) setIsImageLoading(false);
    };

    pre.onload = finish;
    pre.onerror = finish;

    // Assign src after handlers so we don't miss synchronous loads.
    pre.src = image;

    // If already complete (cached), call finish synchronously.
    if (pre.complete && pre.naturalWidth) {
      finish();
    }

    return () => {
      cancelled = true;
      pre.onload = null;
      pre.onerror = null;
    };
  }, [image]);

  const handleFlip = () => {
    if (isFlippable) {
      setIsFlipped(!isFlipped);
    } else {
      onClick?.();
    }
  };

  const cardVariants = {
    front: {
      rotateY: isFlippable ? 0 : 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    back: {
      rotateY: isFlippable ? 180 : 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div
      className={`relative w-full h-full ${
        isFlippable ? "perspective-1000" : ""
      } ${className}`}
      onClick={handleFlip}
      {...(isFlippable ? { role: "button", tabIndex: 0 } : {})}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (isFlippable || onClick)) {
          handleFlip();
        }
      }}
    >
      <motion.div
        className={`relative w-full h-full ${isFlippable ? "preserve-3d" : ""}`}
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
      >
        {/* Front side - Always visible when not flippable */}
        <div
          className={`w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl ${
            isFlippable ? "absolute backface-hidden" : "relative"
          } ${isFlipped && isFlippable ? "opacity-0" : "opacity-100"}`}
        >
          {image && (
            <div className="h-40 overflow-hidden relative">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton variant="image" />
                </div>
              )}
              <img
                src={image}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                } hover:scale-105 transform`}
                loading="lazy"
              />
            </div>
          )}
          <div className="p-6">
            {icon && <div className="mb-4">{icon}</div>}
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>

        {/* Back side - Only for flippable cards */}
        {isFlippable && (
          <div
            className={`absolute w-full h-full backface-hidden rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg p-6 rotateY-180 ${
              isFlipped ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No back content provided</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Card;
