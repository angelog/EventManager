"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { internalApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import { Container } from "./container";

export function Header() {
  const router = useRouter();
  const participant = useAuthStore((state) => state.participant);
  const clear = useAuthStore((state) => state.clear);

  async function handleLogout() {
    await internalApi.delete("/api/session");
    clear();
    router.push("/events");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/events" className="text-lg font-bold text-text">
          Event<span className="text-brand">Manager</span>
        </Link>

        {participant ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-text-body hover:text-text"
            >
              {participant.name}
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Criar conta</Button>
            </Link>
          </div>
        )}
      </Container>
    </header>
  );
}
