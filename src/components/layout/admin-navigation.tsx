"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building,
  CalendarClock,
  CalendarDays,
  CircleUser,
  Home,
  Trophy,
} from "lucide-react";

export default function AdminNavigation() {
  const admin = usePathname().split("/")[1];
  const pathname = usePathname().split("/")[2];

  return (
    <>
      <Link
        href="/admin"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (!pathname ? "text-primary bg-gray-200" : "")
        }
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/admin/usuarios"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "usuarios" ? "text-primary bg-gray-200" : "")
        }
      >
        <CircleUser className="h-4 w-4" />
        Usuarios
      </Link>
      <Link
        href="/admin/casinos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "casinos" ? "text-primary bg-gray-200" : "")
        }
      >
        <Building className="h-4 w-4" />
        Casinos
      </Link>
      <Link
        href="/admin/circuitos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "circuitos" ? "text-primary bg-gray-200" : "")
        }
      >
        <Trophy className="h-4 w-4" />
        Circuitos
      </Link>
      <Link
        href="/admin/eventos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "eventos" ? "text-primary bg-gray-200" : "")
        }
      >
        <CalendarDays className="h-4 w-4" />
        Eventos
      </Link>
      <Link
        href="/admin/torneos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "torneos" ? "text-primary bg-gray-200" : "")
        }
      >
        <CalendarClock className="h-4 w-4" />
        Torneos
      </Link>
    </>
  );
}
