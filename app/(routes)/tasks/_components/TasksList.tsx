import { TaskType } from "@/config/schema";
import { getAllUserTasksAction } from "@/lib/actions/task";
import { getCurrentUserAction } from "@/lib/actions/user";
import { redirect } from "next/navigation";

const TasksList = async () => {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/sign-in");
  }

  const tasksResult = await getAllUserTasksAction(user.id);

  if (!tasksResult.success) {
    return <div>{tasksResult.error}</div>;
  }

  return (
    <div>
      {/* Map over your tasks here */}
      {tasksResult.data?.map((task: TaskType) => (
        <div key={task.id}>{task.content}</div>
      ))}
    </div>
  );
};

export default TasksList;
