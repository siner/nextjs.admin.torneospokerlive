import { getAllTours } from "@/lib/api";
import { Tour, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PrivatePage() {
  const tours = await getAllTours();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Circuitos</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable columns={columns} data={tours} />
      </div>
    </>
  );
}
