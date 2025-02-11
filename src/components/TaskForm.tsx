"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/task";
import { createTask, updateTask } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const TaskForm = ({ task, onClose }: { task: Task; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Task>(task);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mutations for API calls
  const taskMutation = useMutation({
    mutationFn: async (updatedTask: Task) =>
      updatedTask._id ? updateTask(updatedTask._id, updatedTask) : createTask(updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh task list
      onClose(); // Close modal
    },
    onError: (error) => {
      console.error("Error saving task:", error);
      setError("Failed to save task. Try again.");
    },
    onSettled: () => setLoading(false),
  });

 const handleSubmit = async () => {
  if (!formData.name.trim() || !formData.description.trim()) {
    setError("Task name and description are required.");
    return;
  }

  setLoading(true);
  setError(null);

  // Ensure `_id` is only sent for existing tasks
  const taskToSend = { ...formData };
  if (!taskToSend._id) delete taskToSend._id; // ✅ Prevents `_id: ""` issue

  taskMutation.mutate(taskToSend);
};


  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task._id ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input
          placeholder="Task Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        {/* Priority Selector */}
        <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val as Task["priority"] })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Selector */}
        <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as Task["status"] })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Save Button */}
        <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {task._id ? "Update Task" : "Create Task"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
