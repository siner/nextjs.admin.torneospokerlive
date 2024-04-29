"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname().split("/")[1];

  return (
    <>
      <Link
        href="/circuitos"
        className={
          "transition-colors hover:text-foreground" +
          (pathname === "circuitos"
            ? " text-foreground"
            : " text-muted-foreground")
        }
      >
        Circuitos
      </Link>
      <Link
        href="/eventos"
        className={
          "transition-colors hover:text-foreground" +
          (pathname === "eventos"
            ? " text-foreground"
            : " text-muted-foreground")
        }
      >
        Eventos
      </Link>
      <Link
        href="/torneos"
        className={
          "transition-colors hover:text-foreground" +
          (pathname === "torneos"
            ? " text-foreground"
            : " text-muted-foreground")
        }
      >
        Torneos
      </Link>
      <Link
        href="/casinos"
        className={
          "transition-colors hover:text-foreground" +
          (pathname === "casinos"
            ? " text-foreground"
            : " text-muted-foreground")
        }
      >
        Casinos
      </Link>
    </>
  );
}
