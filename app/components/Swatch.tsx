"use client";

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
  onClick,
}: SwatchProps) {
  // Zooming the texture shows grain rather than a whole tile squeezed into 48px.
  const chipStyle = map
    ? {
        backgroundImage: `url(${map})`,
        backgroundSize: "800%",
        backgroundPosition: "center",
      }
    : { backgroundColor: hex };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledReason : label}
      aria-pressed={selected}
      aria-label={
        disabled
          ? `${label}, unavailable. ${disabledReason ?? ""}`
          : `${label}${priceDelta ? `, plus $${priceDelta}` : ""}`
      }
      className="group w-[62px] text-left disabled:cursor-not-allowed"
    >
      <span
        style={chipStyle}
        className={[
          "relative block h-12 w-12 rounded-md bg-cover transition",
          "focus-visible:outline-none",
          selected
            ? "ring-[1.5px] ring-neutral-900 ring-offset-4 ring-offset-[#FAF9F5]"
            : "",
          disabled
            ? "opacity-40 saturate-50"
            : "group-hover:scale-105 group-focus-visible:ring-[1.5px] group-focus-visible:ring-neutral-500 group-focus-visible:ring-offset-2",
        ].join(" ")}
      >
        {selected && !disabled && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-900 text-[9px] text-white">
            ✓
          </span>
        )}

        {disabled && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-white/90"
            >
              <path
                d="M7 11V7a5 5 0 0110 0v4M6 11h12v9H6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>

      <span
        className={[
          "mt-2 block text-[11px]",
          disabled
            ? "text-neutral-400"
            : selected
              ? "text-neutral-900"
              : "text-neutral-600",
        ].join(" ")}
      >
        {label}
      </span>

      {priceDelta ? (
        <span className="mt-px block text-[10px] text-neutral-400">
          +${priceDelta}
        </span>
      ) : null}
    </button>
  );
}
