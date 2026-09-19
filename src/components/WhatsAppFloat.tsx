import { WhatsAppIcon } from "./Icons";
import { whatsappUrl } from "@/data/business";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("Hola Hamdan, quisiera hacer una consulta.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar a Fiambrería Hamdan por WhatsApp"
      className="whatsapp-float fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-[#15975d]/35 bg-[#eef9f3]/95 px-4 py-3 text-sm font-black text-[#0b7145] shadow-[0_12px_28px_rgba(20,112,69,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_32px_rgba(20,112,69,0.24)]"
    >
      <WhatsAppIcon size={21} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
