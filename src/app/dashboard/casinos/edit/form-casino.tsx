"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZodIssue } from "zod";
import { UploadCloudIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { upsertCasinoAction, CasinoActionState } from "@/lib/actions/casinos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Casino = any;

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} aria-disabled={pending}>
      {pending
        ? "Guardando..."
        : isEditing
        ? "Actualizar Casino"
        : "Crear Casino"}
    </Button>
  );
}

function FieldError({
  fieldName,
  errors,
}: {
  fieldName: string;
  errors?: ZodIssue[] | null;
}) {
  const error = errors?.find((e) => e.path.includes(fieldName));
  if (!error) return null;
  return (
    <p className="text-sm font-medium text-destructive">{error.message}</p>
  );
}

function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function FormCasino({ casino }: { casino?: Casino }) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!casino?.id;

  const initialState: CasinoActionState = {
    success: false,
    message: "",
    errors: null,
  };
  const [formState, formAction] = useFormState(
    upsertCasinoAction,
    initialState
  );

  const [name, setName] = useState(casino?.name ?? "");
  const [slug, setSlug] = useState(casino?.slug ?? "");
  const [logo, setLogo] = useState(casino?.logo ?? "");
  const [color, setColor] = useState(casino?.color ?? "");
  const [content, setContent] = useState(casino?.content ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (formState.message) {
      toast({
        description: formState.message,
        variant: formState.success ? undefined : "destructive",
      });
      if (formState.success && !isEditing) {
        router.push("/dashboard/casinos");
      }
    }
  }, [formState, toast, router, isEditing]);

  useEffect(() => {
    if (name && (!slug || !isEditing)) {
      setSlug(slugify(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
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
        toast({ description: "Logo subido con éxito." });
      } else {
        const errorData = await response.text();
        console.error("Error uploading file:", response.status, errorData);
        toast({
          description: `Error al subir: ${response.statusText} ${errorData}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Catch block error uploading file:", error);
      toast({
        description: `Error de red al subir: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction}>
      {isEditing && <input type="hidden" name="id" value={casino.id} />}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={
              !!formState.errors?.find((e) => e.path.includes("name"))
            }
            aria-describedby="name-error"
          />
          <FieldError fieldName="name" errors={formState.errors} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="slug">Slug (Auto-generado)</Label>
          <div className="relative">
            <Input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("slug"))
              }
              aria-describedby="slug-error"
            />
          </div>
          <FieldError fieldName="slug" errors={formState.errors} />
        </div>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              value={logo}
              readOnly
              onChange={(e) => setLogo(e.target.value)}
              aria-invalid={
                !!formState.errors?.find((e) => e.path.includes("logo"))
              }
              aria-describedby="logo-error"
            />
            <FieldError fieldName="logo" errors={formState.errors} />
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5">
            <Input
              id="file"
              type="file"
              name="file_upload"
              onChange={handleChange}
            />
            <Button
              type="button"
              onClick={handleUpload}
              size="sm"
              variant="outline"
              className="w-10"
              disabled={!file || uploading}
              aria-disabled={!file || uploading}
            >
              {uploading ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <UploadCloudIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="color">Color (Hex: #rrggbb)</Label>
          <Input
            id="color"
            name="color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-invalid={
              !!formState.errors?.find((e) => e.path.includes("color"))
            }
            aria-describedby="color-error"
          />
          <FieldError fieldName="color" errors={formState.errors} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32"
            aria-invalid={
              !!formState.errors?.find((e) => e.path.includes("content"))
            }
            aria-describedby="content-error"
          />
          <FieldError fieldName="content" errors={formState.errors} />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/casinos">Cancelar</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </div>
      </div>
    </form>
  );
}
