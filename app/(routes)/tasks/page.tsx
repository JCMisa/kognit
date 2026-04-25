import { Suspense } from "react";
import TasksList from "./_components/TasksList";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

const TasksPage = async () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <Link
        href="/dashboard"
        className="w-full mb-4 cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ease-linear text-sm justify-start"
      >
        <ArrowLeftIcon className="size-4" />
        Go to dashboard
      </Link>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Your Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s a list of all the tasks you&apos;ve created.
          </p>
        </div>

        <Link
          href={"/tasks/create"}
          className="!bg-primary cursor-pointer !text-primary-foreground px-6 py-3 !rounded-2xl font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg clay-button"
        >
          <PlusIcon className="w-5 h-5 stroke-[3px]" />
          <span className="hidden sm:inline">New Task</span>
        </Link>
      </div>

      <Suspense fallback={<p>Loading tasks...</p>}>
        <TasksList />
      </Suspense>
    </div>
  );
};

export default TasksPage;
