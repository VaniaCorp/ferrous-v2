"use client";
import { useState, useEffect, useCallback } from "react";
import useDeviceSize from "./useDeviceSize";
import type { EarthVisualState, WaitlistPosition } from "@/components/model-background";

export default function useEarthSequence(isGameComplete: boolean, waitlistPosition?: WaitlistPosition) {
  const { isMobile } = useDeviceSize();

  const [visualState, setVisualState] = useState<EarthVisualState>({
    colorMode: "gray",
    positionMode: "corner",
    rotationEnabled: false,
    scaleMultiplier: 1.25,
    waitlistPosition,
  });

  const [isGameInView, setIsGameInView] = useState(false);
  const [isWaitlistInView, setIsWaitlistInView] = useState(false);

  // Memoized state updaters that respect game completion state
  const setGameInView = useCallback(() => {
    setIsGameInView(true);
    setVisualState((prev) => ({
      colorMode: prev.colorMode, // Preserve color mode (gray or vibrant)
      positionMode: "center",
      rotationEnabled: prev.rotationEnabled, // Preserve rotation state
      scaleMultiplier: 1.0,
      waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
      isWaitlistActive: false, // Game is active, not waitlist
    }));
  }, []);

  const setGameOutOfView = useCallback(() => {
    setIsGameInView(false);
    // Only move to corner if waitlist is not in view (or game is not completed)
    setVisualState((prev) => {
      // If waitlist is in view AND game is completed, stay at center with waitlist active
      if (isWaitlistInView && isGameComplete) {
        return {
          ...prev,
          isWaitlistActive: true, // Ensure waitlist is marked as active
        };
      }
      return {
        colorMode: prev.colorMode, // Preserve color mode (gray or vibrant)
        positionMode: "corner",
        rotationEnabled: prev.rotationEnabled, // Preserve rotation state
        scaleMultiplier: prev.rotationEnabled ? (isMobile ? 2 : 1.25) : 1.25, // Use completion scale if rotating
        waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
        isWaitlistActive: false, // Not in waitlist when moving to corner
      };
    });
  }, [isMobile, isWaitlistInView, isGameComplete]);

  const setWaitlistInView = useCallback(() => {
    setIsWaitlistInView(true);
    // Only move to center if game is completed
    if (isGameComplete) {
      setVisualState((prev) => ({
        colorMode: prev.colorMode, // Should be vibrant when game is complete
        positionMode: "center",
        rotationEnabled: prev.rotationEnabled, // Should be true when game is complete
        scaleMultiplier: 1.0,
        waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
        isWaitlistActive: true, // Waitlist section is active
      }));
    }
  }, [isGameComplete]);

  const setWaitlistOutOfView = useCallback(() => {
    setIsWaitlistInView(false);
    // Only move to corner if game is not in view
    if (!isGameInView) {
      setVisualState((prev) => ({
        colorMode: prev.colorMode,
        positionMode: "corner",
        rotationEnabled: prev.rotationEnabled,
        scaleMultiplier: prev.rotationEnabled ? (isMobile ? 2 : 1.25) : 1.25,
        waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
        isWaitlistActive: false, // Waitlist is no longer active
      }));
    }
  }, [isGameInView, isMobile]);

  // Handle scroll-based visibility for mini-game (works even after game completion)
  useEffect(() => {
    if (typeof document === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const miniGameSection = document.getElementById("spell");
      
      if (!miniGameSection) {
        // Retry after a short delay if element not found (handles dynamic loading)
        timeoutId = setTimeout(setupObserver, 100);
        return;
      }

      observer = new IntersectionObserver(
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
      
      // Initial check: if already in view when observer is set up
      const rect = miniGameSection.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight * 0.5 && 
        rect.bottom > window.innerHeight * 0.5;
      
      if (isVisible) {
        setGameInView();
      }
    };

    setupObserver();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [setGameInView, setGameOutOfView]);

  // Handle scroll-based visibility for waitlist (only when game is completed)
  useEffect(() => {
    if (typeof document === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const waitlistSection = document.getElementById("waitlist");
      
      if (!waitlistSection) {
        // Retry after a short delay if element not found (handles dynamic loading)
        timeoutId = setTimeout(setupObserver, 100);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setWaitlistInView();
            } else {
              setWaitlistOutOfView();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(waitlistSection);
      
      // Initial check: if already in view when observer is set up and game is completed
      const rect = waitlistSection.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight * 0.5 && 
        rect.bottom > window.innerHeight * 0.5;
      
      if (isVisible && isGameComplete) {
        setWaitlistInView();
      }
    };

    setupObserver();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [setWaitlistInView, setWaitlistOutOfView, isGameComplete]);

  // Update waitlistPosition when prop changes
  useEffect(() => {
      setVisualState((prev) => ({
        ...prev,
        waitlistPosition,
        // Preserve isWaitlistActive state
      }));
  }, [waitlistPosition]);

  // Handle game completion — updates color and rotation, preserves position
  useEffect(() => {
    if (isGameComplete) {
      setVisualState((prev) => ({
        colorMode: "vibrant",
        positionMode: prev.positionMode, // Preserve current position mode (will be updated by waitlist/game observers if needed)
        rotationEnabled: true,
        scaleMultiplier: prev.positionMode === "center" ? 1.0 : (isMobile ? 2 : 1.25), // Center uses 1.0, corner uses completion scale
        waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
        isWaitlistActive: prev.isWaitlistActive, // Preserve waitlist active state
      }));
      // If waitlist is already in view when game completes, move to center
      if (isWaitlistInView) {
        setWaitlistInView();
      }
    } else {
      // When game is reset, go back to gray, preserve position
      setVisualState((prev) => {
        // If waitlist is in view but game is not complete, move to corner
        // Otherwise preserve position (unless game is in view, which will handle it)
        const shouldBeAtCorner = isWaitlistInView && !isGameInView;
        return {
          colorMode: "gray",
          positionMode: shouldBeAtCorner ? "corner" : prev.positionMode, // Move to corner if waitlist forces center but game not complete
          rotationEnabled: false,
          scaleMultiplier: shouldBeAtCorner ? 1.25 : (prev.positionMode === "center" ? 1.0 : 1.25), // Use appropriate scale
          waitlistPosition: prev.waitlistPosition, // Preserve waitlist position
          isWaitlistActive: false, // Reset waitlist active state when game is reset
        };
      });
    }
  }, [isGameComplete, isMobile, isWaitlistInView, isGameInView, setWaitlistInView]);

  return visualState;
}
