import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin panel",
};

import * as React from "react";
import {
  Building,
  CalendarClock,
  CalendarDays,
  CircleUser,
  Home,
  Menu,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminNavigation from "@/components/layout/admin-navigation";
import Link from "next/link";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  const user = await supabase
    .from("user")
    .select("role, id")
    .eq("id", data.user.id);

  if (user.error || user.data.length === 0) {
    redirect("/error");
  }
  if (user.data[0].role !== "admin") {
    redirect("/");
  }
  return (
    <div className="grid w-full md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block pb-10">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <nav className="grid items-start text-sm font-medium lg:px-4 mt-6">
              <AdminNavigation />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="md:hidden flex h-14 items-center gap-4 border-b md:px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="mt-8 text-lg font-medium flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/admin/usuarios"
                    className="flex items-center gap-2"
                  >
                    <CircleUser className="h-4 w-4" />
                    Usuarios
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/admin/casinos"
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Casinos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/admin/circuitos"
                    className="flex items-center gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    Circuitos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/admin/eventos"
                    className="flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Eventos
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/admin/torneos"
                    className="flex items-center gap-2"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Torneos
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 md:p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
