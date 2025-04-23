import { getAllEvents } from "@/lib/api";
import { Casino, Event, Tour, columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllCasinos, getAllTours } from "@/lib/api";

export default async function PrivatePage() {
  const events = await getAllEvents();
  const casinos = await getAllCasinos();
  const tours = await getAllTours();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Eventos</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable
          columns={columns}
          data={events}
          casinos={casinos as Casino[]}
          tours={tours as Tour[]}
        />
      </div>
    </>
  );
}
