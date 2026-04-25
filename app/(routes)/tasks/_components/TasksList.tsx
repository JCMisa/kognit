import { ClayCard } from "@/components/ui-lora/Clay";
import { TaskType } from "@/config/schema";
import { getAllUserTasksAction } from "@/lib/actions/task";
import { getCurrentUserAction } from "@/lib/actions/user";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

const TasksList = async () => {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/sign-in");
  }

  const tasksResult = await getAllUserTasksAction(user.id);

  if (!tasksResult.success || !tasksResult.data) {
    return <div>{tasksResult.error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
      {tasksResult.data.map((task: TaskType) => (
        <ClayCard
          key={task.id}
          className="hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-foreground">
              {task.content}
            </h3>
            <span
              className={cn(
                "text-[10px] font-black uppercase px-2 py-1 rounded-lg clay-pill",
                task.priority === "high"
                  ? "text-red-500"
                  : task.priority === "medium"
                    ? "text-amber-500"
                    : "text-emerald-500",
              )}
            >
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description || "No additional context."}
          </p>
        </ClayCard>
      ))}
    </div>
  );
};

export default TasksList;
