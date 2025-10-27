"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import socials from "@/data/socials.json";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useState } from "react";

export default function MobileFooter() {
  return (
    <footer className="relative w-full h-max flex items-center justify-between px-4 py-12">
      <h3 className="!font-maesiez !text-4xl">FERROUS</h3>
      <aside className="flex items-center gap-2">
        {socials.map((social) => (
          <Link key={social.title} href={social.link} target="_blank" rel="noopener noreferrer" className="w-max border border-white/20 backdrop-blur-sm rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus:ring-orange-500">
            <Icon icon={social.icon} width={24} height={24} />
          </Link>
        ))}
      </aside>
    </footer>
  )
}

export function FooterTrack() {
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(true);

  // Hide footer track when waitlist section is visible
  useEffect(() => {
    if (typeof document === "undefined") return;

    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const waitlistEl = document.getElementById("waitlist");
      if (!waitlistEl) {
        // Retry after a short delay if element not found (handles dynamic loading)
        timeoutId = setTimeout(setupObserver, 100);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Hide footer track when waitlist is intersecting
            setIsVisible(!entry.isIntersecting);
          });
        },
        {
          root: null,
          threshold: 0.1, // Trigger when 10% of waitlist is visible
          rootMargin: "0px 0px -20% 0px", // Hide slightly before fully visible
        }
      );

      observer.observe(waitlistEl);
    };

    setupObserver();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, []);

  // Smooth scroll to waitlist section
  const handleWaitlistClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!lenis || typeof document === "undefined") return;

    const waitlistElement = document.getElementById("waitlist");
    if (waitlistElement) {
      lenis.scrollTo(waitlistElement, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: -20, // Small offset to account for any spacing
      });
    }
  }, [lenis]);

  if (!isVisible) return null;

  return (
    <div className="glass !border-none fixed bottom-0 left-1/2 -translate-x-1/2 w-full xs:max-w-xs sm:max-w-sm h-max backdrop-blur-lg rounded-3xl px-2 py-5 flex items-center justify-between transition-all duration-500 z-50">
      <Link 
        href="#waitlist"
        onClick={handleWaitlistClick}
        className="transition-colors duration-200 hover:text-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-2 py-1"
      >
        Join the waitlist
      </Link>

      <hr className="h-8 border border-white" />

      <aside className="flex items-center gap-2">
        {socials.map((social) => (
          <Link key={social.title} href={social.link} target="_blank" rel="noopener noreferrer" className="w-max border border-white/20 backdrop-blur-sm rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus:ring-orange-500">
            <Icon icon={social.icon} width={24} height={24} />
          </Link>
        ))}
      </aside>
    </div>
  )
}
