import Link from "next/link";
import {
  BedDouble,
  CalendarClock,
  CheckCircle2,
  Inbox,
  Images,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import { getDashboardStats, listBookings, listMessages } from "@/lib/db/queries";
import { AdminAppCard } from "@/components/admin/app-tools";

function fmtDate(d: string | null) {
  if (!d) return "Date not added";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function whatsappUrl(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}

export default async function AdminDashboard() {
  const [stats, bookingRows, messages] = await Promise.all([
    getDashboardStats(),
    listBookings(),
    listMessages(),
  ]);
  const pending = bookingRows
    .filter(({ booking }) => booking.kind === "request" && booking.status === "pending")
    .slice(0, 3);
  const newMessages = messages.filter((message) => message.status === "new").slice(0, 3);
  const todayKey = new Date().toISOString().slice(0, 10);
  const requestsOnly = bookingRows.filter(({ booking }) => booking.kind === "request");
  const arrivals = requestsOnly.filter(({ booking }) => booking.status === "confirmed" && booking.checkIn <= todayKey && booking.checkOut > todayKey);
  const staying = requestsOnly.filter(({ booking }) => booking.status === "checked_in");
  const leavingToday = staying.filter(({ booking }) => booking.checkOut <= todayKey);

  const cards = [
    {
      label: "New booking requests",
      value: stats.pendingBookings,
      icon: CalendarClock,
      href: "/admin/bookings?status=new",
      tone: "text-amber-600",
      urgent: stats.pendingBookings > 0,
    },
    {
      label: "New messages",
      value: stats.newMessages,
      icon: Inbox,
      href: "/admin/bookings?view=messages",
      tone: "text-gold-dark",
    },
    {
      label: "Upcoming stays",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      href: "/admin/bookings?status=upcoming",
      tone: "text-emerald",
    },
    {
      label: "Rooms",
      value: stats.rooms,
      icon: BedDouble,
      href: "/admin/rooms",
      tone: "text-emerald",
    },
  ];

  const quickLinks = [
    { label: "View bookings", href: "/admin/bookings", icon: Inbox },
    { label: "Block dates", href: "/admin/availability", icon: CalendarClock },
    { label: "Edit rooms", href: "/admin/rooms", icon: BedDouble },
    { label: "Update photos", href: "/admin/gallery", icon: Images },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-emerald">Your stay, at a glance</p>
        <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">Your new requests and the most-used tools are here.</p>
      </div>

      <section aria-label="Important updates" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`flex min-h-28 items-center justify-between rounded-2xl border bg-cream-light p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card ${
              card.urgent ? "border-amber-300 ring-1 ring-amber-200" : "border-gold/25"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-ink/65">{card.label}</p>
              <p className="mt-1 font-serif text-3xl font-bold text-ink">{card.value}</p>
            </div>
            <card.icon className={`h-6 w-6 ${card.tone}`} />
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-ink">Today</h2>
          <p className="text-sm text-ink/55">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Link href="/admin/bookings?status=upcoming" className="rounded-xl bg-cream p-3 transition hover:bg-emerald/5">
            <p className="text-sm text-ink/60">Arriving</p>
            <p className="font-serif text-2xl font-bold text-ink">{arrivals.length}</p>
            <p className="mt-1 truncate text-xs text-ink/55">{arrivals.map(({ booking, roomName }) => `${booking.guestName || "Guest"} (${roomName ?? "room"})`).join(", ") || "No arrivals"}</p>
          </Link>
          <Link href="/admin/bookings?status=staying" className="rounded-xl bg-cream p-3 transition hover:bg-emerald/5">
            <p className="text-sm text-ink/60">Staying now</p>
            <p className="font-serif text-2xl font-bold text-ink">{staying.length}</p>
            <p className="mt-1 truncate text-xs text-ink/55">{staying.map(({ booking, roomName }) => `${booking.guestName || "Guest"} (${roomName ?? "room"})`).join(", ") || "No guests checked in"}</p>
          </Link>
          <Link href="/admin/bookings?status=staying" className="rounded-xl bg-cream p-3 transition hover:bg-emerald/5">
            <p className="text-sm text-ink/60">Leaving today</p>
            <p className="font-serif text-2xl font-bold text-ink">{leavingToday.length}</p>
            <p className="mt-1 truncate text-xs text-ink/55">{leavingToday.map(({ booking }) => booking.guestName || "Guest").join(", ") || "Nobody checking out"}</p>
          </Link>
        </div>
        {arrivals.length ? <p className="mt-3 text-sm text-ink/65">When a guest arrives, open <Link href="/admin/bookings?status=upcoming" className="font-semibold text-emerald underline">Upcoming</Link> and press <strong>Check in</strong>.</p> : null}
      </section>

      <AdminAppCard />

      <section>
        <h2 className="font-serif text-xl font-bold text-ink">Quick actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-24 flex-col justify-between rounded-2xl border border-gold/25 bg-cream-light p-4 text-sm font-semibold text-emerald shadow-soft transition hover:border-emerald/40 hover:shadow-card"
            >
              <Icon className="h-5 w-5" />
              <span className="flex w-full items-center justify-between gap-2">
                {label}<ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">Bookings to review</h2>
              <p className="text-sm text-ink/55">New requests are waiting for your decision.</p>
            </div>
            <Link href="/admin/bookings" className="shrink-0 text-sm font-semibold text-emerald hover:underline">See all</Link>
          </div>
          {pending.length === 0 ? (
            <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-ink/60">You’re all caught up. No new booking requests.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map(({ booking, roomName }) => (
                <li key={booking.id} className="rounded-xl border border-gold/20 bg-cream p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">{booking.guestName || "Guest"}</p>
                      <p className="mt-0.5 text-sm text-ink/60">{roomName || "Room"} · {fmtDate(booking.checkIn)} – {fmtDate(booking.checkOut)}</p>
                    </div>
                    <Link href="/admin/bookings" className="text-sm font-semibold text-emerald">Review</Link>
                  </div>
                  {booking.phone ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={`tel:${booking.phone}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald/30 px-3 text-sm font-semibold text-emerald"><Phone className="h-4 w-4" />Call</a>
                      <a href={whatsappUrl(booking.phone)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald px-3 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" />WhatsApp</a>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">New messages</h2>
              <p className="text-sm text-ink/55">Messages from your website visitors.</p>
            </div>
            <Link href="/admin/bookings?view=messages" className="shrink-0 text-sm font-semibold text-emerald hover:underline">See all</Link>
          </div>
          {newMessages.length === 0 ? (
            <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-ink/60">No new messages right now.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {newMessages.map((message) => (
                <li key={message.id} className="rounded-xl border border-gold/20 bg-cream p-4">
                  <p className="font-semibold text-ink">{message.name || "Visitor"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/65">{message.message}</p>
                  <Link href="/admin/bookings?view=messages" className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-emerald">Open message <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
