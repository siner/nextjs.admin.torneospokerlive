import { createClient } from "@/lib/supabase/server";
import { BlogTagForm } from "../form-blog-tag"; // Ruta correcta desde [id]
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipado para los parámetros
interface EditBlogTagPageProps {
  params: {
    id: string;
  };
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: EditBlogTagPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: tag } = await supabase
    .from("blog_tags") // Tabla correcta
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: `Dashboard - Editar Tag: ${tag?.name ?? params.id}`,
  };
}

// Fetch datos del tag
async function fetchTag(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_tags") // Tabla correcta
    .select("id, name, slug")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching tag for edit:", error);
    notFound();
  }
  return data;
}

export default async function EditBlogTagPage({
  params,
}: EditBlogTagPageProps) {
  const tagData = await fetchTag(params.id);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/blog/tags">
          {" "}
          {/* Enlace correcto */}
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Editar Tag</h1>
      <BlogTagForm tag={tagData} /> {/* Pasar datos al form */}
    </div>
  );
}
