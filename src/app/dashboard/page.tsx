import { getAllDraftTournaments, getAllDraftEvents } from "@/lib/api";
import { tournamentColumns } from "./tournaments-columns";
import { TournamentsDataTable } from "./tournaments-data-table";
import { eventsColumns } from "./events-columns";
import { EventsDataTable } from "./events-data-table";

export default async function PrivatePage() {
  const tournaments = await getAllDraftTournaments();
  const events = await getAllDraftEvents();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="md:container mx-auto">
        <h2 className="text-lg font-semibold md:text-2xl">Eventos</h2>
        <EventsDataTable columns={eventsColumns} data={events} />
        <h2 className="text-lg font-semibold md:text-2xl">Torneos</h2>
        <TournamentsDataTable columns={tournamentColumns} data={tournaments} />
      </div>
    </>
  );
}
