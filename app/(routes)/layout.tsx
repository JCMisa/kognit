import React, { Suspense } from "react";
import ChatBot from "./_components/ChatBot";
import { Sidebar } from "./_components/Sidebar";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <section className="ml-0 md:ml-26 lg:ml-28 xl:ml-32 2xl:ml-36 mb-24 md:mb-0">
        {children}
      </section>

      <Suspense fallback={null}>
        <div className="fixed bottom-20 right-8 md:bottom-4 md:right-4 z-[100]">
          <ChatBot />
        </div>
      </Suspense>
    </main>
  );
};

export default RoutesLayout;
