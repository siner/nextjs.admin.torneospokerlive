/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTableColumnHeader } from "@/components/datatables/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export type User = {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar: string;
  email: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const user = row.original;
      const avatar = user.avatar;
      const avatarName = user.username ? user.username : user.email;

      return (
        <Avatar>
          <AvatarImage
            src={
              avatar
                ? `https://wsrv.nl/?url=${avatar}&w=100&h=100&fit=cover&mask=circle`
                : `https://ui-avatars.com/api/?name=${avatarName}&s=100&background=random`
            }
          />
        </Avatar>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre de usuario" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "surname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" className="h-6 w-6 p-0">
            <Link href={"/dashboard/usuarios/edit/" + user.id}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
