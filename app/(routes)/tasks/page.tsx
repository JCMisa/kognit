import { Suspense } from "react";
import TasksList from "./_components/TasksList";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import NewTaskButton from "../_components/NewTaskButton";
import { getCurrentUserAction } from "@/lib/actions/user";
import { getAllUserTasksAction } from "@/lib/actions/task";
import { redirect } from "next/navigation";
import { TaskType } from "@/config/schema";

// Internal component to handle the async data fetch
async function TasksDataWrapper() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/sign-in");

  const tasksResult = await getAllUserTasksAction(user.id);

  // If the fetch fails, we handle it here or pass empty array
  const initialTasks = tasksResult.success ? tasksResult.data : [];

  return <TasksList initialTasks={initialTasks as TaskType[]} />;
}

const TasksPage = async () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Breadcrumb */}
        <nav className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 text-sm font-bold"
          >
            <div className="clay-pill p-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ArrowLeft className="size-4" />
            </div>
            <span>Back to Dashboard</span>
          </Link>
        </nav>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="clay-pill p-2 bg-primary/10">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Your <span className="text-primary">Tasks</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 pl-1">
              <Sparkles className="w-4 h-4 text-primary/60" />
              <p className="text-sm text-muted-foreground font-medium">
                Manage your daily scoop and let Kognit remember the details.
              </p>
            </div>
          </div>

          <NewTaskButton />
        </header>

        {/* Content Section */}
        <main className="relative z-10">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="clay-card h-48 animate-pulse bg-muted/20"
                  />
                ))}
              </div>
            }
          >
            <TasksDataWrapper />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
