"use client";

import { motion } from "motion/react";
import { cn } from "@/libs/helpers/cn";
import { memo, useMemo, useCallback, useState, useEffect, useRef } from "react";

// Memoized Grid Components
const GridLineHorizontal = memo(({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  const style = useMemo(() => ({
    "--background": "#ffffff",
    "--color": "rgba(0, 0, 0, 0.2)",
    "--height": "1px",
    "--width": "5px",
    "--fade-stop": "90%",
    "--offset": offset || "200px",
    "--color-dark": "rgba(255, 255, 255, 0.2)",
    maskComposite: "exclude",
  } as React.CSSProperties), [offset]);

  return (
    <div
      style={style}
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
});

const GridLineVertical = memo(({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  const style = useMemo(() => ({
    "--background": "#ffffff",
    "--color": "rgba(0, 0, 0, 0.2)",
    "--height": "5px",
    "--width": "1px",
    "--fade-stop": "90%",
    "--offset": offset || "150px",
    "--color-dark": "rgba(255, 255, 255, 0.2)",
    maskComposite: "exclude",
  } as React.CSSProperties), [offset]);

  return (
    <div
      style={style}
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
});

// Memoized Image Component dengan lazy loading
const OptimizedImage = memo(({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative">
      <GridLineHorizontal className="-top-4" offset="20px" />
      <motion.div
        whileHover={{
          y: -10,
          transition: { duration: 0.2 }
        }}
        className="relative overflow-hidden rounded-lg"
      >
        {/* Placeholder while loading */}
        {!isLoaded && (
          <div className="aspect-[970/700] bg-brand_02 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          loading="lazy" // Native lazy loading
          decoding="async"
          onLoad={handleLoad}
          className={cn(
            "aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 transition-all duration-300",
            "grayscale hover:grayscale-0 hover:shadow-2xl",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          width={970}
          height={700}
          // Optimized sizes for responsive images
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </motion.div>
    </div>
  );
});

// Memoized Column Component
const MarqueeColumn = memo(({
  images,
  colIndex,
  isVisible,
}: {
  images: string[];
  colIndex: number;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      animate={
        isVisible
          ? {
              y: colIndex % 2 === 0 ? [0, 100, 0] : [0, -100, 0],
              transition: {
                duration: colIndex % 2 === 0 ? 12 : 18,
                repeat: Infinity,
                repeatType: "loop" as const,
              }
            }
          : { y: 0 }
      }
      className="flex flex-col items-start gap-8"
    >
      <GridLineVertical className="-left-4" offset="80px" />
      {images.map((image, imageIndex) => (
        <OptimizedImage
          key={`${colIndex}-${imageIndex}-${image}`}
          src={image}
          alt={`Gallery image ${imageIndex + 1}`}
          index={imageIndex}
        />
      ))}
    </motion.div>
  );
});

export const ThreeDMarquee = memo(({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  // Intersection Observer untuk visibility detection
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger ketika 10% komponen visible
        rootMargin: '50px', // Start animasi 50px sebelum masuk viewport
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Memoized chunks calculation
  const chunks = useMemo(() => {
    const chunkSize = Math.ceil(images.length / 4);
    return Array.from({ length: 4 }, (_, colIndex) => {
      const start = colIndex * chunkSize;
      return images.slice(start, start + chunkSize);
    });
  }, [images]);

  // Memoized transform style dengan performance hints
  const transformStyle = useMemo(() => ({
    transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
    willChange: isVisible ? "transform" : "auto", // Only hint when animating
  }), [isVisible]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={transformStyle}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
          >
            {chunks.map((chunk, colIndex) => (
              <MarqueeColumn
                key={`column-${colIndex}`}
                images={chunk}
                colIndex={colIndex}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ThreeDMarquee.displayName = "ThreeDMarquee";
GridLineHorizontal.displayName = "GridLineHorizontal";
GridLineVertical.displayName = "GridLineVertical";
OptimizedImage.displayName = "OptimizedImage";
MarqueeColumn.displayName = "MarqueeColumn";