// app/Overlay.tsx
"use client";

import { chairConfig } from "@/lib/chairConfig";
import {
  useSelectedWoodId,
  useSelectedFabricId,
  useAvailableFabricIds,
  useTotalPrice,
  useChairActions,
} from "@/lib/configuratorStore";

export function Overlay() {
  const selectedWoodId = useSelectedWoodId();
  const selectedFabricId = useSelectedFabricId();
  const availableFabricIds = useAvailableFabricIds();
  const totalPrice = useTotalPrice();
  const { selectWood, selectFabric } = useChairActions();

  return (
    <div
      style={{
        position: "absolute",
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
              onClick={() => selectWood(wood.id)}
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
          {availableFabricIds.map((id) => {
            const fabric = chairConfig.fabrics[id];
            return (
              <button
                key={fabric.id}
                onClick={() => selectFabric(fabric.id)}
                style={{
                  fontWeight:
                    fabric.id === selectedFabricId ? "bold" : "normal",
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
      </section>
    </div>
  );
}
