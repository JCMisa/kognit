import Link from "next/link";
import TaskForm from "./_components/TaskForm";
import { ArrowLeftIcon } from "lucide-react";

const CreateTasksPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
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

        <Link
          href="/tasks"
          className="w-full max-w-2xl mx-auto mb-2 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ease-linear"
        >
          <ArrowLeftIcon className="size-4" />
          <div className="text-sm font-medium hover:opacity-80 transition-opacity duration-200 ease-linear">
            Back to Tasks
          </div>
        </Link>

        {/* Task Form */}
        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTasksPage;
