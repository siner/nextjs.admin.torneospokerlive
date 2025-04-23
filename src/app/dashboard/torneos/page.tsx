import { getAllCasinos, getAllTournaments, getAllEvents } from "@/lib/api";
import { Torneo, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Casino, Event } from "./columns";

export default async function PrivatePage() {
  const tournaments = await getAllTournaments();
  const casinos = await getAllCasinos();
  const events = await getAllEvents();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Torneos</h1>
      </div>
      <div className="md:container mx-auto">
        <DataTable
          columns={columns}
          data={tournaments}
          casinos={casinos as Casino[]}
          events={events as Event[]}
        />
      </div>
    </>
  );
}
