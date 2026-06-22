import {
  Phone,
  Mail,
  CalendarRange,
  Trash2,
  Check,
  X,
  MailOpen,
  Archive,
} from "lucide-react";
import { listBookings, listMessages } from "@/lib/db/queries";
import {
  setBookingStatusAction,
  deleteBookingAction,
  setMessageStatusAction,
  deleteMessageAction,
} from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald/10 text-emerald",
  cancelled: "bg-red-100 text-red-600",
};

const iconBtn =
  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition";

export default async function BookingsPage() {
  const [bookingRows, messages] = await Promise.all([
    listBookings(),
    listMessages(),
  ]);

  // Only real requests in the inbox (manual blocks live in Availability).
  const requests = bookingRows.filter((r) => r.booking.kind === "request");

  return (
    <div className="flex flex-col gap-10">
      {/* ── Booking requests ─────────────────────────────────────── */}
      <section>
        <h1 className="font-serif text-2xl font-bold text-ink">
          Booking Requests
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          Guests ki booking requests — confirm karne se woh dates block ho
          jayengi.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {requests.length === 0 ? (
            <p className="rounded-xl border border-gold/25 bg-cream-light p-8 text-center text-sm text-ink/50">
              Abhi koi booking request nahi hai.
            </p>
          ) : (
            requests.map(({ booking: b, roomName }) => (
              <article
                key={b.id}
                className="rounded-xl border border-gold/25 bg-cream-light p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold text-ink">
                        {b.guestName || "Guest"}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          statusBadge[b.status] ?? "bg-ink/10 text-ink/60"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      {roomName ?? "Room"} · {b.guests || "—"}
                    </p>
                  </div>
                  <p className="text-xs text-ink/45">
                    {fmtDate(b.createdAt ? b.createdAt.toISOString() : null)}
                  </p>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-emerald" />
                    {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                  </span>
                  {b.phone ? (
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-2 hover:text-emerald"
                    >
                      <Phone className="h-4 w-4 text-emerald" />
                      {b.phone}
                    </a>
                  ) : null}
                  {b.email ? (
                    <a
                      href={`mailto:${b.email}`}
                      className="inline-flex items-center gap-2 hover:text-emerald"
                    >
                      <Mail className="h-4 w-4 text-emerald" />
                      {b.email}
                    </a>
                  ) : null}
                </div>

                {b.notes ? (
                  <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm text-ink/65">
                    {b.notes}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {b.status !== "confirmed" ? (
                    <form action={setBookingStatusAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button
                        className={`${iconBtn} border-emerald/40 text-emerald hover:bg-emerald/10`}
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm
                      </button>
                    </form>
                  ) : null}
                  {b.status !== "cancelled" ? (
                    <form action={setBookingStatusAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button
                        className={`${iconBtn} border-amber-300 text-amber-700 hover:bg-amber-50`}
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteBookingAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <ConfirmButton
                      message="Delete this booking request?"
                      className={`${iconBtn} border-red-200 text-red-600 hover:bg-red-50`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* ── Contact messages ─────────────────────────────────────── */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-ink">Messages</h2>
        <p className="mt-1 text-sm text-ink/55">
          Contact form se aaye messages.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="rounded-xl border border-gold/25 bg-cream-light p-8 text-center text-sm text-ink/50">
              Abhi koi message nahi hai.
            </p>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={`rounded-xl border p-5 ${
                  m.status === "new"
                    ? "border-emerald/30 bg-emerald/5"
                    : "border-gold/25 bg-cream-light"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold text-ink">
                        {m.name || "Visitor"}
                      </h3>
                      {m.status === "new" ? (
                        <span className="rounded-full bg-emerald px-2 py-0.5 text-xs font-medium text-cream-light">
                          New
                        </span>
                      ) : (
                        <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-medium capitalize text-ink/55">
                          {m.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-ink/60">
                      {m.phone ? (
                        <a href={`tel:${m.phone}`} className="hover:text-emerald">
                          {m.phone}
                        </a>
                      ) : null}
                      {m.email ? (
                        <a
                          href={`mailto:${m.email}`}
                          className="hover:text-emerald"
                        >
                          {m.email}
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-xs text-ink/45">
                    {fmtDate(m.createdAt ? m.createdAt.toISOString() : null)}
                  </p>
                </div>

                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-cream px-3 py-2 text-sm text-ink/70">
                  {m.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {m.status !== "read" ? (
                    <form action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value="read" />
                      <button
                        className={`${iconBtn} border-emerald/40 text-emerald hover:bg-emerald/10`}
                      >
                        <MailOpen className="h-3.5 w-3.5" /> Mark read
                      </button>
                    </form>
                  ) : null}
                  {m.status !== "archived" ? (
                    <form action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value="archived" />
                      <button
                        className={`${iconBtn} border-gold/40 text-ink/60 hover:bg-cream`}
                      >
                        <Archive className="h-3.5 w-3.5" /> Archive
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton
                      message="Delete this message?"
                      className={`${iconBtn} border-red-200 text-red-600 hover:bg-red-50`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
