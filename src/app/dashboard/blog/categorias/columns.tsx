"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteBlogCategoryAction } from "@/lib/actions/blogCategories"; // Importar la action correcta
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { toast } from "@/components/ui/use-toast";
import { startTransition } from "react";

// Definir el tipo para los datos de la tabla
export type BlogCategory = {
  id: string; // UUID es string
  name: string;
  slug: string;
  // created_at?: string; // Podríamos añadirlo si es útil
};

export const columns: ColumnDef<BlogCategory>[] = [
  // Ocultar columna ID si no es necesaria visiblemente
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="ID" />
  //   ),
  // },
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
  // {
  //   accessorKey: "created_at",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Creado" />
  //   ),
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("created_at"));
  //     return date.toLocaleDateString(); // Formatear fecha
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      // Wrapper para asegurar compatibilidad de tipos con el diálogo
      const handleDelete = (
        id: string | number
      ): Promise<{ success: boolean; message: string }> => {
        if (typeof id === "string") {
          return deleteBlogCategoryAction(id);
        } else {
          // Manejar el caso si inesperadamente recibimos un número
          // Podrías lanzar un error o retornar una promesa rechazada
          console.error("ID inesperado de tipo número recibido:", id);
          return Promise.resolve({
            success: false,
            message: "ID inválido (inesperado tipo número).",
          });
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-8 w-8 p-0" asChild>
            <Link href={`/dashboard/blog/categorias/edit/${category.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar categoría</span>
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`la categoría "${category.name}"`}
            // Pasamos el wrapper que maneja el tipo
            deleteAction={handleDelete}
            itemId={category.id}
            trigger={
              <Button
                variant="destructive"
                className="h-8 w-8 p-0"
                title="Eliminar categoría"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar categoría</span>
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
