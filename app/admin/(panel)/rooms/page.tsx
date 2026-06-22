import Link from "next/link";
import { Plus, Pencil, Trash2, EyeOff } from "lucide-react";
import { listRooms } from "@/lib/db/queries";
import { deleteRoomAction } from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function RoomsPage() {
  const rooms = await listRooms();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Rooms</h1>
          <p className="mt-1 text-sm text-ink/55">
            {rooms.length} room{rooms.length === 1 ? "" : "s"} — add, edit ya
            remove karo.
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-sm font-semibold text-cream-light transition hover:bg-emerald-dark"
        >
          <Plus className="h-4 w-4" /> Add Room
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gold/25 bg-cream-light">
        {rooms.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">
            Abhi koi room nahi hai. &ldquo;Add Room&rdquo; pe click karo.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/20 text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-b border-gold/10 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-gold/20 bg-cream">
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{r.name}</p>
                        <p className="text-xs text-ink/45">/{r.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{r.priceNight || "—"}</td>
                  <td className="px-4 py-3 text-ink/70">{r.guests || "—"}</td>
                  <td className="px-4 py-3">
                    {r.published ? (
                      <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-medium text-ink/60">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/rooms/${r.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-gold/30 px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-emerald/40 hover:text-emerald"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <form action={deleteRoomAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <ConfirmButton
                          message={`Delete "${r.name}"? Ye wapas nahi aayega.`}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
