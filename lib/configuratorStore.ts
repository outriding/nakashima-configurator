import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type WoodKey, type FabricKey } from "./chairConfig";
import {
  chairConfig,
  woodFabricRules,
  DEFAULT_WOOD,
  DEFAULT_FABRIC,
} from "./chairConfig";
import { useShallow } from "zustand/react/shallow";

type State = {
  selectedWoodId: WoodKey;
  selectedFabricId: FabricKey;
};

type Actions = {
  selectWood: (id: WoodKey) => void;
  selectFabric: (id: FabricKey) => void;
  hydrate: (woodId: WoodKey, fabricId: FabricKey) => void;
};

const useStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      selectedWoodId: DEFAULT_WOOD,
      selectedFabricId: DEFAULT_FABRIC,

      selectWood: (id) => {
        const { selectedFabricId } = get();
        const allowedFabrics = woodFabricRules[id];

        const nextFabric = allowedFabrics.includes(selectedFabricId)
          ? selectedFabricId
          : allowedFabrics[0];

        set(
          { selectedWoodId: id, selectedFabricId: nextFabric },
          false,
          "selectWood",
        );
      },

      selectFabric: (id) => {
        const { selectedWoodId } = get();
        const allowedFabrics = woodFabricRules[selectedWoodId];

        const nextFabric = allowedFabrics.includes(id) ? id : allowedFabrics[0];

        set({ selectedFabricId: nextFabric }, false, "selectFabric");
      },
      hydrate: (woodId, fabricId) => {
        const allowed = woodFabricRules[woodId];
        const fabric = allowed.includes(fabricId) ? fabricId : allowed[0];
        set(
          { selectedWoodId: woodId, selectedFabricId: fabric },
          false,
          "hydrate",
        );
      },
    }),
    {
      name: "ConfiguratorStore",
    },
  ),
);

// State hooks
export const useSelectedWood = () => {
  const id = useStore((s) => s.selectedWoodId);
  return chairConfig.woods[id];
};

export const useSelectedFabric = () => {
  const id = useStore((s) => s.selectedFabricId);
  return chairConfig.fabrics[id];
};

export const useSelectedWoodId = () => useStore((s) => s.selectedWoodId);
export const useSelectedFabricId = () => useStore((s) => s.selectedFabricId);

export const useAvailableFabricIds = () => {
  const woodId = useStore((s) => s.selectedWoodId);
  return woodFabricRules[woodId];
};

export const useTotalPrice = () => {
  const woodId = useStore((s) => s.selectedWoodId);
  const fabricId = useStore((s) => s.selectedFabricId);

  return (
    chairConfig.basePrice +
    chairConfig.woods[woodId].price +
    chairConfig.fabrics[fabricId].price
  );
};

export const useHydrate = () => useStore((s) => s.hydrate);

// Imperative read — non-reactive
export const getChairState = useStore.getState;

// Restores initial state. Used by tests
export const resetStore = () =>
  useStore.setState({
    selectedWoodId: DEFAULT_WOOD,
    selectedFabricId: DEFAULT_FABRIC,
  });

// Actions hook
export const useChairActions = () =>
  useStore(
    useShallow((s) => ({
      selectWood: s.selectWood,
      selectFabric: s.selectFabric,
    })),
  );
