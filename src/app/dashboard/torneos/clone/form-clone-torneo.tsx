"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, RefreshCcw } from "lucide-react";
import { ZodIssue } from "zod";

import { cn } from "@/lib/utils";
import {
  upsertTournamentAction, // Reutilizamos la misma acción
  TournamentActionState,
} from "@/lib/actions/tournaments";
// import { TournamentSchema } from "@/lib/schemas"; // No necesitamos el schema aquí
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Asumimos que draft no se clona, empieza en false
import { useToast } from "@/components/ui/use-toast";

// Tipos (reemplazar any si es posible)
type Torneo = any;
type Casino = { id: number; name: string; slug?: string }; // Añadir slug opcional
type Evento = any;

// Componente SubmitButton (idéntico a form-torneo.tsx)
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Clonando..." : "Clonar Torneo"}
    </Button>
  );
}

// Componente FieldError (idéntico a form-torneo.tsx)
function FieldError({
  fieldName,
  errors,
}: {
  fieldName: string;
  errors?: ZodIssue[] | null;
}) {
  const error = errors?.find((e) => e.path.includes(fieldName));
  if (!error) return null;
  return (
    <p className="text-sm font-medium text-destructive">{error.message}</p>
  );
}

// Función helper para slugificar (igual que en form-torneo)
function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function FormCloneTorneo({
  torneo, // Torneo original a clonar
  casinos,
  eventos,
}: {
  torneo: Torneo;
  casinos: Casino[];
  eventos: Evento[];
}) {
  const { toast } = useToast();
  const router = useRouter(); // Añadir inicialización

  const initialState: TournamentActionState = {
    success: false,
    message: "",
    errors: null,
  };

  // Usamos la misma acción upsertTournamentAction
  const [formState, formAction] = useFormState(
    upsertTournamentAction,
    initialState
  );

  // Estados controlados solo para interacción específica
  const [name, setName] = useState(torneo?.name ?? ""); // Permitir cambiar nombre
  const [slug, setSlug] = useState(torneo?.slug ?? ""); // Permitir cambiar slug
  const [date, setDate] = useState<Date | undefined>(
    torneo?.date ? new Date(torneo.date) : undefined // Permitir cambiar fecha
  );
  const [content, setContent] = useState(torneo?.content ?? ""); // Permitir cambiar contenido
  // Draft no se clona, el nuevo torneo empieza como no borrador por defecto en el schema
  // const [draft, setDraft] = useState(false);
  // Nuevos estados
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCasinoId, setSelectedCasinoId] = useState<string>(
    String(torneo?.casinoId ?? "")
  );

  // Efecto para mostrar Toasts
  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        // No mostrar toast de éxito si vamos a redirigir inmediatamente
        router.push("/dashboard/torneos");
      } else {
        // Mostrar toast solo en error
        toast({
          description: formState.message,
          variant: "destructive",
        });
      }
    }
    // Actualizar dependencias
  }, [formState, toast, router]);

  // Efecto para generar el slug automáticamente (adaptado para clonar)
  useEffect(() => {
    const generateAndSetSlug = () => {
      if (!date || !selectedCasinoId || !name) {
        // No generar si faltan datos clave
        setSlug(""); // Limpiar si faltan datos en clonación
        return;
      }

      const datePart = format(date, "yyyy-MM-dd");
      const casino = casinos.find((c) => String(c.id) === selectedCasinoId);
      const casinoPart = casino ? casino.slug || slugify(casino.name) : "";
      const namePart = slugify(name);

      if (datePart && casinoPart && namePart) {
        // Asegurar que tenemos todas las partes
        setSlug(`${datePart}-${casinoPart}-${namePart}`);
      } else {
        setSlug("");
      }
    };
    generateAndSetSlug();
  }, [name, date, selectedCasinoId, casinos]); // Quitar isEditing y torneo.slug de dependencias

  return (
    // La acción es la misma, no pasamos ID oculto
    <form action={formAction}>
      <div className="grid gap-6">
        {/* Nombre y Slug (Controlados) */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={name} // Controlado
              onChange={(e) => setName(e.target.value)}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("name"))
              }
              aria-describedby="name-error"
            />
            <FieldError fieldName="name" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="slug">Slug (Auto-generado)</Label>
            <div className="relative">
              {/* Botón RefreshCcw eliminado */}
              <Input
                id="slug"
                name="slug"
                type="text"
                value={slug} // Controlado por useEffect
                readOnly // Hacerlo readOnly
                aria-invalid={
                  !!formState.errors?.find((e) => e.path.includes("slug"))
                }
                aria-describedby="slug-error"
              />
            </div>
            <FieldError fieldName="slug" errors={formState.errors} />
          </div>
        </div>

        {/* Casino, Evento, Fecha, Hora (Usan defaultValue del torneo original) */}
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="casinoId">Casino</Label>
            <Select
              name="casinoId"
              value={selectedCasinoId} // Controlado
              onValueChange={setSelectedCasinoId} // Actualiza estado que dispara useEffect
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("casinoId"))
              }
              aria-describedby="casinoId-error"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona Casino" />
              </SelectTrigger>
              <SelectContent>
                {/* No ponemos item vacío deshabilitado */}
                {casinos.map((casino) => (
                  <SelectItem key={casino.id} value={String(casino.id)}>
                    {casino.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError fieldName="casinoId" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="eventId">Evento (Opcional)</Label>
            <Select
              name="eventId"
              defaultValue={String(torneo?.eventId ?? "")} // Prellenado
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("eventId"))
              }
              aria-describedby="eventId-error"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona Evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">Sin evento asociado</SelectItem>{" "}
                {/* Valor no vacío */}
                {eventos.map((evento: any) => (
                  <SelectItem key={evento.id} value={String(evento.id)}>
                    {evento.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError fieldName="eventId" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="date-trigger">Fecha</Label>
            {/* Input oculto para enviar la fecha formateada */}
            <input
              type="hidden"
              name="date"
              value={date ? format(date, "yyyy-MM-dd") : ""}
            />
            {/* Controlar Popover con estado isCalendarOpen */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild id="date-trigger">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  aria-invalid={
                    !!formState.errors?.find((e) => e.path.includes("date"))
                  }
                  aria-describedby="date-error"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona Fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setIsCalendarOpen(false); // Cierra el popover
                  }}
                  initialFocus
                  locale={es}
                  disabled={(date) => date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
            <FieldError fieldName="date" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="time">Hora (HH:mm)</Label>
            <Input
              id="time"
              name="time"
              type="time"
              step="60"
              defaultValue={torneo?.time ?? ""} // Prellenado
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("time"))
              }
              aria-describedby="time-error"
            />
            <FieldError fieldName="time" errors={formState.errors} />
          </div>
        </div>

        {/* Resto de campos (usan defaultValue del torneo original) */}
        <div className="grid md:grid-cols-7 gap-3">
          <div>
            <Label htmlFor="buyin">BuyIn</Label>
            <Input
              id="buyin"
              name="buyin"
              type="text"
              defaultValue={torneo?.buyin ?? ""} // Prellenado
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("buyin"))
              }
              aria-describedby="buyin-error"
            />
            <FieldError fieldName="buyin" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="fee">Fee</Label>
            <Input
              id="fee"
              name="fee"
              type="text"
              defaultValue={torneo?.fee ?? ""}
            />
            <FieldError fieldName="fee" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="points">Puntos</Label>
            <Input
              id="points"
              name="points"
              type="text"
              defaultValue={torneo?.points ?? ""}
            />
            <FieldError fieldName="points" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="leveltime">T. Nivel (min)</Label>
            <Input
              id="leveltime"
              name="leveltime"
              type="text"
              defaultValue={torneo?.leveltime ?? ""}
            />
            <FieldError fieldName="leveltime" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="registerlevels">Niv. Reg.</Label>
            <Input
              id="registerlevels"
              name="registerlevels"
              type="number"
              defaultValue={torneo?.registerlevels ?? ""}
            />
            <FieldError fieldName="registerlevels" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="punctuality">Puntualidad</Label>
            <Input
              id="punctuality"
              name="punctuality"
              type="text"
              defaultValue={torneo?.punctuality ?? ""}
            />
            <FieldError fieldName="punctuality" errors={formState.errors} />
          </div>
          <div>
            <Label htmlFor="bounty">Bounty</Label>
            <Input
              id="bounty"
              name="bounty"
              type="text"
              defaultValue={torneo?.bounty ?? ""}
            />
            <FieldError fieldName="bounty" errors={formState.errors} />
          </div>
        </div>

        {/* Contenido (Controlado) */}
        <div>
          <Label htmlFor="content">Contenido Adicional</Label>
          <Textarea
            id="content"
            name="content"
            value={content} // Controlado
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <FieldError fieldName="content" errors={formState.errors} />
        </div>

        {/* Draft (Switch) - Empieza desactivado por defecto en el nuevo torneo clonado */}
        {/* No es necesario un switch aquí si siempre se crea como no-draft */}
        {/* Si quisiéramos permitir marcarlo como draft al clonar, añadiríamos: */}
        {/*
         <div className="flex items-center space-x-2">
             <Switch id="draft" name="draft" />
             <Label htmlFor="draft">Guardar como Borrador</Label>
             <FieldError fieldName="draft" errors={formState.errors} />
         </div>
        */}

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/torneos">Cancelar</Link>
          </Button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
