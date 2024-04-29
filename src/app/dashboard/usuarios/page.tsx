import { getAllUsers } from "@/lib/api";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PrivatePage() {
  const usuarios = await getAllUsers();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Usuarios</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable columns={columns} data={usuarios} />
      </div>
    </>
  );
}
