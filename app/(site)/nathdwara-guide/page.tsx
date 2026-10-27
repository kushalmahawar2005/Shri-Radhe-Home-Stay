import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Plane, TrainFront, Bus, Sun } from "lucide-react";
import { getContact, getBrand } from "@/lib/content-store";
import { attractions } from "@/lib/site-config";
import { absoluteUrl, breadcrumbSchema, faqSchema, SITE_URL } from "@/lib/seo";
import { Schema } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/decor";
import { BLUR_DATA_URL } from "@/lib/utils";

export const revalidate = 3600;

const TITLE = "Nathdwara Guide — Darshan Timings & How to Reach";
const DESCRIPTION =
  "A practical guide to Nathdwara: Shrinathji darshan timings, how to reach by air, train and road, the best time to visit, places to see nearby and where to stay near the temple.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Nathdwara travel guide",
    "Shrinathji darshan timing",
    "Nathdwara temple timings",
    "how to reach Nathdwara",
    "Nathdwara to Udaipur distance",
    "best time to visit Nathdwara",
    "Nathdwara trip plan",
    "places to visit in Nathdwara",
  ],
  alternates: { canonical: "/nathdwara-guide/" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/nathdwara-guide"),
    images: [{ url: "/images/temple.jpg", alt: "Nathdwara temple town, Rajasthan" }],
  },
};

/**
 * The eight daily darshans of Shrinathji. Timings shift with the season and
 * with festivals, so the page says so plainly rather than pretending these
 * are fixed — guests should always confirm on the day.
 */
const DARSHAN = [
  { name: "Mangla", time: "Early morning, around 5:30 – 6:15 AM", note: "The first darshan of the day" },
  { name: "Shringar", time: "Around 7:15 – 8:00 AM", note: "Shrinathji adorned for the day" },
  { name: "Gwal", time: "Around 9:15 – 9:30 AM", note: "Short darshan" },
  { name: "Rajbhog", time: "Around 11:15 AM – 12:15 PM", note: "The main midday darshan" },
  { name: "Uthapan", time: "Around 3:45 – 4:15 PM", note: "After the afternoon rest" },
  { name: "Bhog", time: "Around 4:45 – 5:00 PM", note: "Short darshan" },
  { name: "Aarti", time: "Around 5:15 – 6:00 PM", note: "Evening aarti" },
  { name: "Shayan", time: "Around 6:30 – 7:00 PM", note: "The final darshan of the day" },
];

const ROUTES = [
  {
    icon: Plane,
    mode: "By air",
    body: "Maharana Pratap Airport, Udaipur (UDR) is the nearest airport, roughly 65 km away — about 1 hour 30 minutes by taxi. It has direct flights from Delhi, Mumbai, Ahmedabad, Bengaluru and Hyderabad.",
  },
  {
    icon: TrainFront,
    mode: "By train",
    body: "Nathdwara has its own railway station a short drive from the temple town. Mavli Junction (about 30 km) and Udaipur City station (about 48 km) are the other common railheads, both with taxis and buses onward to Nathdwara.",
  },
  {
    icon: Bus,
    mode: "By road",
    body: "Nathdwara sits just off NH-48 on the Udaipur–Ajmer highway. It is about 48 km from Udaipur (1 hour), 105 km from Ajmer, 165 km from Jodhpur and roughly 285 km from Jaipur. RSRTC and private buses run through the day.",
  },
];

const SEASONS = [
  {
    season: "October – March",
    verdict: "Best time to visit",
    body: "Pleasant days between 10°C and 27°C — ideal for walking to darshan and for day trips to Kumbhalgarh and Haldighati. This is also festival season, so book your room well in advance.",
  },
  {
    season: "July – September",
    verdict: "Green and quiet",
    body: "The monsoon turns the Aravalli hills green and crowds thin out. Expect occasional heavy rain; carry an umbrella for the walk to the temple.",
  },
  {
    season: "April – June",
    verdict: "Hot but least crowded",
    body: "Daytime temperatures cross 38°C. Plan Mangla and evening darshans, rest in an AC room through the afternoon, and keep sightseeing for early morning.",
  },
];

