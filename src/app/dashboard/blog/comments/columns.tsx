"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { deleteBlogCommentAction } from "@/lib/actions/blogComments"; // Importar la acción
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Tipo para la información del autor del comentario (eliminado o comentado)
/*
export type CommentAuthorInfo = {
  email: string; 
} | null;
*/

// Tipo principal para la fila de la tabla de comentarios
export type BlogComment = {
  id: string; // UUID del comentario
  content: string;
  created_at: string;
  // author_id: CommentAuthorInfo; // Eliminado
  post_id: string; // UUID del post al que pertenece (no visible, pero útil)
  // status: 'pending' | 'approved' | 'rejected'; // Si implementas estados
};

// Wrapper para la acción delete que maneja el tipo de ID
const handleDeleteComment = (
  id: string | number
): Promise<{ success: boolean; message: string }> => {
  if (typeof id === "string") {
    return deleteBlogCommentAction(id);
  } else {
    console.error("ID de comentario inesperado (no string):", id);
    return Promise.resolve({
      success: false,
      message: "ID de comentario inválido.",
    });
  }
};

export const commentColumns: ColumnDef<BlogComment>[] = [
  /* // Columna Autor eliminada
  {
    accessorKey: "author_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Autor" />
    ),
    cell: ({ row }) => {
      const author = row.original.author_id;
      return author ? author.email : <span className="text-xs text-muted-foreground">Desconocido</span>;
    },
  },
  */
  {
    accessorKey: "content",
    header: "Comentario",
    cell: ({ row }) => {
      // Mostrar un extracto
      const content = row.getValue("content") as string;
      const excerpt =
        content.length > 100 ? content.substring(0, 100) + "..." : content;
      return <span className="text-sm">{excerpt}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      try {
        const formatted = formatDate(
          new Date(row.getValue("created_at") as string)
        );
        return <div className="text-xs">{formatted.datestring}</div>;
      } catch (e) {
        return (
          <span className="text-xs text-muted-foreground">Fecha inválida</span>
        );
      }
    },
  },
  /* // Columna de Estado (si se implementa)
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        // Lógica para mostrar badge según estado
        return <Badge variant={status === 'approved' ? 'default' : 'secondary'}>{status}</Badge>;
    }
  }, */
  {
    id: "actions",
    cell: ({ row }) => {
      const comment = row.original;

      return (
        <div className="flex items-center justify-end">
          <DeleteConfirmationDialog
            itemName={`el comentario`}
            deleteAction={handleDeleteComment}
            itemId={comment.id}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                title="Eliminar comentario"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            }
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
