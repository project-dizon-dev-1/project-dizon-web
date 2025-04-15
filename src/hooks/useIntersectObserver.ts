import { useEffect, useRef } from "react";

/**
 * Custom hook that uses Intersection Observer API to detect when an element
 * becomes visible in the viewport and triggers a callback function
 *
 * @param callback - Function to call when intersection occurs
 * @param options - IntersectionObserver options
 * @returns Object containing the reference to attach to your element
 */
const useInterObserver = (
  callback: () => void,
  options: {
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | number[];
  } = { threshold: 0.1 }
) => {
  const ref = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, options]);

  return { ref };
};

export default useInterObserver;
