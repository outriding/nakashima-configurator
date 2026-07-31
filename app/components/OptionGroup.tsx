"use client";

import {
  useAvailableFabricIds,
  useSelectedFabricId,
  useSelectedWoodId,
} from "@/lib/configuratorStore";
import { Swatch } from "./Swatch";
import { chairConfig, type FabricKey, type WoodKey } from "@/lib/chairConfig";

type Woods = typeof chairConfig.woods;
type Fabric = typeof chairConfig.fabrics;

type OptionGroupType = {
  values: Woods | Fabric;
  label: string;
  type: "wood" | "fabric";
  handleClick: (id: WoodKey | FabricKey) => void;
  note?: string;
};

export default function OptionGroup({
  label,
  values,
  type,
  note,
  handleClick,
}: OptionGroupType) {
  const selectedWoodId = useSelectedWoodId();
  const selectedFabricId = useSelectedFabricId();
  const availableFabricIds = useAvailableFabricIds();
  const headingId = `${type}-heading`;
  return (
    <div
      className="flex flex-col gap-3"
      role="group"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="text-[11px] font-medium uppercase tracking-widest text-neutral-400"
      >
        {label}
      </h2>

      <div className="flex gap-4 items-start">
        {Object.values(values).map((value) => {
          const isDisabled =
            type === "fabric" &&
            !availableFabricIds.includes(value.id as FabricKey);

          const isSelected =
            type === "wood"
              ? value.id === selectedWoodId
              : value.id === selectedFabricId;

          return (
            <Swatch
              key={value.id}
              label={value.label}
              onClick={() => handleClick(value.id)}
              selected={isSelected}
              disabled={isDisabled}
              disabledReason={isDisabled ? note : undefined}
              map={value.map}
              hex={value.hex}
              priceDelta={value.price}
              tint={value.tintSwatch === true}
            />
          );
        })}
      </div>

      {note ? <p className="text-xs text-neutral-400">{note}</p> : null}
    </div>
  );
}
