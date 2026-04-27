import { getAllUserTasksAction } from "@/lib/actions/task";
import { ClayCard } from "@/components/ui-lora/Clay";
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export default async function StatCardsGrid({ userId }: { userId: string }) {
  const result = await getAllUserTasksAction(userId);
  const tasks = result.success ? result.data : [];

  const stats = [
    {
      title: "Active Tasks",
      value: tasks?.filter((t) => !t.isCompleted).length,
      icon: <Clock className="text-primary" />,
    },
    {
      title: "Completed",
      value: tasks?.filter((t) => t.isCompleted).length,
      icon: <CheckCircle2 className="text-emerald-500" />,
    },
    {
      title: "High Priority",
      value: tasks?.filter((t) => t.priority === "high").length,
      icon: <AlertCircle className="text-red-500" />,
    },
    {
      title: "Sync Score",
      value: "98%",
      icon: <TrendingUp className="text-fuchsia-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <ClayCard
          key={i}
          className="p-6 flex items-center justify-between hover:scale-[1.02] transition-transform"
        >
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
              {stat.title}
            </p>
            <h3 className="text-3xl font-black tracking-tighter">
              {stat.value}
            </h3>
          </div>
          <div className="clay-pill p-3 h-12 w-12 flex items-center justify-center">
            {stat.icon}
          </div>
        </ClayCard>
      ))}
    </div>
  );
}
