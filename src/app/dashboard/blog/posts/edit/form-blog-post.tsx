/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { upsertBlogPostAction, BlogPostState } from "@/lib/actions/blogPosts";
import { slugify } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "@/components/ui/multi-select-dropdown";
import { UploadCloudIcon, PlusCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { formatISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Importaremos tipos cuando definamos las props
// import { BlogPost } from "../columns"; // Asumiendo que está definido
// import { BlogCategory } from "../../categorias/columns"; // Asumiendo que está definido
// import { BlogTag } from "../../tags/columns"; // Asumiendo que está definido
// Importar el formulario de categorías
import { BlogCategoryForm } from "../../categorias/edit/form-blog-category";
// Importar el formulario de tags
import { BlogTagForm } from "../../tags/edit/form-blog-tag";

// Placeholder para los tipos que vendrán como props
type Category = { id: string; name: string };
type Tag = { id: string; name: string };
type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  tags: string[]; // Array de IDs de tags asociados
  featured_image_url: string | null;
  status: "draft" | "published";
  published_at: Date | string | null;
};

interface BlogPostFormProps {
  post?: Post | null; // Post existente para edición
  categories: Category[]; // Lista inicial del servidor
  tags: Tag[]; // Lista de tags disponibles
  // Añadiremos más props si son necesarias (ej. API Key Cloudflare?)
}

const initialState: BlogPostState = { message: null, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando Post..." : "Guardar Post"}
    </Button>
  );
}

