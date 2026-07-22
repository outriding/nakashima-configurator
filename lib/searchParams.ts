import { parseAsStringEnum } from "nuqs";
import { woods, fabrics, type WoodKey, type FabricKey } from "./chairConfig";

export const woodParser = parseAsStringEnum<WoodKey>(
  Object.keys(woods) as WoodKey[],
).withDefault("walnut");

export const fabricParser = parseAsStringEnum<FabricKey>(
  Object.keys(fabrics) as FabricKey[],
).withDefault("linen");
