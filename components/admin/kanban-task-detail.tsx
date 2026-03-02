"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from "lucide-react";
import { updateTaskAction, deleteTaskAction, toggleTaskAction } from "@/server/actions/kanban";

interface Task {
  id: string;
  phase_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  order_index: number;
}

interface Phase {
  id: string;
  name: string;
  order_index: number;
}

interface KanbanTaskDetailProps {
  task: Task | null;
  phases: Phase[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function KanbanTaskDetail({
  task,
  phases,
  open,
  onOpenChange,
  onTaskUpdate,
  onTaskDelete,
}: KanbanTaskDetailProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const phase = phases.find((p) => p.id === task?.phase_id);

  // Sync local state when task changes
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  if (task && task.id !== lastTaskId) {
    setTitle(task.title);
    setDescription(task.description || "");
    setLastTaskId(task.id);
  }

  const handleSave = async () => {
    if (!task || !title.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updateTaskAction(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onTaskUpdate({ ...task, ...updated });
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (!task) return;
    try {
      const updated = await toggleTaskAction(task.id, checked);
      onTaskUpdate({ ...task, ...updated });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await deleteTaskAction(task.id);
      onTaskDelete(task.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasChanges = task && (title !== task.title || description !== (task.description || ""));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        {task ? (
          <>
            <SheetHeader>
              <SheetTitle>Task Details</SheetTitle>
              <SheetDescription>
                Edit task details or delete this task.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              {/* Phase badge + completed toggle */}
              <div className="flex items-center gap-3">
                {phase && (
                  <Badge variant="outline" className="text-xs">
                    {phase.name}
                  </Badge>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Checkbox
                    id="task-completed"
                    checked={task.is_completed}
                    onCheckedChange={handleToggle}
                  />
                  <label
                    htmlFor="task-completed"
                    className="text-sm text-stone-600 cursor-pointer"
                  >
                    Completed
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="task-title" className="text-sm font-medium text-stone-700">
                  Title
                </label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="task-desc" className="text-sm font-medium text-stone-700">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Save */}
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges || !title.trim()}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Save Changes
              </Button>

              {/* Delete */}
              <div className="border-t pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Task
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &ldquo;{task.title}&rdquo;. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                        onClick={handleDelete}
                      >
                        {isDeleting ? "Deleting..." : "Delete Task"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
