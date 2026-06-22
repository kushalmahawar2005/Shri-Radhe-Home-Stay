"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarRange,
  Inbox,
  Images,
  FileText,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/availability", label: "Availability", icon: CalendarRange },
  { href: "/admin/bookings", label: "Bookings & Messages", icon: Inbox },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/content", label: "Site Content", icon: FileText },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gold/20 bg-cream-light">
      <div className="border-b border-gold/20 px-5 py-5">
        <p className="font-serif text-lg font-bold text-emerald">Shri Radha</p>
        <p className="text-xs text-ink/50">Admin Panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-emerald text-cream-light"
                  : "text-ink/70 hover:bg-emerald/10 hover:text-emerald"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gold/20 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-emerald/10 hover:text-emerald"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
        <p className="truncate px-3 pb-1 pt-2 text-xs text-ink/45" title={email}>
          {email}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
