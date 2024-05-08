"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { useState } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default function FormEvento({
  evento,
  casinos,
  circuitos,
}: {
  evento: any;
  casinos: any[];
  circuitos: any[];
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(evento ? evento.name : "");
  const [slug, setSlug] = useState(evento ? evento.slug : "");
  const [casinoId, setCasinoId] = useState(evento ? evento.casinoId : null);
  const [tourId, setTourId] = useState(evento ? evento.tourId : null);
  const [from, setFrom] = useState(evento ? evento.from : "");
  const [to, setTo] = useState(evento ? evento.to : "");
  const [draft, setDraft] = useState(evento ? evento.draft : null);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function generateSlug() {
    if (name) {
      setSlug(name.toLowerCase().replace(/ /g, "-"));
    }
  }

  function updateEvento() {
    if (!name || !slug || !casinoId || !tourId || !from || !to) {
      toast({ description: "Todos los campos son requeridos" });
      setError(true);
      return;
    }
    setLoading(true);
    var date = new Date(to);
    const date_to = format(date, "yyyy-MM-dd");
    date = new Date(from);
    const date_from = format(date, "yyyy-MM-dd");

    if (!evento) {
      supabase
        .from("Event")
        .insert({
          name,
          slug,
          casinoId,
          tourId,
          from: date_from,
          to: date_to,
          draft,
        })
        .then(() => {
          setLoading(false);
          toast({ description: "Evento creado" });
          router.push("/admin/eventos");
        });
    } else {
      supabase
        .from("Event")
        .update({
          name,
          slug,
          casinoId,
          tourId,
          from: date_from,
          to: date_to,
          draft,
        })
        .eq("id", evento.id)
        .then(() => {
          setLoading(false);
          toast({ description: "Evento actualizado" });
        });
    }
  }

  return (
    <>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              name="name"
              className={"w-full " + (error && !name ? "border-red-500" : "")}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <div className="relative">
              <RefreshCcw
                onClick={() => generateSlug()}
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              />
              <Input
                id="slug"
                type="text"
                name="slug"
                className="w-full"
                defaultValue={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="logo">Casino</Label>
            <Select value={casinoId} onValueChange={(e) => setCasinoId(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Casino" />
              </SelectTrigger>
              <SelectContent>
                {casinos.map((casino) => (
                  <SelectItem key={casino.id} value={casino.id}>
                    {casino.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="logo">Circuito</Label>
            <Select value={tourId} onValueChange={(e) => setTourId(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Circuito" />
              </SelectTrigger>
              <SelectContent>
                {circuitos.map((circuito) => (
                  <SelectItem key={circuito.id} value={circuito.id}>
                    {circuito.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="logo">Desde</Label>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {from ? format(from, "dd/MM/yyyy") : <span>Desde</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={from}
                  onSelect={setFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="logo">Hasta</Label>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {to ? format(to, "dd/MM/yyyy") : <span>Hasta</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={to}
                  onSelect={setTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="draft">Draft</Label>
            <Switch checked={draft} onCheckedChange={() => setDraft(!draft)} />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button size="sm" onClick={() => updateEvento()} disabled={loading}>
            {loading ? "Guardando ..." : "Guardar"}
          </Button>
          <Link href="/admin/eventos">
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
