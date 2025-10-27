import { useLenis } from "lenis/react";
import { useCallback, useEffect, useState } from "react";

export function useScrollToTop() {
  const lenis = useLenis();
  const [isScrolling, setIsScrolling] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!lenis || typeof window === "undefined") return;

    const handleScroll = (e: { scroll: number }) => {
      setShowButton(e.scroll > window.innerHeight * 0.5);
    };

    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, [lenis]);

  const scrollToTop = useCallback((options?: {
    duration?: number;
    easing?: (t: number) => number;
    offset?: number;
  }) => {
    if (!lenis || isScrolling) return;

    setIsScrolling(true);

    const defaultOptions = {
      duration: 2,
      easing: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      offset: 0,
      ...options
    };

    lenis.scrollTo(0, {
      ...defaultOptions,
      onComplete: () => setIsScrolling(false)
    });
  }, [lenis, isScrolling]);

  const scrollToElement = useCallback((
    target: string | HTMLElement, 
    options?: {
      duration?: number;
      easing?: (t: number) => number;
      offset?: number;
    }
  ) => {
    if (!lenis) return;

    const defaultOptions = {
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      offset: -80,
      ...options
    };

    lenis.scrollTo(target, defaultOptions);
  }, [lenis]);

  return {
    scrollToTop,
    scrollToElement,
    isScrolling,
    showButton
  };
}