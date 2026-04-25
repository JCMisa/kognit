"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskType } from "@/config/schema";
import { ClayCard } from "@/components/ui-lora/Clay";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle,
  GripVertical,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { updateTaskStatusAction } from "@/lib/actions/task";
import { toast } from "sonner";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function TaskCard({ task }: { task: TaskType }) {
  // dnd-kit logic
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const priorityStyles = {
    low: "text-emerald-500 bg-emerald-500/10",
    medium: "text-amber-500 bg-amber-500/10",
    high: "text-red-500 bg-red-500/10",
  };

  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  const handleCompleteTask = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const res = await updateTaskStatusAction(
      task.id,
      !isCompleted,
      task.content,
    );

    if (!res.success) {
      toast.error("Failed to update task status. Please try again.");
    }

    setIsCompleted(!isCompleted);
    toast.success("Task status updated!");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("h-full", isDragging && "opacity-50")}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <ClayCard className="group relative flex flex-col gap-4 h-full overflow-hidden border-border/40 hover:border-primary/20 transition-colors">
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
              <span
                className={cn(
                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-full clay-pill",
                  priorityStyles[task.priority],
                )}
              >
                {task.priority}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 text-xs tracking-wider "
                  >
                    <Link href={`/tasks/${task.id}`}>
                      <EyeIcon className="w-3 h-3" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex items-center gap-2 text-xs tracking-wider"
                  >
                    <Link href={`/tasks/${task.id}/edit`}>
                      <PencilIcon className="w-3 h-3" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 text-xs tracking-wider">
                    <Trash2Icon className="w-3 h-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task Image Preview */}
          {task.imageUrl && (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden clay-inset">
              <Image
                src={task.imageUrl}
                alt={`Attachment for ${task.content}`}
                width={400}
                height={160}
                className="w-full h-full object-cover pointer-events-none"
                priority={false}
              />
            </div>
          )}

          {/* Content Section */}
          <div
            className="flex-1 space-y-2 cursor-pointer"
            onClick={handleCompleteTask}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/30" />
                )}
              </div>
              <div>
                <h3
                  className={cn(
                    "font-bold text-base tracking-tight transition-colors",
                    isCompleted
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {task.content}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {task.description || "No additional context."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {task.dueDate
                  ? format(new Date(task.dueDate), "MMM d")
                  : "No date"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40 font-black uppercase">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(task.createdAt), "HH:mm")}</span>
            </div>
          </div>
        </ClayCard>
      </motion.div>
    </div>
  );
}
