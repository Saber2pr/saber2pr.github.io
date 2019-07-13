import { useEffect } from "react";

export const useIsMobile = (
  onIsMobileOnce?: Function,
  onIsPCOnce?: Function,
  clientWidth = 760
) => {
  const isMobile = () => document.documentElement.clientWidth < clientWidth;
  let lock_mob = isMobile();
  let lock_pc = !lock_mob;

  let before = Date.now();

  useEffect(() => {
    const onresize = () => {
      if (Date.now() - before < 500) {
        return;
      }
      before = Date.now();

      if (isMobile()) {
        lock_pc = true;

        if (lock_mob) {
          onIsMobileOnce && onIsMobileOnce();
          lock_mob = false;
        }
      } else {
        lock_mob = true;

        if (lock_pc) {
          onIsPCOnce && onIsPCOnce();
          lock_pc = false;
        }
      }
    };

    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, [before]);

  return isMobile;
};
