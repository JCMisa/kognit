"use client";

import {
  LayoutGrid,
  MessageCircle,
  Settings,
  LogOut,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import this

const navItems = [
  { id: "Home", icon: LayoutGrid, path: "/dashboard" },
  { id: "Tasks", icon: ListTodo, path: "/tasks" },
  { id: "Call", icon: MessageCircle, path: "/call" },
  { id: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const { signOut } = useClerk();
  const pathname = usePathname(); // Get current route

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out successfully!");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col items-center gap-6 w-20 py-8 clay-card fixed left-8 top-1/2 -translate-y-1/2 z-50 h-[95vh]">
        <Image
          src="/logo.svg"
          alt="Kognit Logo"
          width={40}
          height={40}
          className="mb-4"
        />

        <nav className="flex flex-col gap-4 w-full items-center">
          {navItems.map((item) => (
            <Link
              href={item.path}
              key={item.id}
              className={cn(
                "clay-button h-12 w-12 flex items-center justify-center transition-colors",
                pathname === item.path
                  ? "active text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="w-5 h-5 stroke-[2.5px]" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-6 items-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10",
                userButtonTrigger: "w-10 h-10",
              },
            }}
          />

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
          <Link // Changed from button to Link for mobile too
            key={item.id}
            href={item.path}
            className={cn(
              "h-12 w-12 flex items-center justify-center",
              pathname === item.path ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </>
  );
}
