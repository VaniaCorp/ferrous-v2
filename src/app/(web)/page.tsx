"use client";
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import glowAnimation from "@/lottie/glow.json";
import HeroText from '@/ui/web/hero-text';
import Info from '@/ui/web/info';
const MiniGame = dynamic(() => import('@/ui/web/mini-game'), {
  ssr: false, loading: () => (
    <div className="relative w-full max-w-7xl h-screen max-h-[75em] mx-auto" aria-hidden />
  )
});
import { Icon } from '@iconify/react';
import Link from 'next/link';
import socials from '@/data/socials.json';
import Navbar from '@/layout/navbar';
const WaitlistDisplay = dynamic(() => import('@/ui/web/wailtist'), { ssr: false, loading: () => <div className="w-full min-h-[40rem]" aria-hidden /> });
const Features = dynamic(() => import('@/ui/web/features'), { ssr: false, loading: () => <section className="w-full min-h-[48rem]" aria-hidden /> });
const About = dynamic(() => import('@/ui/web/about'), { ssr: false, loading: () => <section className="w-full min-h-[56rem]" aria-hidden /> });
const Details = dynamic(() => import('@/ui/web/details'), { ssr: false, loading: () => <section className="w-full min-h-[40rem]" aria-hidden /> });
const Partner = dynamic(() => import('@/ui/web/partner'), { ssr: false, loading: () => <section className="w-full min-h-[36rem]" aria-hidden /> });
import InitialLoader from '@/layout/loader';
import useDeviceSize from '@/hooks/useDeviceSize';
import MobileMenu from '@/layout/mobile-menu';
import { FooterTrack } from '@/layout/mobile-footer';
import ModelBackground from '@/components/model-background';
import useEarthSequence from '@/hooks/useEarthSequence';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Home() {
  const [hideSocials, setHideSocials] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceSize();
  const [allowMotion, setAllowMotion] = useState(true);
  const visualState = useEarthSequence(isGameComplete, { z: -270 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAllowMotion(!media.matches);
  }, []);

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
            setHideSocials(entry.isIntersecting);
          });
        },
        {
          root: null,
          threshold: 0.01,
          rootMargin: "0px 0px -10% 0px",
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

  useEffect(() => {
    if (isLoaderComplete) {
      setIsPageVisible(true);
      // Re-enable scroll after loader completes
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isLoaderComplete]);

  const handleLoaderComplete = () => {
    setIsLoaderComplete(true);
  };

  if (!isLoaderComplete) {
    return <InitialLoader onComplete={handleLoaderComplete} pageRef={pageRef} />;
  }

  return (
    <div
      ref={pageRef}
      className="relative w-full h-full max-md:overflow-x-hidden"
    >
      {isMobile ? <MobileMenu /> : <Navbar />}

      <HeroText />

      <Info />

      <MiniGame onGameComplete={setIsGameComplete} />

      <Features />

      <About />

      <Details />

      <Partner />

      <nav
        className={`fixed top-1/2 -translate-y-1/2 right-[5%] hidden md:flex flex-col gap-4 transition-all duration-500 z-50 ${hideSocials
          ? "opacity-0 pointer-events-none translate-x-8"
          : "opacity-100 pointer-events-auto translate-x-0"
          }`}
        aria-label="Social media links"
      >
        {socials.map((social) => (
          <Link
            key={social.title}
            href={social.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-max border border-white/20 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
            aria-label={social.title}
          >
            <Icon
              icon={social.icon}
              width={18}
              height={18}
              aria-hidden="true"
              className="text-white"
            />
          </Link>
        ))}
      </nav>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ModelBackground {...visualState} />
      </div>

      <WaitlistDisplay />

      {isMobile ? <FooterTrack /> : null}



      {allowMotion && (
        <Lottie
          animationData={glowAnimation}
          loop
          width={0}
          height={0}
          className={`fixed w-[60em] h-[60em] max-md:hidden lg:w-max lg:h-max top-[50%] translate-y-[-50%] left-[-20%] xl:right-[-70%] inset-0 -z-10 pointer-events-none transition-opacity duration-700 ease-in-out ${
            visualState.positionMode === "center" ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  )
}
