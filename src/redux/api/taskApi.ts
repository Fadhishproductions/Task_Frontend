import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Task } from "../../types/task";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }), // Change URL as needed
  tagTypes: ["Tasks"], // Helps with cache invalidation
  endpoints: (builder) => ({
   getTasks: builder.query<
  { tasks: Task[]; totalTasks: number; totalPages: number; currentPage: number },
  { page: number; limit: number; search?: string }>({
  query: ({ page, limit, search }) =>
    `/tasks?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
  providesTags: ["Tasks"],
}),
    
    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
    }),
    createTask: builder.mutation<Task, Omit<Task, "_id">>({
      query: (newTask) => ({
        url: "/tasks",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"], // Refetch task list after adding
    }),
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: `/tasks/${task._id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
