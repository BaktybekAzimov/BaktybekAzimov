import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Bottle Model Component
function BottleModel({ mousePosition }) {
  const bottleRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (bottleRef.current) {
      // Rotate based on mouse position
      bottleRef.current.rotation.y = THREE.MathUtils.lerp(
        bottleRef.current.rotation.y,
        mousePosition.x * 0.5,
        0.1
      );
      bottleRef.current.rotation.x = THREE.MathUtils.lerp(
        bottleRef.current.rotation.x,
        mousePosition.y * 0.3,
        0.1
      );

      // Floating animation
      bottleRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;

      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      bottleRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group
        ref={bottleRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Bottle body - glass cylinder */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 4, 32]} />
          <meshPhysicalMaterial
            color="#e0f7ff"
            metalness={0.1}
            roughness={0.1}
            transmission={0.95}
            thickness={0.5}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Bottle neck */}
        <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 32]} />
          <meshPhysicalMaterial
            color="#e0f7ff"
            metalness={0.1}
            roughness={0.1}
            transmission={0.95}
            thickness={0.3}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 2.9, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.4, 32]} />
          <meshStandardMaterial
            color="#00a8cc"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Water inside bottle */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 3.5, 32]} />
          <meshPhysicalMaterial
            color="#00a8cc"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={1}
            opacity={0.8}
            transparent
          />
        </mesh>

        {/* Label - "27" */}
        <mesh position={[0, 0, 0.81]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.5]} />
          <meshBasicMaterial color="#1a4d7d" opacity={0.9} transparent />
        </mesh>

        {/* Text "27" on label */}
        <mesh position={[0, 0, 0.82]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color="#00a8cc" opacity={1} transparent />
        </mesh>

        {/* Condensation droplets */}
        {[...Array(20)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 0.5) * 0.8,
              (i % 8) - 2,
              Math.cos(i * 0.5) * 0.8
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0}
              roughness={0}
              transmission={0.95}
              opacity={0.7}
              transparent
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Particles around bottle
function Particles() {
  const particlesRef = useRef();
  const count = 100;

  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = Math.random() * 0.05;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += velocities[i * 3 + 1];

        // Reset particle if it goes too high
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = -5;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00a8cc"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D Scene Component
export default function Bottle3D({ className = '' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00a8cc" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          color="#ffffff"
        />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* 3D Bottle */}
        <BottleModel mousePosition={mousePosition} />

        {/* Floating particles */}
        <Particles />

        {/* Ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        {/* Optional: Orbit controls for manual rotation */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
