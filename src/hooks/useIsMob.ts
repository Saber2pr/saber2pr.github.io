import { useState, useEffect } from "react";
import { useIsMobile } from "./useIsMobile";

export const useIsMob = () => {
  const [isMob, set] = useState(true);

  const is = useIsMobile(() => set(true), () => set(false));

  useEffect(() => {
    set(is());
  }, []);

  return isMob;
};
