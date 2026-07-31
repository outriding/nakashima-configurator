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
import { woods, fabrics } from "@/lib/chairConfig";

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

// Blob URL in production (env var); local file in dev (fallback)
const MODEL_URL = process.env.NEXT_PUBLIC_MODEL_URL ?? "/chair_optimized.glb";

// --- TEXTURES ----
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

function configureWoodColor(textures: Record<string, THREE.Texture>) {
  Object.values(textures).forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    tileWood(t);
  });
}
function configureWoodData(textures: Record<string, THREE.Texture>) {
  Object.values(textures).forEach(tileWood);
}

// Apply transformations to wood textures
function tileWood(t: THREE.Texture) {
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(WOOD_REPEAT, WOOD_REPEAT);
}

// Leather
// Only leather brings its own textures. Linen and velvet tint the model's baked weave. If a second fabric gains textures, switch to the record form used for woods.
const leatherUrls = {
  color: fabrics.leather.map,
  normal: fabrics.leather.normalMap,
  rough: fabrics.leather.roughnessMap,
};

// Apply transformations to fabric textures
const FABRIC_REPEAT = 10;

function tileFabric(t: THREE.Texture) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(FABRIC_REPEAT, FABRIC_REPEAT);
}

const configureFabricColor = (t: THREE.Texture) => {
  t.colorSpace = THREE.SRGBColorSpace;
  tileFabric(t);
};

const configureFabricData = (t: THREE.Texture) => tileFabric(t);

function Chair(props: ThreeElements["group"]) {
  const { gl } = useThree();
  const { nodes, materials } = useGLTF(MODEL_URL, true, false, (loader) => {
    loader.setKTX2Loader(ktx2Loader.detectSupport(gl));
  }) as unknown as ChairGLTF;

  // Get current wood or fabric
  const wood = useSelectedWood();
  const fabric = useSelectedFabric();

  // Get and update textures
  const woodColor = useTexture(woodColorUrls, configureWoodColor);
  const woodNormal = useTexture(woodNormalUrls, configureWoodData);
  const woodRough = useTexture(woodRoughUrls, configureWoodData);

  const fabricColor = useTexture(leatherUrls.color, configureFabricColor);
  const fabricNormal = useTexture(leatherUrls.normal, configureFabricData);
  const fabricRough = useTexture(leatherUrls.rough, configureFabricData);
  const isLeather = fabric.id === "leather";

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Box064_1.geometry}>
        {isLeather ? (
          <meshStandardMaterial
            key="leather"
            map={fabricColor}
            normalMap={fabricNormal}
            roughnessMap={fabricRough}
            color={fabric.hex}
            roughness={1}
          />
        ) : fabric.id === "velvet" ? (
          <meshPhysicalMaterial
            key="velvet"
            map={materials.cusion.map}
            color={fabric.hex}
            roughness={0.9}
            sheen={1}
            sheenRoughness={0.8}
            sheenColor={fabric.hex}
          />
        ) : (
          <meshStandardMaterial
            key="woven"
            map={materials.cusion.map}
            color={fabric.hex}
            roughness={materials.cusion.roughness}
          />
        )}
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
      position={[0, 0.01, 0]}
      opacity={0.65}
      scale={5}
      blur={1}
      far={0.6}
      resolution={2048}
      frames={1}
    />
  );
}

export default function Experience() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [-1.2, 0.8, 1.5], fov: 40 }}>
      <color args={["#FAF9F5"]} attach="background" />
      <Suspense fallback={null}>
        <Environment
          files="/hdri/studio_small_03_1k.hdr"
          environmentIntensity={0.85}
        />
        <Center>
          <Chair />
          <Shadows />
        </Center>
        <Shadows />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={1.4}
        maxDistance={3.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

useTexture.preload([
  ...Object.values(woodColorUrls),
  ...Object.values(woodNormalUrls),
  ...Object.values(woodRoughUrls),
  leatherUrls.color,
  leatherUrls.normal,
  leatherUrls.rough,
]);
