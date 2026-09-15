import Image from "next/image";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

const contactItems = [
  { icon: <PhoneIcon size={21} />, title: "+54 381 255 0960", subtitle: "Línea del local" },
  { icon: <WhatsAppIcon size={21} />, title: "381 351 4449", subtitle: "WhatsApp mayorista" },
  { icon: <PinIcon size={21} />, title: "Av. Colón 340", subtitle: "San Miguel de Tucumán" },
  { icon: <ClockIcon size={21} />, title: "Lun–Sáb 09:00–13:30", subtitle: "18:00–21:30" },
];

export default function HamdanFooter() {
  return (
    <footer id="contacto" className="scroll-mt-40">
      <div className="contact-band border-y border-[#3b1d12]/20 py-7 text-[#fff4df]">
        <div className="mx-auto grid max-w-[1500px] gap-5 px-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-[1.15fr_repeat(4,1fr)_1.1fr] lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.svg" alt="Fiambrería Hamdan" width={70} height={70} className="h-16 w-16 rounded-full border-2 border-[#f1ce7a]/30" />
            <div>
              <p className="font-display text-xl font-black">Fiambrería Hamdan</p>
              <p className="mt-1 text-xs leading-5 text-[#f3dbc3]/75">Fiambres, quesos y mucho más para tu mesa desde 1992.</p>
            </div>
          </div>

          {contactItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3 border-[#f4ddbe]/15 xl:border-l xl:pl-5">
              <span className="text-[#f2c65f]">{item.icon}</span>
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="mt-1 text-xs text-[#f3dbc3]/65">{item.subtitle}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-start xl:justify-end">
            <p className="handwritten rotate-[-3deg] text-xl font-bold text-[#f4d171]">Buena comida,<br />mejores momentos ♥</p>
          </div>
        </div>
      </div>

      <div className="bg-[#3a2118] py-7 text-[#f5e5d3]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-lg font-black">Fiambrería Hamdan</p>
            <p className="mt-1 text-xs text-[#d4bca6]">Más que una fiambrería, una historia de familia.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#dcc8b6]">
            <a href="#inicio" className="hover:text-white">Inicio</a>
            <a href="#historia" className="hover:text-white">Quiénes somos</a>
            <a href="#secciones" className="hover:text-white">Secciones</a>
            <a href="#mayorista" className="hover:text-white">Mayorista</a>
            <a href="#como-pedir" className="hover:text-white">Cómo pedir</a>
            <a href="#contacto" className="hover:text-white">Contacto</a>
          </nav>
          <p className="text-xs text-[#af9988]">© 2026 Fiambrería Hamdan</p>
        </div>
      </div>
    </footer>
  );
}
