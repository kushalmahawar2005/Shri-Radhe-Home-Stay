"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the guest's enquiry directly in WhatsApp for review and sending. */
export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const inputCls =
    "w-full min-w-0 rounded-[0.75rem] border border-gold/40 bg-[#fffdf7] px-3 py-2.5 text-base text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const message = [
      "Jai Shri Krishna! I have an enquiry.",
      `Name: ${field("name")}`,
      ...(field("phone") ? [`Phone: ${field("phone")}`] : []),
      ...(field("email") ? [`Email: ${field("email")}`] : []),
      "",
      field("message"),
    ].join("\n");

    window.location.assign(
      `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1rem] border border-gold/30 bg-cream-light p-4 shadow-card sm:rounded-2xl sm:p-6"
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-ink/80 sm:text-sm">
          Name
          <input name="name" autoComplete="name" required className={inputCls} placeholder="Your name" />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-ink/80 sm:text-sm">
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={inputCls} placeholder="Mobile number" />
        </label>
      </div>
      <label className="mt-3 flex flex-col gap-1 text-xs font-medium text-ink/80 sm:mt-4 sm:text-sm">
        Email (optional)
        <input name="email" type="email" autoComplete="email" className={inputCls} placeholder="you@example.com" />
      </label>
      <label className="mt-3 flex flex-col gap-1 text-xs font-medium text-ink/80 sm:mt-4 sm:text-sm">
        Your enquiry
        <textarea
          name="message"
          required
          rows={3}
          className={`${inputCls} resize-y`}
          placeholder="Travel dates, number of guests or any questions…"
        />
      </label>
      <Button type="submit" variant="primary" className="mt-4 w-full gap-1.5 px-3 text-xs sm:mt-5 sm:text-sm">
        <MessageCircle className="h-4 w-4" /> Send Enquiry on WhatsApp
      </Button>
      <p className="mt-2 text-center text-xs leading-4 text-ink/55">
        WhatsApp opens with your enquiry ready to send.
      </p>
    </form>
  );
}
