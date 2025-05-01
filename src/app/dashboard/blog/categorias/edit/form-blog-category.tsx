"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BlogCategory } from "../columns"; // Ajustar ruta si es necesario
import {
  upsertBlogCategoryAction,
  BlogCategoryState,
} from "@/lib/actions/blogCategories";
import { slugify } from "@/lib/utils"; // Asumiendo que tienes una función slugify

interface BlogCategoryFormProps {
  category?: BlogCategory | null; // Categoría existente para edición
  onSuccess?: () => void; // Callback para cuando se guarda con éxito
}

const initialState: BlogCategoryState = { message: null, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar Categoría"}
    </Button>
  );
}

export function BlogCategoryForm({
  category,
  onSuccess,
}: BlogCategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useFormState(
    upsertBlogCategoryAction,
    initialState
  );

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
    if (slugInput && !category) {
      // Solo auto-rellenar slug en creación
      slugInput.value = slugify(name);
    }
  };

  return (
    <form action={dispatch} className="space-y-6">
      {/* Campo oculto para ID en modo edición */}
      {category?.id && <input type="hidden" name="id" value={category.id} />}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name ?? ""}
          required
          aria-describedby="name-error"
          onChange={handleNameChange} // Auto-generar slug
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
          defaultValue={category?.slug ?? ""}
          required
          aria-describedby="slug-error"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" // Añadir patrón para validación básica en cliente
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
        {/* Podríamos añadir un botón de cerrar diálogo aquí si fuera necesario */}
        {/* <DialogClose asChild>
           <Button variant="outline">Cancelar</Button>
         </DialogClose> */}
        <SubmitButton />
      </div>
    </form>
  );
}
