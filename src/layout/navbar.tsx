"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const navigation = [
  {
    title: "About",
    link: "#about-section",
  },
  {
    title: "Join the waitlist",
    link: "#waitlist",
  }
];

// Smooth scroll to a section by id (with fallback)
function smoothScrollToId(id: string) {
  if (typeof document === "undefined") return;
  
  const el = document.getElementById(id);
  if (el) {
    // Try native smooth scroll
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Optionally, you can adjust for fixed nav height if needed
    // setTimeout(() => window.scrollBy({ top: -80, behavior: "smooth" }), 400);
  }
}

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle expand/collapse for both mouse and keyboard
  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);

  // Keyboard accessibility for button
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsExpanded(true);
    }
    if (e.key === "Escape" || e.key === "ArrowUp") {
      setIsExpanded(false);
      buttonRef.current?.focus();
    }
  };

  // Handle smooth scroll for nav links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      smoothScrollToId(id);
    }
  };

  // Handle smooth scroll for Get early access button
  const handleEarlyAccessClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault?.();
    setIsExpanded(false);
    smoothScrollToId("waitlist");
  };

  return (
    <div
      className="fixed top-9 left-[50%] translate-x-[-50%] w-full max-w-6xl max-xl:px-12 mx-auto flex items-center justify-between z-50"
      role="banner"
      aria-label="Site Navigation"
    >
      <span className="font-maesiez text-5xl" aria-label="Ferrous logo" tabIndex={-1}>
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
              tabIndex={0}
              aria-label={item.title}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 rounded"
              onClick={e => handleNavClick(e, item.link)}
            >
              {item.title}
            </Link>
            {idx < navigation.length - 1 && (
              <span
                className="mx-2"
                aria-hidden="true"
              >
                |
              </span>
            )}
          </span>
        ))}
      </nav>
      <div>
        <button
          ref={buttonRef}
          className={
            `flex items-center gap-2 border border-white p-2 transition-all duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 rounded-xl overflow-hidden
            ${isExpanded ? "w-44" : "w-10"}`
          }
          aria-expanded={isExpanded}
          aria-controls="early-access-panel"
          aria-haspopup="true"
          aria-label={isExpanded ? "Get early access panel expanded" : "Expand get early access panel"}
          onMouseEnter={handleExpand}
          onMouseLeave={handleCollapse}
          onFocus={handleExpand}
          onBlur={handleCollapse}
          onKeyDown={e => {
            handleKeyDown(e);
            // If user presses Enter/Space while expanded, scroll to waitlist
            if (
              (e.key === "Enter" || e.key === " ") &&
              isExpanded
            ) {
              handleEarlyAccessClick(e);
            }
          }}
          onClick={handleEarlyAccessClick}
          tabIndex={0}
          type="button"
        >
          {isExpanded ? (
            <>
              <Icon icon="emojione:star" width={24} height={24} aria-hidden="true" />
              <span id="early-access-panel" className="whitespace-nowrap">Get early access</span>
            </>
          ) : (
            <Icon icon="mdi-light:arrow-down" width={24} height={24} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
