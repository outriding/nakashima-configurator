import { Suspense } from "react";
import { Panel } from "./components/Panel";
import { CanvasArea } from "./components/CanvasArea";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen lg:flex-row">
      <CanvasArea />
      <Suspense fallback={null}>
        <Panel />
      </Suspense>
    </main>
  );
}
