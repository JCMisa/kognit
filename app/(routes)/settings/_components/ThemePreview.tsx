"use client";

import { Bell, Search, User } from "lucide-react";

export function ThemePreview() {
  return (
    <div className="w-full bg-background border border-border/50 rounded-3xl p-6 shadow-xl transition-colors duration-300">
      {/* Mini Navbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">K</span>
          </div>
          <span className="font-semibold text-foreground">Kognit Preview</span>
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-8 clay-button flex items-center justify-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-8 w-16 clay-pill flex items-center justify-center text-[10px] font-bold text-foreground">
            TASK
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="clay-card p-4 space-y-3">
          <div className="h-2 w-12 bg-primary/40 rounded" />
          <div className="h-4 w-full bg-foreground/10 rounded" />
          <div className="h-4 w-2/3 bg-foreground/10 rounded" />
          <button className="hidden md:block w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all">
            Action Button
          </button>
          <button className="block md:hidden w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all">
            Action
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="clay-inset p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <User className="text-primary-foreground h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-16 bg-foreground/20 rounded" />
              <div className="h-2 w-10 bg-foreground/10 rounded" />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2 clay-button text-[10px] font-bold">
              Dismiss
            </button>
            <button className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
