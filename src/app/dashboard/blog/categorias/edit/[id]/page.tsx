import { createClient } from "@/lib/supabase/server";
import { BlogCategoryForm } from "../form-blog-category";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipado para los parámetros de la página
interface EditBlogCategoryPageProps {
  params: {
    id: string; // El ID viene de la URL
  };
}

// Función para generar metadata dinámica
export async function generateMetadata({
  params,
}: EditBlogCategoryPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("blog_categories")
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: `Dashboard - Editar Categoría: ${category?.name ?? params.id}`,
  };
}

// Función para obtener los datos de la categoría a editar
async function fetchCategory(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug") // Seleccionar campos necesarios para el form
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching category for edit:", error);
    notFound(); // Mostrar página 404 si no se encuentra o hay error
  }
  return data;
}

export default async function EditBlogCategoryPage({
  params,
}: EditBlogCategoryPageProps) {
  const categoryData = await fetchCategory(params.id);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/blog/categorias">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
      <BlogCategoryForm category={categoryData} />{" "}
      {/* Pasar datos al formulario */}
    </div>
  );
}
