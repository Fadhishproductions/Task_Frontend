"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTaskMutation } from "../redux/api/taskApi";
import { toast } from "react-hot-toast"; // Import for alerts

export const DeleteDialog = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
  const [deleteTask] = useDeleteTaskMutation();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <Button
          onClick={async () => {
            await deleteTask(id);
            toast.success("Task deleted successfully!");
            onClose();
          }}
        >
          Yes, Delete
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
