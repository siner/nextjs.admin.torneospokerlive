import { getAllCasinos } from "@/lib/api";
import { Casino, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PrivatePage() {
  const casinos = await getAllCasinos();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Casinos</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable columns={columns} data={casinos} />
      </div>
    </>
  );
}
