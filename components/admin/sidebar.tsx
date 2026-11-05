"use client";

import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";
import { InstallAppButton } from "@/components/admin/app-tools";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/availability", label: "Availability", icon: CalendarRange },
  { href: "/admin/bookings", label: "Bookings & messages", icon: Inbox },
  { href: "/admin/gallery", label: "Photos", icon: Images },
  { href: "/admin/content", label: "Website content", icon: FileText },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
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
  );
}

function AccountActions({ email }: { email: string }) {
  return (
    <div className="border-t border-gold/20 p-3">
      <Link
        href="/"
        target="_blank"
        className="mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-emerald/10 hover:text-emerald"
      >
        <ExternalLink className="h-4 w-4" />
        View website
      </Link>
      <InstallAppButton compact className="mb-1 w-full" />
      <p className="truncate px-3 pb-1 pt-2 text-xs text-ink/45" title={email}>
        {email}
      </p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </form>
    </div>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-gold/20 bg-cream-light px-4 shadow-sm md:hidden">
        <Link href="/admin" className="font-serif text-lg font-bold text-emerald">
          Shri Radha <span className="font-sans text-xs font-medium text-ink/50">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-emerald hover:bg-emerald/10"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-gold/20 bg-cream-light md:flex">
        <div className="border-b border-gold/20 px-5 py-5">
          <p className="font-serif text-lg font-bold text-emerald">Shri Radha</p>
          <p className="text-xs text-ink/50">Admin panel</p>
        </div>
        <NavLinks />
        <AccountActions email={email} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="relative flex h-full w-[min(20rem,85vw)] flex-col bg-cream-light shadow-2xl">
            <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
              <div>
                <p className="font-serif text-lg font-bold text-emerald">Shri Radha</p>
                <p className="text-xs text-ink/50">Admin panel</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink/70 hover:bg-emerald/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <AccountActions email={email} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
