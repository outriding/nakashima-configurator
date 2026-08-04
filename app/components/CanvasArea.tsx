// app/components/CanvasArea.tsx
"use client";

import { useState, useEffect } from "react";
import Experience from "../Experience";
import { CanvasLoader } from "./CanvasLoader";
import { ErrorBoundary } from "react-error-boundary";
import { CanvasFallback } from "./CanvasFallback";

export function CanvasArea() {
  const [interacted, setInteracted] = useState(false);
  const [ready, setReady] = useState(false);

  // Don't show the hint until the scene has had time to appear.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const showHint = ready && !interacted;

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
            "transition-opacity duration-500",
            showHint ? "opacity-100" : "opacity-0",
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
