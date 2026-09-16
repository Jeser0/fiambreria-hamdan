import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="paper-surface flex min-h-screen items-center justify-center px-5 py-16 text-[#382a22]">
      <div className="w-full max-w-2xl rounded-[2rem] border border-[#8f1f23]/12 bg-white/80 p-8 text-center shadow-[0_18px_40px_rgba(84,48,30,0.08)] sm:p-12">
        <Image src="/brand/hamdini.svg" alt="Hamdini" width={180} height={180} className="mx-auto h-40 w-40 object-contain" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#b27624]">Error 404</p>
        <h1 className="font-display mt-2 text-4xl font-black text-[#7c171c]">Esta página no está en la picada</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#6e5a4f]">El enlace que abriste no existe o cambió de lugar. Podés volver al inicio o entrar directamente al catálogo mayorista.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-[#8f1f23] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#76191d]">Volver al inicio</Link>
          <Link href="/mayorista" className="rounded-xl border border-[#8f1f23]/20 bg-[#fffaf2] px-5 py-3 text-sm font-black text-[#7f2023] transition hover:-translate-y-0.5 hover:bg-white">Ver mayorista</Link>
        </div>
      </div>
    </main>
  );
}
