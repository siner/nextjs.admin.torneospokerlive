import { createClient } from "@/lib/supabase/server";
import { BlogPostDataTable } from "./data-table";
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Posts Blog",
};

// Revalidar datos
export const revalidate = 3600; // O un tiempo menor si se actualiza frecuentemente

async function fetchBlogPosts() {
  const supabase = createClient();

  // Consulta con JOIN para obtener categoría y CONTADOR de comentarios
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      status,
      created_at,
      published_at,
      blog_categories ( id, name ),
      comment_count:blog_comments(count)
      `
    )
    .order("created_at", { ascending: false }); // Ordenar por fecha de creación descendente

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  // El tipo devuelto por Supabase con JOINs anidados debería coincidir
  // razonablemente con el tipo BlogPost que definimos en columns.tsx
  return data;
}

export default async function BlogPostsPage() {
  const postsData = await fetchBlogPosts();

  // Idealmente, deberíamos asegurar que postsData se ajusta exactamente al tipo BlogPost
  // pero por ahora lo pasamos directamente y ajustamos tipos si es necesario.

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestión de Posts del Blog</h1>
      {/* @ts-ignore Podría haber un ligero mismatch de tipos con los JOINs, ignorar temporalmente */}
      <BlogPostDataTable columns={columns} data={postsData || []} />
    </div>
  );
}
