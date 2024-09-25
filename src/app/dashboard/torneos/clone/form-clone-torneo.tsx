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
import { format, set } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { revalidatePath } from "next/cache";

export default function FormCloneTorneo({
  torneo,
  casinos,
  eventos,
}: {
  torneo: any;
  casinos: any[];
  eventos: any[];
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(torneo ? torneo.name : "");
  const [slug, setSlug] = useState(torneo ? torneo.slug : "");
  const [casinoId, setCasinoId] = useState(torneo ? torneo.casinoId : null);
  const [eventId, setEventId] = useState(torneo ? torneo.eventId : null);
  const [date, setDate] = useState(torneo ? torneo.date : "");
  const [time, setTime] = useState(torneo ? torneo.time : "");
  const [buyin, setBuyin] = useState(torneo ? torneo.buyin : "");
  const [fee, setFee] = useState(torneo ? torneo.fee : "");
  const [points, setPoints] = useState(torneo ? torneo.points : "");
  const [leveltime, setLeveltime] = useState(torneo ? torneo.leveltime : "");
  const [punctuality, setPunctuality] = useState(
    torneo ? torneo.punctuality : ""
  );
  const [bounty, setBounty] = useState(torneo ? torneo.bounty : "");
  const [registerlevels, setRegisterlevels] = useState(
    torneo ? torneo.registerlevels : ""
  );
  const [content, setContent] = useState(torneo ? torneo.content : "");

  const [error, setError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function generateSlug() {
    var temp_slug = "";
    if (date) {
      temp_slug += format(date, "yyyy-MM-dd");
    }
    if (casinoId) {
      temp_slug +=
        "-" +
        casinos
          .filter((casino) => casino.id === casinoId)[0]
          .name.toLowerCase()
          .replace(/ /g, "-");
    }
    if (name) {
      temp_slug += "-" + name.toLowerCase().replace(/ /g, "-");
    }

    setSlug(temp_slug);
  }

  function cloneTorneo() {
    if (!name || !slug || !casinoId || !date || !time || !buyin) {
      toast({ description: "Todos los campos son requeridos" });
      setError(true);
      return;
    }
    setLoading(true);
    const real_date = new Date(date);

    const fixed_date = format(real_date, "yyyy-MM-dd");

    generateSlug();
    supabase
      .from("Tournament")
      .insert({
        name,
        slug,
        casinoId,
        eventId,
        date: fixed_date,
        time,
        buyin,
        fee,
        points,
        leveltime,
        registerlevels,
        punctuality,
        bounty,
        content,
      })
      .then(() => {
        setLoading(false);
        toast({ description: "Torneo creado" });
        router.push("/dashboard/torneos");
      });
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
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
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
            <Label htmlFor="logo">Evento</Label>
            <Select value={eventId} onValueChange={(e) => setEventId(e)}>
              <SelectTrigger>
                <SelectValue placeholder="Evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map((evento: any) => (
                  <SelectItem key={evento.id} value={evento.id}>
                    {evento.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Fecha</Label>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="text"
              name="time"
              className={"w-full " + (error && !time ? "border-red-500" : "")}
              defaultValue={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-7 gap-3">
          <div>
            <Label htmlFor="buyin">BuyIn</Label>
            <Input
              id="buyin"
              type="text"
              name="buyin"
              className={"w-full " + (error && !buyin ? "border-red-500" : "")}
              defaultValue={buyin}
              onChange={(e) => setBuyin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fee">Fee</Label>
            <Input
              id="fee"
              type="text"
              name="fee"
              className="w-full"
              defaultValue={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="points">Puntos</Label>
            <Input
              id="points"
              type="text"
              name="points"
              className="w-full"
              defaultValue={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="leveltime">Tiempo por nivel</Label>
            <Input
              id="leveltime"
              type="text"
              name="leveltime"
              className="w-full"
              defaultValue={leveltime}
              onChange={(e) => setLeveltime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="registerlevels">Niveles de registro</Label>
            <Input
              id="registerlevels"
              type="text"
              name="registerlevels"
              className="w-full"
              defaultValue={registerlevels}
              onChange={(e) => setRegisterlevels(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="punctuality">Puntualidad</Label>
            <Input
              id="punctuality"
              type="text"
              name="punctuality"
              className="w-full"
              defaultValue={punctuality}
              onChange={(e) => setPunctuality(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bounty">Bounty</Label>
            <Input
              id="bounty"
              type="text"
              name="bounty"
              className="w-full"
              defaultValue={bounty}
              onChange={(e) => setBounty(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>

          <Textarea
            id="content"
            name="content"
            className="w-full h-32"
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button size="sm" onClick={() => cloneTorneo()} disabled={loading}>
            {loading ? "Guardando ..." : "Guardar"}
          </Button>
          <Link href="/dashboard/torneos">
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
