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
      className="relative w-full h-[50vh] lg:h-full lg:flex-1 lg:min-w-0"
      onPointerDown={() => setInteracted(true)}
      onWheel={() => setInteracted(true)}
    >
      <ErrorBoundary FallbackComponent={CanvasFallback}>
        <Experience />
        <CanvasLoader />
        <p
          className={[
            "pointer-events-none absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs lg:text-sm text-neutral-400",
            interacted ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <span className="lg:hidden">Drag · pinch to zoom</span>
          <span className="hidden lg:inline">
            Drag to rotate · scroll to zoom
          </span>
        </p>
      </ErrorBoundary>
    </div>
  );
}
