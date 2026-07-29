import { Suspense } from "react";
import Experience from "./Experience";
import { Panel } from "./components/Panel";
import { CanvasLoader } from "./components/CanvasLoader";

export default function Home() {
  return (
    <main className="flex h-screen w-screen">
      <div className="relative min-w-0 flex-1">
        <Experience />
        <CanvasLoader />
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-neutral-400">
          Drag to rotate · scroll to zoom
        </p>
      </div>

      {/* Panel */}
      <Suspense fallback={null}>
        <Panel />
      </Suspense>
    </main>
  );
}
