import { Suspense } from "react";
import { getSessionUserIdAction } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import StatCardsGrid from "./_components/StatCardsGrid";
import ActivityChart from "./_components/ActivityChart";
import DashboardHeader from "./_components/DashboardHeader";
import StatCardsSkeleton from "./_components/StatCardsSkeleton";
import ChartSkeleton from "./_components/ChartSkeleton";

const DashboardContentWrapper = async () => {
  const userId = await getSessionUserIdAction();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="max-w-7xl mx-auto space-y-8">
      <DashboardHeader />

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCardsGrid userId={userId} />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <ActivityChart userId={userId} />
      </Suspense>
    </main>
  );
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Wrap the auth-dependent content in Suspense to prevent the "Blocking Route" error */}
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            Loading Kognit...
          </div>
        }
      >
        <DashboardContentWrapper />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
