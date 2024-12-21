"use client";

import { Cloud, Clouds, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { MeshBasicMaterial } from "three";
import Grass from "./Grass/Grass";
import VrmAvatar from "./VrmAvatar";
import { Model as Cactus1 } from "./gltf/Cactus1";

const CactusVRM = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <Canvas
        style={{
          height: "40rem",
        }}
      >
        <ambientLight intensity={2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={3}
        />
        <pointLight position={[-10, -10, -20]} decay={0} intensity={2} />

        <OrbitControls
          target={[0, 0, 0]}
          maxDistance={4}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />

        <color attach="background" args={["#87CEEB"]} />

        <Suspense fallback={null}>
          <Clouds material={MeshBasicMaterial} position={[0, 4, -10]}>
            <Cloud
              segments={40}
              bounds={[10, 2, 2]}
              volume={10}
              color="white"
            />
            <Cloud seed={1} scale={4} volume={5} color="grey" fade={100} />
          </Clouds>
        </Suspense>

        <Suspense fallback={null}>
          <Grass position={[0, -3, 2]} rotation={[0, 0, 0]} />
        </Suspense>

        <Suspense fallback={null}>
          <VrmAvatar
            avatarKey="cactus-face"
            audioRef={audioRef}
            audioBlob={null}
            blendShapes={[]}
            position={[0.25, -14.9, 0.3]}
            rotation={[0, Math.PI, 0]}
            scale={[10, 10, 10]}
            onLoadingProgress={() => {}}
          />
          <Cactus1
            scale={[5, 5, 5]}
            position={[0, -0.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />
        </Suspense>
      </Canvas>
      <audio ref={audioRef} />
    </>
  );
};

export default CactusVRM;
