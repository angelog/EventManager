"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/ui";

interface SearchBarProps {
  initialValue?: string;
}

// Busca por nome (requisito do PDF). Atualiza a URL (?search=), o que dispara
// a re-renderização da listagem no servidor. Sempre volta para a página 1.
export function SearchBar({ initialValue = "" }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    router.push(`/events${params.size ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        placeholder="Buscar eventos por nome..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Buscar eventos"
      />
      <Button type="submit" variant="secondary">
        Buscar
      </Button>
    </form>
  );
}
