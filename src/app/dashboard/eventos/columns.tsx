/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import {
  deleteEventAction,
  DeleteEventActionResult,
} from "@/lib/actions/events";

export type Casino = {
  id: number;
  name: string;
};

export type Tour = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  name: string;
  slug: string;
  casinoId: number;
  tourId: number;
  from: string;
  to: string;
  casino: Casino;
  tour: Tour;
  draft: boolean;
  tournaments?: { count: number };
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
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
      const evento = row.original;
      return evento.casino.name;
    },
  },
  {
    accessorKey: "tour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Circuito" />
    ),
    cell: ({ row }) => {
      const evento = row.original;
      return evento.tour.name;
    },
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
    accessorKey: "tourId",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value) => {
      return String(row.getValue(id)) === value;
    },
    enableHiding: false,
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Desde" />
    ),
    filterFn: (row, id, value) => {
      const eventFrom = new Date(row.getValue(id));
      const eventTo = new Date(row.original.to);
      const { from: filterFrom, to: filterTo } = value as {
        from?: Date;
        to?: Date;
      };

      const adjustedFilterTo = filterTo ? new Date(filterTo) : undefined;
      if (adjustedFilterTo) {
        adjustedFilterTo.setHours(23, 59, 59, 999);
      }

      if (filterFrom && !adjustedFilterTo) {
        return eventTo >= filterFrom;
      }
      if (!filterFrom && adjustedFilterTo) {
        return eventFrom <= adjustedFilterTo;
      }
      if (filterFrom && adjustedFilterTo) {
        return eventFrom <= adjustedFilterTo && eventTo >= filterFrom;
      }
      return true;
    },
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hasta" />
    ),
  },
  {
    accessorKey: "draft",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Draft" />
    ),
    cell: ({ row }) => {
      const evento = row.original;
      return evento.draft ? "Sí" : "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const evento = row.original;

      const handleDeleteWrapper = async (
        id: number
      ): Promise<{ success: boolean; message: string }> => {
        const result = await deleteEventAction(id);
        if (result.requiresConfirmation) {
          return {
            success: false,
            message: result.message || "Se requiere confirmación adicional.",
          };
        }
        return { success: result.success, message: result.message };
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <a
              href={`https://torneospokerlive.com/eventos/${evento.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={`/dashboard/eventos/edit/${evento.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`el evento "${evento.name}"`}
            itemId={evento.id}
            deleteAction={handleDeleteWrapper}
            trigger={
              <Button
                variant="destructive"
                className="h-6 w-6 p-0"
                title="Eliminar evento"
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
