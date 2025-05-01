import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "../form-blog-post"; // Ajustar ruta
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCommentsDataTable } from "../../../comments/data-table";
import { commentColumns } from "../../../comments/columns";

interface EditBlogPostPageProps {
  params: {
    id: string; // UUID del post
  };
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: EditBlogPostPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title")
    .eq("id", params.id)
    .single();

  return {
    title: `Dashboard - Editar Post: ${post?.title ?? params.id}`,
  };
}

// Función para obtener TODOS los datos necesarios para el formulario y tabla de comentarios
async function fetchEditPageData(postId: string) {
  const supabase = createClient();

  // Usar Promise.all para obtener todo en paralelo
  const [postRes, categoriesRes, tagsRes, commentsRes] = await Promise.all([
    // 1. Post
    supabase
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        content,
        category_id,
        featured_image_url,
        status,
        published_at,
        blog_post_tags ( tag_id ) 
      `
      )
      .eq("id", postId)
      .single(),
    // 2. Categorías
    supabase.from("blog_categories").select("id, name").order("name"),
    // 3. Tags
    supabase.from("blog_tags").select("id, name").order("name"),
    // 4. Comentarios para este post
    supabase
      .from("blog_comments")
      .select(
        `
          id,
          content,
          created_at,
          post_id 
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false }),
  ]);

  // Manejo de errores
  if (postRes.error || !postRes.data) {
    console.error("Error fetching post for edit:", postRes.error);
    notFound(); // Post no encontrado, crucial
  }
  if (categoriesRes.error) {
    console.error(
      "Error fetching categories for edit form:",
      categoriesRes.error
    );
  }
  if (tagsRes.error) {
    console.error("Error fetching tags for edit form:", tagsRes.error);
  }
  if (commentsRes.error) {
    console.error("Error fetching comments for edit form:", commentsRes.error);
  }

  // Formatear datos del post
  const formattedPost = {
    ...postRes.data,
    tags: postRes.data.blog_post_tags.map(
      (pt: { tag_id: string }) => pt.tag_id
    ),
    published_at: postRes.data.published_at
      ? new Date(postRes.data.published_at)
      : null,
  };
  delete (formattedPost as any).blog_post_tags;

  // Formatear comentarios para que coincidan con el tipo BlogComment
  const formattedComments = (commentsRes.data || []).map((comment) => {
    return {
      ...comment,
    };
  });

  return {
    post: formattedPost,
    categories: categoriesRes.data || [],
    tags: tagsRes.data || [],
    comments: formattedComments, // Usar comentarios formateados
  };
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { post, categories, tags, comments } = await fetchEditPageData(
    params.id
  );

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      {" "}
      {/* Ampliado ancho */}
      <Button variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/blog/posts">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al listado de Posts
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Editar Post</h1>
      {/* Pasar todos los datos al formulario */}
      <BlogPostForm post={post} categories={categories} tags={tags} />
      {/* --- Sección de Comentarios --- */}
      <div className="mt-12 pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
        <BlogCommentsDataTable columns={commentColumns} data={comments} />
      </div>
    </div>
  );
}