export function BlogPostForm({
  post,
  categories: initialCategories,
  tags: initialTags,
}: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useFormState(upsertBlogPostAction, initialState);

  // Estado local para campos complejos que no van directamente en FormData
  const [contentHtml, setContentHtml] = useState(post?.content || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags || []);
  const [imageUrl, setImageUrl] = useState<string | null>(
    post?.featured_image_url || null
  );
  // Estados para la subida de imagen
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Estado para la fecha de publicación
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(
    post?.published_at ? new Date(post.published_at) : undefined
  );
  // Estado para el diálogo de nueva categoría
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  // Estado para la lista de categorías manejada en cliente
  const [clientCategories, setClientCategories] =
    useState<Category[]>(initialCategories);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false); // Para feedback opcional
  // Estados para tags
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [clientTags, setClientTags] = useState<Tag[]>(initialTags);
  const [isFetchingTags, setIsFetchingTags] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast({
          title: "Error al guardar",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({ description: state.message });
        router.push("/dashboard/blog/posts"); // Redirigir al listado tras éxito
      }
    }
  }, [state, toast, router]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    const slugInput = event.target.form?.elements.namedItem(
      "slug"
    ) as HTMLInputElement | null;
    if (slugInput && !post?.id) {
      // Solo auto-slug en creación
      slugInput.value = slugify(name);
    }
  };

  // *** Funciones para subida de imagen (adaptadas de form-casino) ***
  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  }

  async function handleImageUpload() {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Asegúrate de que estas variables de entorno estén configuradas
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
      const accessToken = process.env.NEXT_PUBLIC_CDN_ACCESS_TOKEN;

      if (!uploadUrl || !accessToken) {
        toast({
          description: "Error: URL de subida o token no configurados.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const response = await fetch(
        `${uploadUrl}/upload`, // Usar la URL base
        {
          method: "POST",
          body: formData,
          headers: {
            "Access-Token": accessToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url); // Actualizar estado con la URL devuelta
        toast({ description: "Imagen subida con éxito." });
      } else {
        const errorData = await response.text();
        console.error("Error uploading file:", response.status, errorData);
        toast({
          description: `Error al subir: ${response.statusText} ${errorData}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Catch block error uploading file:", error);
      toast({
        description: `Error de red al subir: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }
  // *** Fin Funciones para subida de imagen ***

  // Función para obtener categorías desde la API
  const fetchClientCategories = async () => {
    setIsFetchingCategories(true);
    console.log("Fetching categories from API...");
    try {
      const response = await fetch("/api/blog/categories");
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data: Category[] = await response.json();
      setClientCategories(data);
      console.log("Categories updated:", data);
    } catch (error) {
      console.error("Failed to fetch client categories:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de categorías.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingCategories(false);
    }
  };

  // *** Función para obtener TAGS desde la API ***
  const fetchClientTags = async () => {
    setIsFetchingTags(true);
    console.log("Fetching tags from API...");
    try {
      const response = await fetch("/api/blog/tags"); // Usar endpoint de tags
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const data: Tag[] = await response.json();
      setClientTags(data); // Actualizar estado de tags
      console.log("Tags updated:", data);
    } catch (error) {
      console.error("Failed to fetch client tags:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de tags.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingTags(false);
    }
  };

  // Callback para cerrar diálogo y refrescar categorías
  const handleCategoryCreated = () => {
    setIsCategoryDialogOpen(false);
    fetchClientCategories(); // Llamar a la función de refresco
  };

  // *** Callback para TAGS ***
  const handleTagCreated = () => {
    setIsTagDialogOpen(false);
    fetchClientTags(); // Llamar a la función de refresco de tags
  };

  // Wrapper para loggear cambios en selectedTags
  const handleSetSelectedTags = (newTags: string[]) => {
    console.log("[BlogPostForm] handleSetSelectedTags called with:", newTags);
    setSelectedTags(newTags);
  };

  // Mapear tags para el nuevo componente (la estructura es la misma)
  const tagOptions: MultiSelectOption[] = clientTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  console.log("[BlogPostForm] Rendering with selectedTags:", selectedTags);

  return (
    <form action={dispatch} className="space-y-6">
      {/* Campos ocultos necesarios para la action */}
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      {/* Mantenemos input oculto para content, su valor se actualiza con el estado */}
      <input type="hidden" name="content" value={contentHtml} />
      {/* Para tags, necesitamos enviar cada tag seleccionado como una entrada separada */}
      {selectedTags.map((tagId) => (
        <input key={tagId} type="hidden" name="tags" value={tagId} />
      ))}
      <input type="hidden" name="featured_image_url" value={imageUrl || ""} />
      {/* Input oculto para enviar la fecha formateada (ISO 8601 o YYYY-MM-DD) */}
      <input
        type="hidden"
        name="published_at"
        value={publishedAt ? formatISO(publishedAt) : ""}
      />

      {/* --- Columna Principal (Título, Slug, Contenido) --- */}
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            defaultValue={post?.title ?? ""}
            required
            onChange={handleNameChange}
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-500">{state.errors.title}</p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            title="Solo minúsculas, números y guiones"
          />
          {state.errors?.slug && (
            <p className="mt-1 text-sm text-red-500">{state.errors.slug}</p>
          )}
        </div>

        {/* --- Integración Editor TipTap --- */}
        <div>
          <Label>Contenido</Label>
          <TiptapEditor
            content={contentHtml}
            onChange={setContentHtml}
            placeholder="Escribe aquí el contenido del post..."
          />
          {state.errors?.content && (
            <p className="mt-1 text-sm text-red-500">{state.errors.content}</p>
          )}
        </div>
      </div>

      {/* --- Columna Lateral (Metadatos, Relaciones) --- */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-4">Publicación</h3>
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select name="status" defaultValue={post?.status ?? "draft"} required>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecciona estado..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.status && (
            <p className="mt-1 text-sm text-red-500">{state.errors.status}</p>
          )}
        </div>
        {/* --- Integración DatePicker --- */}
        <div className="pt-2">
          <Label htmlFor="published_at_picker">
            Fecha Publicación (Opcional)
          </Label>
          <DatePicker
            date={publishedAt}
            onDateChange={setPublishedAt}
            className="mt-1"
            placeholder="Establecer fecha de publicación"
          />
          {/* El error vendrá de la validación del input oculto */}
          {state.errors?.published_at && (
            <p className="mt-1 text-sm text-red-500">
              {state.errors.published_at}
            </p>
          )}
        </div>

        <h3 className="text-lg font-medium mb-4 pt-4 border-t">Organización</h3>
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="category_id">
              Categoría {isFetchingCategories && "(Actualizando...)"}
            </Label>
            <Dialog
              open={isCategoryDialogOpen}
              onOpenChange={setIsCategoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Nueva
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>
                    Añade una nueva categoría que estará disponible
                    inmediatamente.
                  </DialogDescription>
                </DialogHeader>
                {/* --- Integrar FormBlogCategory --- */}
                <BlogCategoryForm onSuccess={handleCategoryCreated} />
              </DialogContent>
            </Dialog>
          </div>
          <Select name="category_id" defaultValue={post?.category_id ?? ""}>
            <SelectTrigger id="category_id">
              <SelectValue placeholder="Selecciona categoría..." />
            </SelectTrigger>
            <SelectContent>
              {clientCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.category_id && (
            <p className="mt-1 text-sm text-red-500">
              {state.errors.category_id}
            </p>
          )}
        </div>

        {/* --- Integración Selector de Tags (Dropdown) --- */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label>Tags {isFetchingTags && "(Actualizando...)"}</Label>
            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Nuevo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Tag</DialogTitle>
                  <DialogDescription>
                    Añade un nuevo tag que estará disponible inmediatamente.
                  </DialogDescription>
                </DialogHeader>
                {/* --- Integrar FormBlogTag --- */}
                <BlogTagForm onSuccess={handleTagCreated} />
              </DialogContent>
            </Dialog>
          </div>
          <MultiSelectDropdown
            options={tagOptions}
            selectedValues={selectedTags}
            onChange={handleSetSelectedTags}
            placeholder="Seleccionar tags..."
            label="Tags disponibles"
            className="mt-1"
          />
          {state.errors?.tags && (
            <p className="mt-1 text-sm text-red-500">{state.errors.tags}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 pt-4 border-t">
            Imagen Destacada
          </h3>
          {/* Input que muestra la URL (solo lectura) */}
          <Label htmlFor="featured_image_display">URL Imagen Destacada</Label>
          <Input
            id="featured_image_display"
            type="url"
            value={imageUrl || ""}
            readOnly
            className="mt-1 bg-muted"
            aria-describedby="featured_image_url-error"
          />
          {state.errors?.featured_image_url && (
            <p className="mt-1 text-sm text-red-500">
              {state.errors.featured_image_url}
            </p>
          )}
        </div>
        {/* Input para seleccionar archivo y botón para subir */}
        <div className="flex w-full items-center gap-2 pt-2">
          <Input
            id="file_upload"
            type="file"
            name="file_upload" // Este name no se envía con el form principal
            onChange={handleImageFileChange}
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={handleImageUpload}
            size="icon"
            variant="outline"
            className="h-9 w-9 flex-shrink-0"
            disabled={!file || uploading}
            aria-disabled={!file || uploading}
            title="Subir imagen seleccionada"
          >
            {uploading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
            ) : (
              <UploadCloudIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {/* Preview de la imagen */}
        {imageUrl && (
          <div className="mt-2">
            <Label>Vista Previa</Label>
            <img
              src={imageUrl}
              alt="Vista previa imagen destacada"
              className="mt-1 h-24 w-auto rounded border"
            />
          </div>
        )}
      </div>

      {/* Errores Generales DB */}
      {state.errors?.db && (
        <p className="mt-1 text-sm text-red-500">{state.errors.db}</p>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" asChild>
          <Link href="/dashboard/blog/posts">Cancelar</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
