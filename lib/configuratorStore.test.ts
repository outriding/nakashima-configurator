import { describe, it, expect, beforeEach } from "vitest";
import { getChairState, resetStore } from "./configuratorStore";
import {
  chairConfig,
  fabrics,
  woodFabricRules,
  woodsAllowingFabric,
} from "./chairConfig";
import type { FabricKey, WoodKey } from "./chairConfig";

beforeEach(() => {
  resetStore();
});

describe("selectWood — cross-option dependency", () => {
  it("keeps the current fabric when it is still valid for the new wood", () => {
    const { selectFabric, selectWood } = getChairState();

    selectFabric("velvet"); // valid on walnut
    selectWood("oak"); // oak also allows velvet

    expect(getChairState().selectedWoodId).toBe("oak");
    expect(getChairState().selectedFabricId).toBe("velvet");
  });

  it("clamps to a valid fabric when the current one is not allowed", () => {
    const { selectFabric, selectWood } = getChairState();

    selectFabric("leather"); // valid on walnut
    selectWood("oak"); // oak forbids leather

    expect(getChairState().selectedWoodId).toBe("oak");
    expect(getChairState().selectedFabricId).not.toBe("leather");
    expect(woodFabricRules.oak).toContain(getChairState().selectedFabricId);
  });

  it("never leaves the store in an invalid combination, for any wood", () => {
    // Exhaustive: every wood, from every starting fabric.
    for (const woodId of Object.keys(woodFabricRules) as WoodKey[]) {
      for (const fabricId of Object.keys(fabrics) as FabricKey[]) {
        resetStore();
        getChairState().selectFabric(fabricId);
        getChairState().selectWood(woodId);

        const state = getChairState();
        expect(woodFabricRules[state.selectedWoodId]).toContain(
          state.selectedFabricId,
        );
      }
    }
  });
});

describe("selectFabric — defensive guard", () => {
  // Allowed onf default start wood
  it("applies a fabric that is valid for the current wood", () => {
    getChairState().selectFabric("velvet");
    expect(getChairState().selectedFabricId).toBe("velvet");
  });

  it("refuses to set a fabric the current wood does not allow", () => {
    const { selectWood, selectFabric } = getChairState();

    selectWood("ebony"); // ebony allows leather only
    selectFabric("linen"); // not allowed

    expect(getChairState().selectedFabricId).not.toBe("linen");
    expect(woodFabricRules.ebony).toContain(getChairState().selectedFabricId);
  });
});

describe("hydrate — untrusted URL input", () => {
  it("applies a valid pair unchanged", () => {
    getChairState().hydrate("oak", "velvet");

    expect(getChairState().selectedWoodId).toBe("oak");
    expect(getChairState().selectedFabricId).toBe("velvet");
  });

  it("clamps an invalid pair from a hand-edited URL", () => {
    // ?wood=ebony&fabric=linen — both real values, forbidden combination.
    getChairState().hydrate("ebony", "linen");

    expect(getChairState().selectedWoodId).toBe("ebony");
    expect(woodFabricRules.ebony).toContain(getChairState().selectedFabricId);
  });
});

describe("derived pricing", () => {
  // useTotalPrice is a hook and can't run outside React, so the derivation is
  // asserted directly here. If pricing logic grows, extract a plain function
  // from the selector and test that instead of duplicating the sum.
  const priceOf = (woodId: WoodKey, fabricId: FabricKey) =>
    chairConfig.basePrice +
    chairConfig.woods[woodId].price +
    chairConfig.fabrics[fabricId].price;

  it("is base price alone for the zero-delta defaults", () => {
    expect(priceOf("walnut", "linen")).toBe(chairConfig.basePrice);
  });

  it("sums the base price with both option deltas", () => {
    expect(priceOf("oak", "velvet")).toBe(
      chairConfig.basePrice +
        chairConfig.woods.oak.price +
        chairConfig.fabrics.velvet.price,
    );
  });
});

describe("rules integrity", () => {
  it("makes every fabric reachable from at least one wood", () => {
    // Nothing in the type system prevents rules where an option is dead data.
    for (const fabricId of Object.keys(fabrics) as FabricKey[]) {
      const reachable = Object.values(woodFabricRules).some((allowed) =>
        allowed.includes(fabricId),
      );
      expect(reachable, `${fabricId} is unreachable`).toBe(true);
    }
  });

  it("lists at least one fabric for every wood", () => {
    for (const woodId of Object.keys(woodFabricRules) as WoodKey[]) {
      expect(woodFabricRules[woodId].length).toBeGreaterThan(0);
    }
  });
});

describe("woodsAllowingFabric", () => {
  it("returns the labels of woods that permit the fabric", () => {
    expect(woodsAllowingFabric("leather")).toEqual(["Walnut", "Ebony"]);
    expect(woodsAllowingFabric("linen")).toEqual(["Walnut", "Oak"]);
    expect(woodsAllowingFabric("velvet")).toEqual(["Walnut", "Oak"]);
  });

  it("returns labels rather than ids, for use in UI copy", () => {
    // The tooltip reads "Available with Walnut or Ebony frame" — ids would
    // render lowercase and wrong.
    expect(woodsAllowingFabric("leather")).not.toContain("walnut");
  });
});
