"use client";

import { chairConfig, formatList } from "@/lib/chairConfig";
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
import { woodsAllowingFabric } from "@/lib/chairConfig";

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
    const { selectedWoodId, selectedFabricId } = getChairState();
    setUrl({ wood: selectedWoodId, fabric: selectedFabricId });
  };

  // Update store and URL
  const handleWood = (id: WoodKey) => {
    selectWood(id);
    syncUrl();
  };

  // Update store and URL
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
    <div className="h-full w-90 px-12 pt-22 flex flex-col gap-10  bg-[#FFFFFF]">
      {/* Product + live price */}
      <div className="flex flex-col">
        <h1 className="text-sm text-neutral-500">Nakashima lounge chair </h1>
        <p className="mt-1 text-4xl font-bold tracking-tight text-neutral-900">
          ${totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Wood */}
      <OptionGroup
        type="wood"
        label="wood finish"
        values={chairConfig.woods}
        handleClick={(id) => handleWood(id as WoodKey)}
      />

      {/* Fabric */}
      <OptionGroup
        type="fabric"
        label="fabric"
        values={chairConfig.fabrics}
        handleClick={(id) => handleFabric(id as FabricKey)}
        note={fabricNote}
      />

      {/* Copy Button */}
      <div className="border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-800 transition hover:border-neutral-400 mt-3"
        >
          <LinkIcon className="h-4 w-4" strokeWidth={1.75} />
          {copied ? "Copied" : "Copy link to this design"}
        </button>
      </div>
    </div>
  );
}
