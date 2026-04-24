"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, useWatch } from "react-hook-form"; // Added useWatch
import { Calendar, Sparkles, Plus, ChevronDown, AlignLeft } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { ClayButton, ClayCard } from "@/components/ui-lora/Clay";
import PrioritySelector from "./PrioritySelector";
import { PriorityType } from "@/config/schema";
import { toast } from "sonner";
import { cn, showConfetti } from "@/lib/utils";
import { createTaskAction } from "@/lib/actions/task";
import { useRouter } from "next/navigation";

export interface TaskFormValues {
  content: string;
  description: string;
  priority: PriorityType;
  dueDate: Date | null;
}

export default function TaskForm() {
  const router = useRouter();

  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      content: "",
      description: "",
      priority: "medium",
      dueDate: null,
    },
  });

  const dueDateValue = useWatch({
    control,
    name: "dueDate",
  });

  const handleFormSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      const finalData = {
        ...values,
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
      };

      const result = await createTaskAction(finalData);

      if (result.success) {
        console.log("Task created successfully: ", result.data);
        toast.success("Task created successfully!");
        showConfetti();
        reset();
        router.push("/tasks");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log("Error creating task: ", error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClayCard className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="clay-pill h-10 w-10 flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            New Task
          </h2>
          <p className="text-xs text-muted-foreground">
            AI will remember and understand your task
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="ml-auto"
        >
          <Sparkles className="w-5 h-5 text-primary/60" />
        </motion.div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Task Content Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            What do you need to do?
          </label>
          <div className="clay-input px-5 py-4">
            <input
              {...register("content", { required: "Task content is required" })}
              placeholder="e.g. Review the Q4 report and prepare summary..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none"
              autoComplete="off"
            />
          </div>
          <AnimatePresence>
            {errors.content && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-destructive pl-1 font-medium"
              >
                {errors.content.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Description Toggle & Field */}
        <div>
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors pl-1"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Add description</span>
            <motion.div
              animate={{ rotate: showDescription ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="clay-input px-5 py-4 mt-3">
                  <textarea
                    {...register("description")}
                    placeholder="Add more context for the AI to understand better..."
                    rows={3}
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Priority & Due Date Row */}
        <div className="space-y-5 sm:space-y-0 sm:flex sm:items-end sm:gap-6">
          <div className="space-y-2 flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <PrioritySelector
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Due date
            </label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        `clay-pill flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors`,
                        dueDateValue && "border border-primary",
                        field.value
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>
                        {field.value
                          ? format(new Date(field.value), "MMM d, yyyy")
                          : "Pick a date"}
                      </span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    className={cn("w-auto p-0 rounded-2xl border-0 shadow-2xl")}
                    align="start"
                  >
                    <CalendarPicker
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date(2020, 0)}
                      endMonth={new Date(2040, 0)}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : null)
                      }
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        {/* AI Context Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="clay-inset px-4 py-3 flex items-start gap-3"
        >
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground/70">Kognit AI</span>{" "}
            will analyze your task and help you find related context.
          </p>
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <ClayButton
            type="submit"
            variant="primary"
            className="relative overflow-hidden min-w-[160px]"
            disabled={isSubmitting}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  <span>Creating...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </motion.div>
              )}
            </AnimatePresence>
          </ClayButton>
        </div>
      </form>
    </ClayCard>
  );
}
