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
  Newspaper,
  Tags,
  FileText,
} from "lucide-react";

export default function AdminNavigation() {
  const admin = usePathname().split("/")[1];
  const pathname = usePathname().split("/")[2];

  return (
    <>
      <Link
        href="/dashboard"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (!pathname ? "text-primary bg-gray-200" : "")
        }
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/usuarios"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "usuarios" ? "text-primary bg-gray-200" : "")
        }
      >
        <CircleUser className="h-4 w-4" />
        Usuarios
      </Link>
      <Link
        href="/dashboard/casinos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "casinos" ? "text-primary bg-gray-200" : "")
        }
      >
        <Building className="h-4 w-4" />
        Casinos
      </Link>
      <Link
        href="/dashboard/circuitos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "circuitos" ? "text-primary bg-gray-200" : "")
        }
      >
        <Trophy className="h-4 w-4" />
        Circuitos
      </Link>
      <Link
        href="/dashboard/eventos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "eventos" ? "text-primary bg-gray-200" : "")
        }
      >
        <CalendarDays className="h-4 w-4" />
        Eventos
      </Link>
      <Link
        href="/dashboard/torneos"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "torneos" ? "text-primary bg-gray-200" : "")
        }
      >
        <CalendarClock className="h-4 w-4" />
        Torneos
      </Link>
      {/* Enlaces Blog */}
      <Link
        href="/dashboard/blog/categorias"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "blog/categorias" || pathname === "blog"
            ? "text-primary bg-gray-200"
            : "") // Activo si está en blog o blog/categorias
        }
      >
        <Newspaper className="h-4 w-4" /> {/* Icono Blog */}
        Categorías
      </Link>
      <Link
        href="/dashboard/blog/tags"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "blog/tags" ? "text-primary bg-gray-200" : "")
        }
      >
        {/* Podríamos añadir un icono específico para tags o reusar Newspaper con indentación */}
        <Tags className="h-4 w-4" /> {/* Icono Tags */}
        Tags
      </Link>
      <Link
        href="/dashboard/blog/posts"
        className={
          "flex items-center gap-3 px-3 py-2 text-muted-foreground transition-all hover:text-primary " +
          (pathname === "blog/posts" ? "text-primary bg-gray-200" : "")
        }
      >
        {/* <span className="ml-7"></span> Indentación simple */}
        <FileText className="h-4 w-4" /> {/* Icono Posts */}
        Posts
      </Link>
    </>
  );
}
