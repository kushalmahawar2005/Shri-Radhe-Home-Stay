"use client";

import { useState } from "react";
import { Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/app/(site)/contact/actions";

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

/**
 * OPTIONAL contact form.
 * - If NEXT_PUBLIC_FORMSPREE_ENDPOINT is set, posts to Formspree (no server).
 * - Otherwise it gracefully falls back to a pre-filled WhatsApp message,
 *   so the site works fully without any backend.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const inputCls =
    "w-full rounded-lg border border-gold/40 bg-cream-light px-4 py-2.5 text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    // Primary: save to our database (admin inbox).
    try {
      const res = await submitContactMessage({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
    } catch {
      /* fall through to other options */
    }

    // Optional: post to Formspree if configured.
    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (res.ok) {
          setStatus("sent");
          form.reset();
          return;
        }
      } catch {
        /* fall through to WhatsApp */
      }
    }

    // Final fallback: open WhatsApp with a pre-filled message.
    const msg = `Jai Shri Krishna! I'm ${data.get("name")}.\n${data.get(
      "message"
    )}\nReach me at ${data.get("email")} / ${data.get("phone")}`;
    window.open(
      `https://wa.me/918619301401?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener"
    );
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/30 bg-cream-light p-8 text-center shadow-card">
        <CheckCircle2 className="h-10 w-10 text-emerald" />
        <h3 className="font-serif text-2xl text-emerald">Message sent!</h3>
        <p className="text-ink/70">
          Thank you — we&apos;ll reply shortly. For an instant response, message
          us on WhatsApp.
        </p>
        <Button asChild variant="primary" size="sm">
          <a
            href={siteConfig.links.whatsappPrimary}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
          Name
          <input name="name" required className={inputCls} placeholder="Your name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
          Phone
          <input
            name="phone"
            type="tel"
            className={inputCls}
            placeholder="Mobile number"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-ink/80">
        Email
        <input
          name="email"
          type="email"
          required
          className={inputCls}
          placeholder="you@example.com"
        />
      </label>
      <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium text-ink/80">
        Message
        <textarea
          name="message"
          required
          rows={4}
          className={inputCls}
          placeholder="Tell us your travel dates and number of guests…"
        />
      </label>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-700">
          Something went wrong. Please call or WhatsApp us instead.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="mt-5 w-full"
        disabled={status === "sending"}
      >
        {ENDPOINT ? (
          <>
            <Send className="h-4 w-4" />
            {status === "sending" ? "Sending…" : "Send Message"}
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            Send via WhatsApp
          </>
        )}
      </Button>

      {!ENDPOINT && (
        <p className="mt-3 text-center text-xs text-ink/50">
          This form opens WhatsApp with your message pre-filled.
        </p>
      )}
    </form>
  );
}