const FESTIVALS = [
  "Janmashtami — the biggest celebration of the year at Shrinathji",
  "Annakut / Govardhan Puja — a mountain of food offered to the deity, days after Diwali",
  "Holi and Phag Mahotsav — weeks of colour and bhajans through Phalgun",
  "Sharad Purnima, Diwali and Nutan Varsh — full temple town celebrations",
];

const PAGE_FAQS = [
  {
    q: "What are the Shrinathji darshan timings in Nathdwara?",
    a: "Shrinathji has eight darshans a day — Mangla, Shringar, Gwal, Rajbhog, Uthapan, Bhog, Aarti and Shayan — starting around 5:30 AM and ending around 7:00 PM. The exact slots change with the season and during festivals, so always confirm the timing for the day of your visit.",
  },
  {
    q: "How do I reach Nathdwara?",
    a: "The nearest airport is Udaipur (about 65 km, 1.5 hours by taxi). Nathdwara has its own railway station, with Mavli Junction (30 km) and Udaipur City (48 km) as alternatives. By road, Nathdwara is on NH-48, about 48 km from Udaipur and 285 km from Jaipur.",
  },
  {
    q: "How far is Nathdwara from Udaipur?",
    a: "Nathdwara is about 48 km from Udaipur — roughly an hour by car on NH-48. Many travellers do Udaipur as a day trip from Nathdwara, or stop at Nathdwara on the way to Kumbhalgarh.",
  },
  {
    q: "What is the best time to visit Nathdwara?",
    a: "October to March has the most pleasant weather and the biggest festivals. April to June is hot but far less crowded, and the monsoon months are green and quiet.",
  },
  {
    q: "How many days are enough for Nathdwara?",
    a: "One night is enough for darshan itself. Two nights lets you attend Mangla darshan, see the Statue of Belief, and fit in Haldighati, Eklingji or Kumbhalgarh Fort without rushing.",
  },
  {
    q: "Where should I stay in Nathdwara?",
    a: "Staying inside the temple town, within walking distance of Shrinathji Temple, saves you a taxi for every darshan — especially the pre-dawn Mangla darshan. Shri Radha Villa Stay is an 8 minute walk from the temple with AC rooms, attached bathrooms and free parking.",
  },
];

