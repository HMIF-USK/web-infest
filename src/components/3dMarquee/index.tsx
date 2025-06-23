"use client";

import { motion } from "motion/react";
import { cn } from "@/libs/helpers/cn";
import { memo, useMemo, useCallback, useState, useRef, useEffect } from "react";

// Global cache untuk tracking gambar yang sudah dimuat
const imageLoadCache = new Set<string>();

// Simplified GridLine components
const GridLineHorizontal = memo(({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={{
        "--offset": offset || "200px",
      } as React.CSSProperties}
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-px w-[calc(100%+var(--offset))]",
        "bg-gradient-to-r from-[#4C0D27]/40 via-[#4C0D27]/40 to-transparent",
        "z-30",
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
  return (
    <div
      style={{
        "--offset": offset || "150px",
      } as React.CSSProperties}
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] w-px h-[calc(100%+var(--offset))]",
        "bg-gradient-to-b from-[#4C0D27]/40 via-[#4C0D27]/40 to-transparent",
        "z-30",
        className,
      )}
    />
  );
});

// Function untuk check apakah gambar sudah ada di cache browser
const isImageCached = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    setTimeout(() => {
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        resolve(true);
      }
    }, 0);
  });
};

// Optimized Image component dengan persistent cache
const OptimizedImage = memo(({
  src,
  alt,
  imageIndex,
}: {
  src: string;
  alt: string;
  imageIndex: number;
}) => {
  // Check apakah gambar sudah pernah dimuat sebelumnya
  const [isLoaded, setIsLoaded] = useState(() => imageLoadCache.has(src));
  const imgRef = useRef<HTMLImageElement>(null);

  // Check cache browser saat component mount
  useEffect(() => {
    if (!isLoaded && !imageLoadCache.has(src)) {
      isImageCached(src).then((cached) => {
        if (cached) {
          imageLoadCache.add(src);
          setIsLoaded(true);
        }
      });
    }
  }, [src, isLoaded]);

  const handleLoad = useCallback(() => {
    imageLoadCache.add(src);
    setIsLoaded(true);
  }, [src]);

  // Check jika img element sudah complete
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0 && !isLoaded) {
      handleLoad();
    }
  }, [handleLoad, isLoaded]);

  return (
    <div className="relative">
      <GridLineHorizontal className="-top-4" offset="20px" />
      
      {/* Loading skeleton - hanya show jika benar-benar belum loaded */}
      {!isLoaded && (
        <div className="aspect-[970/700] rounded-lg bg-gray-200/50 animate-pulse" />
      )}
      
      <motion.img
        ref={imgRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        whileHover={{
          y: -10,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        src={src}
        alt={alt}
        className={cn(
          "aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5",
          "grayscale hover:grayscale-0 transition-all duration-300",
          "hover:shadow-2xl will-change-transform",
          isLoaded ? "block" : "hidden"
        )}
        width={485}
        height={350}
        loading={imageLoadCache.has(src) ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
      />
    </div>
  );
});

// Preload images untuk better performance
const useImagePreloader = (images: string[]) => {
  useEffect(() => {
    const preloadImages = images.slice(0, 8);
    
    preloadImages.forEach((src) => {
      if (!imageLoadCache.has(src)) {
        const img = new Image();
        img.onload = () => imageLoadCache.add(src);
        img.src = src;
      }
    });
  }, [images]);
};

// Static transform style - tidak perlu useMemo
const transformStyle = {
  transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
  backfaceVisibility: "hidden" as const,
};

// Main component
export const ThreeDMarquee = memo(({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  // Preload beberapa gambar untuk performance yang lebih baik
  useImagePreloader(images);

  // useMemo PERLU karena expensive array operation dan hasil digunakan di map
  const chunks = useMemo(() => {
    const chunkSize = Math.ceil(images.length / 4);
    return Array.from({ length: 4 }, (_, colIndex) => {
      const start = colIndex * chunkSize;
      return images.slice(start, start + chunkSize);
    });
  }, [images]);

  return (
    <div
      className={cn(
        "mx-auto block h-full overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={transformStyle}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-gpu"
          >
            {chunks.map((subarray, colIndex) => (
              <div
                key={`col-${colIndex}`}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((image, imageIndex) => (
                  <OptimizedImage
                    key={`${colIndex}-${imageIndex}-${image}`}
                    src={image}
                    alt={`Image ${imageIndex + 1}`}
                    imageIndex={imageIndex}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Display names
ThreeDMarquee.displayName = "ThreeDMarquee";
GridLineHorizontal.displayName = "GridLineHorizontal";
GridLineVertical.displayName = "GridLineVertical";
OptimizedImage.displayName = "OptimizedImage";