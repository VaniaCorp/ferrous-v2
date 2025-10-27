"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const navigation = [
  {
    title: "About",
    link: "#about-section",
  },
  {
    title: "Spell it out",
    link: "#spell",
  },
  {
    title: "Join the waitlist",
    link: "#waitlist",
  }
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLMenuElement>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100vw";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overflow = "";
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Animate nav open/close
  useEffect(() => {
    if (!navRef.current) return;
    if (isOpen) {
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          navRef.current!.style.display = "flex";
        }
      });
      if (menuRef.current) {
        gsap.fromTo(
          menuRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.1
          }
        );
      }
    } else {
      gsap.to(navRef.current, {
        y: "100%",
        opacity: 0,
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (navRef.current) navRef.current.style.display = "none";
        }
      });
    }
  }, [isOpen]);

  // Initial state: nav hidden
  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.transform = "translateY(100%)";
      navRef.current.style.opacity = "0";
      navRef.current.style.pointerEvents = "none";
      navRef.current.style.display = "none";
    }
  }, []);

  // Smooth scroll for anchor links
  const handleNavLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      const id = href.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350); // Wait for menu to close
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100]">
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-2 z-20">
        <h3 className="!text-4xl !font-maesiez">FERROUS</h3>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <Icon icon="uil:bars" width={28} height={28} />
        </button>
      </header>

      {/* Animated Fullscreen Nav Overlay */}
      <div
        ref={navRef}
        className="fixed top-0 left-0 w-full h-screen min-h-screen z-[200] flex flex-col items-center justify-center bg-black/70 backdrop-blur-2xl transition-all"
        style={{
          willChange: "transform, opacity",
        }}
        aria-modal={isOpen}
        role="dialog"
        tabIndex={-1}
      >
        <button
          className="absolute top-6 right-6 z-30 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
        >
          <Icon icon="uil:times" width={32} height={32} />
        </button>
        <menu
          ref={menuRef}
          className="flex flex-col items-center gap-8 mt-12"
        >
          {navigation.map((item) => (
            <li key={item.title} className="list-none">
              <Link
                href={item.link}
                onClick={e => handleNavLink(e, item.link)}
                className="text-3xl font-semibold text-white transition-colors duration-200 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 px-6 py-2 rounded"
                tabIndex={isOpen ? 0 : -1}
                aria-label={item.title}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </menu>
      </div>
    </div>
  );
}
