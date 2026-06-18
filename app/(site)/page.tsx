import { Hero } from "@/components/hero";
import { QuickFacts } from "@/components/quick-facts";
import { About } from "@/components/about";
import { Rooms } from "@/components/rooms";
import { GreenBand } from "@/components/green-band";
import { DivineEnergy } from "@/components/divine-energy";
import { Facilities } from "@/components/facilities";
import { Nearby } from "@/components/nearby";
import { Testimonials } from "@/components/testimonials";
import { FindUs } from "@/components/find-us";
import { CtaBand } from "@/components/cta-band";

// Fully static — no server runtime required.
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickFacts />
      <About />
      <Rooms />
      <GreenBand />
      <DivineEnergy />

      {/* Facilities · Nearby Attractions · Guest reviews — three-column row */}
      <section className="bg-cream-alt py-16 md:py-24">
        <div className="container grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3 lg:items-start">
          <Facilities compact />
          <Nearby compact />
          <Testimonials compact />
        </div>
      </section>

      <FindUs />
      <CtaBand />
    </>
  );
}
