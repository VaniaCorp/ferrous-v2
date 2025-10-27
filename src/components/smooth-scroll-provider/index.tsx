"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Configure ScrollTrigger defaults for better performance
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Clean up on unmount
    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // Optimized settings for smooth performance
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 35,
        wheelMultiplier: 1,
        infinite: false,
        autoResize: true,
        prevent: (node) => {
          // Prevent smooth scroll on specific elements
          return (
            node.classList.contains('no-smooth-scroll') ||
            node.tagName === 'INPUT' ||
            node.tagName === 'TEXTAREA' ||
            node.tagName === 'SELECT'
          );
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}