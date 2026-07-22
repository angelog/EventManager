import { Container } from "@/components/layout/container";

// Skeleton exibido enquanto o detalhe do evento carrega (Suspense).
export default function Loading() {
  return (
    <Container className="flex flex-col gap-6 py-10">
      <div className="h-4 w-40 animate-pulse rounded bg-elevated" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface lg:col-span-2" />
        <div className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
      </div>
    </Container>
  );
}
