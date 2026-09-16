import Image from "next/image";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

const contactItems = [
  {
    icon: <PhoneIcon size={21} />,
    title: "+54 381 255 0960",
    subtitle: "Línea del local",
    href: "tel:+543812550960",
  },
  {
    icon: <WhatsAppIcon size={21} />,
    title: "381 351 4449",
    subtitle: "WhatsApp mayorista",
    href: "https://wa.me/543813514449",
  },
  {
    icon: <PinIcon size={21} />,
    title: "Av. Colón 340",
    subtitle: "San Miguel de Tucumán",
    href: "https://www.google.com/maps/search/?api=1&query=Av.+Col%C3%B3n+340%2C+San+Miguel+de+Tucum%C3%A1n",
  },
  {
    icon: <ClockIcon size={21} />,
    title: "Lun–Sáb 09:00–13:30",
    subtitle: "18:00–21:30",
  },
];

export default function HamdanFooter() {
  return (
    <footer id="contacto" className="scroll-mt-40">
      <div className="contact-band border-y border-[#3b1d12]/20 py-8 text-[#fff4df]">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[1.15fr_repeat(4,1fr)]">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo.svg"
                alt="Fiambrería Hamdan"
                width={70}
                height={70}
                className="h-16 w-16 rounded-full border-2 border-[#f1ce7a]/30"
              />
              <div>
                <p className="font-display text-xl font-black">Fiambrería Hamdan</p>
                <p className="mt-1 text-xs leading-5 text-[#f3dbc3]/75">Tradición tucumana desde 1992.</p>
              </div>
            </div>

            {contactItems.map((item) => {
              const content = (
                <>
                  <span className="text-[#f2c65f]">{item.icon}</span>
                  <div>
                    <p className="text-sm font-extrabold">{item.title}</p>
                    <p className="mt-1 text-xs text-[#f3dbc3]/65">{item.subtitle}</p>
                  </div>
                </>
              );

              const className = "flex items-center gap-3 border-[#f4ddbe]/15 xl:border-l xl:pl-5 transition hover:text-white";

              return item.href ? (
                <a key={item.title} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className={className}>
                  {content}
                </a>
              ) : (
                <div key={item.title} className={className}>{content}</div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-[#f4ddbe]/15 pt-5 text-xs text-[#f3dbc3]/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Fiambrería Hamdan. Todos los derechos reservados.</p>
            <p className="handwritten text-base font-bold text-[#f4d171]">Buena comida, mejores momentos ♥</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
