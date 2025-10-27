# Video Optimization System

This system provides comprehensive video optimization for the Ferrous application, ensuring fast loading, responsive design, and optimal user experience across all devices and connection types.

## Features

### 🚀 Performance Optimizations
- **Adaptive Loading**: Automatically adjusts video loading strategy based on connection speed
- **Mobile Optimization**: Optimized video attributes and loading for mobile devices
- **Connection Detection**: Detects slow connections (2G, slow-2G) and skips video when appropriate
- **Reduced Motion Support**: Respects user's `prefers-reduced-motion` setting
- **Smart Timeout**: Dynamic timeout based on estimated load time

### 📱 Responsive Design
- **Mobile Detection**: Automatic mobile device detection
- **Responsive Video**: Video scales properly across all screen sizes
- **Object Positioning**: Optimized video positioning for different devices

### ♿ Accessibility
- **ARIA Labels**: Proper accessibility labels for screen readers
- **Focus Management**: Proper focus handling after video completion
- **Reduced Motion**: Automatic skipping for users who prefer reduced motion

### 🔧 Technical Features
- **Error Handling**: Graceful fallback when video fails to load
- **Loading States**: Visual loading indicators
- **Preload Optimization**: Smart preloading based on device and connection
- **Cache Headers**: Optimized caching for video files

## Usage

### Basic Implementation

```tsx
import InitialLoader from '@/layout/loader';

function App() {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  
  if (!isLoaderComplete) {
    return <InitialLoader onComplete={() => setIsLoaderComplete(true)} />;
  }
  
  return <YourMainContent />;
}
```

### Advanced Configuration

```tsx
import { useVideoOptimization } from '@/hooks/useVideoOptimization';

function CustomVideoLoader() {
  const {
    shouldSkipVideo,
    isMobile,
    connectionType,
    getVideoSource,
    getVideoAttributes
  } = useVideoOptimization({
    skipOnSlowConnection: true,
    skipOnReducedMotion: true,
    mobileOptimized: true,
    timeoutMs: 5000
  });

  // Use the optimization data to customize your video implementation
}
```

## Configuration

### Video Optimization Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `skipOnSlowConnection` | boolean | `true` | Skip video on slow connections (2G, slow-2G) |
| `skipOnReducedMotion` | boolean | `true` | Skip video when user prefers reduced motion |
| `mobileOptimized` | boolean | `true` | Enable mobile-specific optimizations |
| `timeoutMs` | number | `3000` | Maximum time to wait for video to load |
| `enableAdaptiveLoading` | boolean | `true` | Enable adaptive loading based on connection |

### Next.js Configuration

The system includes optimized Next.js configuration:

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/videos/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'Content-Type',
          value: 'video/mp4',
        },
      ],
    },
  ];
}
```

## File Structure

```
src/
├── layout/
│   └── loader.tsx              # Main loader component
├── hooks/
│   └── useVideoOptimization.ts # Video optimization hook
├── lib/
│   ├── video-utils.ts          # Video optimization utilities
│   └── README-video-optimization.md
└── app/
    └── layout.tsx              # Preload configuration
```

## Performance Metrics

### Loading Times
- **Desktop (Fast Connection)**: ~1-2 seconds
- **Mobile (4G)**: ~2-3 seconds  
- **Slow Connection (2G)**: Video skipped, instant load
- **Reduced Motion**: Video skipped, instant load

### File Sizes
- **Current Video**: 1.3MB (intro-vid.mp4)
- **Optimized for**: Web delivery with proper compression
- **Cache Duration**: 1 year (immutable)

## Best Practices

### Video Preparation
1. **Compress videos** using tools like FFmpeg
2. **Use appropriate bitrates** for web delivery
3. **Consider multiple formats** (MP4, WebM) for better compatibility
4. **Optimize for mobile** with appropriate resolutions

### Implementation
1. **Always provide fallbacks** for video loading failures
2. **Use preload strategically** - only for critical videos
3. **Implement proper error handling** with user-friendly messages
4. **Test on various devices** and connection speeds

### Performance
1. **Monitor Core Web Vitals** - especially LCP (Largest Contentful Paint)
2. **Use CDN** for video delivery when possible
3. **Implement lazy loading** for non-critical videos
4. **Consider video placeholders** for better perceived performance

## Troubleshooting

### Common Issues

1. **Video not loading on mobile**
   - Check if `playsInline` attribute is set
   - Verify video format compatibility
   - Check network connection

2. **Video loading too slowly**
   - Reduce video file size
   - Check connection speed detection
   - Verify preload configuration

3. **Accessibility issues**
   - Ensure proper ARIA labels
   - Test with screen readers
   - Verify focus management

### Debug Mode

Enable debug logging by setting environment variable:
```bash
NEXT_PUBLIC_VIDEO_DEBUG=true
```

This will log optimization decisions and performance metrics to the console.

## Future Enhancements

- [ ] Multiple video quality options
- [ ] WebP video format support
- [ ] Advanced compression techniques
- [ ] A/B testing for optimization strategies
- [ ] Analytics integration for performance monitoring
