"use client";

import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";

  return (
    <form
      className="hidden md:block ml-auto flex-1 sm:flex-initial"
      action="/buscar"
      method="GET"
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          name="q"
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          defaultValue={search}
        />
      </div>
    </form>
  );
}
