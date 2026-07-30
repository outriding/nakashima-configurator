// app/components/CanvasArea.tsx
"use client";

import { useState } from "react";
import Experience from "../Experience";
import { CanvasLoader } from "./CanvasLoader";
import { ErrorBoundary } from "react-error-boundary";
import { CanvasFallback } from "./CanvasFallback";

export function CanvasArea() {
  const [interacted, setInteracted] = useState(false);

  return (
    <div
      className="relative min-w-0 flex-1"
      onPointerDown={() => setInteracted(true)}
      onWheel={() => setInteracted(true)}
    >
      <ErrorBoundary FallbackComponent={CanvasFallback}>
        <Experience />
        <CanvasLoader />
        <p
          className={[
            "pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-neutral-400",
            "transition-opacity duration-500",
            interacted ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          Drag to rotate · scroll to zoom
        </p>
      </ErrorBoundary>
    </div>
  );
}
