"use client";
import { useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { woodParser, fabricParser } from "@/lib/searchParams";
import { useHydrate } from "@/lib/configuratorStore";

export function useUrlSync() {
  const [{ wood, fabric }, setUrl] = useQueryStates({
    wood: woodParser,
    fabric: fabricParser,
  });

  const hydrate = useHydrate();
  const didHydrate = useRef(false);

  // URL → store, ONCE on mount. The ref guarantees this never re-runs, so
  // later URL changes don't fight the store — that would be the two-way loop.
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    hydrate(wood, fabric);
  }, [wood, fabric, hydrate]);

  return setUrl;
}
