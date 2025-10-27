"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import blackWorldAnimation from "@/lottie/black-world-lottie.json";
import colouredWorldAnimation from "@/lottie/coloured-world-lottie.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface WorldBackgroundProps {
  isMobile: boolean;
  isGameComplete: boolean;
  allowMotion: boolean;
}

const WorldBackground: React.FC<WorldBackgroundProps> = ({
  isMobile,
  isGameComplete,
  allowMotion
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentState, setCurrentState] = useState(isGameComplete);

  // Handle smooth transition when game state changes
  useEffect(() => {
    if (currentState !== isGameComplete) {
      setIsVisible(false);

      const fadeOutTimer = setTimeout(() => {
        setCurrentState(isGameComplete);
        setIsVisible(true);
      }, 300); // Half of transition duration

      return () => clearTimeout(fadeOutTimer);
    }
  }, [isGameComplete, currentState]);

  const animationData = currentState ? colouredWorldAnimation : blackWorldAnimation;
  const imageSrc = currentState ? "/videos/earth-color-mobile.gif" : "/videos/earth-black-mobile.gif";
  const altText = currentState ? 'Colour World' : 'Black World';
  const lottieAltText = currentState ? "Rotating colour earth" : "Rotating gray earth";
  const opacityClass = currentState ? 'opacity-50' : 'opacity-60';

  if (isMobile) {
    return (
      <Image
        src={imageSrc}
        alt={altText}
        width={0}
        height={0}
        priority
        fetchPriority="high"
        className={`fixed bottom-0 left-0 w-full h-full object-cover -z-10 transition-opacity ease-in-out duration-600 ${isVisible ? opacityClass : 'opacity-0'
          }`}
      />
    );
  }

  if (!allowMotion) {
    return null;
  }

  return (
    <Lottie
      animationData={animationData}
      alt={lottieAltText}
      width={0}
      height={0}
      className={`w-full lg:h-full object-fill fixed top-[0%] lg:top-56 -left-[0%] inset-0 -z-10 transition-opacity ease-in-out duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    />
  );
};

export default WorldBackground;
