"use client";
import { useState, useEffect, useCallback } from "react";
import useDeviceSize from "./useDeviceSize";
import type { EarthVisualState } from "@/components/model-background";

export default function useEarthSequence(isGameComplete: boolean) {
  const { isMobile } = useDeviceSize();

  const [visualState, setVisualState] = useState<EarthVisualState>({
    colorMode: "gray",
    positionMode: "corner",
    rotationEnabled: false,
    scaleMultiplier: 1.25,
  });

  // Memoized state updaters for cleaner code
  const setGameInView = useCallback(() => {
    setVisualState({
      colorMode: "gray",
      positionMode: "center",
      rotationEnabled: false,
      scaleMultiplier: 1.0,
    });
  }, []);

  const setGameOutOfView = useCallback(() => {
    setVisualState({
      colorMode: "gray",
      positionMode: "corner",
      rotationEnabled: false,
      scaleMultiplier: 1.25,
    });
  }, []);

  // Handle scroll-based visibility (only when game not complete)
  useEffect(() => {
    if (typeof document === "undefined" || isGameComplete) return;

    const miniGameSection = document.getElementById("spell");
    if (!miniGameSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setGameInView();
          } else {
            setGameOutOfView();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(miniGameSection);
    return () => observer.disconnect();
  }, [isGameComplete, setGameInView, setGameOutOfView]);

  // Handle game completion — stays vibrant and spinning
  useEffect(() => {
    if (isGameComplete) {
      setVisualState({
        colorMode: "vibrant",
        positionMode: "corner",
        rotationEnabled: true,
        scaleMultiplier: isMobile ? 2 : 1.25,
      });
    }
  }, [isGameComplete, isMobile]);

  return visualState;
}
