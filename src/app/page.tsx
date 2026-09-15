import HamdanFooter from "@/components/HamdanFooter";
import HamdanHeader from "@/components/HamdanHeader";
import HamdanHero from "@/components/HamdanHero";
import OrderExperience from "@/components/OrderExperience";
import SectionGateways from "@/components/SectionGateways";
import ShoppingJourney from "@/components/ShoppingJourney";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#382a22]">
      <HamdanHeader />
      <HamdanHero />
      <SectionGateways />
      <ShoppingJourney />
      <OrderExperience />
      <HamdanFooter />
    </main>
  );
}
