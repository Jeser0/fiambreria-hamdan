import HamdanHeader from "@/components/HamdanHeader";
import HamdanHero from "@/components/HamdanHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />
      <HamdanHero />

      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-[#8e1e24]/20 bg-white/60 p-10 text-center text-[#8f796a]">
          Próximas secciones del sitio
        </div>
      </section>
    </main>
  );
}
