"use client";
import { useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { woodParser, fabricParser } from "@/lib/searchParams";
import { useHydrate } from "@/lib/configuratorStore";

const searchParams = { wood: woodParser, fabric: fabricParser };

// URL → store, once on mount.
export function useHydrateFromUrl() {
  const [{ wood, fabric }] = useQueryStates(searchParams);
  const hydrate = useHydrate();
  const didHydrate = useRef(false);

  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    hydrate(wood, fabric);
  }, [wood, fabric, hydrate]);
}

/** store → URL. Called from selection handlers. */
export function useUrlWriter() {
  const [, setUrl] = useQueryStates(searchParams);
  return setUrl;
}
