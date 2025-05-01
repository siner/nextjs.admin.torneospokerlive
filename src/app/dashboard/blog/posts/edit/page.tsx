import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "./form-blog-post";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard - Nuevo Post Blog",
};

// Función para obtener categorías y tags
async function fetchFormData() {
  const supabase = createClient();
  const [categoriesRes, tagsRes] = await Promise.all([
    supabase.from("blog_categories").select("id, name").order("name"),
    supabase.from("blog_tags").select("id, name").order("name"),
  ]);

  if (categoriesRes.error) {
    console.error("Error fetching categories for form:", categoriesRes.error);
  }
  if (tagsRes.error) {
    console.error("Error fetching tags for form:", tagsRes.error);
  }

  return {
    categories: categoriesRes.data || [],
    tags: tagsRes.data || [],
  };
}

export default async function NewBlogPostPage() {
  const { categories, tags } = await fetchFormData();

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
      <h1 className="text-2xl font-bold mb-6">Nuevo Post</h1>
      <BlogPostForm categories={categories} tags={tags} />{" "}
      {/* Pasar categorías y tags */}
    </div>
  );
}
