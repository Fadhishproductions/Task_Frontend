export type Task = {
    _id?: string;
    name: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Completed";
  };
  