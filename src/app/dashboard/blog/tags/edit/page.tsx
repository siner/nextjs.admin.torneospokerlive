import { BlogTagForm } from "./form-blog-tag";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard - Nuevo Tag Blog",
};

export default function NewBlogTagPage() {
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/blog/tags">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al listado
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Nuevo Tag</h1>
      <BlogTagForm />
    </div>
  );
}
