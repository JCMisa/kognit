"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Calendar,
  Plus,
  ChevronDown,
  AlignLeft,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";
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
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export interface TaskFormValues {
  content: string;
  description: string;
  priority: PriorityType;
  dueDate: Date | null;
  imageUrl?: string | null;
}

export default function TaskForm() {
  const router = useRouter();
  const {
    uploadImage,
    isUploading,
    progress,
    reset: resetUpload,
  } = useCloudinaryUpload();

  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      content: "",
      description: "",
      priority: "medium",
      dueDate: null,
      imageUrl: null,
    },
  });

  const dueDateValue = useWatch({ control, name: "dueDate" });
  // const imageUrlValue = useWatch({ control, name: "imageUrl" });

  const onFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    try {
      const result = await uploadImage(file);
      setPreviewUrl(result.secure_url);
      setValue("imageUrl", result.secure_url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.log("Image upload error:", err);
      toast.error("Failed to upload image");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setValue("imageUrl", null);
    resetUpload();
  };

  const handleFormSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createTaskAction(values);
      if (result.success) {
        toast.success("Task created successfully!");
        showConfetti();
        reset();
        setPreviewUrl(null);
        router.push("/tasks");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log("Error creating task:", error);
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
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Task Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            What do you need to do?
          </label>
          <div className="clay-input px-5 py-4">
            <input
              {...register("content", { required: "Task content is required" })}
              placeholder="e.g. Review the Q4 report..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Description Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground pl-1"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Add description</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform",
                showDescription && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="clay-input px-5 py-4 mt-3">
                  <textarea
                    {...register("description")}
                    placeholder="Add context for AI..."
                    rows={3}
                    className="w-full bg-transparent text-sm focus:outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
            Attachment
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "relative h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 bg-muted/30",
              previewUrl ? "border-solid border-transparent" : "clay-card-flat",
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-xs font-bold text-primary">
                  {progress}% uploaded
                </span>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full group">
                <Image
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="Task attachment"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-white p-2 rounded-full text-destructive shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud
                  className={cn(
                    "w-8 h-8 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground/40",
                  )}
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    Drop image here
                  </p>
                  <label className="text-xs font-medium text-primary cursor-pointer hover:underline">
                    or browse files
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] && onFileChange(e.target.files[0])
                      }
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Priority & Date */}
        <div className="sm:flex sm:items-end sm:gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase pl-1">
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
            <label className="text-xs font-semibold text-muted-foreground uppercase pl-1">
              Due date
            </label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "clay-pill px-4 py-2.5 text-sm flex items-center gap-2",
                        dueDateValue && "border border-primary",
                        field.value
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <Calendar className="w-4 h-4 text-primary/70" />
                      {field.value
                        ? format(new Date(field.value), "MMM d, yyyy")
                        : "Pick a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 rounded-2xl border-0 shadow-2xl">
                    <CalendarPicker
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date(2020, 0)}
                      endMonth={new Date(2040, 0)}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(d) => field.onChange(d?.toISOString())}
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

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <ClayButton
            type="submit"
            variant="primary"
            className="min-w-[160px]"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </ClayButton>
        </div>
      </form>
    </ClayCard>
  );
}
