"use client";
import * as React from "react";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/datatables/pagination";
// import { DataTableViewOptions } from "@/components/datatables/view-options"; // Comentado o eliminado
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogPost, BlogCategoryInfo } from "./columns"; // Importar tipos
// Asumiendo que tenemos un componente para filtrar por estado, similar a Select
// import { DataTableFacetedFilter } from "@/components/datatables/faceted-filter";

// Props necesitarán las categorías para el filtro si lo implementamos
interface DataTableProps<TData extends BlogPost, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // categories: BlogCategoryInfo[]; // Descomentar si añadimos filtro por categoría
}

// Opciones para el filtro de estado
const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
];

export function BlogPostDataTable<TData extends BlogPost, TValue>({
  columns,
  data,
}: // categories // Descomentar si añadimos filtro por categoría
DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  // const [columnVisibility, setColumnVisibility] = // Comentado o eliminado
  //   React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility, // Comentado o eliminado
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      // columnVisibility, // Comentado o eliminado
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 20, // Quizás menos posts por página por defecto
      },
    },
    manualPagination: false, // Asumiendo paginación en cliente por ahora
  });

  // const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {/* Barra de filtros */}
      <div className="flex items-center justify-between py-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-grow">
          <Input
            placeholder="Buscar por título..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-8"
          />
          {/* {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Estado"
              options={statusOptions}
            />
          )} */}
          {/* Añadir filtro por categoría si es necesario */}
          {/* {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )} */}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Nuevo Post */}
          <Link href="/dashboard/blog/posts/edit">
            <Button size="sm" className="h-8">
              Nuevo Post
            </Button>
          </Link>
          {/* Opciones de Vista */}
          {/* <DataTableViewOptions table={table} /> */}
          {/* Comentado o eliminado */}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron posts.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
