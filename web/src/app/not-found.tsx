"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui";

export default function NotFound() {
  const router = useRouter();
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="text-2xl font-bold text-text">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-text-muted">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Button className="mt-2" onClick={() => router.replace("/events")}>
        Voltar para eventos
      </Button>
    </Container>
  );
}
