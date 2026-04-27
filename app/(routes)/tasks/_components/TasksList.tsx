/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskType } from "@/config/schema";
import { reorderTasksAction } from "@/lib/actions/task";
import { toast } from "sonner";

export default function TasksList({
  initialTasks,
}: {
  initialTasks: TaskType[];
}) {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Prevents accidental drags when clicking buttons
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      // 1. Move the items in the local array
      const newTasks = arrayMove(tasks, oldIndex, newIndex);

      // 2. Map through the new array and assign position = index
      const updatedTasksWithPositions = newTasks.map((task, index) => ({
        ...task,
        position: index,
      }));

      // 3. Update local state immediately (Optimistic UI)
      setTasks(updatedTasksWithPositions);

      // 4. Prepare only the necessary IDs and positions for the server
      const payload = updatedTasksWithPositions.map((t) => ({
        id: t.id,
        position: t.position,
      }));

      const result = await reorderTasksAction(payload);

      if (!result.success) {
        setTasks(tasks); // Rollback on failure
        toast.error("Failed to save the new order.");
      }
    }
  };

  return (
    <DndContext
      id="kognit-tasks-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4 pb-10">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
