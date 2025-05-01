import { createClient } from "@/lib/supabase/server";
import { BlogCategoryDataTable } from "./data-table";
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Categorías Blog",
};

// Revalidar datos cada hora (o según necesidad)
export const revalidate = 3600;

async function fetchBlogCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug") // Seleccionar solo las columnas necesarias
    .order("name", { ascending: true }); // Ordenar por nombre

  if (error) {
    console.error("Error fetching blog categories:", error);
    // Podrías lanzar el error o retornar un array vacío con un mensaje
    return [];
  }
  return data;
}

export default async function BlogCategoriesPage() {
  const categoriesData = await fetchBlogCategories();

  // Podríamos añadir un tipo más específico si fuera necesario, pero BlogCategory de columns debería servir
  // const categories: BlogCategory[] = categoriesData;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Gestión de Categorías del Blog
      </h1>
      {/* @ts-ignore // Temporalmente ignorar si hay un mismatch sutil de tipos entre fetch y tabla */}
      <BlogCategoryDataTable columns={columns} data={categoriesData} />
    </div>
  );
}
