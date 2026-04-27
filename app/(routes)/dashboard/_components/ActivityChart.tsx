import { ClayCard } from "@/components/ui-lora/Clay";
import { getTaskActivityStatsAction } from "@/lib/actions/task";
import ChartClientWrapper from "./ChartClientWrapper";

export default async function ActivityChart({ userId }: { userId: string }) {
  // Fetch initial weekly data from your server action
  const result = await getTaskActivityStatsAction(userId);
  const initialData = result.success ? result.data : [];

  return (
    <ClayCard className="p-6 space-y-6">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xl font-black italic">Activity Overview</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Task volume analytics
          </p>
        </div>

        {/* Pass initial data to the interactive client wrapper */}
        <ChartClientWrapper initialData={initialData} />
      </div>

      {/* The actual chart rendering happens inside the wrapper for reactivity */}
    </ClayCard>
  );
}
