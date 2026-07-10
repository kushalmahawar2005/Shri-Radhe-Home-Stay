import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CheckCircle2,
  Mail,
  PhoneCall,
  ClipboardCheck,
  ShieldCheck,
  MessageCircle,
  Home,
} from "lucide-react";
import { getBrand, getContact } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { BookingSummary } from "@/components/booking-summary";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Booking Received",
  description:
    "Thank you! Your booking request at Shri Radha Home Stay has been received. Our team will contact you shortly to confirm your stay.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/booking/success" },
};

const steps = [
  {
    icon: PhoneCall,
    title: "We Will Call You",
    desc: "Our team will call you to confirm your stay details.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    desc: "You can also message us directly on WhatsApp anytime.",
  },
  {
    icon: ClipboardCheck,
    title: "Booking Under Review",
    desc: "Your booking is being reviewed and will be confirmed shortly.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Your information is safe and secure with us at every step.",
  },
];

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { paymentStatus?: string };
}) {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  const paid = searchParams?.paymentStatus === "paid";
  return (
    <>
      <section className="bg-cream-gradient py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10">
            <CheckCircle2 className="h-12 w-12 text-emerald" />
          </span>
          <h1 className="mt-6 font-serif text-4xl font-bold text-ink sm:text-5xl">
            Thank You!
          </h1>
          <p className="mt-3 font-serif text-xl italic text-gold-dark">
            {paid
              ? "Your Booking Is Confirmed"
              : "Your Booking Request Has Been Received"}
          </p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/70">
            We truly appreciate you choosing {brand.name}.{" "}
            {paid
              ? "Your advance payment is received and our team will call you shortly with your stay details."
              : "Our team will contact you shortly to confirm your stay."}
          </p>
        </div>
      </section>

      {/* next steps */}
      <section className="bg-cream py-12 md:py-16">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gold/30 bg-cream-light p-6 text-center shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10">
                  <s.icon className="h-6 w-6 text-emerald" />
                </span>
                <h3 className="font-serif text-base font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink/60">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* summary */}
          <div className="mx-auto mt-10 max-w-3xl">
            <h2 className="mb-4 font-serif text-2xl font-bold text-ink">
              Booking Summary
            </h2>
            <Suspense fallback={<div className="h-40" />}>
              <BookingSummary />
            </Suspense>
          </div>
        </div>
      </section>

      {/* assistance + back home */}
      <section className="bg-cream-alt py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-gold/30 bg-cream-light px-8 py-7 text-center shadow-card md:flex-row md:text-left">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Need Immediate Assistance?
              </h2>
              <p className="mt-1 text-ink/70">
                Call or WhatsApp us anytime — we&apos;re here to help.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="primary" size="sm">
                <a href={contact.phones.telPrimary}>
                  <PhoneCall className="h-4 w-4" /> Call Now
                </a>
              </Button>
              <Button asChild variant="gold" size="sm">
                <a
                  href={contact.links.whatsappPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
