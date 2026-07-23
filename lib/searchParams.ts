import { parseAsStringEnum } from "nuqs";
import { woods, fabrics, type WoodKey, type FabricKey } from "./chairConfig";
import { DEFAULT_WOOD, DEFAULT_FABRIC } from "./chairConfig";

export const woodParser = parseAsStringEnum<WoodKey>(
  Object.keys(woods) as WoodKey[],
).withDefault(DEFAULT_WOOD);

export const fabricParser = parseAsStringEnum<FabricKey>(
  Object.keys(fabrics) as FabricKey[],
).withDefault(DEFAULT_FABRIC);
