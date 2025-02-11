import { useState } from "react";
import { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskForm } from "./TaskForm";
import { DeleteDialog } from "./DeleteDialog";

export const TaskList = ({ tasks, onSave, onDelete }: { tasks: Task[]; onSave: (task: Task) => void; onDelete: (id: string) => void }) => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // ✅ Get Card Styles Based on Priority
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600";
      case "Medium": return "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600";
      case "Low": return "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600";
      default: return "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600";
    }
  };

  // ✅ Get Badge Styles Based on Status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500 text-white";
      case "In Progress": return "bg-orange-500 text-white";
      case "To Do": return "bg-gray-500 text-white";
      default: return "bg-gray-300 dark:bg-gray-700 text-white";
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Button className="col-span-full" onClick={() => setEditTask({ _id: "", name: "", description: "", priority: "Low", status: "To Do" })}>
        + Add Task
      </Button>

      {tasks.map((task) => (
        <Card key={task._id} className={`shadow-lg border transition hover:scale-105 ${getPriorityStyles(task.priority)}`}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300">{task.description}</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Priority Row */}
            <div className="flex justify-between items-center text-sm">
              <strong>Priority:</strong>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityStyles(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            {/* Status Row */}
            <div className="flex justify-between items-center text-sm mt-2">
              <strong>Status:</strong>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusStyles(task.status)}`}>
                {task.status}
              </span>
            </div>
          </CardContent>

          <div className="flex justify-end gap-2 p-4">
            <Button size="sm" variant="outline" onClick={() => setEditTask(task)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleteTaskId(task._id)}>Delete</Button>
          </div>
        </Card>
      ))}

      {editTask && <TaskForm task={editTask} onClose={() => setEditTask(null)}   />}
      {deleteTaskId && <DeleteDialog id={deleteTaskId} onClose={() => setDeleteTaskId(null)} onDelete={onDelete} />}
    </div>
  );
};
