"use client";
import "@/components/model-background/AtmosphereMaterial";
import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import useDeviceSize from "@/hooks/useDeviceSize";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Group, DirectionalLight } from "three";
import { EffectComposer, HueSaturation, BrightnessContrast } from "@react-three/postprocessing";
import { ThreeElements } from "@react-three/fiber";

// Re-declare JSX types to ensure TypeScript picks them up
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      atmosphereMaterialImpl: ThreeElements["meshStandardMaterial"] & {
        uColor?: THREE.ColorRepresentation;
        uIntensity?: number;
      };
    }
  }
}

export type WaitlistPosition = {
  x?: number;
  y?: number;
  z?: number;
};

export type EarthVisualState = {
  colorMode: "gray" | "vibrant";
  positionMode: "corner" | "center";
  rotationEnabled: boolean;
  scaleMultiplier?: number;
  waitlistPosition?: WaitlistPosition;
  isWaitlistActive?: boolean;
};

// Mobile Earth Model Component - loads only mobile model
function MobileEarthModel({ colorMode, positionMode, rotationEnabled, scaleMultiplier = 1, waitlistPosition, isWaitlistActive, groupRef, lightRef }: EarthVisualState & { groupRef: React.RefObject<Group | null>, lightRef: React.RefObject<DirectionalLight | null> }) {
  const { scene } = useGLTF("/models/earth-1k.glb", true);
  return <EarthModelContent scene={scene} colorMode={colorMode} positionMode={positionMode} rotationEnabled={rotationEnabled} scaleMultiplier={scaleMultiplier} waitlistPosition={waitlistPosition} isWaitlistActive={isWaitlistActive} isMobile={true} groupRef={groupRef} lightRef={lightRef} />;
}

// Desktop Earth Model Component - loads only desktop model
function DesktopEarthModel({ colorMode, positionMode, rotationEnabled, scaleMultiplier = 1, waitlistPosition, isWaitlistActive, groupRef, lightRef }: EarthVisualState & { groupRef: React.RefObject<Group | null>, lightRef: React.RefObject<DirectionalLight | null> }) {
  const { scene } = useGLTF("/models/earth-4k.glb", true);
  return <EarthModelContent scene={scene} colorMode={colorMode} positionMode={positionMode} rotationEnabled={rotationEnabled} scaleMultiplier={scaleMultiplier} waitlistPosition={waitlistPosition} isWaitlistActive={isWaitlistActive} isMobile={false} groupRef={groupRef} lightRef={lightRef} />;
}

