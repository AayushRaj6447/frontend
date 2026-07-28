import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Red Blood Cell (Erythrocyte) Geometry Component
function RedBloodCell({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.5 }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5} position={position}>
      <mesh ref={meshRef} scale={scale}>
        {/* Torus / Disc geometry squished to replicate erythrocyte shape */}
        <cylinderGeometry args={[1.8, 1.8, 0.4, 32, 1]} />
        <meshPhysicalMaterial
          color="#e11d48"
          emissive="#881337"
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.2}
          thickness={1.5}
        />
      </mesh>
    </Float>
  );
}

// Glowing Particle Field
function ParticleField({ count = 80 }) {
  const pointsRef = useRef();

  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#f43f5e"
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Organic Pulsing Core Drop
function PulsingHeartCore() {
  const coreRef = useRef();

  useFrame((state) => {
    if (coreRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 2.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <mesh ref={coreRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <MeshDistortMaterial
        color="#be123c"
        emissive="#f43f5e"
        emissiveIntensity={0.5}
        distort={0.4}
        speed={3}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function BloodCellCanvas() {
  return (
    <div className="w-full h-full min-h-[350px] relative rounded-2xl overflow-hidden glass-panel">
      <div className="absolute top-4 left-4 z-10 bg-dark-900/60 backdrop-blur-md border border-blood-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-blood-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blood-500 animate-ping" />
        Interactive 3D Erythrocyte Engine
      </div>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#f43f5e" />
        <pointLight position={[5, -5, 5]} intensity={1.2} color="#fb7185" />

        <PulsingHeartCore />
        <RedBloodCell position={[-2.2, 1.2, -1]} scale={0.6} rotationSpeed={0.8} />
        <RedBloodCell position={[2.4, -1.0, -1.5]} scale={0.5} rotationSpeed={0.6} />
        <RedBloodCell position={[-1.8, -1.5, 0.5]} scale={0.4} rotationSpeed={1.1} />
        <RedBloodCell position={[1.9, 1.6, -0.5]} scale={0.45} rotationSpeed={0.9} />

        <ParticleField count={100} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
