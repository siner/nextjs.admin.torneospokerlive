import { createClient } from "@/lib/supabase/server";
import { BlogTagDataTable } from "./data-table"; // Importar el DataTable correcto
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Tags Blog", // Título adecuado
};

// Revalidar datos
export const revalidate = 3600;

async function fetchBlogTags() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_tags") // Tabla correcta
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching blog tags:", error);
    return [];
  }
  return data;
}

export default async function BlogTagsPage() {
  const tagsData = await fetchBlogTags();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestión de Tags del Blog</h1>
      {/* @ts-ignore // Temporalmente ignorar si hay mismatch */}
      <BlogTagDataTable columns={columns} data={tagsData} />
    </div>
  );
}
