import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HamdanHeader from "@/components/HamdanHeader";
import HamdanFooter from "@/components/HamdanFooter";
import Checkout from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Revisar pedido",
  description:
    "Completá tus datos, revisá tu carrito y prepará tu pedido para WhatsApp.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (mode !== "mayorista" && mode !== "minorista") notFound();
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />
      <Checkout key={mode} mode={mode} />
      <HamdanFooter />
    </main>
  );
}
