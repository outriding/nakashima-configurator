import { Suspense } from "react";
import Experience from "./Experience";
import { Panel } from "./components/Panel";

export default function Home() {
  return (
    <main className="flex h-screen w-screen">
      {/* Canvas takes the remaining width; min-w-0 stops flex from
          refusing to shrink it below its content size. */}
      <div className="min-w-0 flex-1">
        <Experience />
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-neutral-400">
          Drag to rotate · scroll to zoom
        </p>
      </div>

      {/* Panel reads search params, so it can't be prerendered. */}
      <Suspense fallback={null}>
        <Panel />
      </Suspense>
    </main>
  );
}
