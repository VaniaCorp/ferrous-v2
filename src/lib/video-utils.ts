/**
 * Video optimization utilities for better performance and user experience
 */



export interface NetworkConnection {
  effectiveType?: string;
  downlink?: number;
  addEventListener?: (event: string, listener: () => void) => void;
  removeEventListener?: (event: string, listener: () => void) => void;
}

export interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
}

/**
 * Check if the user's connection is slow
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as NavigatorWithConnection).connection;
  const slowConnections: string[] = ['slow-2g', '2g'];
  
  return connection?.effectiveType ? slowConnections.includes(connection.effectiveType) : false;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal video source based on device and connection
 */
export function getOptimalVideoSource(
  baseSrc: string, 
  isMobile: boolean, 
  isSlowConnection: boolean
): string {
  // For now, we use the same video file
  // In a real implementation, you might have different video files:
  // - intro-vid-mobile.mp4 (smaller, optimized for mobile)
  // - intro-vid-low.mp4 (lower quality for slow connections)
  // - intro-vid.mp4 (full quality for desktop)
  
  if (isMobile && isSlowConnection) {
    // Could return a mobile-optimized, low-quality version
    return baseSrc;
  }
  
  if (isMobile) {
    // Could return a mobile-optimized version
    return baseSrc;
  }
  
  if (isSlowConnection) {
    // Could return a low-quality version
    return baseSrc;
  }
  
  return baseSrc;
}

/**
 * Get optimal video attributes based on device and connection
 */
export function getOptimalVideoAttributes(
  isMobile: boolean,
  isSlowConnection: boolean
): Partial<HTMLVideoElement> & { controlsList?: string } {
  const baseAttributes: Partial<HTMLVideoElement> & { controlsList?: string } = {
    muted: true,
    playsInline: true,
    disablePictureInPicture: true,
    controlsList: 'nodownload nofullscreen noremoteplayback'
  };

  if (isMobile) {
    return {
      ...baseAttributes,
      preload: 'none', // Don't preload on mobile to save bandwidth
      poster: undefined // No poster on mobile to save bandwidth
    };
  }

  if (isSlowConnection) {
    return {
      ...baseAttributes,
      preload: 'metadata', // Only load metadata on slow connections
    };
  }

  return {
    ...baseAttributes,
    preload: 'metadata', // Load metadata for faster start
  };
}

/**
 * Estimate video load time based on file size and connection
 */
export function estimateLoadTime(fileSizeBytes: number): number {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 3000; // Default 3 seconds
  }

  const connection = (navigator as NavigatorWithConnection).connection;
  const downlink = connection?.downlink ?? 1; // Mbps
  
  // Convert file size to bits and calculate time
  const fileSizeBits = fileSizeBytes * 8;
  const timeInSeconds = fileSizeBits / (downlink * 1024 * 1024);
  
  // Add some buffer time
  return Math.min(Math.max(timeInSeconds * 1000 + 1000, 1000), 10000);
}

/**
 * Check if video format is supported
 */
export function isVideoFormatSupported(format: string): boolean {
  if (typeof document === 'undefined') {
    return true; // Assume supported on server
  }

  const video = document.createElement('video');
  return video.canPlayType(`video/${format}`) !== '';
}

/**
 * Get the best supported video format
 */
export function getBestSupportedFormat(formats: string[]): string {
  const supportedFormats = ['webm', 'mp4', 'ogg'];
  
  for (const format of supportedFormats) {
    if (formats.includes(format) && isVideoFormatSupported(format)) {
      return format;
    }
  }
  
  return 'mp4'; // Fallback to mp4
}
