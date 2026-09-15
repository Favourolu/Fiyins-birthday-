import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function usePrefersReducedMotion() {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

function Balloon({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <Float
      speed={reduced ? 0 : 1.2 * speed}
      rotationIntensity={reduced ? 0 : 0.4}
      floatIntensity={reduced ? 0 : 1.4}
      position={position}
    >
      <group scale={scale}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} envMapIntensity={1.2} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <coneGeometry args={[0.07, 0.12, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 1.3, 4]} />
          <meshBasicMaterial color="#caa9e8" transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function CakeCentrepiece() {
  const reduced = usePrefersReducedMotion();
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!reduced && group.current) group.current.rotation.y += delta * 0.15;
  });
  return (
    <group ref={group} position={[0, -2.1, 0]} scale={0.72}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.15, 1.25, 0.55, 48]} />
        <meshStandardMaterial color="#f9e3f2" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 0.5, 48]} />
        <meshStandardMaterial color="#d946c8" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.42, 48]} />
        <meshStandardMaterial color="#f5d68a" roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const r = 0.32;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0.6, Math.sin(angle) * r]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
              <meshStandardMaterial color="#fff6e0" />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#ffb545" emissive="#ff8a00" emissiveIntensity={1.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Parallax({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const { camera, pointer } = useThree();
  useFrame(() => {
    if (reduced) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.3 + pointer.y * 0.35, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return <>{children}</>;
}

export default function BirthdayScene() {
  const [ready, setReady] = useState(false);
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.6, 7.5], fov: 42 }}
        dpr={[1, 1.75]}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        <color attach="background" args={["#150a24"]} />
        <fog attach="fog" args={["#150a24", 6, 14]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} color="#ffe3f6" />
        <pointLight position={[-3, -1, 2]} intensity={1.2} color="#7c3aed" />
        <pointLight position={[2, -2, 3]} intensity={0.8} color="#f5d68a" />
        <Parallax>
          <CakeCentrepiece />
          <Balloon position={[-3.4, 1.6, -3]} color="#d946c8" scale={0.85} speed={0.8} />
          <Balloon position={[3.2, 2, -3.4]} color="#7c3aed" scale={1} speed={1.1} />
          <Balloon position={[-2.4, 2.8, -4.2]} color="#f5d68a" scale={0.65} speed={1.3} />
          <Balloon position={[2.6, 1, -4.6]} color="#f472b6" scale={0.75} speed={0.9} />
          <Sparkles count={80} scale={[9, 6, 6]} size={2.5} speed={0.25} color="#f5d68a" opacity={0.7} />
        </Parallax>
      </Canvas>
    </div>
  );
}
