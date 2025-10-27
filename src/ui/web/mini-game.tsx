"use client";

import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

interface MiniGameProps {
  onGameComplete?: (isComplete: boolean) => void;
}

export default function MiniGame({ onGameComplete }: MiniGameProps) {
  const [clickedLetters, setClickedLetters] = useState<string[]>([]);
  const [, setIsComplete] = useState(false);
  const [revealedTitleParts, setRevealedTitleParts] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const spanRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const textFragments = useMemo(() => ([
    { id: "FER", x: "10%", y: "20%", rotation: -15, isTarget: true },
    { id: "R", x: "85%", y: "15%", rotation: -15, isTarget: true },
    { id: "OUS", x: "80%", y: "75%", rotation: -15, isTarget: true },
    // Jumbled text fragments (fillers)
    { id: "GFS", x: "25%", y: "10%", rotation: 20, isTarget: false },
    { id: "E", x: "50%", y: "25%", rotation: -10, isTarget: false },
    { id: "SOU", x: "70%", y: "35%", rotation: 15, isTarget: false },
    { id: "RR", x: "90%", y: "5%", rotation: -25, isTarget: false },
    { id: "WE", x: "15%", y: "80%", rotation: 30, isTarget: false },
    { id: "O", x: "5%", y: "90%", rotation: -20, isTarget: false },
    { id: "RULE", x: "45%", y: "85%", rotation: 25, isTarget: false },
    { id: "EM", x: "75%", y: "90%", rotation: -30, isTarget: false },
    // More fillers
    { id: "SUN", x: "30%", y: "60%", rotation: 10, isTarget: false },
    { id: "CAT", x: "60%", y: "10%", rotation: -12, isTarget: false },
    { id: "DOG", x: "40%", y: "40%", rotation: 18, isTarget: false },
    { id: "LUX", x: "20%", y: "50%", rotation: -8, isTarget: false },
    { id: "ZEN", x: "65%", y: "60%", rotation: 22, isTarget: false },
    { id: "QRS", x: "80%", y: "50%", rotation: -18, isTarget: false },
    { id: "BEE", x: "55%", y: "70%", rotation: 14, isTarget: false },
    { id: "FOX", x: "35%", y: "80%", rotation: -16, isTarget: false },
    { id: "JAM", x: "60%", y: "85%", rotation: 8, isTarget: false }
  ]), []);

  const targetFragments = useMemo(() => textFragments.filter(f => f.isTarget), [textFragments]);

  // Main title fragments with their corresponding text fragments
  const mainTitleFragments = useMemo(() => ([
    { id: "FER", text: "FER" },
    { id: "R", text: "R" },
    { id: "OUS", text: "OUS" }
  ]), []);

  // Update revealed title parts when clickedLetters changes
  useEffect(() => {
    setRevealedTitleParts(clickedLetters);
  }, [clickedLetters]);

  const resetGame = () => {
    setClickedLetters([]);
    setIsComplete(false);
    setRevealedTitleParts([]);
    onGameComplete?.(false);

    // Reset all text fragments to dim state
    gsap.to(textRefs.current, {
      opacity: 0.3,
      duration: 0.3
    });

    // Reset content visibility
    if (spanRef.current) {
      spanRef.current.style.display = 'block';
    }
    gsap.to(spanRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(paragraphRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  useGSAP(() => {
    gsap.set(textRefs.current, { opacity: 0.3 });
    gsap.set(spanRef.current, { opacity: 1, y: 0 });
    gsap.set(paragraphRef.current, { opacity: 0, y: 20 });
  }, { scope: sectionRef });

  const handleTextClick = useCallback((textId: string, index: number) => {
    const fragment = textFragments[index];
    if (!fragment.isTarget || clickedLetters.includes(textId)) return;

    const newClickedLetters = [...clickedLetters, textId];
    setClickedLetters(newClickedLetters);

    // Instantly make the clicked text fragment white and bright
    const textElement = textRefs.current[index];
    if (textElement) {
      gsap.to(textElement, {
        opacity: 1,
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(textElement, {
            scale: 1,
            duration: 0.2
          });
        }
      });
    }

    // Check if we've completed the word
    if (newClickedLetters.length === targetFragments.length) {
      // Fluid content replacement
      setTimeout(() => {
        // Fade out span content and hide it
        gsap.to(spanRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            if (spanRef.current) {
              spanRef.current.style.display = 'none';
            }
          }
        });

        // Fade in paragraph content
        gsap.to(paragraphRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3
        });

        // Update state after animation
        setTimeout(() => {
          setIsComplete(true);
          onGameComplete?.(true);
        }, 900);
      }, 800);
    }
  }, [clickedLetters, onGameComplete, targetFragments, textFragments]);

  return (
    <div id="spell" className="relative w-full max-w-7xl h-screen max-h-[75em] mx-auto flex flex-col justify-center items-center gap-12 z-0">
      <section
        ref={sectionRef}
        className="w-full max-w-4xl h-[40em] relative overflow-hidden"
      >
        {/* Text fragments positioned absolutely */}
        {textFragments.map((fragment, index) => (
          <span
            key={`${fragment.id}-${index}`}
            ref={el => { textRefs.current[index] = el; }}
            onClick={() => handleTextClick(fragment.id, index)}
            className={`absolute cursor-pointer select-none text-2xl font-bold text-white transition-transform duration-200
              ${fragment.isTarget ? 'hover:opacity-70' : 'hover:opacity-60'}
              ${fragment.isTarget ? '' : 'hover:text-gray-400'}
              ${fragment.isTarget && 'animate-scale'}
            `}
            style={{
              left: fragment.x,
              top: fragment.y,
              transform: `rotate(${fragment.rotation}deg)`,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              opacity: clickedLetters.includes(fragment.id) ? 1 : 0.3
            }}
          >
            {fragment.id}
          </span>
        ))}
      </section>

      <div id="display" className="flex flex-col gap-4 items-center justify-center">
        <h1
          ref={mainTitleRef}
          className="text-center tracking-[0.3em] text-6xl font-bold text-white relative"
        >
          {mainTitleFragments.map((frag) => (
            <span key={frag.id} className="relative inline-block">
              <span
                className={`transition-all duration-500 ${revealedTitleParts.includes(frag.id) ? 'opacity-100' : 'opacity-30'
                  }`}
              >
                {frag.text}
              </span>
              {/* Animated underline */}
              <div
                className={`absolute bottom-0 -left-2 h-0.5 md:h-2 bg-white transition-all duration-500 ease-out ${revealedTitleParts.includes(frag.id) ? 'w-full' : 'w-0'
                  }`}
                style={{
                  transform: revealedTitleParts.includes(frag.id) ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left'
                }}
              />
            </span>
          ))}
        </h1>
        
        <div
          ref={spanRef}
          className="text-center space-y-4"
        >
          <h3 className="text-3xl font-semibold text-white">In a nutshell</h3>
          <p className="text-white">starts with &quot;FER&quot;</p>
        </div>

        <p
          ref={paragraphRef}
          className="w-full max-w-lg text-center text-white"
        >
          Step into a world of wealth, now within your grasp.
        </p>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="absolute bottom-20 md:bottom-48 right-5 lg:right-48 border p-4 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-200"
      >
        <Icon icon="uit:redo" width={24} height={24} style={{ transform: "scaleX(-1)" }} />
      </button>
    </div>
  );
}
