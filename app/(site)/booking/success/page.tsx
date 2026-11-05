import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CheckCircle2,
  PhoneCall,
  ClipboardCheck,
  ShieldCheck,
  MessageCircle,
  Home,
} from "lucide-react";
import { getBrand, getContact } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { BookingSummary } from "@/components/booking-summary";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Booking Received",
  description:
    "Thank you! Your booking request at Shri Radha Villa Stay has been received. Our team will contact you shortly to confirm your stay.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/booking/success/" },
};

function nextSteps(paid: boolean) {
  return [
    paid
      ? {
          icon: ShieldCheck,
          title: "Room reserved for you",
          desc: "Your advance is received and the room is held for your dates.",
        }
      : {
          icon: ClipboardCheck,
          title: "We check your request",
          desc: "We confirm the room is free for your dates — usually within a few hours.",
        },
    {
      icon: PhoneCall,
      title: "We call you",
      desc: paid
        ? "Our family will call to share directions and your check-in details."
        : "We call or WhatsApp you to confirm the booking. No payment is needed now.",
    },
    {
      icon: MessageCircle,
      title: "Message us anytime",
      desc: "Questions about arrival, taxis or darshan timings? Just WhatsApp us.",
    },
  ];
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { paymentStatus?: string; review?: string };
}) {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  const paid = searchParams?.paymentStatus === "paid";
  const review = paid && searchParams?.review === "1";
  const steps = nextSteps(paid);
  return (
    <>
      <section className="bg-cream-gradient pb-8 pt-5 sm:pt-12 md:pb-10 md:pt-16">
        <div className="container max-w-3xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
            <CheckCircle2 className="h-10 w-10 text-emerald" />
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold text-ink sm:text-5xl">
            {review ? "Payment Received" : paid ? "Booking Confirmed!" : "Request Received!"}
          </h1>
          <p
            className={
              paid
                ? "mx-auto mt-3 inline-flex rounded-full bg-emerald/10 px-3 py-1 text-sm font-semibold text-emerald"
                : "mx-auto mt-3 inline-flex rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold-dark"
            }
          >
            {paid ? `₹${siteConfig.advanceAmount} advance paid` : "Awaiting confirmation · pay at the villa"}
          </p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/70">
            Thank you for choosing {brand.name}.{" "}
            {review
              ? "Your payment is safe with us, but someone booked these dates a moment before you. We'll call you right away to offer another room or a full refund."
              : paid
                ? "Your room is reserved — we'll call you shortly with your stay details."
                : "We'll call or WhatsApp you shortly to confirm your stay."}
          </p>
        </div>
      </section>

      <section className="bg-cream pb-12 md:pb-16">
        <div className="container grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-ink">Booking Summary</h2>
            <Suspense fallback={<div className="h-64 rounded-2xl border border-gold/30 bg-cream-light" />}>
              <BookingSummary />
            </Suspense>
            <p className="mt-3 text-xs text-ink/55">
              Keep your booking ID handy — share it when you call or WhatsApp us.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-ink">What happens next</h2>
            <ol className="flex flex-col gap-3">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="flex gap-3 rounded-2xl border border-gold/30 bg-cream-light p-4 shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                    <s.icon className="h-5 w-5 text-emerald" />
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-ink">
                      <span className="text-gold-dark">{i + 1}.</span> {s.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink/65">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* assistance + back home */}
      <section className="bg-cream-alt py-5 sm:py-12 md:py-16">
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
