import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import React, { useRef, useEffect, useState } from "react";
import useDeviceSize from "@/hooks/useDeviceSize";

type AnimatedCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function AnimatedCard({
  imageSrc,
  title,
  description,
  content,
  isExpanded,
  onToggle,
}: AnimatedCardProps) {
  // Truncate content for collapsed state
  const truncatedContent =
    description.length > 360 ? description.slice(0, 360) + "..." : description;

  // For scrolling and fade-in effect
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const scrollAnimationRef = useRef<number | null>(null);
  const {isMobile, isTablet} = useDeviceSize();

  // For auto scroll
  const autoScrollRef = useRef<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);

  // Split content into paragraphs
  const paragraphs = String(content)
    .split('\n')
    .filter(line => line.trim() !== '');

  // Disable body scroll when expanded
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = '';
      }
    };
  }, [isExpanded]);

  // Handle mouse position for scroll direction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    // If user moves mouse, pause auto scroll
    setIsAutoScrolling(false);

    const container = scrollRef.current;
    const rect = container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const containerHeight = rect.height;

    // Define zones for scrolling (top 20% and bottom 20%)
    if (mouseY < containerHeight * 0.2) {
      setScrollDirection('up');
    } else if (mouseY > containerHeight * 0.8) {
      setScrollDirection('down');
    } else {
      setScrollDirection('none');
    }
  };

  const handleMouseLeave = () => {
    setScrollDirection('none');
    // Resume auto scroll when mouse leaves
    setIsAutoScrolling(true);
  };

  // Smooth scrolling animation (manual via mouse)
  useEffect(() => {
    if (!scrollRef.current || scrollDirection === 'none') {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      return;
    }

    const container = scrollRef.current;
    const scrollSpeed = 2; // pixels per frame

    const animate = () => {
      if (scrollDirection === 'up') {
        container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
      } else if (scrollDirection === 'down') {
        container.scrollTop = Math.min(
          container.scrollHeight - container.clientHeight,
          container.scrollTop + scrollSpeed
        );
      }
      scrollAnimationRef.current = requestAnimationFrame(animate);
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [scrollDirection]);

  // Auto scroll effect
  useEffect(() => {
    if (!isExpanded || !scrollRef.current) {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    // Only auto scroll if enabled and not being manually scrolled
    if (!isAutoScrolling) {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    const container = scrollRef.current;
    const autoScrollSpeed = 0.5; // pixels per frame, slow

    let direction: "down" | "up" = "down";

    const autoScroll = () => {
      if (!container) return;

      // If at bottom, reverse direction to up
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
        direction = "up";
      }
      // If at top, reverse direction to down
      if (container.scrollTop <= 0) {
        direction = "down";
      }

      if (direction === "down") {
        container.scrollTop = Math.min(
          container.scrollHeight - container.clientHeight,
          container.scrollTop + autoScrollSpeed
        );
      } else {
        container.scrollTop = Math.max(
          0,
          container.scrollTop - autoScrollSpeed
        );
      }

      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isExpanded, isAutoScrolling, content]);

  // If user scrolls manually (wheel, touch), pause auto scroll for a while
  useEffect(() => {
    if (!isExpanded || !scrollRef.current) return;

    let timeout: NodeJS.Timeout | null = null;

    const handleUserScroll = () => {
      setIsAutoScrolling(false);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 3000); // Resume auto scroll after 3s of inactivity
    };

    const container = scrollRef.current;
    container.addEventListener("wheel", handleUserScroll, { passive: true });
    container.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      if (timeout) clearTimeout(timeout);
      container.removeEventListener("wheel", handleUserScroll);
      container.removeEventListener("touchmove", handleUserScroll);
    };
  }, [isExpanded]);

  // Fade-in paragraphs as they come into view
  useEffect(() => {
    if (!isExpanded || !scrollRef.current) return;

    const container = scrollRef.current;
    const handleScroll = () => {
      const newVisible: number[] = [];
      const paraNodes = Array.from(container.querySelectorAll("p"));

      paraNodes.forEach((node, idx) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate visibility with fade effect
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > 0.1 * rect.height) {
          newVisible.push(idx);
        }
      });

      setVisibleParagraphs(newVisible);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isExpanded, content]);

  // Calculate paragraph opacity based on position
  const getParagraphOpacity = (idx: number) => {
    if (!scrollRef.current) return visibleParagraphs.includes(idx) ? 1 : 0.3;

    const container = scrollRef.current;
    const paraNodes = Array.from(container.querySelectorAll("p"));
    const node = paraNodes[idx] as HTMLElement;

    if (!node) return 0.3;

    const rect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate fade based on distance from center
    const nodeCenter = rect.top + rect.height / 2;
    const containerCenter = containerRect.top + containerRect.height / 2;
    const distance = Math.abs(nodeCenter - containerCenter);
    const maxDistance = containerRect.height / 2;

    const opacity = Math.max(0.2, 1 - (distance / maxDistance) * 0.8);
    return opacity;
  };

  return (
    <AnimatePresence>
      {!isExpanded ? (
        <motion.div
          key="card-collapsed"
          className={`relative flex flex-wrap glass rounded-[49px] md:rounded-xl backdrop-blur-lg shadow-lg text-white transition-all duration-300 cursor-pointer overflow-hidden
            ${isMobile ? "w-[20em] basis-[20em] min-h-[480px]" : isTablet ? "w-[22em] basis-[22em] min-h-[600px]" : "w-[370px] min-h-[600px]"}
            `}
          onClick={onToggle}
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          layout
        >
          <motion.div className="absolute top-0 left-0 w-full h-full bg-olive-transparent px-8 py-12 flex items-center justify-center">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex flex-col items-start gap-8"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-row gap-4 mt-2 mb-8 ml-2"
              >
                <motion.div
                  layout
                  layoutId={`card-image-${title}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-[80px] md:w-[120px] h-[80px] md:h-[120px] flex items-center justify-center"
                >
                  <Image
                    src={imageSrc}
                    alt={title}
                    title={title}
                    width={120}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                    priority  
                  />
                </motion.div>
              </motion.div>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <motion.h3
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="lg:!text-2xl font-bold leading-tight mb-4"
                >
                  {title}
                </motion.h3>
                <motion.article
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="text-xs md:text-base font-normal leading-relaxed tracking-wide opacity-90 space-y-4"
                >
                  {truncatedContent}
                </motion.article>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="card-expanded"
          className={`fixed inset-0 z-50 flex items-center justify-center ${isMobile ? "bg-black/30 backdrop-blur-sm" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background overlay - clicking closes the card */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            onClick={onToggle}
          />

          {/* Content container */}
          <motion.div
            className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Background image */}
            <motion.div
              layoutId={`card-image-${title}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center opacity-10"
            >
              <Image
                src={imageSrc}
                alt={title}
                title={title}
                width={600}
                height={600}
                className="object-contain max-w-full max-h-full opacity-40"
                priority
              />
            </motion.div>

            {/* Content */}
            <motion.div
              className="relative z-10 w-full max-w-4xl h-full flex flex-col gap-8 mt-24"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.header className="w-full flex items-center justify-between">
                <motion.h3 className="font-semibold text-4xl text-white max-w-2xl">
                  {title}
                </motion.h3>
                <motion.button
                  className="flex items-center justify-center p-3 md:p-6 border border-white/30 rounded-full md:rounded-3xl hover:bg-white/10 transition-colors"
                  onClick={onToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="mdi:arrow-left" className="text-white" width={32} height={32} />
                </motion.button>
              </motion.header>

              <motion.article
                className="flex-1 flex items-center justify-center overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  ref={scrollRef}
                  className="prose prose-invert prose-lg max-w-3xl text-white/90 space-y-6 text-left relative w-full h-96 overflow-y-auto px-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {paragraphs.map((line, idx) => (
                    <motion.p
                      key={idx}
                      className="text-lg leading-relaxed transition-all duration-300"
                      style={{
                        opacity: getParagraphOpacity(idx),
                        transform: `translateY(${visibleParagraphs.includes(idx) ? 0 : 10}px)`,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </motion.article>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}