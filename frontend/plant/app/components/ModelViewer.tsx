import { Clouds, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

interface ModelViewerProps {
  gltfComponent: React.ReactNode;
}

const ModelViewer = ({ gltfComponent }: ModelViewerProps) => {
  return (
    <Canvas
      style={{
        height: "40rem",
      }}
    >
      <ambientLight intensity={1.25} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={3}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={2} />

      <OrbitControls maxDistance={1} minDistance={0.75} />

      <color attach="background" args={["#87CEEB"]} />

      <Clouds />

      {gltfComponent}
    </Canvas>
  );
};

export default ModelViewer;
