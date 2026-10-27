import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Footprints,
  MessageCircle,
  Phone,
  Check,
  Clock,
  MapPin,
  IndianRupee,
} from "lucide-react";
import {
  getRooms,
  getBrand,
  getContact,
  type RoomView,
} from "@/lib/content-store";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, breadcrumbSchema, faqSchema, priceNumber } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

const TITLE = "Stay Near Shrinathji Temple, Nathdwara — 8 Minute Walk";
const DESCRIPTION =
  "Looking for a stay near Shrinathji Temple in Nathdwara? Shri Radha Villa Stay is an 8 minute walk from the temple — clean AC rooms with attached bathrooms, 24x7 hot water, free WiFi and free parking. Book direct on call or WhatsApp for the best rate.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "stay near Shrinathji Temple",
    "hotels near Shrinathji Temple Nathdwara",
    "home stay near Nathdwara temple",
    "rooms near Shrinathji Mandir",
    "accommodation near Shrinathji Temple",
    "Shrinathji mandir ke pass hotel",
    "walking distance hotel Nathdwara",
  ],
  alternates: { canonical: "/stay-near-shrinathji-temple/" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/stay-near-shrinathji-temple"),
    images: [{ url: "/images/building.jpg", alt: "Shri Radha Villa Stay, Nathdwara" }],
  },
};

/** Why guests specifically want to be within walking distance of the temple. */
const WALKING_BENEFITS = [
  {
    icon: Clock,
    title: "Mangla darshan without a taxi",
    body: "The first darshan of the day starts before sunrise. From here you simply walk — no waiting for an auto at 5 AM, no parking hunt near the temple.",
  },
  {
    icon: Footprints,
    title: "Come back and rest between darshans",
    body: "Shrinathji opens for darshan in short slots through the day. Being 8 minutes away means you can return to your room, freshen up and go again.",
  },
  {
    icon: MapPin,
    title: "Easy for elders and children",
    body: "The route to the temple is flat and busy with other devotees. Families travelling with elderly parents or small children manage it comfortably.",
  },
  {
    icon: IndianRupee,
    title: "No daily travel cost",
    body: "Guests staying on the highway spend ₹200–400 a day on autos. Staying inside the temple town removes that cost entirely.",
  },
];

/** Approximate walking distances from the property. */
const DISTANCES = [
  { place: "Shrinathji Temple (main gate)", distance: "1.2 km", time: "8 min walk" },
  { place: "Nathdwara main bazaar", distance: "900 m", time: "6 min walk" },
  { place: "Nathdwara bus stand", distance: "2 km", time: "5 min drive" },
  { place: "Statue of Belief (Vishwas Swaroopam)", distance: "4.5 km", time: "10 min drive" },
  { place: "Nathdwara railway station", distance: "~7 km", time: "15 min drive" },
  { place: "Udaipur (Maharana Pratap) Airport", distance: "~65 km", time: "1 hr 30 min drive" },
];

/**
 * FAQs are built from live room data so the prices quoted here can never
 * drift away from what the admin panel actually charges.
 */
function buildFaqs(rooms: RoomView[]) {
  const rates = rooms.map((r) => `${r.name} ${r.priceNight}`).join(", ");
  return [
  {
    q: "How far is Shri Radha Villa Stay from Shrinathji Temple?",
    a: "We are about 1.2 km from the Shrinathji Temple — an easy 8 minute walk through the temple town. Most guests walk to every darshan rather than taking an auto.",
  },
  {
    q: "Can I walk to the temple for Mangla darshan early in the morning?",
    a: "Yes. Mangla darshan is the earliest of the day and the walk takes about 8 minutes. The route stays busy with other devotees at that hour, so it is comfortable for families too.",
  },
  {
    q: "Is parking available if I drive to Nathdwara?",
    a: "Yes, we have safe on-site parking for cars and two-wheelers at no extra cost. You can park once and walk to the temple, which avoids the congestion near the temple gates.",
  },
  {
    q: "What does a room near Shrinathji Temple cost here?",
    a: `Current per-night rates are: ${rates}. Booking directly on WhatsApp usually gets you a better rate than online travel sites, because there is no commission in between.`,
  },
  {
    q: "Do you help arrange darshan and local sightseeing?",
    a: "Yes. We can guide you on current darshan timings, arrange a taxi for Haldighati, Kumbhalgarh, Eklingji or Udaipur, and help you plan the day around temple opening slots.",
  },
  {
    q: "Is this a hotel or a home stay?",
    a: "It is a family-run villa stay — the comfort and privacy of a hotel room with the personal care of a home stay. The owners live on the property and look after guests personally.",
  },
  ];
}

