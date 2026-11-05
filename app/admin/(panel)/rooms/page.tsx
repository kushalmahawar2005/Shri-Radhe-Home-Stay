import Link from "next/link";
import { Plus, Pencil, Trash2, EyeOff, BedDouble, Users, IndianRupee } from "lucide-react";
import { listRooms } from "@/lib/db/queries";
import { deleteRoomAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function RoomsPage({ searchParams }: { searchParams: { saved?: string } }) {
  const rooms = await listRooms();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald">Your accommodation</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Rooms</h1>
          <p className="mt-1 text-sm text-ink/55">{rooms.length} room{rooms.length === 1 ? "" : "s"} on your website.</p>
        </div>
        <Link href="/admin/rooms/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald px-4 text-sm font-semibold text-white transition hover:bg-emerald-dark">
          <Plus className="h-4 w-4" />Add a room
        </Link>
      </div>

      {searchParams.saved === "1" ? <p role="status" className="mt-4 rounded-xl bg-emerald/10 px-4 py-3 text-sm font-medium text-emerald">Room saved. Your website is updated.</p> : null}

      {rooms.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-gold/25 bg-cream-light p-8 text-center">
          <BedDouble className="mx-auto h-9 w-9 text-emerald/60" />
          <p className="mt-3 font-semibold text-ink">No rooms added yet</p>
          <p className="mt-1 text-sm text-ink/55">Add your first room to show it on the website.</p>
          <Link href="/admin/rooms/new" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-emerald px-4 text-sm font-semibold text-white">Add your first room</Link>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 lg:grid-cols-2">
          {rooms.map((room) => (
            <li key={room.id} className="overflow-hidden rounded-2xl border border-gold/25 bg-cream-light shadow-soft">
              <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-gold/20 bg-cream sm:h-28 sm:w-36">
                  {room.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={room.image} alt={room.alt || room.name} className="h-full w-full object-cover" />
                  ) : <div className="flex h-full items-center justify-center text-ink/35"><BedDouble className="h-7 w-7" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-lg font-bold text-ink">{room.name}</h2>
                      <p className="mt-0.5 text-sm text-ink/55">{room.published ? "Visible on website" : "Hidden from website"}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${room.published ? "bg-emerald/10 text-emerald" : "bg-ink/10 text-ink/60"}`}>
                      {room.published ? "Published" : <><EyeOff className="mr-1 inline h-3 w-3" />Hidden</>}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink/70">
                    <span className="inline-flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-gold-dark" />{room.priceNight || room.price || "Price on request"}</span>
                    {room.guests ? <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald" />{room.guests}</span> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-gold/15 bg-cream/70 p-3">
                <Link href={`/admin/rooms/${room.id}/edit`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-emerald/30 bg-cream-light px-3 text-sm font-semibold text-emerald hover:bg-emerald/5"><Pencil className="h-4 w-4" />Edit room</Link>
                <form action={deleteRoomAction}>
                  <input type="hidden" name="id" value={room.id} />
                  <ConfirmButton message={`Permanently delete ${room.name}?`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Delete</span></ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
