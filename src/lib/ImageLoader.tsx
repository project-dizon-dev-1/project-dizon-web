import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse h-80 rounded-md" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(className, {
          "opacity-0": !loaded,
          "opacity-100 transition-opacity duration-300": loaded,
        })}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageLoader;
