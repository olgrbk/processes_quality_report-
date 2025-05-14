import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function CanvasBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <mesh rotation={[90, 0, 20]}>
          <torusGeometry args={[2, 0.5, 16, 100]} />
          <meshStandardMaterial color="#10b981" wireframe />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}