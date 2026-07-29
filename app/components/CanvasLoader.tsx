"use client";

import { useProgress } from "@react-three/drei";

export function CanvasLoader() {
  const { active } = useProgress();

  return (
    <div
      aria-hidden={!active}
      className={[
        "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
        "bg-[#FAF9F5] transition-opacity duration-700 ease-out",
        active ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <p className="animate-pulse text-sm text-neutral-500">
        Nakashima lounge chair
      </p>
    </div>
  );
}
