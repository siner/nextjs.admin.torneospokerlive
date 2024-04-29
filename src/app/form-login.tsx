"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const urlSuccess = searchParams.get("success");
  const urlFail = searchParams.get("error");
  const urlAllowed = searchParams.get("allowed");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(urlFail ? true : false);
  const [success, setSuccess] = useState(urlSuccess ? true : false);
  const [allowed, setAllowed] = useState(
    urlAllowed && urlAllowed === "false" ? false : true
  );
  const [logged, setLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (logged) {
      router.push("/dashboard");
      return;
    }
  }, [logged, router]);

  useEffect(() => {
    if (!allowed) {
      logout();
      router.refresh();
    }
  }, [allowed, router]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  async function emailLogin() {
    const supabase = createClient();

    if (!email || !password) {
      setFail(true);
      return;
    }

    const user = {
      email: email as string,
      password: password as string,
    };

    const { data, error } = await supabase.auth.signInWithPassword(user);

    if (!data?.user) {
      setFail(true);
    }

    setLogged(true);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {fail && (
          <div className="text-red-500 text-sm">Credenciales incorrectas</div>
        )}
        {!allowed && (
          <div className="text-red-500 text-sm">
            No tienes permisos para acceder a esta página
          </div>
        )}
        <Button onClick={emailLogin} type="submit" className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
}
