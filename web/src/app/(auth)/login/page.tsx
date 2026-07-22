"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "@/components/layout/container";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { getApiErrorMessage, internalApi } from "@/lib/api";
import { type LoginFormValues, loginSchema } from "@/lib/schemas/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setParticipant = useAuthStore((state) => state.setParticipant);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      const { data } = await internalApi.post("/api/session", values);
      setParticipant(data.participant);
      router.push(searchParams.get("from") ?? "/events");
      router.refresh();
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Não foi possível entrar."));
    }
  }

  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-text">Entrar</h1>
        <p className="mb-6 text-sm text-text-muted">
          Acesse para criar eventos e se inscrever.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {formError && <Alert>{formError}</Alert>}

          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="voce@email.com"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>

          <Field
            label="Senha"
            htmlFor="password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              invalid={!!errors.password}
              {...register("password")}
            />
          </Field>

          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Não tem conta?{" "}
          <Link href="/register" className="text-brand-light hover:underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </Container>
  );
}
