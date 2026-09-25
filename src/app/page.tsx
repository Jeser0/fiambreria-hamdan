import HamdanFooter from "@/components/HamdanFooter";
import HamdanHeader from "@/components/HamdanHeader";
import HamdanHero from "@/components/HamdanHero";
import OrderExperience from "@/components/OrderExperience";
import ScrollReveal from "@/components/ScrollReveal";
import SectionGateways from "@/components/SectionGateways";
import ProductShowcase from "@/components/ProductShowcase";
import ShoppingJourney from "@/components/ShoppingJourney";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />
      <HamdanHero />
      <ScrollReveal><SectionGateways /></ScrollReveal>
      <ScrollReveal><ProductShowcase /></ScrollReveal>
      <ScrollReveal><ShoppingJourney /></ScrollReveal>
      <ScrollReveal><OrderExperience /></ScrollReveal>
      <HamdanFooter />
    </main>
  );
}
