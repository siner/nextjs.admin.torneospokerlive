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
  slug: string;
  color: string;
  content: string;
  logo: string;
};

export const columns: ColumnDef<Casino>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "logo",
    header: "",
    cell: ({ row }) => (
      <div
        className="hidden md:flex flex-col items-center justify-center rounded-full h-10 w-10 mx-2"
        style={{
          backgroundColor: row.getValue("color"),
        }}
      >
        <img
          src={`https://wsrv.nl/?url=${row.getValue(
            "logo"
          )}&w=100&h=100&fit=contain&mask=circle`}
          alt="logo"
          className="h-10 w-10"
        />
      </div>
    ),
  },
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
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const casino = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/casinos/" + casino.slug} target="_blank">
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/admin/casinos/edit/" + casino.id}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
