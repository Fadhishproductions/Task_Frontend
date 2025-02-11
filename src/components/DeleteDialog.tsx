"use client";

 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteDialog = ({ id, onClose, onDelete }: { id: string; onClose: () => void; onDelete: (id: string) => void }) => (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
        <Button onClick={() => { onDelete(id); onClose(); }}>Yes, Delete</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
  