import { Container } from "@/components/layout/container";

// Skeleton exibido durante o carregamento da listagem (Suspense).
export default function Loading() {
  return (
    <Container className="flex flex-col gap-6 py-10">
      <div className="h-8 w-40 animate-pulse rounded bg-elevated" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-elevated" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton estático
            key={i}
            className="h-36 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    </Container>
  );
}
