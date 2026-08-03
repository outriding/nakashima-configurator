"use client";

import {
  chairConfig,
  formatList,
  woodsAllowingFabric,
} from "@/lib/chairConfig";
import type { WoodKey, FabricKey } from "@/lib/chairConfig";
import {
  useTotalPrice,
  useChairActions,
  getChairState,
} from "@/lib/configuratorStore";
import { useUrlWriter, useHydrateFromUrl } from "@/lib/urlSync";
import OptionGroup from "./OptionGroup";
import { useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";

const leatherWoods = woodsAllowingFabric("leather");
const fabricNote = `Leather available with ${formatList(leatherWoods)} frame`;

export function Panel() {
  const totalPrice = useTotalPrice();
  const { selectWood, selectFabric } = useChairActions();
  const [copied, setCopied] = useState(false);

  // Update Zustand store with values from URL (runs once on mount)
  useHydrateFromUrl();
  // Push changes from the store --> URL
  const setUrl = useUrlWriter();

  const syncUrl = () => {
    // Read state back after the action, not from the click: selectWood can
    // clamp the fabric (e.g. oak → linen when leather was selected), so the URL
    // must reflect what the store settled on, not what was requested.
    const { selectedWoodId, selectedFabricId } = getChairState();
    setUrl({ wood: selectedWoodId, fabric: selectedFabricId });
  };

  const handleWood = (id: WoodKey) => {
    selectWood(id);
    syncUrl();
  };

  const handleFabric = (id: FabricKey) => {
    selectFabric(id);
    syncUrl();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id); // rapid clicks would otherwise stack timers and flicker the label
  }, [copied]);

  return (
    // Outer: scroll container.
    <div
      className="w-full flex-1 lg:flex-none lg:w-90 overflow-y-auto
             px-10 lg:px-12 pt-6 lg:pt-[5.5rem]
             pb-[calc(2rem+env(safe-area-inset-bottom))] lg:pb-8 bg-white"
    >
      <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 flex flex-col gap-4 md:gap-6 lg:gap-10">
        {/* Product + live price */}
        <div className="flex lg:flex-col items-baseline justify-between lg:justify-start">
          <h1 className="text-sm text-neutral-500">Nakashima lounge chair</h1>
          <p className="text-3xl lg:text-4xl lg:mt-1 font-bold tracking-tight leading-none text-neutral-900">
            £{totalPrice.toLocaleString("en-GB")}
          </p>
        </div>

        <OptionGroup
          type="wood"
          label="wood finish"
          values={chairConfig.woods}
          handleClick={(id) => handleWood(id as WoodKey)}
        />

        <OptionGroup
          type="fabric"
          label="fabric"
          values={chairConfig.fabrics}
          handleClick={(id) => handleFabric(id as FabricKey)}
          note={fabricNote}
        />

        <div className="border-t border-neutral-200 pt-9">
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-800 transition hover:border-neutral-400"
          >
            <LinkIcon className="h-4 w-4" strokeWidth={1.75} />
            {copied ? "Copied" : "Copy link to this design"}
          </button>
        </div>
      </div>
    </div>
  );
}
