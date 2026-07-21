"use client";

import * as THREE from "three";
import { Canvas, useThree, type ThreeElements } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
  Center,
  useTexture,
} from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Suspense } from "react";
import { useSelectedWood, useSelectedFabric } from "@/lib/configuratorStore";
import { woods } from "@/lib/chairConfig";

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

const MODEL_URL = process.env.NEXT_PUBLIC_MODEL_URL ?? "/chair_optimized.glb";

const woodColorUrls = Object.fromEntries(
  Object.values(woods).map((w) => [w.id, w.map]),
);
const woodNormalUrls = Object.fromEntries(
  Object.values(woods).map((w) => [w.id, w.normalMap]),
);
const woodRoughUrls = Object.fromEntries(
  Object.values(woods).map((w) => [w.id, w.roughnessMap]),
);

const WOOD_REPEAT = 2;

function configureColor(textures: Record<string, THREE.Texture>) {
  Object.values(textures).forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    tile(t);
  });
}

function configureData(textures: Record<string, THREE.Texture>) {
  Object.values(textures).forEach(tile);
}

function tile(t: THREE.Texture) {
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(WOOD_REPEAT, WOOD_REPEAT);
}

function Chair(props: ThreeElements["group"]) {
  const { gl } = useThree();
  const { nodes, materials } = useGLTF(MODEL_URL, true, false, (loader) => {
    loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
  }) as unknown as ChairGLTF;

  const wood = useSelectedWood();
  const fabric = useSelectedFabric();

  const woodColor = useTexture(woodColorUrls, configureColor);
  const woodNormal = useTexture(woodNormalUrls, configureData);
  const woodRough = useTexture(woodRoughUrls, configureData);

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Box064_1.geometry}>
        <meshStandardMaterial
          map={materials.cusion.map}
          color={fabric.hex}
          roughness={materials.cusion.roughness}
        />
      </mesh>

      <mesh castShadow receiveShadow geometry={nodes.Box064_2.geometry}>
        <meshStandardMaterial
          map={woodColor[wood.id]}
          normalMap={woodNormal[wood.id]}
          roughnessMap={woodRough[wood.id]}
          roughness={1}
        />
      </mesh>

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