// Shared content component to avoid code duplication
function EarthModelContent({
  scene,
  colorMode,
  positionMode,
  rotationEnabled,
  scaleMultiplier,
  waitlistPosition,
  isWaitlistActive,
  isMobile,
  groupRef,
  lightRef,
}: {
  scene: THREE.Group;
  colorMode: "gray" | "vibrant";
  positionMode: "corner" | "center";
  rotationEnabled: boolean;
  scaleMultiplier: number;
  waitlistPosition?: WaitlistPosition;
  isWaitlistActive?: boolean;
  isMobile: boolean;
  groupRef: React.RefObject<Group | null>;
  lightRef: React.RefObject<DirectionalLight | null>;
}) {
  // Base scale (responsive) and derived scale
  const baseScale = isMobile ? 1 : 1.2;
  const scale = baseScale * scaleMultiplier;

  // Target positions (world coordinates relative to group origin)
  const cornerTarget = useMemo(
    () => new THREE.Vector3(isMobile ? -1.8 : -72.4, isMobile ? -72.2 : -132.6, isMobile ? -470 : -170),
    [isMobile]
  );
  const centerTarget = useMemo(
    () => new THREE.Vector3(0, isMobile ? 0.8 : -6.2, -370),
    [isMobile]
  );
  
  // Waitlist custom position (only used when positionMode is "center" and waitlistPosition is provided)
  // Merges partial position with defaults, allowing individual axis updates
  const waitlistTarget = useMemo(() => {
    if (!waitlistPosition) return null;
    
    const defaultX = centerTarget.x;
    const defaultY = centerTarget.y;
    const defaultZ = centerTarget.z;
    
    return new THREE.Vector3(
      waitlistPosition.x ?? defaultX,
      waitlistPosition.y ?? defaultY,
      waitlistPosition.z ?? defaultZ
    );
  }, [waitlistPosition, centerTarget]);

  // The desired target depending on positionMode
  // Only use waitlistPosition when explicitly in waitlist section (isWaitlistActive), not during game section
  const desiredTarget = positionMode === "center" && isWaitlistActive && waitlistTarget 
    ? waitlistTarget 
    : (positionMode === "center" ? centerTarget : cornerTarget);

  // Initialize position to corner immediately on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(cornerTarget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const currentGroup = groupRef.current;
    if (!currentGroup) return;

    // Create a directional light if not already created
    if (!lightRef.current) {
      const dl = new THREE.DirectionalLight(new THREE.Color("#a0d8ff"), 4.5);
      dl.position.set(-1, 1, -1); // relative to the group
      // target will be the group's origin (the globe)
      const tgt = new THREE.Object3D();
      tgt.position.set(0, 0, 0);
      currentGroup.add(tgt);
      dl.target = tgt;
      lightRef.current = dl;
      // Add it to group so it rotates/moves with the globe
      currentGroup.add(dl);
    } else {
      // If it exists, ensure it's still a child of the group (re-parent on remount)
      if (lightRef.current.parent !== currentGroup) {
        currentGroup.add(lightRef.current);
      }
      // ensure target is pointing to the group's origin
      if (lightRef.current.target && lightRef.current.target.parent !== currentGroup) {
        const tgt = new THREE.Object3D();
        tgt.position.set(0, 0, 0);
        currentGroup.add(tgt);
        lightRef.current.target = tgt;
      }
    }

    // cleanup on unmount
    return () => {
      if (lightRef.current && currentGroup) {
        try {
          currentGroup.remove(lightRef.current);
        } catch {
          // Ignore errors during cleanup
        }
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

// Main Earth Model Component - conditionally renders mobile or desktop version
export function EarthModel({
  colorMode,
  positionMode,
  rotationEnabled,
  scaleMultiplier = 1,
  waitlistPosition,
  isWaitlistActive,
}: EarthVisualState) {
  const groupRef = useRef<Group | null>(null);
  const lightRef = useRef<DirectionalLight | null>(null);
  const { isMobile, width } = useDeviceSize();

  // Wait for device detection (width will be null initially on server/initial render)
  if (width === null) {
    return null; // Return null until device is detected
  }

  // Conditionally render only the model needed for the current device
  if (isMobile) {
    return (
      <MobileEarthModel
        colorMode={colorMode}
        positionMode={positionMode}
        rotationEnabled={rotationEnabled}
        scaleMultiplier={scaleMultiplier}
        waitlistPosition={waitlistPosition}
        isWaitlistActive={isWaitlistActive}
        groupRef={groupRef}
        lightRef={lightRef}
      />
    );
  }

  return (
    <DesktopEarthModel
      colorMode={colorMode}
      positionMode={positionMode}
      rotationEnabled={rotationEnabled}
      scaleMultiplier={scaleMultiplier}
      waitlistPosition={waitlistPosition}
      isWaitlistActive={isWaitlistActive}
      groupRef={groupRef}
      lightRef={lightRef}
    />
  );
}

export default function ModelBackground(props: EarthVisualState) {
  const { isMobile } = useDeviceSize();

  return (
    <>
      <PreloadModels />
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
    </>
  );
}

// Device-aware preloading component - handles preloading based on device
function PreloadModels() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const width = window.innerWidth;
    const isMobileDevice = width < 768;
    
    if (isMobileDevice) {
      // Only preload mobile model on mobile devices
      useGLTF.preload("/models/earth-1k.glb");
    } else {
      // Only preload desktop model on desktop devices
      useGLTF.preload("/models/earth-4k.glb");
    }
  }, []);
  
  return null;
}

// Initialize preloading when component is imported (client-side only)
if (typeof window !== "undefined") {
  // Start preloading immediately on client-side
  const width = window.innerWidth;
  const isMobileDevice = width < 768;
  
  if (isMobileDevice) {
    useGLTF.preload("/models/earth-1k.glb");
  } else {
    useGLTF.preload("/models/earth-4k.glb");
  }
}
