"use client";

import { Lock, Check } from "lucide-react";

type SwatchProps = {
  label: string;
  /** Price delta in whole currency units. Omitted or 0 renders nothing. */
  priceDelta?: number;
  /** Texture path — takes precedence over hex when present. */
  map?: string;
  /** Flat colour fallback for options with no texture of their own. */
  hex?: string;
  selected: boolean;
  disabled?: boolean;
  /** Why this option is unavailable. Surfaced as the chip's tooltip. */
  disabledReason?: string;
  /** Multiply the texture by `hex`. True for fabrics using the shared neutral
      weave (linen, velvet); false for options whose texture is already the
      right colour (woods, leather). */
  tint: boolean;
  onClick: () => void;
};

export function Swatch({
  label,
  priceDelta,
  map,
  hex,
  selected,
  disabled = false,
  disabledReason,
  tint,
  onClick,
}: SwatchProps) {
  // Neutral weave × fabric hex — mirrors how the model tints its baked weave.
  console.log(typeof hex, JSON.stringify(hex));
  const chipStyle = map
    ? {
        backgroundImage: `url(${map})`,
        backgroundColor: hex,
        ...(tint ? { backgroundBlendMode: "multiply" as const } : {}),
        backgroundSize: "100%",
        backgroundPosition: "center",
      }
    : { backgroundColor: hex };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      title={disabled ? disabledReason : label}
      aria-pressed={selected}
      aria-label={
        disabled
          ? `${label}, unavailable. ${disabledReason ?? ""}`
          : `${label}${priceDelta ? `, plus £${priceDelta}` : ""}`
      }
      className="group flex w-[62px] md:w-24 lg:w-[62px] flex-col items-center cursor-pointer aria-disabled:cursor-not-allowed"
    >
      <span
        style={chipStyle}
        className={[
          "relative block h-12 w-12 md:h-18 md:w-18 lg:h-12 lg:w-12 rounded-md  transition",
          "focus-visible:outline-none",
          selected
            ? "ring-[1.5px] ring-neutral-900 ring-offset-1 ring-offset-[#FAF9F5]"
            : "",
          disabled
            ? "opacity-40 saturate-50"
            : "group-hover:scale-105 group-focus-visible:ring-[1.5px] group-focus-visible:ring-neutral-500 group-focus-visible:ring-offset-2",
        ].join(" ")}
      >
        {selected && !disabled && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-900 text-white">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
        )}

        {disabled && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Lock className="h-4 w-4 text-black" strokeWidth={2} />
          </span>
        )}
      </span>

      <span
        className={[
          "mt-2 block text-xs",
          disabled
            ? "text-neutral-400"
            : selected
              ? "font-medium text-neutral-900"
              : "text-neutral-600",
        ].join(" ")}
      >
        {label}
      </span>

      {priceDelta ? (
        <span className="mt-px block text-[11px] text-neutral-500">
          +£{priceDelta}
        </span>
      ) : null}
    </button>
  );
}
