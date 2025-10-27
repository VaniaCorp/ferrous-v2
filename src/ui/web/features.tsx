import AnimatedCard from "@/components/animated-card";
import features from "@/data/features.json";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Features() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const scrollRef = useRef<number>(0);
  const isInitialMount = useRef(true);

  const handleCardToggle = (featureTitle: string) => {
    setExpandedCard(featureTitle);
  };

  const handleClose = () => {
    setExpandedCard(null);
  };

  useEffect(() => {
    // Skip scroll handling on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if window or document is not available (SSR)
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (expandedCard) {
      // Save current scroll position
      scrollRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Only restore scroll position if we had a saved position
      if (scrollRef.current > 0) {
        window.scrollTo(0, scrollRef.current);
        scrollRef.current = 0;
      }
    }

    // Cleanup function
    return () => {
      if (expandedCard && typeof document !== "undefined") {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
      }
    };
  }, [expandedCard]);

  return (
    <div id="features" className="relative max-w-7xl xl:h-screen lg:px-16 my-12 mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center xl:justify-between">
      <AnimatePresence mode="wait">
        {expandedCard === null ? (
          features.map((feature) => (
            <motion.div
              key={feature.title}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AnimatedCard
                imageSrc={feature.image}
                title={feature.title}
                description={feature.description}
                content={feature.content}
                isExpanded={false}
                onToggle={() => handleCardToggle(feature.title)}
              />
            </motion.div>
          ))
        ) : (
          (() => {
            const feature = features.find(f => f.title === expandedCard);
            if (!feature) return null;
            return (
              <AnimatedCard
                key={feature.title}
                imageSrc={feature.image}
                title={feature.title}
                description={feature.description}
                content={feature.content}
                isExpanded={true}
                onToggle={handleClose}
              />
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
}