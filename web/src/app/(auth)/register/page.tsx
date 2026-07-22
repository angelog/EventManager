"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "@/components/layout/container";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { getApiErrorMessage, internalApi } from "@/lib/api";
import { type RegisterFormValues, registerSchema } from "@/lib/schemas/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const setParticipant = useAuthStore((state) => state.setParticipant);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      const { data } = await internalApi.post("/api/auth/register", values);
      setParticipant(data.participant);
      router.push("/events");
      router.refresh();
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Não foi possível criar a conta."),
      );
    }
  }

  return (
    <Container className="flex flex-1 items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-text">Criar conta</h1>
        <p className="mb-6 text-sm text-text-muted">
          Cadastre-se para participar dos eventos.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {formError && <Alert>{formError}</Alert>}

          <Field label="Nome" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="João Silva"
              invalid={!!errors.name}
              {...register("name")}
            />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="voce@email.com"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>

          <Field label="Telefone" htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              placeholder="41999999999"
              invalid={!!errors.phone}
              {...register("phone")}
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
              placeholder="mínimo 6 caracteres"
              invalid={!!errors.password}
              {...register("password")}
            />
          </Field>

          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="text-brand-light hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </Container>
  );
}
