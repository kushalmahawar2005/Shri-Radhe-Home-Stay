/**
 * Read-only month calendar that highlights unavailable dates for a room.
 * `ranges` use [checkIn, checkOut) — checkout day is free again.
 * Server component (pure render).
 */
type Range = { checkIn: string; checkOut: string; kind: string };

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function dayStatus(date: string, ranges: Range[]): "block" | "booked" | "free" {
  let booked = false;
  for (const r of ranges) {
    if (r.checkIn <= date && date < r.checkOut) {
      if (r.kind === "block") return "block";
      booked = true;
    }
  }
  return booked ? "booked" : "free";
}

function Month({
  year,
  month,
  ranges,
  today,
}: {
  year: number;
  month: number;
  ranges: Range[];
  today: string;
}) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-xl border border-gold/25 bg-cream-light p-4">
      <p className="mb-3 text-center font-serif text-base font-semibold text-emerald">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-ink/40">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const date = ymd(year, month, day);
          const status = dayStatus(date, ranges);
          const isToday = date === today;
          const cls =
            status === "block"
              ? "bg-red-500 text-white"
              : status === "booked"
              ? "bg-amber-400 text-ink"
              : "bg-cream text-ink/70";
          return (
            <span
              key={i}
              className={`flex h-8 items-center justify-center rounded-md text-xs ${cls} ${
                isToday ? "ring-2 ring-emerald ring-offset-1" : ""
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function AvailabilityCalendar({
  ranges,
  monthsToShow = 3,
}: {
  ranges: Range[];
  monthsToShow?: number;
}) {
  const now = new Date();
  const today = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-ink/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-500" /> Blocked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-400" /> Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-cream ring-1 ring-gold/30" /> Free
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <Month
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            ranges={ranges}
            today={today}
          />
        ))}
      </div>
    </div>
  );
}
