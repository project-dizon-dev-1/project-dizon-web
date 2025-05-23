import  { useState } from "react";
import { cn } from "@/lib/utils";

type ImageLoaderProps = {
  src: string;
  alt: string;
  className?: string;
};

const ImageLoader = ({ src, alt, className }: ImageLoaderProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse h-full rounded-md" />
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
