/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteTournamentAction } from "@/lib/actions/tournaments";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";

export type Casino = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  name: string;
};

export type Torneo = {
  id: number;
  name: string;
  slug: string;
  casinoId: number;
  eventId: number;
  date: string;
  time: string;
  casino: Casino;
  event: Event;
  draft: boolean;
};

export const columns: ColumnDef<Torneo>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "casinoId",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value) => {
      return String(row.getValue(id)) === value;
    },
    enableHiding: false,
  },
  {
    accessorKey: "eventId",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value) => {
      return String(row.getValue(id)) === value;
    },
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "casino",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Casino" />
    ),
    cell: ({ row }) => {
      const torneo = row.original;
      return torneo.casino.name;
    },
  },
  {
    accessorKey: "event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
    cell: ({ row }) => {
      const torneo = row.original;
      return torneo.event ? torneo.event.name : "";
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id));
      const { from, to } = value as { from?: Date; to?: Date };
      if (from && !to) {
        return date >= from;
      }
      if (!from && to) {
        // Ajustar 'to' para incluir todo el día
        const adjustedTo = new Date(to);
        adjustedTo.setHours(23, 59, 59, 999);
        return date <= adjustedTo;
      }
      if (from && to) {
        // Ajustar 'to' para incluir todo el día
        const adjustedTo = new Date(to);
        adjustedTo.setHours(23, 59, 59, 999);
        return date >= from && date <= adjustedTo;
      }
      return true; // No filter applied if no dates
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora" />
    ),
  },
  {
    accessorKey: "draft",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Draft" />
    ),
    cell: ({ row }) => {
      const torneo = row.original;
      return torneo.draft ? "Sí" : "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const torneo = row.original;

      // Wrapper para asegurar compatibilidad de tipos con el diálogo
      const handleDelete = (
        id: string | number
      ): Promise<{ success: boolean; message: string }> => {
        if (typeof id === "number") {
          return deleteTournamentAction(id);
        } else {
          // Manejar el caso si inesperadamente recibimos un string
          console.error("ID inesperado de tipo string recibido:", id);
          return Promise.resolve({
            success: false,
            message: "ID inválido (inesperado tipo string).",
          });
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <a
              href={`https://torneospokerlive.com/torneos/${torneo.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={`/dashboard/torneos/clone/${torneo.id}`}>
              <Copy className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={`/dashboard/torneos/edit/${torneo.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`el torneo "${torneo.name}"`}
            itemId={torneo.id}
            deleteAction={handleDelete}
            trigger={
              <Button
                variant="destructive"
                className="h-6 w-6 p-0"
                title="Eliminar torneo"
              >
                <Trash2 className="h-4 w-4" />
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
