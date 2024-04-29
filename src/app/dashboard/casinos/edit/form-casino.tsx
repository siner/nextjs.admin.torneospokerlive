"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

import Link from "next/link";
import { useState } from "react";
import { RefreshCcw, Search, UploadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormCasino({ casino }: { casino: any }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(casino ? casino.name : "");
  const [slug, setSlug] = useState(casino ? casino.slug : "");
  const [logo, setLogo] = useState(casino ? casino.logo : "");
  const [color, setColor] = useState(casino ? casino.color : "");
  const [content, setContent] = useState(casino ? casino.content : "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function generateSlug() {
    if (name) {
      setSlug(name.toLowerCase().replace(/ /g, "-"));
    }
  }

  function handleChange(event: any) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  function handleUpload() {
    uploadFile();
  }

  async function uploadFile() {
    const formData = new FormData();
    if (!file) return;
    formData.append("image", file);
    const response = await fetch(
      process.env.NEXT_PUBLIC_UPLOAD_URL + "/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          "Access-Token": `${process.env.NEXT_PUBLIC_CDN_ACCESS_TOKEN}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setLogo(data.url);
    } else {
      toast({ description: "Error al subir la imagen" });
    }
  }

  function updateCasino() {
    if (!name || !slug || !logo || !color || !content) {
      toast({ description: "Todos los campos son requeridos" });
      setError(true);
      return;
    }
    setLoading(true);
    if (!casino) {
      supabase
        .from("Casino")
        .insert({
          name,
          slug,
          logo,
          color,
          content,
        })
        .then(() => {
          setLoading(false);
          toast({ description: "Casino creado" });
          router.push("/admin/casinos");
        });
    } else {
      supabase
        .from("Casino")
        .update({
          name,
          slug,
          logo,
          color,
          content,
        })
        .eq("id", casino.id)
        .then(() => {
          setLoading(false);
          toast({ description: "Casino actualizado" });
        });
    }
  }

  return (
    <>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            name="name"
            className={"w-full " + (error && !name ? "border-red-500" : "")}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="slug">Slug</Label>

          <div className="relative">
            <RefreshCcw
              onClick={() => generateSlug()}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              id="slug"
              type="text"
              name="slug"
              className="w-full"
              defaultValue={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              type="text"
              name="logo"
              className="w-full"
              defaultValue={logo}
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <Input id="file" type="file" name="file" onChange={handleChange} />
            <Button
              onClick={handleUpload}
              size="sm"
              variant="outline"
              className="w-10"
            >
              <UploadCloudIcon />
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="text"
            name="color"
            className="w-full"
            defaultValue={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button size="sm" onClick={() => updateCasino()} disabled={loading}>
            {loading ? "Guardando ..." : "Guardar"}
          </Button>
          <Link href="/admin/casinos">
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
