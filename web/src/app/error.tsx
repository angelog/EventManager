"use client";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui";

export default function ErrorBoundary({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-text">Algo deu errado</h1>
      <p className="max-w-sm text-sm text-text-muted">
        Ocorreu um erro ao carregar esta página. Tente novamente.
      </p>
      <Button onClick={() => unstable_retry()}>Tentar novamente</Button>
    </Container>
  );
}
