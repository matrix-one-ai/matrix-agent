/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 ./public/glbs/cactus-1.glb --output ./app/components/gltf/Cactus1.tsx 
*/

import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    ["tripo_node_9a9bc2e5-4248-4291-a09e-44cf97f1c975"]: THREE.Mesh;
  };
  materials: {
    ["tripo_material_9a9bc2e5-4248-4291-a09e-44cf97f1c975"]: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/glbs/cactus-1.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={
          nodes["tripo_node_9a9bc2e5-4248-4291-a09e-44cf97f1c975"].geometry
        }
        material={
          materials["tripo_material_9a9bc2e5-4248-4291-a09e-44cf97f1c975"]
        }
      />
    </group>
  );
}

useGLTF.preload("/glbs/cactus-1.glb");
