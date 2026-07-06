import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SEPARATION = 88;
const AMOUNT_X = 48;
const AMOUNT_Y = 48;

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

function ParticleWave() {
  const pointsRef = useRef<THREE.Points>(null);
  const clockRef = useRef(0);
  const rotationRef = useRef(0);

  const { positions, scales, colors } = useMemo(() => {
    const numParticles = AMOUNT_X * AMOUNT_Y;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    const colors = new Float32Array(numParticles * 3);
    let i = 0;
    let j = 0;

    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2;
        positions[i + 1] = -120 + (iy - AMOUNT_Y / 2) * 4; // spread vertically so particles fill hero
        positions[i + 2] = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2;
        scales[j] = 10;

        const mix = (ix + iy) / (AMOUNT_X + AMOUNT_Y);
        colors[i] = 0.34 + mix * 0.36;
        colors[i + 1] = 0.86 - mix * 0.18;
        colors[i + 2] = 1;

        i += 3;
        j++;
      }
    }

    return { positions, scales, colors };
  }, []);

  useFrame((_, delta) => {
    const geom = pointsRef.current?.geometry as
      THREE.BufferGeometry | undefined;
    if (!geom) return;

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const scl = geom.attributes.scale as THREE.BufferAttribute;
    clockRef.current += delta * 1.6;
    const count = clockRef.current;
    let i = 0;
    let j = 0;

    // Slow, gentle wave motion with more vertical spread
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        const wave1 = Math.sin((ix + count) * 0.18) * 65;
        const wave2 = Math.sin((iy + count) * 0.25) * 75;
        const y = wave1 + wave2;
        pos.array[i + 1] = y;
        scl.array[j] =
          8 +
          (Math.sin((ix + count) * 0.18) + 1) * 6 +
          (Math.sin((iy + count) * 0.25) + 1) * 6;
        i += 3;
        j++;
      }
    }

    pos.needsUpdate = true;
    scl.needsUpdate = true;

    // Subtle auto-rotation for smooth ambient feel
    rotationRef.current += delta * 0.012;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(rotationRef.current) * 0.08;
    }
  });

  return (
    <points ref={pointsRef} rotation={[-0.32, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float scale;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = scale * (420.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d) * 0.86;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  const progress = useRef(0);
  const target = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.current = max > 0 ? window.scrollY / max : 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useFrame((_, delta) => {
    // Clamp delta to avoid jumps on tab-switch / frame drops
    const dt = Math.min(delta, 0.05);
    const lerpFactor = 1 - Math.pow(0.001, dt); // frame-rate-independent lerp

    progress.current += (target.current - progress.current) * lerpFactor * 0.04;
    const p = progress.current;

    // Ultra-smooth camera follow with eased scroll curve
    const scrollZ = 900 - Math.pow(p, 0.85) * 550; // ease-out curve on Z
    const scrollY = Math.sin(p * 1.6) * 45 - pointer.current.y * 20;

    camera.position.x +=
      (pointer.current.x * 60 - camera.position.x) * lerpFactor * 0.03;
    camera.position.z += (scrollZ - camera.position.z) * lerpFactor * 0.035;
    camera.position.y += (scrollY - camera.position.y) * lerpFactor * 0.04;

    // Gentle look-at with subtle follow
    camera.lookAt(
      pointer.current.x * 6,
      -30 + Math.sin(p * 0.8) * 10,
      p * 20,
    );
  });

  return null;
}

export default function Scene3D() {
  const mounted = useMounted();

  if (!mounted) return <div className="portfolio-3d-bg" aria-hidden="true" />;

  return (
    <div className="portfolio-3d-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 800], fov: 60, near: 1, far: 10000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#070724"]} />
        <fog attach="fog" args={["#070724", 500, 2200]} />
        <ParticleWave />
        <ScrollCamera />
      </Canvas>
    </div>
  );
}
