import Experience from "./Experience";
import { Overlay } from "./Overlay";

export default function Home() {
  return (
    <main className="w-screen h-screen relative">
      <Experience />
      <Overlay />
    </main>
  );
}
