import {
  useAvailableFabricIds,
  useSelectedFabricId,
  useSelectedWoodId,
} from "@/lib/configuratorStore";
import { Swatch } from "./Swatch";
import { chairConfig, FabricKey, WoodKey } from "@/lib/chairConfig";

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
  const availableFabricsIds = useAvailableFabricIds();
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </h2>
      <div className="flex gap-4">
        {Object.values(values).map((value) => {
          return (
            <div key={value.id}>
              <Swatch
                label={value.label}
                onClick={() => handleClick(value.id)}
                selected={
                  value.id === selectedWoodId || value.id === selectedFabricId
                }
                map={value.map}
                hex={value.hex}
                disabled={
                  type === "fabric"
                    ? !availableFabricsIds.includes(value.id as FabricKey)
                    : false
                }
                priceDelta={value.price}
              />
              {note ? <p className="text-xs text-neutral-400">{note}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
