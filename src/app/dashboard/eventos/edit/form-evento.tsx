"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZodIssue } from "zod";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { upsertEventAction, EventActionState } from "@/lib/actions/events";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

type Evento = any;
type Casino = any;
type Circuito = any;
type Tour = any;

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} aria-disabled={pending}>
      {pending
        ? "Guardando..."
        : isEditing
        ? "Actualizar Evento"
        : "Crear Evento"}
    </Button>
  );
}

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

function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function FormEvento({
  evento,
  casinos,
  circuitos,
}: {
  evento?: Evento;
  casinos: Casino[];
  circuitos: Circuito[];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!evento?.id;
  const tours = circuitos;

  const initialState: EventActionState = {
    success: false,
    message: "",
    errors: null,
  };
  const [formState, formAction] = useFormState(upsertEventAction, initialState);

  const [name, setName] = useState(evento?.name ?? "");
  const [slug, setSlug] = useState(evento?.slug ?? "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: evento?.from ? new Date(evento.from) : undefined,
    to: evento?.to ? new Date(evento.to) : undefined,
  });
  const [draft, setDraft] = useState(evento?.draft ?? false);

  useEffect(() => {
    if (formState.message) {
      toast({
        description: formState.message,
        variant: formState.success ? undefined : "destructive",
      });
      if (formState.success && !isEditing) {
        router.push("/dashboard/eventos");
      }
    }
  }, [formState, toast, router, isEditing]);

  useEffect(() => {
    if (name && (!slug || !isEditing)) {
      setSlug(slugify(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <form action={formAction}>
      {isEditing && <input type="hidden" name="id" value={evento.id} />}

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={name}
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
            <Input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("slug"))
              }
              aria-describedby="slug-error"
            />
            <FieldError fieldName="slug" errors={formState.errors} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="casinoId">Casino</Label>
            <Select
              name="casinoId"
              defaultValue={String(evento?.casinoId ?? "")}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("casinoId"))
              }
              aria-describedby="casinoId-error"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona Casino" />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="tourId">Circuito</Label>
            <Select
              name="tourId"
              defaultValue={String(evento?.tourId ?? "")}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("tourId"))
              }
              aria-describedby="tourId-error"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona Circuito" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={String(tour.id)}>
                    {tour.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError fieldName="tourId" errors={formState.errors} />
          </div>
        </div>
        <div className="grid gap-3">
          <Label>Rango de Fechas</Label>
          <input
            type="hidden"
            name="from"
            value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
          />
          <input
            type="hidden"
            name="to"
            value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
          />
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="max-w-sm"
            aria-invalid={
              !!formState.errors?.find(
                (e) => e.path.includes("from") || e.path.includes("to")
              )
            }
            aria-describedby="date-range-error"
          />
          <FieldError fieldName="from" errors={formState.errors} />
          <FieldError fieldName="to" errors={formState.errors} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="draft"
            name="draft"
            checked={draft}
            onCheckedChange={setDraft}
            aria-label="Modo Borrador"
          />
          <Label htmlFor="draft">Guardar como Borrador</Label>
          <FieldError fieldName="draft" errors={formState.errors} />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/eventos">Cancelar</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </div>
      </div>
    </form>
  );
}
