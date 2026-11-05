import Link from "next/link";
import { getBrand, getRooms } from "@/lib/content-store";
import { siteConfig } from "@/lib/site-config";
import { priceNumber } from "@/lib/seo";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/**
 * Long-form copy block on the home page. Two jobs: answer what a first-time
 * visitor actually wants to know (where it is, what it costs, how far the
 * temple is), and give Google real text — plus internal links — to rank the
 * home page for "home stay in Nathdwara" and its variants.
 */
export async function SeoIntro() {
  const [brand, rooms] = await Promise.all([getBrand(), getRooms()]);
  // Quote the real lowest rate rather than a number baked into the copy.
  const fromRate = rooms.length
    ? rooms.reduce((min, r) =>
        Number(priceNumber(r.priceNight)) < Number(priceNumber(min.priceNight))
          ? r
          : min
      ).priceNight
    : null;

  return (
    <section className="heritage-wash relative isolate overflow-hidden bg-cream py-5 sm:py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-cream/75" aria-hidden="true" />
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Nathdwara, Rajasthan"
          title="A Home Stay in Nathdwara, Near Shrinathji Temple"
          highlight="Home Stay"
        />

        <div className="mx-auto mt-5 sm:mt-10 flex max-w-3xl flex-col gap-5 leading-relaxed text-ink/75">
          <Reveal>
            <p>
              {brand.name} is a family-run home stay in Nathdwara, the temple
              town in Rajasthan&apos;s Rajsamand district that draws lakhs of
              devotees to Shrinathji every year. We are on {" "}
              {siteConfig.address.street}, about 1.2 km from the temple — an{" "}
              <strong className="font-semibold text-ink">
                {brand.templeWalkTime}
              </strong>
              . For guests that means walking to Mangla darshan before sunrise
              instead of hunting for an auto, and coming back to rest between
              darshan slots.
            </p>
          </Reveal>

          <Reveal>
            <p>
              We keep seven rooms, each named after Shri Krishna and Radha
              Rani. Three are air-conditioned —{" "}
              <Link
                href="/rooms/radha-rani"
                className="font-medium text-emerald underline underline-offset-4"
              >
                Radha Rani
              </Link>{" "}
              for groups of five,{" "}
              <Link
                href="/rooms/makhan-chor"
                className="font-medium text-emerald underline underline-offset-4"
              >
                Makhan Chor
              </Link>{" "}
              for four and{" "}
              <Link
                href="/rooms/bal-gopal"
                className="font-medium text-emerald underline underline-offset-4"
              >
                Bal Gopal
              </Link>{" "}
              for families with a child — and four non-AC rooms for three to
              four guests. Every room has an attached bathroom with geyser, 24x7
              hot and cold water, free WiFi, mineral water and complimentary
              tea, coffee and milk. Parking is private and on-site, and we can
              arrange a taxi for Haldighati, Eklingji, Kumbhalgarh or Udaipur.
            </p>
          </Reveal>

          <Reveal>
            <p>
              {fromRate ? `Rates start at ${fromRate} a night. ` : ""}Booking
              direct — over a{" "}
              <Link
                href="/contact"
                className="font-medium text-emerald underline underline-offset-4"
              >
                call or WhatsApp
              </Link>{" "}
              or through our{" "}
              <Link
                href="/booking"
                className="font-medium text-emerald underline underline-offset-4"
              >
                online booking form
              </Link>{" "}
              — usually costs less than the travel sites, because there is no
              commission in between. Check-in is from {siteConfig.checkInTime}{" "}
              and check-out is by {siteConfig.checkOutTime}.
            </p>
          </Reveal>

          <Reveal>
            <p>
              First visit to Nathdwara? Our{" "}
              <Link
                href="/nathdwara-guide"
                className="font-medium text-emerald underline underline-offset-4"
              >
                Nathdwara travel guide
              </Link>{" "}
              covers Shrinathji darshan timings, how to reach by air, train and
              road, the best months to visit and the places worth seeing nearby.
              If you are specifically comparing options close to the temple, the{" "}
              <Link
                href="/stay-near-shrinathji-temple"
                className="font-medium text-emerald underline underline-offset-4"
              >
                stay near Shrinathji Temple
              </Link>{" "}
              page has distances, rates and what is included.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
