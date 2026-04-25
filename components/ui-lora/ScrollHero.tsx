"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface ScrollHeroProps {
  // Content Props
  image?: string;
  word?: string;
  subtext?: string;
  labels?: string[];

  // Style Props
  accentColor?: string; // Overrides the CSS variable primary if provided
  clayMode?: boolean; // Toggle your globals.css clay utility
  height?: string; // Control the "scroll duration" (e.g., '300vh' vs '500vh')
  blurAmount?: string; // Custom blur for the background
}

export const ScrollHero = ({
  image = "https://images.unsplash.com/photo-1775126964224-99c03c0e439c?w=1200&auto=format&fit=crop&q=60",
  word = "UILORA",
  subtext = "The component library for premium interfaces",
  labels = ["Design", "Motion", "System"],
  accentColor,
  clayMode = true,
  height = "1000vh",
  blurAmount = "80px",
}: ScrollHeroProps) => {
  const { user } = useUser();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Use the passed accentColor prop, or fall back to your CSS variable
  const themeAccent = accentColor || "var(--primary)";

  // --- Scroll Transformations ---
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.75, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["48px", "0px"]);
  const imgFilter = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["saturate(0.5) brightness(0.3)", "saturate(1) brightness(0.5)"],
  );

  const letterSpacing = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7],
    ["1em", "0.25em", "-0.02em"],
  );
  const wordOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.8, 1],
    [0, 1, 1, 0.8],
  );
  const wordY = useTransform(scrollYProgress, [0, 0.7], [60, -20]);

  const subtextOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const subtextY = useTransform(scrollYProgress, [0.45, 0.65], [40, 0]);
  const bgGlowOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 0.6]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height, backgroundColor: "var(--background)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 1. Background Logic */}
        <motion.div
          style={{ scale, borderRadius }}
          className="absolute inset-0 z-0 overflow-hidden border border-border/20"
        >
          <motion.img
            src={image}
            alt="Hero Background"
            className="w-full h-full object-cover"
            style={{ filter: imgFilter }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80" />
        </motion.div>

        {/* 2. Dynamic Accent Glow */}
        <motion.div
          style={{ opacity: bgGlowOpacity }}
          className="absolute inset-0 pointer-events-none z-10"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${themeAccent} 0%, transparent 60%)`,
              filter: `blur(${blurAmount})`,
              opacity: 0.15,
            }}
          />
        </motion.div>

        {/* 3. Central Content */}
        <div className="relative z-20 flex flex-col items-center px-8 text-center">
          <motion.div style={{ y: wordY }}>
            <motion.h1
              style={{
                letterSpacing,
                opacity: wordOpacity,
                fontSize: "clamp(2.5rem, 15vw, 12rem)",
                // color: "var(--foreground)",
              }}
              className="font-sans uppercase font-black leading-none text-primary/80 dark:text-white"
            >
              {word}
            </motion.h1>
          </motion.div>

          <motion.div
            style={{ opacity: subtextOpacity, y: subtextY }}
            className={`mt-10 p-8 backdrop-blur-sm bg-background/40 w-auto border-white/5 ${clayMode ? "clay-card" : "rounded-3xl"}`}
          >
            <div
              className="h-px w-24 mx-auto mb-6"
              style={{ backgroundColor: themeAccent }}
            />

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed tracking-wide mb-6">
              {subtext}
            </p>

            <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
              {labels.map((label) => (
                <span
                  key={label}
                  className="text-[10px] font-mono tracking-[0.3em] uppercase"
                  style={{ color: themeAccent }}
                >
                  {label}
                </span>
              ))}
            </div>

            <Button
              className={cn(
                "cursor-pointer !rounded-md w-32 dark:text-white mt-4 !bg-primary",
                clayMode && "clay-button",
              )}
              asChild
            >
              <Link href={user ? "/learn-more" : "/sign-in"}>Learn More</Link>
            </Button>
          </motion.div>
        </div>

        {/* 4. Scroll Hint */}
        {/* <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-12 flex flex-col items-center gap-3 z-30"
        >
          <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-muted-foreground">
            Scroll
          </span>
          <div className="h-10 w-px" style={{ backgroundColor: themeAccent }} />
        </motion.div> */}
      </div>
    </div>
  );
};
