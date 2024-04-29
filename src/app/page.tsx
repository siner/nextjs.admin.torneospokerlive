import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Login from "./form-login";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allowed = searchParams?.allowed === "false" ? false : true;
  const supabase = createClient();
  if (allowed) {
    const { data, error } = await supabase.auth.getUser();

    if (data.user) {
      const user = await supabase
        .from("user")
        .select("role, id")
        .eq("id", data.user.id);

      if (user.error || user.data.length === 0) {
        redirect("/error");
      }
      if (user.data[0].role === "admin") {
        redirect("/dashboard");
      }
    }
  } else {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Login />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
