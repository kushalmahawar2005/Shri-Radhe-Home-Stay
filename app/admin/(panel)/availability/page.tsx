import Link from "next/link";
import { CalendarRange, Trash2, BedDouble } from "lucide-react";
import { listRooms, getRoomBlocks } from "@/lib/db/queries";
import { AvailabilityCalendar } from "@/components/admin/availability-calendar";
import { BlockForm } from "@/components/admin/block-form";
import { deleteBlockAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: { room?: string };
}) {
  const rooms = await listRooms();

  if (rooms.length === 0) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Availability</h1>
        <p className="mt-4 rounded-xl border border-gold/25 bg-cream-light p-8 text-center text-sm text-ink/50">
          Pehle koi room add karo, phir uski availability manage kar sakte ho.
        </p>
      </div>
    );
  }

  const selectedId = searchParams.room
    ? Number(searchParams.room)
    : rooms[0].id;
  const selected = rooms.find((r) => r.id === selectedId) ?? rooms[0];

  const blocks = await getRoomBlocks(selected.id);
  const ranges = blocks.map((b) => ({
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    kind: b.kind,
  }));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Availability</h1>
      <p className="mt-1 text-sm text-ink/55">
        Room select karke dates block/unblock karo. Confirmed bookings yahan
        automatically dikhti hain.
      </p>

      {/* Room picker */}
      <div className="mt-5 flex flex-wrap gap-2">
        {rooms.map((r) => (
          <Link
            key={r.id}
            href={`/admin/availability?room=${r.id}`}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              r.id === selected.id
                ? "bg-emerald text-cream-light"
                : "border border-gold/30 text-ink/70 hover:border-emerald/40 hover:text-emerald"
            }`}
          >
            <BedDouble className="h-4 w-4" />
            {r.name}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <AvailabilityCalendar ranges={ranges} />
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold text-emerald">
              Block dates — {selected.name}
            </h2>
            <BlockForm roomId={selected.id} />
          </section>

          <section className="rounded-xl border border-gold/25 bg-cream-light p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold text-emerald">
              Current blocks & bookings
            </h2>
            {blocks.length === 0 ? (
              <p className="text-sm text-ink/50">Koi blocked date nahi hai.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {blocks.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gold/20 bg-cream px-3 py-2 text-sm"
                  >
                    <span className="inline-flex items-center gap-2 text-ink/70">
                      <CalendarRange
                        className={`h-4 w-4 ${
                          b.kind === "block" ? "text-red-500" : "text-amber-500"
                        }`}
                      />
                      {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                      <span className="text-xs text-ink/40">
                        {b.kind === "block" ? b.notes || "Blocked" : "Booked"}
                      </span>
                    </span>
                    {b.kind === "block" ? (
                      <form action={deleteBlockAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <ConfirmButton
                          message="Unblock these dates?"
                          className="rounded-md p-1.5 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </ConfirmButton>
                      </form>
                    ) : (
                      <Link
                        href="/admin/bookings"
                        className="text-xs text-emerald hover:underline"
                      >
                        Manage
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
