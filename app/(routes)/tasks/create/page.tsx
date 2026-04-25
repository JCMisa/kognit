import Link from "next/link";
import TaskForm from "./_components/TaskForm";
import { ArrowLeftIcon } from "lucide-react";
import { Suspense } from "react";

const CreateTasksPage = async () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        <Link
          href="/tasks"
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 text-sm font-bold"
        >
          <div className="clay-pill p-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeftIcon className="size-4" />
          </div>
          <span>Back to Tasks</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-5 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Create a new task
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Kognit will remember, understand, and help you stay on top of
            everything.
          </p>
        </div>

        {/* Task Form */}
        <Suspense fallback={<p>Loading form...</p>}>
          <TaskForm />
        </Suspense>
      </div>
    </div>
  );
};

export default CreateTasksPage;
