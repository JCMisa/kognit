/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ClayProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function ClayCard({ children, className, ...props }: ClayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("clay-card p-6 relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ClayButton({
  children,
  variant = "primary",
  className,
  ...props
}: any) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-lg hover:brightness-110",
    white: "clay-button text-foreground",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-6 py-3 rounded-2xl font-bold tracking-wide transition-all active:shadow-inner",
        variant === "primary" ? variants.primary : variants.white,
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function ClayIconBtn({ icon: Icon, active, className, ...props }: any) {
  return (
    <button
      className={cn(
        "clay-button h-12 w-12 flex items-center justify-center transition-colors",
        active
          ? "active text-primary"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <Icon className="w-5 h-5 stroke-[2.5px]" />
    </button>
  );
}
