import { Suspense } from "react";
import Experience from "./Experience";
import { Panel } from "./components/Panel";
import { CanvasLoader } from "./components/CanvasLoader";
import { CanvasArea } from "./components/CanvasArea";

export default function Home() {
  return (
    <main className="flex h-screen w-screen">
      <CanvasArea />
      <Suspense fallback={null}>
        <Panel />
      </Suspense>
    </main>
  );
}
