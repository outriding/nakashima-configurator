import Experience from "./Experience";
import { Overlay } from "./Overlay";

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Experience />
      <Overlay />
    </main>
  );
}
