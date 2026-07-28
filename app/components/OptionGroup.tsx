import { Swatch } from "./Swatch";
import { chairConfig } from "@/lib/chairConfig";

type Woods = typeof chairConfig.woods;
type Fabric = typeof chairConfig.fabrics;

type OptionGroupType = {
  values: Woods | Fabric;
  label: string;
};

export default function OptionGroup({ label, values }: OptionGroupType) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="uppercase">{label}</h2>
      <div className="flex gap-4">
        {Object.values(values).map((value) => {
          return (
            <div key={value.id}>
              <Swatch
                label={value.label}
                onClick={() => {}}
                selected={true}
                map={value.map}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
