"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BlogTag } from "../columns"; // Ajustar ruta si es necesario
import { upsertBlogTagAction, BlogTagState } from "@/lib/actions/blogTags";
import { slugify } from "@/lib/utils";

interface BlogTagFormProps {
  tag?: BlogTag | null; // Tag existente para edición
  onSuccess?: () => void; // Callback para cuando se guarda con éxito
}

const initialState: BlogTagState = { message: null, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar Tag"}
    </Button>
  );
}

export function BlogTagForm({ tag, onSuccess }: BlogTagFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useFormState(upsertBlogTagAction, initialState);

  // Mostrar toast y llamar onSuccess
  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast({
          title: "Error al guardar",
          description: state.message,
          variant: "destructive",
        });
      } else {
        // Éxito
        toast({ description: state.message });
        onSuccess?.(); // Llamar al callback si existe
      }
    }
  }, [state, toast, onSuccess]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    const slugInput = event.target.form?.elements.namedItem(
      "slug"
    ) as HTMLInputElement | null;
    if (slugInput && !tag) {
      // Solo auto-rellenar slug en creación
      slugInput.value = slugify(name);
    }
  };

  return (
    <form action={dispatch} className="space-y-6">
      {/* Campo oculto para ID en modo edición */}
      {tag?.id && <input type="hidden" name="id" value={tag.id} />}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={tag?.name ?? ""}
          required
          aria-describedby="name-error"
          onChange={handleNameChange}
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={tag?.slug ?? ""}
          required
          aria-describedby="slug-error"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          title="Solo minúsculas, números y guiones"
        />
        <div id="slug-error" aria-live="polite" aria-atomic="true">
          {state.errors?.slug &&
            state.errors.slug.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Mostrar errores generales de DB */}
      <div id="db-error" aria-live="polite" aria-atomic="true">
        {state.errors?.db &&
          state.errors.db.map((error: string) => (
            <p className="mt-1 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <div className="flex justify-end gap-4">
        <SubmitButton />
      </div>
    </form>
  );
}
