"use client";

import { Cloud, Clouds, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { MeshBasicMaterial } from "three";
import Grass from "./Grass/Grass";

interface ModelViewerProps {
  gltfComponent: React.ReactNode;
}

const ModelViewer = ({ gltfComponent }: ModelViewerProps) => {
  return (
    <Canvas className="max-h-[60vh] h-[520px] rounded-[20px] border-2 border-black">
      <ambientLight intensity={2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={3}
      />
      <pointLight position={[-10, -10, -20]} decay={0} intensity={2} />

      <OrbitControls maxDistance={5} minDistance={2} />

      <color attach="background" args={["#87CEEB"]} />

      <Suspense fallback={null}>
        <Clouds material={MeshBasicMaterial} position={[0, 4, -10]}>
          <Cloud segments={40} bounds={[10, 2, 2]} volume={10} color="white" />
          <Cloud seed={1} scale={4} volume={5} color="grey" fade={100} />
        </Clouds>
      </Suspense>

      <Suspense fallback={null}>
        <Grass position={[0, -3, 2]} rotation={[0, 0, 0]} />
      </Suspense>

      <Suspense fallback={null}>{gltfComponent}</Suspense>
    </Canvas>
  );
};

export default ModelViewer;
