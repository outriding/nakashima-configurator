export type OptionValue = {
  id: string;
  label: string;
  price: number;
  map?: string;
  normalMap?: string;
  roughnessMap?: string;
  hex?: string;
};

type TexturedOption = OptionValue & {
  map: string;
  normalMap: string;
  roughnessMap: string;
};

export const woods = {
  walnut: {
    id: "walnut",
    label: "Walnut",
    price: 0,
    map: "/textures/wood/walnut.jpg",
    normalMap: "/textures/wood/walnut_normal.jpg",
    roughnessMap: "/textures/wood/walnut_rough.jpg",
    hex: "#5c4033",
  },
  oak: {
    id: "oak",
    label: "Oak",
    price: 80,
    map: "/textures/wood/oak.jpg",
    normalMap: "/textures/wood/oak_normal.jpg",
    roughnessMap: "/textures/wood/oak_rough.jpg",
    hex: "#c19a6b",
  },
  ebony: {
    id: "ebony",
    label: "Ebony",
    price: 120,
    map: "/textures/wood/ebony.jpg",
    normalMap: "/textures/wood/ebony_normal.jpg",
    roughnessMap: "/textures/wood/ebony_rough.jpg",
    hex: "#2b2b2b",
  },
} as const satisfies Record<string, TexturedOption>;

export const fabrics = {
  linen: {
    id: "linen",
    label: "Linen",
    price: 0,
    map: "/textures/fabric/linen.jpg",
    hex: "#e8e4da",
  },
  velvet: {
    id: "velvet",
    label: "Velvet",
    price: 150,
    map: "/textures/fabric/velvet.jpg",
    hex: "#2f4f4f",
  },
  leather: {
    id: "leather",
    label: "Leather",
    price: 300,
    map: "/textures/fabric/leather_color.jpg",
    normalMap: "/textures/fabric/leather_normal.jpg",
    roughnessMap: "/textures/fabric/leather_rough.jpg",
    hex: "#8b5a3c",
  },
} as const satisfies Record<string, OptionValue>;

export const chairConfig = {
  basePrice: 1200,
  woods,
  fabrics,
} as const;

export type WoodKey = keyof typeof woods;
export type FabricKey = keyof typeof fabrics;

// Default values - store & search params
export const DEFAULT_WOOD: WoodKey = "walnut";
export const DEFAULT_FABRIC: FabricKey = "linen";

export const valuesById: Record<string, OptionValue> = {
  ...woods,
  ...fabrics,
};

export const woodFabricRules: Record<WoodKey, FabricKey[]> = {
  walnut: ["linen", "velvet", "leather"],
  oak: ["linen", "velvet"],
  ebony: ["leather"],
};

/** Which woods permit a given fabric — derived from woodFabricRules, so it can't drift. */
export const woodsAllowingFabric = (fabricId: FabricKey): string[] =>
  (Object.keys(woodFabricRules) as WoodKey[])
    .filter((woodId) => woodFabricRules[woodId].includes(fabricId))
    .map((woodId) => woods[woodId].label);
