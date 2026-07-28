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
  type: string;
  handleClick: (id: WoodKey | FabricKey) => void;
};

export default function OptionGroup({
  label,
  values,
  type,
  handleClick,
}: OptionGroupType) {
  const selectedWoodId = useSelectedWoodId();
  const selectedFabricId = useSelectedFabricId();
  const availableFabricsIds = useAvailableFabricIds();
  return (
    <div className="flex flex-col gap-3">
      <h2 className="uppercase">{label}</h2>
      <div className="flex gap-4">
        {Object.values(values).map((value) => {
          {
            console.log(values);
          }
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
