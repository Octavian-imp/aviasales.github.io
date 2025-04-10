import { useEffect, useRef } from "react";

const useOnlyEffect = (effect: () => void) => {
  const isRunning = useRef(false);
  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    effect();
  }, []);
};

export default useOnlyEffect;
