"use client";

import * as THREE from "three";
import {
  Canvas,
  useThree,
  type ThreeElements,
  useFrame,
} from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Suspense } from "react";
import { useSelectedWood, useSelectedFabric } from "@/lib/configuratorStore";

const ktx2Loader = new KTX2Loader().setTranscoderPath("/basis/");

type ChairGLTF = GLTF & {
  nodes: {
    Box064_1: THREE.Mesh;
    Box064_2: THREE.Mesh;
    Box064_3: THREE.Mesh;
  };
  materials: {
    cusion: THREE.MeshStandardMaterial;
    frame: THREE.MeshStandardMaterial;
    screws: THREE.MeshStandardMaterial;
  };
};

function Chair(props: ThreeElements["group"]) {
  const { gl } = useThree();
  const { nodes, materials } = useGLTF(
    "/chair_optimized.glb",
    true,
    false,
    (loader) => {
      loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
    },
  ) as unknown as ChairGLTF;

  const wood = useSelectedWood();
  const fabric = useSelectedFabric();

  useFrame(() => {
    if (wood.hex) materials.frame.color.set(wood.hex);
    if (fabric.hex) materials.cusion.color.set(fabric.hex);
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box064_1.geometry}
        material={materials.cusion}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box064_2.geometry}
        material={materials.frame}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box064_3.geometry}
        material={materials.screws}
      />
    </group>
  );
}

function Shadows() {
  return (
    <ContactShadows
      position={[0, 0.005, 0]}
      opacity={0.65}
      scale={8}
      blur={1.6}
      far={0.6}
      resolution={2048}
      frames={1}
    />
  );
}

export default function Experience() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [-1.5, 0.8, 1.5], fov: 40 }}>
      <color args={["ghostwhite"]} attach="background" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <Center>
          <Chair />
          <Shadows />
        </Center>
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
