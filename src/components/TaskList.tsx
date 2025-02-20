import { useEffect, useState } from "react";
import { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskForm } from "./TaskForm";
import { DeleteDialog } from "./DeleteDialog";
import { useGetTasksQuery } from "../redux/api/taskApi";
import { Input } from "./ui/input";

export const TaskList = () => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [debouncedText, setDebouncedText] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const limit = 5; // Set how many tasks per page
 
   // Delay search execution to avoid excessive API calls
   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedText(searchText);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  //fetching tasks
  const { data, isLoading, error } = useGetTasksQuery({ page, limit, search: debouncedText });

  if (isLoading)
    return (
      <div className="relative min-h-[200px] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
    if (error) {
    const errorMessage =
      "status" in error
        ? `Error ${error.status}: ${(error)?.data || "Something went wrong"}`
        : (error as Error)?.message || "Unknown error";
  
    return (
      <div className="col-span-full bg-white rounded-xl border-dashed border-4 border-gray-600 shadow-md py-4 px-6 flex justify-center">
        <h1 className="text-lg text-black italic">{errorMessage}</h1>
      </div>
    );
  }
  

  const { tasks, totalPages, currentPage } = data ?? {};

  // ✅ Get Card Styles Based on Priority
  const getCardStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600";
      case "Low":
        return "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600";
    }
  };

  const getPriorityStyles = (priority: string) => { //styles for priority
    switch (priority) {
      case "High":
        return "bg-red-400 dark:bg-red-400 border-red-900 dark:border-red-600 text-white";
      case "Medium":
        return "bg-yellow-400 dark:bg-yellow-400 border-yellow-900 dark:border-yellow-600 text-white ";
      case "Low":
        return "bg-green-400 dark:bg-green-400 border-green-900 dark:border-green-600 text-white";
      default:
        return "bg-gray-400 dark:bg-gray-400 border-gray-900 dark:border-gray-600";
    }
  };

  // ✅ Get Badge Styles Based on Status
  const getStatusStyles = (status: string) => { // for status text style
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "In Progress":
        return "bg-orange-500 text-white";
      case "To Do":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-300 dark:bg-gray-700 text-white";
    }
  };

  
  
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <Input placeholder="Search Tasks" value={searchText}
          onChange={(e) => setSearchText(e.target.value)}/>
      </div>
      <Button
        className="col-span-full bg-gray-900 text-gray-300"
        onClick={() =>
          setEditTask({
            _id: "",
            name: "",
            description: "",
            priority: "Low",
            status: "To Do",
          })
        }
      >
        + Add Task
      </Button>

      {tasks && tasks?.length > 0 ? (
        tasks?.map((task) => (
          <Card key={task._id} className={`shadow-lg border transition hover:scale-105 ${getCardStyles(task.priority)}`}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {task.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
                {task.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <strong>Priority:</strong>
                <span className={`px-2 py-1 text-xs font-semibold  rounded ${getPriorityStyles(task.priority)}`}>
            {task.priority}
          </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <strong>Status:</strong>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusStyles(task.status)}`}>
            {task.status}
          </span>
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button size="sm" variant="outline" onClick={() => setEditTask(task)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleteTaskId(task?._id || "")}>Delete</Button>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full bg-white rounded-xl border-dashed border-4 border-gray-600 shadow-md py-4 px-6 flex justify-center">
          <h1 className="text-lg text-black italic">
            No Tasks Available. You are welcome to add one.
          </h1>
        </div>
      )}

{/* Pagination Controls */}
{ tasks && tasks.length>0 && 
      <div className="col-span-full flex justify-center items-center gap-4 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
          Prev
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
}

      {editTask && <TaskForm task={editTask} onClose={() => setEditTask(null)} />}
      {deleteTaskId && <DeleteDialog id={deleteTaskId} onClose={() => setDeleteTaskId(null)} />}
    </div>
  );
};
