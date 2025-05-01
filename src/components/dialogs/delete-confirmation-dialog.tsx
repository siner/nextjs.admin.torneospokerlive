"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DeleteConfirmationDialogProps {
  itemName?: string;
  deleteAction: (
    id: string | number
  ) => Promise<{ success: boolean; message: string }>;
  itemId: string | number;
  trigger: React.ReactElement;
}

export function DeleteConfirmationDialog({
  itemName = "este elemento",
  deleteAction,
  itemId,
  trigger,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAction(itemId);
      if (result.success) {
        toast({ description: result.message });
        setIsOpen(false);
        router.refresh();
      } else {
        toast({
          description: result.message || "Error al eliminar.",
          variant: "destructive",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TriangleAlert className="mr-2 h-5 w-5 text-destructive" />{" "}
            ¿Confirmar Eliminación?
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
            <strong>{itemName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
