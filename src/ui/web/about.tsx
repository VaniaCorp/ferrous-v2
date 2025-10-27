import { TextParagraphAnimation } from "@/animations/text-animation";
import useDeviceSize from "@/hooks/useDeviceSize";
import { motion } from "motion/react";
import React, { useRef, useEffect, useState } from "react";

const aboutParagraphs = [
  `At Ferrous, we believe access to wealth-building opportunities shouldn't be limited to a privileged few or those already deep inside the crypto world. Traditional financial systems in emerging markets restrict individuals from participating in high-value, globally recognized assets such as gold, bonds, or treasuries. On the other hand, existing blockchain products are typically designed with crypto-native users in mind, creating barriers for everyday people who primarily earn, spend, and save in their local currencies. Ferrous was built to break this barrier—bridging local money directly to global, tokenized opportunities.`,
  `Our platform enables users to acquire tokenized real-world assets like gold, bonds, and treasuries etc using their native currency. By removing the complexity of crypto wallets, exchanges, and multiple conversions, Ferrous makes it possible for non-crypto users to access blockchain-powered financial products without needing to be tech-savvy. Through strategic partnerships with providers, we simplify the on-ramp process, ensuring every transaction is compliant, transparent, and reliable. The result is a financial experience that feels familiar but delivers entirely new levels of access and control.`,
  `For institutions, Ferrous represents more than just a platform, it's an onramp to a new class of users. By partnering with us, providers gain access to a vast, underserved market of individuals ready to diversify their holdings but currently excluded from traditional systems. Through our model, providers can extend their reach while Ferrous handles the localization, and user experience. This opens opportunities to expand services into emerging high-growth regions without any challenges.`,
  // `This is how Ferrous bridges economies once blocked by infrastructure gaps, high fees, and bureaucracy. It's not just unlocking access to global investment markets—it's rewriting the rules so that underserved populations can finally participate, prosper, and preserve their wealth on their own terms.`
];

export default function About() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const upperRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // State for upper section
  const [upperInView, setUpperInView] = useState(false);

  // State for article section
  const [articleInView, setArticleInView] = useState(false);

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Split content into paragraphs
  const paragraphs = aboutParagraphs.filter(line => line.trim() !== '');
  const { isMobile } = useDeviceSize();

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(media.matches);
      const handler = () => setIsReducedMotion(media.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  // Intersection observer for upper section - scrolls in first
  useEffect(() => {
    if (!upperRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setUpperInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -20% 0px",
      }
    );

    observer.observe(upperRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection observer for article section - scrolls in after upper
  useEffect(() => {
    if (!articleRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setArticleInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(articleRef.current);
    return () => observer.disconnect();
  }, []);

  // No hover/auto-scroll UX. Natural scrolling only.

  return (
    <main
      className="relative w-full min-h-screen my-12 flex flex-col gap-12 items-center"
      aria-label="About Ferrous"
      id="about-section"
    >
      {/* Sticky header that animates in as section enters */}
      <motion.div
        ref={upperRef}
        className="sticky top-0 pt-20 lg:pt-48 pb-20 z-10 w-full flex flex-col items-center justify-center md:gap-4 font-light bg-black/30 backdrop-blur-sm md:backdrop-blur-md backdrop-saturate-150 border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: upperInView ? 1 : 0, y: upperInView ? 0 : 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-4xl px-4 md:px-8 text-center">
          {isMobile ? (
            <TextParagraphAnimation as={"h2"} className="!font-light text-lg md:text-xl lg:text-2xl leading-relaxed">
              Ferrous bridges emerging economies to the global money pool by connecting your local currency to a broad array of tokenized real world assets
            </TextParagraphAnimation>
          ) : (
            <TextParagraphAnimation as={"h2"} className="!font-light text-xl md:text-2xl lg:text-3xl leading-relaxed">
              Ferrous bridges emerging economies to the global money pool by connecting your local currency to a broad array of tokenized real world assets
            </TextParagraphAnimation>
          )}
        </div>
      </motion.div>

      {/* Body: fades in after header, scrolls naturally while header stays sticky */}
      <motion.article
        ref={articleRef}
        className="relative w-full max-w-4xl xl:max-w-6xl h-full overflow-hidden py-6 px-4 md:px-0"
        aria-label="About Ferrous details"
        role="region"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: articleInView ? 1 : 0, y: articleInView ? 0 : 20 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <div
          ref={scrollRef}
          className="prose prose-invert prose-base md:prose-2xl text-white/90 space-y-12 text-center w-full h-full"
          style={{
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          tabIndex={0}
          aria-label="About Ferrous article content"
        >
          {paragraphs.map((line, idx) => (
            <p key={idx} className="!text-md lg:!text-xl leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </motion.article>
    </main>
  );
}