"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteBlogTagAction } from "@/lib/actions/blogTags"; // Importar la action correcta
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";

// Definir el tipo para los datos de la tabla de Tags
export type BlogTag = {
  id: string; // UUID es string
  name: string;
  slug: string;
};

export const columns: ColumnDef<BlogTag>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tag = row.original;

      // Wrapper para asegurar compatibilidad de tipos con el diálogo
      const handleDelete = (
        id: string | number
      ): Promise<{ success: boolean; message: string }> => {
        if (typeof id === "string") {
          return deleteBlogTagAction(id);
        } else {
          console.error("ID inesperado de tipo número recibido para tag:", id);
          return Promise.resolve({
            success: false,
            message: "ID inválido (inesperado tipo número).",
          });
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-8 w-8 p-0" asChild>
            {/* Enlace de edición para tags */}
            <Link href={`/dashboard/blog/tags/edit/${tag.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar tag</span>
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`el tag "${tag.name}"`}
            // Pasamos el wrapper
            deleteAction={handleDelete}
            itemId={tag.id} // Pasamos el ID (string)
            trigger={
              <Button
                variant="destructive"
                className="h-8 w-8 p-0"
                title="Eliminar tag"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar tag</span>
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
