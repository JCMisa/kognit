"use client";

import { Search, Bell } from "lucide-react";
import { ClayCard } from "@/components/ui-lora/Clay";
import { useUserStore } from "@/store/userStore";
import ThemeToggler from "@/components/custom/ThemeToggler";
import NewTaskButton from "../_components/NewTaskButton";

export default function DashboardPage() {
  const userDetails = useUserStore((state) => state.userDetails);

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* md:ml-32 ensures the content doesn't sit under the fixed sidebar */}
      <main className="flex-1 ">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Hello,{" "}
              <span className="text-primary">
                {userDetails?.firstName || "Tropa"}!
              </span>
            </h1>
            <p className="text-muted-foreground font-bold mt-1">
              Here&apos;s your daily scoop.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="clay-input pl-12 pr-4 py-3 w-full md:w-64 text-foreground font-semibold outline-none"
              />
            </div>
            <ThemeToggler />
            <button className="clay-button p-3 h-12 w-12 flex items-center justify-center cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <NewTaskButton />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ClayCard className="md:col-span-2 bg-gradient-to-br from-primary to-fuchsia-400 p-8 text-primary-foreground border-none">
            <h2 className="text-3xl font-black mb-2">Gemini is analyzing...</h2>
            <p className="font-bold opacity-90 max-w-sm">
              Kognit is processing your tasks to find the best schedule for your
              weekend.
            </p>
          </ClayCard>

          <ClayCard className="flex flex-col justify-center">
            <p className="text-muted-foreground text-sm font-bold">
              ACTIVE TASKS
            </p>
            <h3 className="text-4xl font-black">12</h3>
          </ClayCard>
        </div>
      </main>
    </div>
  );
}
