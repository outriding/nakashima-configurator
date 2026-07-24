// app/Overlay.tsx
"use client";

import { chairConfig, woodsAllowingFabric } from "@/lib/chairConfig";
import type { WoodKey, FabricKey } from "@/lib/chairConfig";
import {
  useSelectedWoodId,
  useSelectedFabricId,
  useAvailableFabricIds,
  useTotalPrice,
  useChairActions,
  getChairState,
} from "@/lib/configuratorStore";
import { useUrlWriter, useHydrateFromUrl } from "@/lib/urlSync";
import { Swatch } from "./Swatch";
import OptionGroup from "./OptionGroup";

export function Panel() {
  const selectedWoodId = useSelectedWoodId();
  const selectedFabricId = useSelectedFabricId();
  const availableFabricIds = useAvailableFabricIds();
  const totalPrice = useTotalPrice();
  const { selectWood, selectFabric } = useChairActions();

  // Update Zustand store with values from URL (runs once on mount)
  useHydrateFromUrl();
  // Push changes from the store --> URL
  const setUrl = useUrlWriter();

  // Update store and URL
  const handleWood = (id: WoodKey) => {
    selectWood(id);
    const fabricNow = getChairState().selectedFabricId;
    setUrl({ wood: id, fabric: fabricNow });
  };

  // Update store and URL
  const handleFabric = (id: FabricKey) => {
    selectFabric(id);
    setUrl({ fabric: id });
  };

  return (
    <div
      style={{
        top: 0,
        right: 0,
        height: "100%",
        width: "320px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        pointerEvents: "none",
      }}
    >
      {/* Wood */}
      <section style={{ pointerEvents: "auto" }}>
        <h3>Wood finish</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {Object.values(chairConfig.woods).map((wood) => (
            <button
              key={wood.id}
              onClick={() => handleWood(wood.id)}
              style={{
                fontWeight: wood.id === selectedWoodId ? "bold" : "normal",
              }}
            >
              {wood.label}
            </button>
          ))}
        </div>
      </section>

      {/* Fabric — only shows options valid for the current wood */}
      <section style={{ pointerEvents: "auto" }}>
        <h3>Fabric</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {Object.values(chairConfig.fabrics).map((fabric) => {
            const available = availableFabricIds.includes(fabric.id);
            return (
              <button
                key={fabric.id}
                disabled={!available}
                onClick={() => handleFabric(fabric.id)}
                title={
                  available
                    ? undefined
                    : `Available with ${woodsAllowingFabric(fabric.id).join(" or ")} frame`
                }
                style={{
                  fontWeight:
                    fabric.id === selectedFabricId ? "bold" : "normal",
                  opacity: available ? 1 : 0.4,
                  cursor: available ? "pointer" : "not-allowed",
                }}
              >
                {fabric.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Price */}
      <section style={{ pointerEvents: "auto", marginTop: "auto" }}>
        <strong>${totalPrice}</strong>

        <OptionGroup label="wood finish" values={chairConfig.woods} />
      </section>
    </div>
  );
}
