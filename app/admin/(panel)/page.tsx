import Link from "next/link";
import {
  BedDouble,
  CalendarClock,
  CheckCircle2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats } from "@/lib/db/queries";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total Rooms",
      value: stats.rooms,
      icon: BedDouble,
      href: "/admin/rooms",
      tone: "text-emerald",
    },
    {
      label: "Pending Requests",
      value: stats.pendingBookings,
      icon: CalendarClock,
      href: "/admin/bookings",
      tone: "text-amber-600",
    },
    {
      label: "Confirmed Bookings",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      href: "/admin/bookings",
      tone: "text-emerald",
    },
    {
      label: "New Messages",
      value: stats.newMessages,
      icon: Inbox,
      href: "/admin/bookings",
      tone: "text-gold-dark",
    },
  ];

  const quickLinks = [
    { label: "Add / edit rooms", href: "/admin/rooms" },
    { label: "Block or open dates", href: "/admin/availability" },
    { label: "Upload gallery photos", href: "/admin/gallery" },
    { label: "Edit contact & content", href: "/admin/content" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/55">
        Welcome back — yahan se poori site manage karo.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-gold/25 bg-cream-light p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <c.icon className={`h-6 w-6 ${c.tone}`} />
              <span className="font-serif text-3xl font-bold text-ink">
                {c.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-ink/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gold/25 bg-cream-light p-6 shadow-soft">
        <h2 className="font-serif text-lg font-semibold text-emerald">
          Quick actions
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {quickLinks.map((q) => (
            <li key={q.href}>
              <Link
                href={q.href}
                className="flex items-center justify-between rounded-lg border border-gold/20 bg-cream px-4 py-3 text-sm font-medium text-ink/75 transition hover:border-emerald/40 hover:text-emerald"
              >
                {q.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
