
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { Pricing } from "@/components/home/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
