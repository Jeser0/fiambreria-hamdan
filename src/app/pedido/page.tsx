import { redirect } from "next/navigation";

// Preserve the legacy wholesale order URL.
export default function PedidoPage() {
  redirect("/pedido/mayorista");
}
