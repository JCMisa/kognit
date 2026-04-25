import React, { Suspense } from "react";
import ChatBot from "./_components/ChatBot";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen">
      {children}
      <Suspense fallback={null}>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
          <ChatBot />
        </div>
      </Suspense>
    </main>
  );
};

export default RoutesLayout;
