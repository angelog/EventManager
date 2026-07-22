import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { SessionProvider } from "@/components/providers/session-provider";
import { getServerSession } from "@/lib/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Manager",
  description: "Gerenciamento de eventos e participantes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const participant = await getServerSession();

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SessionProvider initialParticipant={participant}>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
