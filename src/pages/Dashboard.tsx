import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/api";
import { TaskList } from "../components/TaskList";
import { Task } from "@/types/task";

export default function Dashboard() {
  const { data: tasks, isLoading } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      {isLoading ? <p className="text-center">Loading tasks...</p> : <TaskList tasks={tasks || []} onSave={function (task: Task): void {
              throw new Error("Function not implemented.");
          } } onDelete={function (id: string): void {
              throw new Error("Function not implemented.");
          } } />}
    </div>
  );
}
