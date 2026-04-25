import React, { Suspense } from "react";
import ChatBot from "./_components/ChatBot";
import { Sidebar } from "./dashboard/_components/Sidebar";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <section className="ml-0 md:ml-24 lg:ml-28 xl:ml-32 2xl:ml-36 mb-24 md:mb-0">
        {children}
      </section>

      <Suspense fallback={null}>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
          <ChatBot />
        </div>
      </Suspense>
    </main>
  );
};

export default RoutesLayout;
