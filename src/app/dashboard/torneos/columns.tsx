/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
};

export const columns: ColumnDef<Torneo>[] = [
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
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hora" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const torneo = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/torneos/" + torneo.slug} target="_blank">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/admin/torneos/clone/" + torneo.id}>
              <Copy className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/admin/torneos/edit/" + torneo.id}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
