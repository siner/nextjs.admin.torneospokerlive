"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export type MultiSelectOption = {
  value: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "Selecciona tags...",
  label = "Tags",
  className,
}: MultiSelectDropdownProps) {
  const [filter, setFilter] = React.useState("");

  const handleCheckedChange = (value: string, checked: boolean) => {
    const newSelectedValues = checked
      ? [...selectedValues, value] // Add if checked
      : selectedValues.filter((v) => v !== value); // Remove if unchecked
    onChange(newSelectedValues);
  };

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    onChange(newSelectedValues);
  };

  // Find the full option objects for the selected values
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  // Filtrar opciones basadas en el input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={cn("space-y-2", className)}>
      {/* Mostrar badges de los seleccionados (opcional, igual que antes) */}
      <div className="flex gap-1 flex-wrap mb-2 min-h-[20px]">
        {selectedOptions.map((option) => (
          <Badge
            variant="secondary"
            key={option.value}
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(option.value);
            }}
          >
            {option.label}
            <X className="ml-1 h-3 w-3 cursor-pointer" />
          </Badge>
        ))}
        {selectedOptions.length === 0 && (
          <span className="text-xs text-muted-foreground italic">
            Ninguno seleccionado
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {/* Input para filtrar */}
          <div className="p-2">
            <Input
              placeholder="Buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-8"
            />
          </div>
          <DropdownMenuSeparator />
          {/* Mapear sobre filteredOptions */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(option.value, checked)
                  }
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            {/* Mensaje si el filtro no devuelve resultados */}
            {filteredOptions.length === 0 && filter !== "" && (
              <DropdownMenuLabel className="text-muted-foreground italic text-sm px-2 py-1.5">
                No se encontraron tags.
              </DropdownMenuLabel>
            )}
            {/* Mensaje si no hay opciones originales */}
            {options.length === 0 && (
              <DropdownMenuLabel className="text-muted-foreground italic text-sm px-2 py-1.5">
                No hay tags disponibles.
              </DropdownMenuLabel>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
