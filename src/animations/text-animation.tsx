"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";

gsap.registerPlugin(SplitText, ScrollTrigger);

type TextUpAnimationProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  role?: string;
  shouldAnimate?: boolean;
};

export function TextUpAnimation({
  children,
  as: Tag = "span",
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  role,
  shouldAnimate = false,
}: TextUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return; // Skip animation for reduced motion users
    }
    if (!containerRef.current) return;

    // Split into characters
    const split = new SplitText(containerRef.current, {
      type: "chars,words",
    });

    // Set initial state
    gsap.set(split.chars, { yPercent: 120, opacity: 1 });

    // If shouldAnimate is true, trigger the animation immediately
    if (shouldAnimate) {
      const tl = gsap.timeline();
      tl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0,
        ease: "power3.out",
      });
      // Add a small delay before reverting to ensure smooth completion
      tl.call(() => {
        gsap.delayedCall(0.2, () => {
          split.revert();
        });
      });
    } else {
      // Fallback to scroll-based animation if shouldAnimate is not provided
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => {
          split.revert();
        },
      });
    }

    return () => {
      split.revert();
    };
  }, [shouldAnimate]);

  return (
    <div
      className="relative w-max h-max overflow-hidden"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      role={role}
    >
      <Tag ref={containerRef} className={className}>
        {children}
      </Tag>
    </div>
  );
}

export function TextStaggerUpAnimation({
  children,
  as: Tag = "span",
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  role,
}: TextUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
    }
    if (!containerRef.current) return;

    // Split into characters
    const split = new SplitText(containerRef.current, {
      type: "chars,words",
    });

    // Set initial state
    gsap.set(split.chars, { yPercent: 120, opacity: 1 });

    // Animate on scroll
    gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        split.revert();
      },
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div
      className="relative w-max h-max overflow-hidden"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      role={role}
    >
      <Tag ref={containerRef} className={className}>
        {children}
      </Tag>
    </div>
  );
}

export function TextParagraphAnimation({
  children,
  as: Tag = "p",
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  role,
}: TextUpAnimationProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
    }
    if (!containerRef.current) return;

    // Check if mobile device
    const isMobile = window.innerWidth < 768;

    // Split into lines with better word handling
    const split = new SplitText(containerRef.current, {
      type: "lines",
      linesClass: "line-overflow",
      reduceWhiteSpace: false,
    });

    // Hide initially
    gsap.set(split.lines, { yPercent: 120, opacity: 0 });

    // Animate each line upward into view
    gsap.to(split.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: isMobile ? "top 70%" : "top 85%", // Earlier trigger on mobile
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        split.revert(); // optional cleanup
      },
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <Tag
        ref={containerRef}
        className={`${className} break-words hyphens-auto`}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        role={role}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {children}
      </Tag>
    </div>
  );
}

export function ExpandingTextAnimation({
  children,
  imageSrc,
  imageAlt,
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  role,
}: TextUpAnimationProps & {
  imageSrc: string;
  imageAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageRef.current) return;

    // Split into words
    const split = new SplitText(containerRef.current, {
      type: "words",
    });

    // Set initial state - all text below viewport
    gsap.set(split.words, { yPercent: 120, opacity: 0 });
    gsap.set(imageRef.current, { scale: 0, opacity: 0 });

    // Create timeline for the sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Step 1: All text rises up together
    tl.to(split.words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0,
    });

    // Step 2: Text expands to reveal image
    tl.to(split.words, {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.3");

    // Step 3: Image appears and text returns to normal
    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.2");

    tl.to(split.words, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.3");

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div className="relative w-max h-max overflow-hidden">
      <div
        ref={containerRef}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        role={role}
      >
        {children}
      </div>
      <Image
        ref={imageRef}
        src={imageSrc}
        alt={imageAlt}
        width={70}
        height={70}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

export function TextWithImageAnimation({
  leftText,
  rightText,
  imageSrc,
  imageAlt,
  className = "",
}: {
  leftText: string;
  rightText: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
    }
    if (!leftRef.current || !rightRef.current || !imageRef.current) return;

    // Split both text sections into words
    const leftSplit = new SplitText(leftRef.current, { type: "words" });
    const rightSplit = new SplitText(rightRef.current, { type: "words" });

    // Set initial state - all text below viewport
    gsap.set([...leftSplit.words, ...rightSplit.words], { yPercent: 120, opacity: 0 });
    gsap.set(imageRef.current, { scale: 0, opacity: 0 });

    // Create timeline for the sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: leftRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Step 1: All text rises up together
    tl.to([...leftSplit.words, ...rightSplit.words], {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0,
    });

    // Step 2: Text expands to reveal image
    tl.to([...leftSplit.words, ...rightSplit.words], {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.3");

    // Step 3: Image appears and text returns to normal
    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.2");

    tl.to([...leftSplit.words, ...rightSplit.words], {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.3");

    return () => {
      leftSplit.revert();
      rightSplit.revert();
    };
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div ref={leftRef} className="text-4xl text-center">
        {leftText}
      </div>
      <div className="relative inline-block">
        <Image 
          ref={imageRef}
          src={imageSrc}
          alt={imageAlt}
          width={70}
          height={70}
          className="inline-block"
        />
      </div>
      <div ref={rightRef} className="text-4xl text-center">
        {rightText}
      </div>
    </div>
  );
}

