"use client";

import {
  LayoutGrid,
  PieChart,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

const navItems = [
  { id: "Home", icon: LayoutGrid },
  { id: "Stats", icon: PieChart },
  { id: "Chat", icon: MessageCircle },
  { id: "Settings", icon: Settings },
];

export function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out successfully!");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col items-center gap-6 w-auto py-8 clay-card h-[calc(100vh-64px)] fixed left-8 z-50">
        <Image
          src="/logo.svg"
          alt="Kognit Logo"
          width={40}
          height={40}
          className="mb-4"
        />

        <nav className="flex flex-col gap-4 w-full px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "clay-button h-12 w-12 flex items-center justify-center transition-colors",
                activeTab === item.id
                  ? "active text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="w-5 h-5 stroke-[2.5px]" />
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={handleSignOut}
            className="clay-button h-10 w-10 flex items-center justify-center text-destructive cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-20 clay-card z-50 flex items-center justify-around px-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "h-12 w-12 flex items-center justify-center",
              activeTab === item.id ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </nav>
    </>
  );
}
