"use client";

import * as THREE from "three";
import { Canvas, useThree, type ThreeElements } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Suspense } from "react";

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
      position={[0, 0, 0]}
      opacity={0.7}
      scale={12}
      blur={2.2}
      far={1.5}
      resolution={1024}
      frames={1}
    />
  );
}

export default function Experience() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [2.5, 1.8, 3], fov: 50 }}>
      <color args={["ivory"]} attach="background" />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Chair />
        <Shadows />
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
