"use client";

import React, { useState, useEffect, useRef } from "react";

type EllipseConfig = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fillA: string;
  fillB: string;
  filter: string;
  cxRange: [number, number];
  cyRange: [number, number];
  glowRange: [number, number];
};

type EllipseState = {
  cx: number;
  cy: number;
  fill: string;
  glow: number;
  target: {
    cx: number;
    cy: number;
    fill: string;
    glow: number;
  };
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number) {
  // a, b: hex color strings, t: 0-1
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(lerp(ar, br, t));
  const rg = Math.round(lerp(ag, bg, t));
  const rb = Math.round(lerp(ab, bb, t));
  return `#${rr.toString(16).padStart(2, "0")}${rg
    .toString(16)
    .padStart(2, "0")}${rb.toString(16).padStart(2, "0")}`;
}

const ELLIPSE_CONFIGS: EllipseConfig[] = [
  {
    // Green ellipse
    cx: 1133.5,
    cy: 419,
    rx: 379.5,
    ry: 349,
    fillA: "#9AFF5B",
    fillB: "#B6FFB0",
    filter: "url(#filter0_f_163_1220)",
    cxRange: [1100, 1200],
    cyRange: [380, 460],
    glowRange: [0.2, 0.5],
  },
  {
    // Yellow ellipse 1
    cx: 761,
    cy: 746,
    rx: 287,
    ry: 276,
    fillA: "#FFEA00",
    fillB: "#FFF9A0",
    filter: "url(#filter1_f_163_1220)",
    cxRange: [700, 800],
    cyRange: [700, 800],
    glowRange: [0.2, 0.5],
  },
  {
    // Yellow ellipse 2
    cx: 617,
    cy: 448,
    rx: 287,
    ry: 276,
    fillA: "#FFEA00",
    fillB: "#FFF9A0",
    filter: "url(#filter2_f_163_1220)",
    cxRange: [570, 670],
    cyRange: [400, 500],
    glowRange: [0.2, 0.5],
  },
];

export default function AnimatedEllipses() {
  const [ellipses, setEllipses] = useState<EllipseState[]>(() =>
    ELLIPSE_CONFIGS.map((cfg) => ({
      cx: cfg.cx,
      cy: cfg.cy,
      fill: cfg.fillA,
      glow: 0.3,
      target: {
        cx: cfg.cx,
        cy: cfg.cy,
        fill: cfg.fillA,
        glow: 0.3,
      },
    }))
  );

  // For smooth animation, store last update time
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Every 3000ms, pick new random targets for each ellipse (slower, more at ease)
    const interval = setInterval(() => {
      setEllipses((prev: EllipseState[]) =>
        prev.map((e, i) => {
          const cfg = ELLIPSE_CONFIGS[i];
          return {
            ...e,
            target: {
              cx: randomBetween(cfg.cxRange[0], cfg.cxRange[1]),
              cy: randomBetween(cfg.cyRange[0], cfg.cyRange[1]),
              fill: Math.random() > 0.5 ? cfg.fillA : cfg.fillB,
              glow: randomBetween(cfg.glowRange[0], cfg.glowRange[1]),
            },
          };
        })
      );
      lastUpdateRef.current = Date.now();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate towards target every frame, but with a much slower interpolation speed
  useEffect(() => {
    let frame: number;
    function animate() {
      setEllipses((prev: EllipseState[]) =>
        prev.map((e) => {
          const t = 0.025; // much slower interpolation speed for a more at-ease feel
          return {
            ...e,
            cx: lerp(e.cx, e.target.cx, t),
            cy: lerp(e.cy, e.target.cy, t),
            fill: lerpColor(e.fill, e.target.fill, t),
            glow: lerp(e.glow, e.target.glow, t),
            target: e.target,
          };
        })
      );
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      width="1524"
      height="1200"
      viewBox="0 0 1524 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="filter0_f_163_1220"
          x="424.7"
          y="-259.3"
          width="1417.6"
          height="1356.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="164.65"
            result="effect1_foregroundBlur_163_1220"
          />
        </filter>
        <filter
          id="filter1_f_163_1220"
          x="144.7"
          y="140.7"
          width="1232.6"
          height="1210.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="164.65"
            result="effect1_foregroundBlur_163_1220"
          />
        </filter>
        <filter
          id="filter2_f_163_1220"
          x="0.700012"
          y="-157.3"
          width="1232.6"
          height="1210.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="164.65"
            result="effect1_foregroundBlur_163_1220"
          />
        </filter>
      </defs>
      {ellipses.map((e, i) => (
        <g
          key={i}
          opacity={e.glow}
          filter={ELLIPSE_CONFIGS[i].filter}
          style={{
            transition: "opacity 0.6s, filter 0.6s",
          }}
        >
          <ellipse
            cx={e.cx}
            cy={e.cy}
            rx={ELLIPSE_CONFIGS[i].rx}
            ry={ELLIPSE_CONFIGS[i].ry}
            fill={e.fill}
            style={{
              filter: `drop-shadow(0 0 ${40 + e.glow * 80}px ${e.fill})`,
              transition: "cx 0.6s, cy 0.6s, fill 0.6s, filter 0.6s",
            }}
          />
        </g>
      ))}
    </svg>
  );
}