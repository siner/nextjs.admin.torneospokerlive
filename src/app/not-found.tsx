import { Button } from "@/components/ui/button";
import Link from "next/link";
export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="flex flex-col text-center justify-center">
      <h2 className="text-2xl font-bold py-4 mt-20">Página no encontrada</h2>
      <div className="text-center mt-4">
        <Link href="/">
          <Button>Volver a la página de inicio</Button>
        </Link>
      </div>
    </div>
  );
}
