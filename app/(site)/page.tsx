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
import { getRooms } from "@/lib/content-store";

// Rendered on the server with rooms from the DB; refreshed hourly and
// on-demand whenever the admin saves a room.
export const revalidate = 3600;

export default async function HomePage() {
  const rooms = await getRooms();
  return (
    <>
      <Hero />
      <QuickFacts />
      <About />
      <Rooms rooms={rooms} />
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
