/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Desde" />
    ),
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hasta" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const evento = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <a
              href={"https://torneospokerlive.com/eventos/" + evento.slug}
              target="_blank"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/dashboard/eventos/edit/" + evento.id}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