export default async function NathdwaraGuidePage() {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    image: `${SITE_URL}/images/temple.jpg`,
    inLanguage: "en-IN",
    mainEntityOfPage: absoluteUrl("/nathdwara-guide"),
    author: { "@type": "Organization", name: brand.name, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: {
      "@type": "Place",
      name: "Nathdwara",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nathdwara",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <Schema data={articleSchema} />
      <Schema data={faqSchema(PAGE_FAQS)} />
      <Schema
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Nathdwara Travel Guide", path: "/nathdwara-guide" },
        ])}
      />

      {/* ── hero ── */}
      <section className="bg-cream-gradient py-14 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>Travel Guide</Eyebrow>
            <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
              <span className="text-emerald">Nathdwara</span> Travel Guide
            </h1>
            <p className="font-serif text-xl italic text-gold-dark">
              Darshan timings, how to reach, what to see and where to stay.
            </p>
            <p className="max-w-xl leading-relaxed text-ink/75">
              Nathdwara, in Rajasthan&apos;s Rajsamand district, is home to
              Shrinathji — a seven-year-old form of Lord Krishna, brought here
              from Vrindavan in the 17th century. It is one of the most visited
              Vaishnav pilgrimage towns in India, and it is small enough to see
              on foot. Here is everything a first-time visitor needs.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/temple.jpg"
                alt="Nathdwara temple town in Rajasthan"
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

      {/* ── darshan timings ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Shrinathji Temple"
            title="Darshan Timings"
            highlight="Darshan"
            subtitle="Shrinathji is not open all day. The deity is shown in eight short darshans, and the temple closes in between — so plan your day around these slots."
          />

          <div className="mx-auto mt-10 max-w-3xl overflow-x-auto rounded-2xl border border-gold/30 bg-cream-light shadow-card">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">
                The eight daily darshans of Shrinathji at Nathdwara with
                approximate timings
              </caption>
              <thead className="bg-emerald text-cream-light">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Darshan
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Approximate time
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {DARSHAN.map((d, i) => (
                  <tr key={d.name} className={i % 2 ? "bg-cream/50" : undefined}>
                    <th scope="row" className="px-5 py-3 font-medium text-ink">
                      {d.name}
                    </th>
                    <td className="px-5 py-3 text-ink/70">{d.time}</td>
                    <td className="px-5 py-3 text-ink/70">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-ink/55">
            Timings shift with the season and during festivals, and each darshan
            can last only a few minutes. Staying with us? Ask us the night
            before and we will tell you the exact slots for the next morning.
          </p>
        </div>
      </section>

      {/* ── how to reach ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Getting There"
            title="How to Reach Nathdwara"
            highlight="Reach"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ROUTES.map((r) => (
              <Reveal
                key={r.mode}
                className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft"
              >
                <r.icon className="h-7 w-7 text-emerald" />
                <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
                  {r.mode}
                </h3>
                <p className="mt-2 leading-relaxed text-ink/70">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── best time to visit ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="When to Go"
            title="Best Time to Visit Nathdwara"
            highlight="Best"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SEASONS.map((s) => (
              <Reveal
                key={s.season}
                className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft"
              >
                <Sun className="h-7 w-7 text-gold-dark" />
                <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
                  {s.season}
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald">
                  {s.verdict}
                </p>
                <p className="mt-2 leading-relaxed text-ink/70">{s.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-soft">
            <h3 className="font-serif text-xl font-semibold text-ink">
              Festivals worth planning around
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-ink/70">
              {FESTIVALS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── places to visit ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Sightseeing"
            title="Places to Visit In and Around Nathdwara"
            highlight="Visit"
            subtitle="Everything below is an easy half-day or day trip from the temple town."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attractions.map((a) => (
              <Reveal
                key={a.name}
                className="flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-cream-light shadow-card"
              >
                <figure className="relative aspect-[4/3]">
                  <Image
                    src={a.image}
                    alt={a.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </figure>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {a.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-dark">
                    {a.byCar} · {a.byBike} by road
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {a.blurb}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/attractions"
              className="font-medium text-emerald underline underline-offset-4 hover:text-gold-dark"
            >
              See all nearby attractions with travel times →
            </Link>
          </p>
        </div>
      </section>

      {/* ── where to stay ── */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 shadow-card">
              <Image
                src="/images/room-deluxe.jpg"
                alt={`AC room at ${brand.name}, a home stay near Shrinathji Temple in Nathdwara`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </figure>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-4">
            <Eyebrow>Where to Stay</Eyebrow>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              Stay Within Walking Distance of the Temple
            </h2>
            <p className="leading-relaxed text-ink/75">
              Because darshan happens in short slots from before dawn to early
              evening, where you stay decides how much of the day you spend in
              transport. {brand.name} is an 8 minute walk from Shrinathji
              Temple — AC rooms with attached bathrooms, 24x7 hot water, free
              WiFi, free parking and a family that will help you plan darshan,
              taxis and sightseeing.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/stay-near-shrinathji-temple">
                  See Our Stay Near the Temple
                </Link>
              </Button>
              <Button asChild variant="gold" size="lg">
                <a
                  href={contact.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-cream-alt py-14 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Common Questions"
            title="Nathdwara Trip FAQs"
            highlight="FAQs"
          />
          <FaqAccordion faqs={PAGE_FAQS} />
        </div>
      </section>
    </>
  );
}
