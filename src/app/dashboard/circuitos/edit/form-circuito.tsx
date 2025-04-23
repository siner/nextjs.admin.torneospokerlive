"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { upsertCircuitAction, ActionResult } from "@/lib/actions/circuits";
import { CircuitSchema } from "@/lib/schemas";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { RefreshCcw, UploadCloudIcon } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// --- Funciones Helper movidas fuera del componente ---

// Estado inicial para useFormState
const initialState: ActionResult<CircuitSchema> = {
  status: "idle",
  message: "",
};

// Componente para el botón de envío que muestra estado pendiente
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar"}
    </Button>
  );
}

// Helper para obtener errores de ZodIssue[]
function getFieldError(
  fieldName: string,
  errors?: z.ZodIssue[] | null
): string | undefined {
  if (!errors) return undefined;
  const fieldError = errors.find((err) => err.path.includes(fieldName));
  return fieldError?.message;
}

// --- Componente Principal ---

export default function FormCircuito({
  circuito,
}: {
  circuito?: CircuitSchema | null;
}) {
  const [state, formAction] = useFormState(upsertCircuitAction, initialState);
  const [logoUrl, setLogoUrl] = useState(circuito?.logoUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentSlug, setCurrentSlug] = useState(circuito?.slug ?? "");
  const [currentName, setCurrentName] = useState(circuito?.name ?? "");
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const toastShownRef = useRef(false);
  const router = useRouter();

  // Efecto para mostrar toasts basados en el estado de la acción
  useEffect(() => {
    // Solo mostrar toast si el estado es success o error y no se ha mostrado ya
    if (
      (state.status === "success" || state.status === "error") &&
      !toastShownRef.current
    ) {
      if (state.message) {
        // Asegurarse que hay un mensaje
        toast({
          description: state.message,
          variant: state.status === "error" ? "destructive" : undefined,
        });
        toastShownRef.current = true; // Marcar como mostrado
      }
      // Redirigir en caso de éxito después de un delay
      if (state.status === "success") {
        setTimeout(() => router.push("/dashboard/circuitos"), 1000);
      }
    }

    // Resetear ref si el estado vuelve a idle o cambia el mensaje (permitir nuevo toast)
    if (
      state.status === "idle" ||
      (toastShownRef.current &&
        (state.status === "success" || state.status === "error"))
    ) {
      // Podríamos resetearlo también si cambia el mensaje aunque el status sea el mismo
      // Esto permite mostrar mensajes de error consecutivos si el usuario intenta enviar de nuevo
      // Comentado por ahora para evitar toasts repetidos si la acción falla varias veces igual.
      // toastShownRef.current = false;
    }
    // Resetear explícitamente si vuelve a idle para la próxima interacción
    if (state.status === "idle") {
      toastShownRef.current = false;
    }
  }, [state, toast, router]);

  // Función para generar slug (actualiza estado local)
  function generateSlug() {
    if (currentName) {
      setCurrentSlug(
        currentName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
    }
  }

  // Función para manejar la subida del archivo
  async function handleUpload() {
    if (!file) {
      toast({
        description: "Selecciona un archivo primero.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_UPLOAD_URL + "/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            "Access-Token": `${process.env.NEXT_PUBLIC_CDN_ACCESS_TOKEN}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLogoUrl(data.url);
        toast({ description: "Logo subido correctamente." });
      } else {
        const errorData = await response.text();
        console.error("Error subiendo logo:", errorData);
        toast({
          description: "Error al subir el logo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en fetch de subida:", error);
      toast({
        description: "Error de red al subir el logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  const nameError = getFieldError("name", state.errors);
  const slugError = getFieldError("slug", state.errors);

  return (
    <form ref={formRef} action={formAction} className="grid gap-6">
      {circuito?.id && <Input type="hidden" name="id" value={circuito.id} />}
      <Input type="hidden" name="logoUrl" value={logoUrl} />

      <div className="grid gap-3">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          aria-describedby="name-error"
          className={nameError ? "border-red-500" : ""}
        />
        {nameError && (
          <p id="name-error" className="text-sm text-red-500">
            {nameError}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="slug">Slug</Label>
        <div className="relative">
          <Input
            id="slug"
            name="slug"
            value={currentSlug}
            onChange={(e) => setCurrentSlug(e.target.value)}
            aria-describedby="slug-error"
            className={`pr-10 ${slugError ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateSlug}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            title="Generar slug desde nombre"
          >
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        {slugError && (
          <p id="slug-error" className="text-sm text-red-500">
            {slugError}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="file">Logo</Label>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Logo actual"
            className="h-16 w-auto my-2 border p-1"
          />
        )}
        <div className="flex w-full items-center gap-1.5">
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={handleUpload}
            size="icon"
            variant="outline"
            disabled={uploading || !file}
            className="w-10 h-10 flex-shrink-0"
            title="Subir logo seleccionado"
          >
            {uploading ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloudIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Sube el logo aquí. El enlace se guardará automáticamente al guardar el
          circuito.
        </p>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <SubmitButton />
        <Link href="/dashboard/circuitos">
          <Button size="sm" variant="outline" type="button">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
