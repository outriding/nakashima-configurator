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
    <>
      <h2>{label}</h2>
      <div className="flex">
        {Object.values(values).map((value) => {
          return (
            <div key={value.id} className="mr-4">
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
    </>
  );
}
