"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type BlockedRange = { from: string; to: string };

/* ── date helpers (work on local "YYYY-MM-DD" keys; string compare = chrono) ── */
const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Does the half-open night range [from, to) hit any blocked range? */
function overlapsBlocked(from: string, to: string, blocked: BlockedRange[]) {
  return blocked.some((b) => b.from < to && b.to > from);
}
/** Is the single night starting on `key` blocked? */
function isBlockedNight(key: string, blocked: BlockedRange[]) {
  return blocked.some((b) => key >= b.from && key < b.to);
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmtPretty(key: string) {
  if (!key) return "";
  return fromKey(key).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function nights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  return Math.round(
    (fromKey(checkOut).getTime() - fromKey(checkIn).getTime()) / 86_400_000
  );
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  blocked = [],
  className,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  blocked?: BlockedRange[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [view, setView] = useState(() =>
    checkIn ? fromKey(checkIn) : startOfToday()
  );
  const ref = useRef<HTMLDivElement>(null);
  const popId = useId();

  const todayKey = toKey(startOfToday());
  const selectingCheckout = Boolean(checkIn) && !checkOut;

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function dayDisabled(key: string) {
    if (key < todayKey) return true;
    if (selectingCheckout) {
      if (key > checkIn) return overlapsBlocked(checkIn, key, blocked);
      return isBlockedNight(key, blocked); // re-picking an earlier check-in
    }
    return isBlockedNight(key, blocked);
  }

  function pick(key: string) {
    if (dayDisabled(key)) return;
    if (selectingCheckout && key > checkIn) {
      onChange(checkIn, key);
      setHovered("");
      setTimeout(() => setOpen(false), 150);
    } else {
      onChange(key, ""); // start a fresh range
    }
  }

  // build the 6-week grid for the viewed month
  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const gridStart = addDays(first, -first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [view]);

  // the "to" boundary for range highlighting (selection or hover preview)
  const previewEnd =
    checkOut ||
    (selectingCheckout &&
    hovered &&
    hovered > checkIn &&
    !overlapsBlocked(checkIn, hovered, blocked)
      ? hovered
      : "");

  const nightCount = nights(checkIn, checkOut);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* trigger — two field pills */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popId}
        className={cn(
          "grid w-full grid-cols-2 overflow-hidden rounded-lg border bg-cream-light text-left transition-colors",
          open ? "border-gold ring-2 ring-gold/40" : "border-gold/40 hover:border-gold"
        )}
      >
        <span className="flex flex-col gap-0.5 border-r border-gold/30 px-4 py-2.5">
          <span className="text-xs font-medium text-ink/55">Check In</span>
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              checkIn ? "font-medium text-ink" : "text-ink/40"
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-gold-dark" />
            {fmtPretty(checkIn) || "Add date"}
          </span>
        </span>
        <span className="flex flex-col gap-0.5 px-4 py-2.5">
          <span className="text-xs font-medium text-ink/55">Check Out</span>
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              checkOut ? "font-medium text-ink" : "text-ink/40"
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-gold-dark" />
            {fmtPretty(checkOut) || "Add date"}
          </span>
        </span>
      </button>

      {/* popover */}
      {open && (
        <div
          id={popId}
          role="dialog"
          aria-label="Choose check-in and check-out dates"
          className="absolute left-0 top-full z-30 mt-2 w-[19rem] max-w-[calc(100vw-3rem)] rounded-2xl border border-gold/30 bg-cream-light p-4 shadow-card"
        >
          {/* month nav */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-gold/15 disabled:opacity-30"
              disabled={
                view.getFullYear() === startOfToday().getFullYear() &&
                view.getMonth() <= startOfToday().getMonth()
              }
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="font-serif text-sm font-semibold text-emerald">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() =>
                setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-gold/15"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* weekday header */}
          <div className="mt-3 grid grid-cols-7 text-center text-[0.7rem] font-medium text-ink/45">
            {WEEKDAYS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* day grid */}
          <div className="mt-1 grid grid-cols-7 gap-y-1">
            {cells.map((d) => {
              const key = toKey(d);
              const inMonth = d.getMonth() === view.getMonth();
              const disabled = dayDisabled(key);
              const booked = isBlockedNight(key, blocked) && key >= todayKey;
              const isStart = key === checkIn;
              const isEnd = key === checkOut;
              const inRange =
                checkIn &&
                previewEnd &&
                key > checkIn &&
                key < previewEnd;
              const isToday = key === todayKey;

              return (
                <div
                  key={key}
                  className={cn(
                    "flex justify-center",
                    (isStart && previewEnd) || inRange
                      ? "bg-emerald/10"
                      : isEnd
                        ? "bg-emerald/10"
                        : "",
                    isStart && previewEnd && "rounded-l-full",
                    isEnd && "rounded-r-full"
                  )}
                >
                  <button
                    type="button"
                    disabled={disabled || !inMonth}
                    onClick={() => pick(key)}
                    onMouseEnter={() => setHovered(key)}
                    aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]}${
                      booked ? " — booked" : ""
                    }`}
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                      !inMonth && "invisible",
                      isStart || isEnd
                        ? "bg-emerald font-semibold text-cream-light"
                        : inRange
                          ? "text-emerald"
                          : disabled
                            ? cn(
                                "cursor-not-allowed text-ink/30",
                                booked && "line-through"
                              )
                            : "text-ink hover:bg-gold/20",
                      isToday && !isStart && !isEnd && "ring-1 ring-gold"
                    )}
                  >
                    {d.getDate()}
                  </button>
                </div>
              );
            })}
          </div>

          {/* legend + footer */}
          <div className="mt-3 flex items-center gap-3 border-t border-gold/20 pt-3 text-[0.7rem] text-ink/55">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" /> Booked
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-ink/60">
              {nightCount > 0
                ? `${nightCount} night${nightCount > 1 ? "s" : ""}`
                : selectingCheckout
                  ? "Pick check-out"
                  : "Pick check-in"}
            </p>
            <div className="flex items-center gap-2">
              {(checkIn || checkOut) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("", "");
                    setHovered("");
                  }}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink/60 hover:bg-gold/15"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-emerald px-3 py-1 text-xs font-semibold text-cream-light hover:bg-emerald/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
