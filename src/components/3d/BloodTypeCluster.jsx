import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const BLOOD_TYPES = [
  { type: 'A+', pos: [-2.2, 1.2, 0], color: '#f43f5e' },
  { type: 'A-', pos: [-0.8, 1.8, -1], color: '#e11d48' },
  { type: 'B+', pos: [0.8, 1.8, -0.5], color: '#be123c' },
  { type: 'B-', pos: [2.2, 1.2, 0], color: '#9f1239' },
  { type: 'O+', pos: [-2.2, -1.2, 0.5], color: '#e11d48' },
  { type: 'O-', pos: [-0.7, -1.8, -0.8], color: '#f43f5e' },
  { type: 'AB+', pos: [0.7, -1.8, -0.2], color: '#fb7185' },
  { type: 'AB-', pos: [2.2, -1.2, 0.4], color: '#be123c' },
];

function TypeNode({ type, pos, color, selectedType, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedType === type;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const activeColor = isSelected ? '#fbbf24' : (hovered ? '#ffffff' : color);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8} position={pos}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect(type === selectedType ? null : type);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={meshRef} scale={isSelected || hovered ? 1.25 : 1}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color={activeColor}
            emissive={isSelected ? '#f59e0b' : color}
            emissiveIntensity={isSelected ? 0.8 : (hovered ? 0.5 : 0.2)}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        <Text
          position={[0, 0, 0.72]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {type}
        </Text>
      </group>
    </Float>
  );
}

export default function BloodTypeCluster({ selectedType, onSelect }) {
  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden glass-panel">
      <div className="absolute top-4 left-4 z-10 bg-dark-900/70 border border-slate-700/50 px-3 py-1 rounded-full text-xs font-semibold text-slate-300">
        Blood Group Filter: <span className="text-blood-500">{selectedType || 'All Types'}</span>
      </div>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#f43f5e" />

        {BLOOD_TYPES.map((bt) => (
          <TypeNode
            key={bt.type}
            type={bt.type}
            pos={bt.pos}
            color={bt.color}
            selectedType={selectedType}
            onSelect={onSelect}
          />
        ))}

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
