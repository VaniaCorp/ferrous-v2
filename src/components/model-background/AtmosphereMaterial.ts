"use client";
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// 🩵 Fresnel-based atmospheric glow shader
const AtmosphereMaterialImpl = shaderMaterial(
  {
    uColor: new THREE.Color("#4da6ff"),
    uIntensity: 1.5,
  },
  // Vertex Shader
  `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Transform normal to view space for accurate fresnel
    vNormal = normalize(normalMatrix * normal);
    // Pass world position for proper view direction calculation
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Calculate proper view direction from fragment to camera
    vec3 viewDirection = normalize(-vPosition);
    
    // Accurate Fresnel effect based on view angle
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 3.0);
    
    vec3 color = uColor * fresnel * uIntensity;
    gl_FragColor = vec4(color, fresnel * 0.9);
  }
  `
)

// 👇 Register custom material so it can be used in JSX
extend({ AtmosphereMaterialImpl })

export { AtmosphereMaterialImpl }
