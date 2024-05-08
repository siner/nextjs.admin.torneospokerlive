"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormUser({ user }: { user: any }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user ? user.name : "");
  const [surname, setSurname] = useState(user ? user.surname : "");
  const { toast } = useToast();
  const router = useRouter();

  function updateUser() {
    setLoading(true);
    if (!user) {
      supabase
        .from("user")
        .insert({
          name,
          surname,
        })
        .then(() => {
          setLoading(false);
          toast({ description: "Usuario creado" });
          router.push("/dashboard/usuarios");
        });
    } else {
      supabase
        .from("user")
        .update({
          name,
          surname,
        })
        .eq("id", user.id)
        .then(() => {
          setLoading(false);
          toast({ description: "Usuario actualizado" });
        });
    }
  }

  return (
    <>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            className="w-full"
            defaultValue={user ? user.email : ""}
            disabled
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            name="name"
            className="w-full"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="surname">Apellidos</Label>
          <Input
            id="name"
            type="text"
            name="surname"
            className="w-full"
            defaultValue={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button size="sm" onClick={() => updateUser()} disabled={loading}>
            {loading ? "Guardando ..." : "Guardar"}
          </Button>
          <Link href="/dashboard/usuarios">
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
