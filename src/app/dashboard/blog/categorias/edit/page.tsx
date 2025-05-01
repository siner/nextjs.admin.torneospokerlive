import { BlogCategoryForm } from "./form-blog-category";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard - Nueva Categoría Blog",
};

export default function NewBlogCategoryPage() {
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/blog/categorias">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Nueva Categoría</h1>
      <BlogCategoryForm /> {/* Renderizar el formulario sin datos iniciales */}
    </div>
  );
}
