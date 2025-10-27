"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDeviceSize from "@/hooks/useDeviceSize";

type ExpandableCardProps = {
  title: string;
  content: string;
  truncatedContent?: string;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
};

export default function ExpandableCard({
  title,
  content,
  truncatedContent,
  expanded: expandedProp,
  onToggle,
  className = "",
}: ExpandableCardProps) {
  // If expandedProp is undefined, manage state internally
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = expandedProp !== undefined ? expandedProp : internalExpanded;
  const { isMobile } = useDeviceSize();

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!expanded);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.4, type: "spring" } }}
      className={`relative glass backdrop-blur-lg rounded-xl p-6 text-left shadow-lg text-white/90 flex flex-col gap-4 cursor-pointer 
        ${className}
        ${isMobile ? "w-[20em]" : expanded ? "w-[32em]" : "w-[24em]"}
      `}
      style={{
        background: "#71460040",
        color: "#fff",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)",
        height: expanded
          ? isMobile
            ? "auto"
            : "32em"
          : "20em",
        overflow: "hidden",
        transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-expanded={expanded}
      onClick={handleToggle}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-olive-transparent/50 inset-0 pointer-events-none"></div>
      <button
        className="w-full text-left focus:outline-none"
        onClick={handleToggle}
        aria-controls="expandable-card-content"
        aria-expanded={expanded}
        tabIndex={0}
      >
        <h3 className="font-bold mb-2">{title}</h3>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            id="expandable-card-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="text-sm leading-relaxed whitespace-pre-line mt-2">
              {content}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            id="expandable-card-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="text-sm leading-relaxed whitespace-pre-line mt-2">
              {truncatedContent || content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-start mt-auto cursor-pointer" onClick={handleToggle}>
        <button
          onClick={handleToggle}
          className="flex items-center gap-1 px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label={expanded ? "Show less" : "Show more"}
        >
          <span
            className={`block w-2 h-2 rounded-full transition-colors ${expanded ? "bg-white/80" : "bg-white/40"
              }`}
          />
          <span
            className={`block w-2 h-2 rounded-full transition-colors ${expanded ? "bg-white/80" : "bg-white/40"
              }`}
          />
          <span
            className={`block w-2 h-2 rounded-full transition-all ${expanded
                ? "bg-white/80"
                : "bg-white/40"
              }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
