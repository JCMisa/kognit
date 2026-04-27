import { redirect } from "next/navigation"; // Using your auth action
import Agent from "./_components/Agent";
import { getCurrentUserAction } from "@/lib/actions/user";
import { Suspense } from "react";

const AgentWrapper = async () => {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/sign-in");
  }

  return <Agent userId={user.id} userName={user.firstName} />;
};

const CallAssistant = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-xl w-full mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Kognit Voice Assistant
          </h1>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            Speak naturally to review your tasks, set priorities, or get AI
            insights.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center text-muted-foreground">
              Loading Kognit...
            </div>
          }
        >
          <AgentWrapper />
        </Suspense>
      </div>
    </main>
  );
};

export default CallAssistant;
