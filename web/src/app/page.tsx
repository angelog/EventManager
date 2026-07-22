import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">

      <h1 className="text-2xl font-bold text-text">Página Inicial</h1>

      <Button className="mt-2">
        Botão
      </Button>
    </Container>
  );
}
