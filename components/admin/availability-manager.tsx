"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Ban, CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Unlock, X } from "lucide-react";
import { createBlockAction, deleteBlockAction } from "@/app/admin/(panel)/availability/actions";
import { cn } from "@/lib/utils";

export type ManagedRange = {
  id: number;
  checkIn: string;
  checkOut: string;
  kind: string; // "block" | "booking"
  notes?: string | null;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const REASONS = ["Offline booking", "Maintenance", "Family use"];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => new Date(`${s}T00:00:00`);
const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};
const nice = (s: string) => parse(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000);

/** The range covering this night (check-out day itself is free). */
function rangeOn(date: string, ranges: ManagedRange[]) {
  return ranges.find((r) => r.checkIn <= date && date < r.checkOut);
}

/**
 * Tap-to-block availability tool. The owner taps the first and last night
 * the room is NOT available and presses one button — no typing dates.
 * Tapping a red (blocked) night offers to unblock it.
 */
export function AvailabilityManager({
  roomId,
  roomName,
  ranges,
}: {
  roomId: number;
  roomName: string;
  ranges: ManagedRange[];
}) {
  const today = ymd(new Date());
  const [offset, setOffset] = useState(0);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [picked, setPicked] = useState<ManagedRange | null>(null);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const months = useMemo(() => {
    const base = new Date();
    return [0, 1].map((i) => new Date(base.getFullYear(), base.getMonth() + offset + i, 1));
  }, [offset]);

  // Selection = nights start..end inclusive → checkout is the morning after `end`.
  const lastNight = end ?? start;
  const checkOut = lastNight ? addDays(lastNight, 1) : null;
  const nights = start && checkOut ? nightsBetween(start, checkOut) : 0;
  const clash = Boolean(start && checkOut && ranges.some((r) => r.checkIn < checkOut && r.checkOut > start));

  function clearSelection() {
    setStart(null);
    setEnd(null);
    setReason("");
  }

  function tap(date: string) {
    setNotice(null);
    const existing = rangeOn(date, ranges);
    if (existing) {
      clearSelection();
      setPicked(existing);
      return;
    }
    setPicked(null);
    if (!start || end) {
      setStart(date);
      setEnd(null);
    } else if (date < start) {
      setStart(date);
    } else {
      setEnd(date);
    }
  }

  function block() {
    if (!start || !checkOut) return;
    const fd = new FormData();
    fd.set("roomId", String(roomId));
    fd.set("checkIn", start);
    fd.set("checkOut", checkOut);
    fd.set("reason", reason || "Not available");
    startTransition(async () => {
      const res = await createBlockAction({}, fd);
      if (res.error) {
        setNotice({ type: "error", text: res.error });
      } else {
        setNotice({ type: "ok", text: `Done! ${roomName} is now not available from ${nice(start)} to ${nice(lastNight!)}.` });
        clearSelection();
      }
    });
  }

  function unblock(range: ManagedRange) {
    const fd = new FormData();
    fd.set("id", String(range.id));
    startTransition(async () => {
      await deleteBlockAction(fd);
      setPicked(null);
      setNotice({ type: "ok", text: `Unblocked. ${roomName} can be booked again from ${nice(range.checkIn)} to ${nice(addDays(range.checkOut, -1))}.` });
    });
  }

  function dayClass(date: string) {
    const r = rangeOn(date, ranges);
    const selected = start && lastNight && date >= start && date <= lastNight;
    if (selected) return "bg-emerald text-white ring-2 ring-emerald";
    if (r?.kind === "block") return "bg-red-500 text-white hover:bg-red-600";
    if (r) return "bg-amber-300 text-ink hover:bg-amber-400";
    return "bg-white text-ink ring-1 ring-gold/25 hover:bg-emerald/10 hover:ring-emerald/40";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* Calendar */}
      <div>
        <ol className="mb-3 grid gap-2 text-sm text-ink/70 sm:grid-cols-3">
          <li className="rounded-xl bg-cream-light px-3 py-2"><strong className="text-emerald">1.</strong> Tap the first night</li>
          <li className="rounded-xl bg-cream-light px-3 py-2"><strong className="text-emerald">2.</strong> Tap the last night</li>
          <li className="rounded-xl bg-cream-light px-3 py-2"><strong className="text-emerald">3.</strong> Press <em>Not available</em></li>
        </ol>

        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-ink/65" aria-label="Calendar key">
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-white ring-1 ring-gold/30" />Free</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-amber-300" />Guest booking</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-red-500" />Not available</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-emerald" />Your selection</span>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0} aria-label="Previous month" className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-cream-light text-emerald hover:bg-emerald/10 disabled:opacity-40"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => setOffset((o) => o + 1)} aria-label="Next month" className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-cream-light text-emerald hover:bg-emerald/10"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {months.map((first, i) => {
            const year = first.getFullYear();
            const month = first.getMonth();
            const days = new Date(year, month + 1, 0).getDate();
            const lead = first.getDay();
            return (
              <div key={`${year}-${month}`} className={cn("rounded-2xl border border-gold/25 bg-cream-light p-3", i === 1 && "hidden sm:block")}>
                <p className="mb-2 text-center font-serif text-lg font-semibold text-emerald">{MONTHS[month]} {year}</p>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink/45">
                  {WEEKDAYS.map((d) => <span key={d}>{d.slice(0, 2)}</span>)}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {Array.from({ length: lead }, (_, k) => <span key={`b${k}`} />)}
                  {Array.from({ length: days }, (_, k) => {
                    const date = ymd(new Date(year, month, k + 1));
                    const past = date < today;
                    const r = rangeOn(date, ranges);
                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={past}
                        onClick={() => tap(date)}
                        aria-label={`${nice(date)}${r ? (r.kind === "block" ? ", not available" : ", guest booking") : ", free"}`}
                        className={cn(
                          "flex h-10 w-full min-w-0 items-center justify-center rounded-lg text-sm font-medium transition sm:h-11",
                          past ? "cursor-not-allowed bg-transparent text-ink/25" : dayClass(date),
                          date === today && "outline outline-2 outline-offset-1 outline-emerald",
                        )}
                      >
                        {k + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action panel */}
      <div className="flex flex-col gap-3 lg:sticky lg:top-4">
        {notice ? (
          <p role="status" className={cn("flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium", notice.type === "ok" ? "bg-emerald/10 text-emerald" : "bg-red-50 text-red-700")}>
            {notice.type === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
            {notice.text}
          </p>
        ) : null}

        {picked ? (
          <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
            <p className={cn("text-xs font-semibold uppercase tracking-wider", picked.kind === "block" ? "text-red-600" : "text-amber-700")}>
              {picked.kind === "block" ? "Not available" : "Guest booking"}
            </p>
            <p className="mt-1 font-serif text-xl font-semibold text-ink">
              {nice(picked.checkIn)} – {nice(addDays(picked.checkOut, -1))}
              <span className="ml-2 text-sm font-normal text-ink/55">({nightsBetween(picked.checkIn, picked.checkOut)} night{nightsBetween(picked.checkIn, picked.checkOut) === 1 ? "" : "s"})</span>
            </p>
            {picked.notes ? <p className="mt-1 text-sm text-ink/60">Note: {picked.notes}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {picked.kind === "block" ? (
                <button type="button" onClick={() => unblock(picked)} disabled={pending} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald px-4 text-sm font-semibold text-white hover:bg-emerald-dark disabled:opacity-60">
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />} Make available again
                </button>
              ) : (
                <Link href="/admin/bookings?status=upcoming" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald px-4 text-sm font-semibold text-white">
                  <CalendarCheck2 className="h-4 w-4" /> Open in Bookings
                </Link>
              )}
              <button type="button" onClick={() => setPicked(null)} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gold/40 px-4 text-sm font-medium text-ink/70 hover:bg-cream">Close</button>
            </div>
          </section>
        ) : start ? (
          <section className="rounded-2xl border border-emerald/30 bg-cream-light p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald">Selected for {roomName}</p>
            <p className="mt-1 font-serif text-xl font-semibold text-ink">
              {nice(start)}{lastNight && lastNight !== start ? ` – ${nice(lastNight)}` : ""}
              <span className="ml-2 text-sm font-normal text-ink/55">({nights} night{nights === 1 ? "" : "s"})</span>
            </p>
            {!end ? <p className="mt-1 text-sm text-ink/55">Tap another date to choose more nights, or block just this one.</p> : null}
            {clash ? <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Some of these nights already have a booking or block. Choose only free (white) dates.</p> : null}

            <p className="mt-4 text-sm font-medium text-ink/75">Why? <span className="font-normal text-ink/50">(optional)</span></p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button key={r} type="button" onClick={() => setReason(reason === r ? "" : r)} className={cn("min-h-10 rounded-full border px-3 text-sm transition", reason === r ? "border-emerald bg-emerald/10 font-semibold text-emerald" : "border-gold/35 text-ink/65 hover:border-emerald/40")}>{r}</button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={block} disabled={pending || clash} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />} Not available
              </button>
              <button type="button" onClick={clearSelection} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gold/40 px-4 text-sm font-medium text-ink/70 hover:bg-cream">Cancel</button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-gold/40 bg-cream-light p-4 text-sm text-ink/60 sm:p-5">
            <p className="font-semibold text-ink">Room full for some days?</p>
            <p className="mt-1">Tap the dates on the calendar to stop online bookings for those nights. Tap a <span className="font-semibold text-red-600">red</span> date to open it again.</p>
          </section>
        )}
      </div>
    </div>
  );
}
