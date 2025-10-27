"use client";

import { useRef, useState, useEffect } from "react";
import { useVideoOptimization } from "@/hooks/useVideoOptimization";

interface InitialLoaderProps {
  onComplete: () => void;
  pageRef?: React.RefObject<HTMLDivElement | null>;
}

export default function InitialLoader({ onComplete, pageRef }: InitialLoaderProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { 
    shouldSkipVideo,
    getVideoSource, 
    getVideoAttributes, 
    timeoutMs 
  } = useVideoOptimization({
    skipOnSlowConnection: true,
    skipOnReducedMotion: true,
    mobileOptimized: true,
    timeoutMs: 3000
  });

  // Handle video loading states
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setHasError(false);
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsVideoLoaded(false);
    // Fallback: complete loader after error
    setTimeout(() => {
      handleVideoEnd();
    }, 1000);
  };

  // When the video ends, fade out the loader, then call onComplete and focus pageRef if provided
  const handleVideoEnd = () => {
    if (loaderRef.current) {
      loaderRef.current.style.transition = "opacity 0.4s ease";
      loaderRef.current.style.opacity = "0";
      setTimeout(() => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none";
          loaderRef.current.style.pointerEvents = "none";
        }
        if (pageRef && pageRef.current) {
          // Optionally focus the main page for accessibility
          if (typeof (pageRef.current).focus === "function") {
            (pageRef.current).focus();
          }
        }
        onComplete();
      }, 400);
    } else {
      onComplete();
    }
  };

  // Skip video based on optimization settings
  useEffect(() => {
    if (shouldSkipVideo) {
      handleVideoEnd();
      return;
    }

    // Skip video after timeout if it hasn't loaded
    const timeout = setTimeout(() => {
      if (!isVideoLoaded && !hasError) {
        handleVideoEnd();
      }
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [shouldSkipVideo, isVideoLoaded, hasError, timeoutMs]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      tabIndex={-1}
      aria-label="Loading"
    >
      {/* Loading indicator */}
      {/* {!isVideoLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )} */}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-lg font-medium mb-2">Loading...</div>
            <div className="text-sm opacity-70">Please wait</div>
          </div>
        </div>
      )}

      {/* Optimized video element */}
      <video
        ref={videoRef}
        src={getVideoSource("/videos/intro-vid.mp4")}
        autoPlay
        onEnded={handleVideoEnd}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlayThrough={handleVideoLoad}
        className={`w-full h-full object-contain md:object-cover transition-opacity duration-300 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        // style={{ 
        //   maxWidth: "100vw", 
        //   maxHeight: "100vh",
        //   // Optimize for mobile
        //   ...(isMobile && {
        //     objectPosition: "center center"
        //   })
        // }}
        {...(getVideoAttributes() as React.VideoHTMLAttributes<HTMLVideoElement>)}
        // Accessibility
        aria-label="Loading animation"
        role="img"
      />
    </div>
  );
}