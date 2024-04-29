import { getAllEvents } from "@/lib/api";
import { Event, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PrivatePage() {
  const events = await getAllEvents();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Eventos</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable columns={columns} data={events} />
      </div>
    </>
  );
}
