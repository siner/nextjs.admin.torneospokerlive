"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteBlogPostAction } from "@/lib/actions/blogPosts";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils"; // Asumiendo que tienes formatDate

// Tipos para datos relacionados (esperados de un JOIN)
export type BlogCategoryInfo = {
  id: string;
  name: string;
} | null;

// Tipo principal para la fila de la tabla
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  created_at: string;
  published_at: string | null;
  blog_categories: BlogCategoryInfo;
  // Ajustar tipo para reflejar la estructura devuelta por Supabase count()
  comment_count: { count: number }[] | null;
};

export const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "blog_categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => {
      const category = row.original.blog_categories;
      return category ? (
        category.name
      ) : (
        <span className="text-xs text-muted-foreground">N/A</span>
      );
    },
    // filterFn podría añadirse si se necesita filtrar por categoría
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "published" ? "default" : "secondary"}>
          {status === "published" ? "Publicado" : "Borrador"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "published_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publicado" />
    ),
    cell: ({ row }) => {
      const publishedDate = row.getValue("published_at");
      if (!publishedDate)
        return <span className="text-xs text-muted-foreground">N/A</span>;
      try {
        // Usar función formatDate si existe y es adecuada, o formatear aquí
        const formatted = formatDate(new Date(publishedDate as string));
        return <div className="text-xs">{formatted.datestring}</div>;
      } catch (e) {
        return (
          <span className="text-xs text-muted-foreground">Fecha inválida</span>
        );
      }
    },
  },
  {
    accessorKey: "comment_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coments" />
    ),
    cell: ({ row }) => {
      // Extraer el count del array/objeto devuelto
      const commentData = row.original.comment_count;
      const count =
        commentData && commentData.length > 0 ? commentData[0].count : 0;
      return <div className="text-center font-medium">{count}</div>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      // Wrapper para delete action
      const handleDelete = (
        id: string | number
      ): Promise<{ success: boolean; message: string }> => {
        if (typeof id === "string") {
          return deleteBlogPostAction(id);
        } else {
          console.error("ID inesperado de tipo número recibido para post:", id);
          return Promise.resolve({ success: false, message: "ID inválido." });
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          {/* Botón Ver (opcional, si tienes vista pública) */}
          {post.status === "published" && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a
                href={`https://www.torneospokerlive.com/noticias/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver post público"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver post</span>
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link
              href={`/dashboard/blog/posts/edit/${post.id}`}
              title="Editar post"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar post</span>
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`el post "${post.title}"`}
            deleteAction={handleDelete}
            itemId={post.id}
            trigger={
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                title="Eliminar post"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar post</span>
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
