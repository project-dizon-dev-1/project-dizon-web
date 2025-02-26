import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const useInterObserver = (callback:()=> void) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && callback) {
      callback();
    }
  }, [inView, callback]);

  return { ref };
};

export default useInterObserver;
