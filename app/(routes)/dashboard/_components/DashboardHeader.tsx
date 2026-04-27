"use client";

import { Search, Bell } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import ThemeToggler from "@/components/custom/ThemeToggler";
import NewTaskButton from "../../_components/NewTaskButton";

export default function DashboardHeader() {
  const userDetails = useUserStore((state) => state.userDetails);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
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

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Search Bar with Clay Styling */}
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="clay-input pl-12 pr-4 py-3 w-full md:w-64 text-foreground font-semibold outline-none"
            />
          </div>

          <ThemeToggler />

          {/* Notification Button */}
          <button className="clay-button p-3 h-12 w-12 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <NewTaskButton />
      </div>
    </header>
  );
}