export default async function StayNearTemplePage() {
  const [rooms, brand, contact] = await Promise.all([
    getRooms(),
    getBrand(),
    getContact(),
  ]);
  const pageFaqs = buildFaqs(rooms);
  const cheapest = rooms.reduce(
    (min, r) => (Number(priceNumber(r.priceNight)) < Number(priceNumber(min.priceNight)) ? r : min),
    rooms[0]
  );

  return (
    <>
      <Schema data={faqSchema(pageFaqs)} />
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          {
            name: "Stay Near Shrinathji Temple",
            path: "/stay-near-shrinathji-temple",
          },
        ])}
      />

      {/* ── hero ── */}
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>Nathdwara, Rajasthan</Eyebrow>
            <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Stay Near <span className="text-emerald">Shrinathji Temple</span>{" "}
              — an 8 Minute Walk Away
            </h1>
            <p className="max-w-xl leading-relaxed text-ink/75">
              {brand.name} is a family-run home stay inside Nathdwara temple
              town, about 1.2 km from the Shrinathji Temple. Clean AC rooms with
              attached bathrooms, 24x7 hot water, free WiFi and free parking —
              so you can walk to every darshan instead of arranging transport.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="primary" size="lg">
                <Link href="/booking">Check Availability</Link>
              </Button>
              <Button asChild variant="gold" size="lg">
                <a
                  href={contact.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp for Best Price
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/building.jpg"
                alt={`${brand.name} — home stay an 8 minute walk from Shrinathji Temple, Nathdwara`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── why walking distance matters ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Why Location Matters"
            title="Why Devotees Choose a Stay Within Walking Distance"
            highlight="Walking"
            subtitle="Nathdwara is a temple town, and the difference between staying inside it and staying on the highway shows up on every single darshan."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WALKING_BENEFITS.map((b) => (
              <Reveal
                key={b.title}
                className="flex gap-4 rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft"
              >
                <b.icon className="mt-1 h-6 w-6 shrink-0 text-emerald" />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── distance table ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Distances"
            title="How Far Is Everything From Us?"
            highlight="Far"
          />

          <div className="mx-auto mt-10 max-w-3xl overflow-x-auto rounded-2xl border border-gold/30 bg-cream-light shadow-card">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <caption className="sr-only">
                Distances and travel times from {brand.name} to Shrinathji
                Temple and other landmarks in and around Nathdwara
              </caption>
              <thead className="bg-emerald text-cream-light">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Place
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Distance
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Travel time
                  </th>
                </tr>
              </thead>
              <tbody>
                {DISTANCES.map((d, i) => (
                  <tr
                    key={d.place}
                    className={i % 2 ? "bg-cream/50" : undefined}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3 font-medium text-ink"
                    >
                      {d.place}
                    </th>
                    <td className="px-5 py-3 text-ink/70">{d.distance}</td>
                    <td className="px-5 py-3 text-ink/70">{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-ink/55">
            Distances are approximate and measured from {siteConfig.address.full}
            . Message us and we will send the exact Google Maps pin.
          </p>
        </div>
      </section>

      {/* ── rooms ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Rooms & Rates"
            title="Rooms Near Shrinathji Temple"
            highlight="Rooms"
            subtitle={`Every room is air-conditioned with an attached bathroom, 24x7 hot water, free WiFi, LED TV and daily housekeeping. Rates start at ${cheapest.priceNight} a night.`}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rooms.map((room) => (
              <Reveal
                key={room.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream-light shadow-card"
              >
                <figure className="relative aspect-[4/3]">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </figure>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    {room.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-dark">
                    {room.guests} · {room.bed} · {room.size}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {room.blurb}
                  </p>
                  <p className="mt-4 font-serif text-2xl font-bold text-emerald">
                    {room.priceNight}
                    <span className="text-sm font-normal text-ink/60">
                      {" "}
                      / night
                    </span>
                  </p>
                  <Button asChild variant="primary" size="sm" className="mt-4">
                    <Link href={`/rooms/${room.slug}`}>View Room Details</Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── what's included ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Included"
            title="What Every Booking Includes"
            highlight="Every"
          />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {siteConfig.facilities.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 rounded-xl border border-gold/30 bg-cream-light px-4 py-3 text-ink/80 shadow-soft"
              >
                <Check className="h-5 w-5 shrink-0 text-emerald" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Good to Know"
            title="Questions About Staying Near the Temple"
            highlight="Questions"
          />
          <FaqAccordion faqs={pageFaqs} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-emerald py-14 text-center md:py-16">
        <div className="container">
          <h2 className="font-serif text-3xl font-bold text-cream-light sm:text-4xl">
            Book Your Stay Near Shrinathji Temple
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Rooms fill up fast around festivals, Annakut and weekends. Call or
            WhatsApp us for today&apos;s availability and the best direct rate.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <a href={contact.phones.telPrimary}>
                <Phone className="h-4 w-4" /> {contact.phones.primary}
              </a>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <a
                href={contact.links.whatsappPrimary}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
