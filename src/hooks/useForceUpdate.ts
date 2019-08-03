import { useState } from "react";

export const useForceUpdate = () => {
  const [tick, setNextTick] = useState(0);
  return () => setNextTick(tick + 1);
};
