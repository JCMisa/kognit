import { getUserTaskByIdAction } from "@/lib/actions/task";
import { getSessionUserIdAction } from "@/lib/actions/auth";
import TaskForm from "../../_components/TaskForm";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react"; // Added use
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

// 1. Await params INSIDE the component that is wrapped by Suspense
async function EditTaskFormLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = await params;
  const userId = await getSessionUserIdAction();

  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getUserTaskByIdAction(taskId, userId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <TaskForm initialData={result.data} isEditing />;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  // DO NOT await params here.
  // Pass the promise directly to the loader.
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        <nav>
          <Link
            href="/tasks"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 text-sm font-bold"
          >
            <div className="clay-pill p-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ArrowLeftIcon className="size-4" />
            </div>
            <span>Back to Tasks</span>
          </Link>
        </nav>

        {/* Page Header */}
        <header className="text-center mb-5 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Edit Task
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Kognit will remember, understand, and help you stay on top of
            everything.
          </p>
        </header>

        {/* 3. The promise is resolved here, within the Suspense boundary */}
        <Suspense
          fallback={
            <div className="clay-card h-96 w-full max-w-2xl mx-auto animate-pulse bg-muted/20 flex items-center justify-center">
              <p className="text-sm font-bold text-muted-foreground">
                Loading Kognit Memory...
              </p>
            </div>
          }
        >
          <EditTaskFormLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
