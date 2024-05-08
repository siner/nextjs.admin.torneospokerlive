/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import FormTorneo from "./form-torneo";
import { getAllCasinos, getAllEvents } from "@/lib/api";

export default async function EditTorneo({
  params,
}: {
  params: { id: number };
}) {
  const casinos = await getAllCasinos();
  const eventos = await getAllEvents();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/torneos" passHref>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Crear Evento
          </h1>
        </div>
        <div className="grid">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Editar</CardTitle>
              </CardHeader>
              <CardContent>
                <FormTorneo torneo={null} eventos={eventos} casinos={casinos} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
