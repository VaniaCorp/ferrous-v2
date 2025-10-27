"use client";
import Image from "next/image";
import { TextStaggerUpAnimation } from "@/animations/text-animation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import socials from "@/data/socials.json";
import { useLenis } from "lenis/react";
import { useActionState, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useDeviceSize from "@/hooks/useDeviceSize";
import MobileFooter from "@/layout/mobile-footer";
import { joinWaitlistAction } from "@/lib/actions/join-waitlist";
import { toast } from "sonner";

export default function WaitlistDisplay() {
  const lenis = useLenis();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { isMobile } = useDeviceSize();
  const [state, formAction] = useActionState(joinWaitlistAction, { success: true as boolean, message: undefined as string | undefined });
  const [submitted, setSubmitted] = useState(false);

  const navigation = [
    {
      title: "About",
      link: "#about-section",
    },
    {
      title: "Spell it out",
      link: "#spell",
    }
  ];

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    if (!lenis || typeof window === "undefined") return;

    const handleScroll = (e: { scroll: number }) => {
      // Show button when scrolled down more than 100vh
      const shouldShow = e.scroll > window.innerHeight;
      setShowScrollButton(shouldShow);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  // Smooth scroll to top function
  const scrollToTop = useCallback(() => {
    if (!lenis) return;

    setIsScrolling(true);

    lenis.scrollTo(0, {
      duration: 2, // 2 seconds for smooth, luxurious feel
      easing: (t: number) => {
        // Custom easing for extra smooth feel
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      onComplete: () => {
        setIsScrolling(false);
        // Reset the showScrollButton state after scrolling completes
        setShowScrollButton(false);
      }
    });
  }, [lenis]);

  // Handle navigation links with smooth scrolling
  const handleNavigationClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (!lenis || typeof document === "undefined") return;

    // Remove the # from href to get the element ID
    const elementId = href.replace('#', '');
    const targetElement = document.getElementById(elementId);

    if (targetElement) {
      setIsScrolling(true);

      lenis.scrollTo(targetElement, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: -80, // Account for any fixed headers
        onComplete: () => {
          setIsScrolling(false);
        }
      });
    }
  }, [lenis]);

  useEffect(() => {
    if (!submitted) return;
    if (state.success === false) {
      toast.error(state.message || "Please try to register again");
    } else if (state.success === true) {
      toast.success(state.message || "You're on the waitlist");
    }
  }, [submitted, state.success, state.message]);

  return (
    <div
      id="waitlist"
      className="relative w-full h-full lg:h-screen lg:max-h-[75em] mx-auto flex flex-col"
    >
      <section className="absolute top-[13%] left-[50%] translate-x-[-50%] w-max h-max mx-auto flex flex-col gap-4">
        <span className="text-2xl">Join Our</span>
        <div className="-mt-8">
          <TextStaggerUpAnimation
            as="h1"
            aria-label="Waitlist"
            aria-labelledby="waitlist"
            className="lg:!text-[12em] md:!text-[8em] !text-[4em]"
          >
            WAITLIST
          </TextStaggerUpAnimation>
        </div>
      </section>

      <div className="relative z-10 mx-auto mt-auto">
        <Image
          src={isMobile ? "/images/hgiku-mobile.svg" : "/images/hgiku.svg"}
          alt="Waitlist"
          width={isMobile ? 0 : 0}
          height={0}
          fetchPriority="high"
          loading="eager"
          className={`${isMobile ? "w-full" : "h-full w-full object-cover"}`}
        />

        <form
          action={formAction}
          onSubmit={() => setSubmitted(true)}
          className={`absolute bottom-12 left-[50%] translate-x-[-50%] w-full max-w-xs md:max-w-sm lg:max-w-xl p-1 md:p-2 bg-white rounded-xl md:rounded-2xl focus-within:outline-none focus-within:ring-1 focus-within:ring-orange-500 flex items-center gap-2 overflow-hidden ${isMobile ? "bottom-4" : "bottom-12"}`}
        >
          <input
            type="email"
            name="email"
            id="waitlist-email"
            required
            placeholder="Enter your email"
            className="absolute top-0 left-0 w-full h-full p-2 md:p-4 text-base text-black rounded-xl md:rounded-2xl no-smooth-scroll"
            aria-label="Email address for waitlist"
          />
          <button
            type="submit"
            disabled={false}
            className="relative z-10 bg-black rounded-lg flex items-center justify-center ml-auto md:w-12 md:h-12 w-10 h-10 transition-all duration-200 hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Submit email to join waitlist"
          >
            <Icon icon="codex:check" width={24} height={24} color="white" />
          </button>
        </form>
      </div>

      {isMobile ?
        <MobileFooter />
        : (
          <footer className="relative w-full h-max glass hidden lg:flex rounded-none">
            <div className="w-full h-full mx-auto bg-black/65 backdrop-blur-sm">
              <div className="w-full h-full max-w-7xl mx-auto py-8 px-8 xl:px-4 xl:py-20 flex items-center justify-between">
                <aside className="flex items-center gap-4">
                  <span
                    className="font-maesiez text-4xl cursor-pointer transition-colors duration-200 hover:text-orange-300"
                    aria-label="Ferrous logo"
                    tabIndex={0}
                    onClick={scrollToTop}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToTop();
                      }
                    }}
                  >
                    FERROUS
                  </span>

                  <nav
                    className="flex items-center gap-2"
                    aria-label="Main navigation"
                    role="navigation"
                  >
                    {navigation.map((item, idx) => (
                      <span key={item.title} className="flex items-center">
                        <Link
                          href={item.link}
                          onClick={(e) => handleNavigationClick(e, item.link)}
                          tabIndex={0}
                          aria-label={item.title}
                          className="transition-colors duration-200 hover:text-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-2 py-1"
                        >
                          {item.title}
                        </Link>
                        {idx < navigation.length - 1 && (
                          <span
                            className="mx-2 text-white/40"
                            aria-hidden="true"
                          >
                            |
                          </span>
                        )}
                      </span>
                    ))}
                  </nav>
                </aside>

                <div>
                  <span className="text-base text-white/70">
                    copyright {new Date().getFullYear()} &copy; Ferrous
                  </span>
                </div>

                <aside className="flex items-center gap-2">
                  {socials.map((social) => (
                    <Link
                      key={social.title}
                      href={social.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-max border border-white/20 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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

                  <AnimatePresence>
                    {showScrollButton && (
                      <motion.button
                        type="button"
                        onClick={scrollToTop}
                        disabled={isScrolling}
                        className={`relative w-max border backdrop-blur-sm rounded-3xl p-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 overflow-hidden ${isScrolling
                          ? 'border-orange-400 bg-orange-400/20 cursor-wait'
                          : 'border-white hover:scale-110 hover:border-white/40 hover:bg-white/10 cursor-pointer'
                          }`}
                        aria-label={isScrolling ? "Scrolling to top..." : "Scroll to top of page"}
                        whileHover={!isScrolling ? { scale: 1.05 } : {}}
                        whileTap={!isScrolling ? { scale: 0.95 } : {}}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Animated background for scrolling state */}
                        <AnimatePresence>
                          {isScrolling && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-orange-300/30"
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: 1,
                              }}
                            />
                          )}
                        </AnimatePresence>

                        <motion.div
                          animate={isScrolling ? {
                            rotateZ: 360,
                          } : {}}
                          transition={isScrolling ? {
                            duration: 2,
                            ease: "easeInOut",
                          } : {}}
                        >
                          <Icon
                            icon="mdi:arrow-up"
                            width={38}
                            height={38}
                            className={`transition-colors duration-300 ${isScrolling ? 'text-orange-300' : 'text-white'
                              }`}
                          />
                        </motion.div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </aside>
              </div>
            </div>
          </footer>
        )}
    </div>
  );
}