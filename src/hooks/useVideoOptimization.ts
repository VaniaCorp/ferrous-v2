import { useState, useEffect } from 'react';
import { 
  isSlowConnection, 
  prefersReducedMotion, 
  getOptimalVideoSource, 
  getOptimalVideoAttributes,
  estimateLoadTime,
  NavigatorWithConnection
} from '@/lib/video-utils';

interface VideoOptimizationOptions {
  skipOnSlowConnection?: boolean;
  skipOnReducedMotion?: boolean;
  mobileOptimized?: boolean;
  timeoutMs?: number;
}

interface VideoOptimizationReturn {
  shouldSkipVideo: boolean;
  isMobile: boolean;
  connectionType: string;
  getVideoSource: (baseSrc: string) => string;
  getVideoAttributes: () => Partial<HTMLVideoElement> & { controlsList?: string };
  timeoutMs: number;
  isSlowConnection: boolean;
  prefersReducedMotion: boolean;
}

export function useVideoOptimization(options: VideoOptimizationOptions = {}): VideoOptimizationReturn {
  const {
    skipOnSlowConnection = true,
    skipOnReducedMotion = true,
    mobileOptimized = true,
    timeoutMs = 3000
  } = options;

  const [shouldSkipVideo, setShouldSkipVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [estimatedLoadTime, setEstimatedLoadTime] = useState(timeoutMs);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    // Detect connection type and estimate load time
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as NavigatorWithConnection).connection;
        const effectiveType = connection?.effectiveType ?? 'unknown';
        setConnectionType(effectiveType);
        
        // Estimate load time for a typical intro video (1.3MB)
        const videoSizeBytes = 1.3 * 1024 * 1024; // 1.3MB
        const loadTime = estimateLoadTime(videoSizeBytes);
        setEstimatedLoadTime(Math.max(loadTime, timeoutMs));
        
        if (skipOnSlowConnection && 
            (effectiveType === 'slow-2g' || effectiveType === '2g')) {
          setShouldSkipVideo(true);
        }
      }
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      if (skipOnReducedMotion && prefersReducedMotion()) {
        setShouldSkipVideo(true);
      }
    };

    // Initial checks
    checkMobile();
    checkConnection();
    checkReducedMotion();

    // Listen for changes
    window.addEventListener('resize', checkMobile);
    
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorWithConnection).connection;
      connection?.addEventListener?.('change', checkConnection);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if ('connection' in navigator) {
        const connection = (navigator as NavigatorWithConnection).connection;
        connection?.removeEventListener?.('change', checkConnection);
      }
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, [skipOnSlowConnection, skipOnReducedMotion, timeoutMs]);

  // Get optimized video source
  const getVideoSource = (baseSrc: string) => {
    if (!mobileOptimized) {
      return baseSrc;
    }

    return getOptimalVideoSource(baseSrc, isMobile, isSlowConnection());
  };

  // Get video attributes based on optimization
  const getVideoAttributes = () => {
    return getOptimalVideoAttributes(isMobile, isSlowConnection());
  };

  // Check if video should be skipped
  const shouldSkip = () => {
    if (skipOnSlowConnection && isSlowConnection()) return true;
    if (skipOnReducedMotion && prefersReducedMotion()) return true;
    return shouldSkipVideo;
  };

  return {
    shouldSkipVideo: shouldSkip(),
    isMobile,
    connectionType,
    getVideoSource,
    getVideoAttributes,
    timeoutMs: estimatedLoadTime,
    isSlowConnection: isSlowConnection(),
    prefersReducedMotion: prefersReducedMotion()
  };
}
