"use client";
import "@/components/model-background/AtmosphereMaterial";
import React, { Suspense, useRef, useMemo, useEffect } from "react";
import useDeviceSize from "@/hooks/useDeviceSize";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Group, DirectionalLight } from "three";
import { EffectComposer, HueSaturation, BrightnessContrast } from "@react-three/postprocessing";
import { ThreeElements } from "@react-three/fiber";

// Re-declare JSX types to ensure TypeScript picks them up
declare global {
  namespace JSX {
    interface IntrinsicElements {
      atmosphereMaterialImpl: ThreeElements["meshStandardMaterial"] & {
        uColor?: THREE.ColorRepresentation;
        uIntensity?: number;
      };
    }
  }
}

export type EarthVisualState = {
  colorMode: "gray" | "vibrant";
  positionMode: "corner" | "center";
  rotationEnabled: boolean;
  scaleMultiplier?: number;
};

export function EarthModel({
  colorMode,
  positionMode,
  rotationEnabled,
  scaleMultiplier = 1,
}: EarthVisualState) {
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<DirectionalLight | null>(null);
  const { isMobile } = useDeviceSize();

  // Load GLTF scenes
  const { scene: mobileScene } = useGLTF("/models/earth-1k.glb");
  const { scene: desktopScene } = useGLTF("/models/earth-4k.glb");
  const scene = isMobile ? mobileScene : desktopScene;

  // Base scale (responsive) and derived scale
  const baseScale = isMobile ? 1 : 1.2;
  const scale = baseScale * scaleMultiplier;

  // Target positions (world coordinates relative to group origin)
  const cornerTarget = useMemo(
    () => new THREE.Vector3(isMobile ? -1.8 : -112.4, isMobile ? -1.2 : -132.6, isMobile ? -570 : -370),
    [isMobile]
  );
  const centerTarget = useMemo(
    () => new THREE.Vector3(0, isMobile ? 0.8 : -6.2, -370),
    [isMobile]
  );

  // The desired target depending on positionMode
  const desiredTarget = positionMode === "center" ? centerTarget : cornerTarget;

  // Rotate (frame-rate independent) and lerp position for smooth motion
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Rotation (if enabled)
    if (rotationEnabled) {
      // rotation speed tuned to previous behaviour; frame-rate independent
      groupRef.current.rotation.y += 0.0008 * delta * 60;
    }

    // Smoothly move group to the target position
    groupRef.current.position.lerp(desiredTarget, 0.12);
  });

  // Ensure directional light stays fixed relative to the group (so the same globe spot remains lit)
  useEffect(() => {
    if (!groupRef.current) return;

    // Create a directional light if not already created
    if (!lightRef.current) {
      const dl = new THREE.DirectionalLight(new THREE.Color("#a0d8ff"), 4.5);
      dl.position.set(-1, 1, -1); // relative to the group
      // target will be the group's origin (the globe)
      const tgt = new THREE.Object3D();
      tgt.position.set(0, 0, 0);
      groupRef.current.add(tgt);
      dl.target = tgt;
      lightRef.current = dl;
      // Add it to group so it rotates/moves with the globe
      groupRef.current.add(dl);
    } else {
      // If it exists, ensure it's still a child of the group (re-parent on remount)
      if (lightRef.current.parent !== groupRef.current) {
        groupRef.current.add(lightRef.current);
      }
      // ensure target is pointing to the group's origin
      if (lightRef.current.target && lightRef.current.target.parent !== groupRef.current) {
        const tgt = new THREE.Object3D();
        tgt.position.set(0, 0, 0);
        groupRef.current.add(tgt);
        lightRef.current.target = tgt;
      }
    }

    // cleanup on unmount
    return () => {
      if (lightRef.current && groupRef.current) {
        try {
          groupRef.current.remove(lightRef.current);
        } catch (_) { }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupRef.current]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} position={[0, 0, 0]} />
      <ambientLight intensity={0.01} color="#001133" />
      <mesh scale={[scale * 1.03, scale * 1.03, scale * 1.03]} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* @ts-expect-error - Custom shader material registered via extend() */}
        <atmosphereMaterialImpl
          uColor={colorMode === "gray" ? "#888" : "#4da6ff"}
          uIntensity={colorMode === "gray" ? 0.4 : 2.2}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function ModelBackground(props: EarthVisualState) {
  const { isMobile } = useDeviceSize();
  const margin = isMobile ? 0.6 : 1;

  return (
    <Canvas
      gl={{ alpha: false }}
      style={{ background: "#000" }}
      camera={{
        // Push camera back slightly more for your large globe
        position: [0, 0, isMobile ? 8 : 6],
        fov: isMobile ? 45 : 50,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={null}>
          <EarthModel {...props} />
      </Suspense>

      <EffectComposer>
        <HueSaturation saturation={props.colorMode === "gray" ? -1 : 0} />
        <BrightnessContrast brightness={0.05} contrast={0.4} />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload("/models/earth-1k.glb");
useGLTF.preload("/models/earth-4k.glb");
