import { Suspense } from "react";
import TasksList from "./_components/TasksList";

const TasksPage = async () => {
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>

      <Suspense fallback={<p>Loading tasks...</p>}>
        <TasksList />
      </Suspense>
    </div>
  );
};

export default TasksPage;
