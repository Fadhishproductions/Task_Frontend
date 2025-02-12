"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/task";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast"; // Import for alerts
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../redux/api/taskApi";

export const TaskForm = ({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<Task>({
    _id: task?._id || "",
    name: task?.name || "",
    description: task?.description || "",
    priority: task?.priority || "Low",
    status: task?.status || "To Do",
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isLoading = isCreating || isUpdating; // Combined loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const taskData = { ...formData };

      // Remove _id if it's an empty string (indicating task creation)
      if (!taskData._id) {
        delete taskData._id;
      }

      if (formData._id) {
        await updateTask(taskData).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await createTask(taskData).unwrap();
        toast.success("Task created successfully!");
      }

      onClose(); // Close modal on success
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task._id ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {" "}
          {/* ✅ Correctly attach handleSubmit here */}
          {/* Name Input */}
          <Input
            className="mb-2"
            placeholder="Task Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {/* Description Input */}
          <Input
            className="mb-2"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {/* Priority Selector */}
          <Select
            value={formData.priority}
            onValueChange={(val) =>
              setFormData({ ...formData, priority: val as Task["priority"] })
            }
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          {/* Status Selector */}
          <Select
            value={formData.status}
            onValueChange={(val) =>
              setFormData({ ...formData, status: val as Task["status"] })
            }
          >
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {/* Save Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {task._id ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
