import Link from "next/link";
import { CalendarRange, Trash2, BedDouble } from "lucide-react";
import { listRooms, getRoomBlocks } from "@/lib/db/queries";
import { AvailabilityManager } from "@/components/admin/availability-manager";
import { RoomPicker } from "@/components/admin/room-picker";
import { deleteBlockAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

function fmtDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** "5 Nov (1 night)" or "5 Nov – 7 Nov (3 nights)" — checkOut is the morning they leave. */
function stayLabel(checkIn: string, checkOut: string) {
  const nights = Math.round((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86_400_000);
  const last = new Date(`${checkOut}T00:00:00`);
  last.setDate(last.getDate() - 1);
  const lastKey = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;
  const range = nights <= 1 ? fmtDate(checkIn) : `${fmtDate(checkIn)} – ${fmtDate(lastKey)}`;
  return `${range} (${nights} night${nights === 1 ? "" : "s"})`;
}

export default async function AvailabilityPage({ searchParams }: { searchParams: { room?: string } }) {
  const rooms = await listRooms();

  if (rooms.length === 0) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Availability</h1>
        <p className="mt-4 rounded-2xl border border-gold/25 bg-cream-light p-8 text-center text-sm text-ink/60">Add a room first. Then you can manage its available dates here.</p>
        <Link href="/admin/rooms/new" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-emerald px-4 text-sm font-semibold text-white">Add a room</Link>
      </div>
    );
  }

  const selectedId = searchParams.room ? Number(searchParams.room) : rooms[0].id;
  const selected = rooms.find((room) => room.id === selectedId) ?? rooms[0];
  const blocks = await getRoomBlocks(selected.id);
  const todayKey = new Date().toISOString().slice(0, 10);
  const upcoming = blocks.filter((block) => block.checkOut > todayKey);

  return (
    <div>
      <p className="text-sm font-semibold text-emerald">Room calendar</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Availability</h1>
      <p className="mt-1 text-sm text-ink/55">Stop online bookings for days when a room is already full, under repair or used by family.</p>

      <div className="mt-5">
        <p className="mb-1.5 text-sm font-semibold text-ink/75" aria-hidden="true">Choose a room</p>
        <RoomPicker rooms={rooms.map(({ id, name }) => ({ id, name }))} selectedId={selected.id} />
        <div className="hidden flex-wrap gap-2 sm:flex">
          {rooms.map((room) => (
            <Link key={room.id} href={`/admin/availability?room=${room.id}`} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${room.id === selected.id ? "bg-emerald text-white" : "border border-gold/30 text-ink/70 hover:border-emerald/40 hover:text-emerald"}`}>
              <BedDouble className="h-4 w-4" />{room.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <AvailabilityManager
          key={selected.id}
          roomId={selected.id}
          roomName={selected.name}
          ranges={blocks.map((block) => ({ id: block.id, checkIn: block.checkIn, checkOut: block.checkOut, kind: block.kind, notes: block.notes }))}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
        <h2 className="font-serif text-lg font-semibold text-emerald">Upcoming dates for {selected.name}</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 rounded-xl bg-cream p-3 text-sm text-ink/60">Nothing booked or blocked yet — the room is free on all dates.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {upcoming.map((block) => (
              <li key={block.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/20 bg-cream px-3 py-3 text-sm">
                <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-ink/75">
                  <CalendarRange className={`h-4 w-4 ${block.kind === "block" ? "text-red-500" : "text-amber-600"}`} />
                  <span className="font-medium">{stayLabel(block.checkIn, block.checkOut)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${block.kind === "block" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                    {block.kind === "block" ? block.notes && block.notes !== "Blocked" ? `Not available · ${block.notes}` : "Not available" : `Guest: ${block.guestName || "booking"}`}
                  </span>
                </span>
                {block.kind === "block" ? (
                  <form action={deleteBlockAction}>
                    <input type="hidden" name="id" value={block.id} />
                    <ConfirmButton message={`Make ${selected.name} available again for ${stayLabel(block.checkIn, block.checkOut)}?`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-emerald hover:bg-emerald/10">
                      <Trash2 className="h-4 w-4" />Make available
                    </ConfirmButton>
                  </form>
                ) : <Link href="/admin/bookings?status=upcoming" className="min-h-10 inline-flex items-center text-xs font-semibold text-emerald hover:underline">View booking</Link>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
