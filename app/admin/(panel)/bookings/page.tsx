import Link from "next/link";
import {
  Phone,
  Mail,
  CalendarRange,
  Trash2,
  Check,
  X,
  MailOpen,
  Archive,
  MessageCircle,
  LogIn,
  LogOut,
  UserX,
  Undo2,
  IndianRupee,
  RotateCcw,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { listBookings, listMessages } from "@/lib/db/queries";
import {
  bookingStepAction,
  deleteBookingAction,
  setMessageStatusAction,
  deleteMessageAction,
} from "./actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

type SearchParams = { view?: string; status?: string; updated?: string };

function fmtDate(d: string | null) {
  if (!d) return "Not added";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function whatsappUrl(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}

const STATUS: Record<string, { label: string; badge: string }> = {
  pending: { label: "New request", badge: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", badge: "bg-emerald/10 text-emerald" },
  checked_in: { label: "Staying now", badge: "bg-emerald text-white" },
  checked_out: { label: "Stay complete", badge: "bg-ink/10 text-ink/70" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-700" },
  no_show: { label: "Didn't arrive", badge: "bg-red-100 text-red-700" },
};

const PAYMENT: Record<string, string> = {
  paid: `₹${siteConfig.advanceAmount} advance paid`,
  settled: "Fully paid",
  refunded: "Advance refunded",
  failed: "Online payment failed",
  pending: "Payment not finished",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New requests" },
  { key: "upcoming", label: "Upcoming" },
  { key: "staying", label: "Staying now" },
  { key: "done", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

function matchesFilter(status: string, filter: FilterKey) {
  switch (filter) {
    case "new": return status === "pending";
    case "upcoming": return status === "confirmed";
    case "staying": return status === "checked_in";
    case "done": return status === "checked_out";
    case "cancelled": return status === "cancelled" || status === "no_show";
    default: return true;
  }
}

const nightsOf = (a: string, b: string) =>
  Math.max(0, Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86_400_000));

function whenLabel(checkIn: string, checkOut: string, status: string, today: string) {
  if (status === "checked_in") return checkOut === today ? "Leaves today" : "Staying now";
  if (!["pending", "confirmed"].includes(status)) return null;
  const tomorrow = new Date(`${today}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tKey = tomorrow.toISOString().slice(0, 10);
  if (checkIn === today) return "Arrives today";
  if (checkIn === tKey) return "Arrives tomorrow";
  if (checkIn < today && checkOut > today) return "Should have arrived";
  return null;
}

function StepButton({ id, step, back, label, icon: Icon, tone, confirm, children }: {
  id: number; step: string; back: string; label: string; icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "plain" | "danger" | "warn"; confirm?: string; children?: React.ReactNode;
}) {
  const cls = {
    primary: "border-emerald bg-emerald text-white hover:bg-emerald-dark",
    plain: "border-gold/40 text-ink/75 hover:bg-cream",
    danger: "border-red-200 text-red-700 hover:bg-red-50",
    warn: "border-amber-300 text-amber-800 hover:bg-amber-50",
  }[tone];
  return (
    <form action={bookingStepAction} className="contents">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="back" value={back} />
      {children}
      {confirm ? (
        <ConfirmButton message={confirm} className={`${buttonBase} ${cls}`}><Icon className="h-4 w-4" />{label}</ConfirmButton>
      ) : (
        <button type="submit" className={`${buttonBase} ${cls}`}><Icon className="h-4 w-4" />{label}</button>
      )}
    </form>
  );
}

const UPDATED: Record<string, { text: string; error?: boolean }> = {
  confirm: { text: "Booking confirmed — the dates are now blocked on the website." },
  reopen: { text: "Booking restored and dates blocked again." },
  check_in: { text: "Guest checked in. Have a great stay!" },
  check_out: { text: "Guest checked out. Any unused nights are free again." },
  no_show: { text: "Marked as didn't arrive — the dates are free again." },
  cancel: { text: "Booking cancelled — the dates are free again." },
  refund: { text: "Marked the advance as refunded." },
  paid_full: { text: "Marked as fully paid." },
  deleted: { text: "Booking deleted." },
  saved: { text: "Changes saved." },
  clash: { text: "Can't confirm: another booking or block already uses some of these dates. Check Availability first.", error: true },
  error: { text: "Something went wrong. Please try again.", error: true },
};

const buttonBase = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition";

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold ${active ? "bg-emerald text-white" : "bg-cream text-ink/65 hover:bg-emerald/10"}`}>
      {children}
    </Link>
  );
}

export default async function BookingsPage({ searchParams }: { searchParams: SearchParams }) {
  const view = searchParams.view === "messages" ? "messages" : "bookings";
  const statusFilter: FilterKey = (FILTERS.map((f) => f.key) as string[]).includes(searchParams.status || "") ? (searchParams.status as FilterKey) : "all";
  const today = new Date().toISOString().slice(0, 10);
  const back = statusFilter === "all" ? "/admin/bookings" : `/admin/bookings?status=${statusFilter}`;
  const [bookingRows, allMessages] = await Promise.all([listBookings(), listMessages()]);
  const requests = bookingRows
    .filter(({ booking }) => booking.kind === "request")
    .filter(({ booking }) => matchesFilter(booking.status, statusFilter))
    .sort((a, b) => {
      const priority: Record<string, number> = { pending: 0, checked_in: 1, confirmed: 2, checked_out: 3, no_show: 4, cancelled: 5 };
      const pa = priority[a.booking.status] ?? 9;
      const pb = priority[b.booking.status] ?? 9;
      if (pa !== pb) return pa - pb;
      // Upcoming stays: soonest first. Everything else: newest first.
      if (a.booking.status === "confirmed") return a.booking.checkIn.localeCompare(b.booking.checkIn);
      return (b.booking.createdAt?.getTime() ?? 0) - (a.booking.createdAt?.getTime() ?? 0);
    });
  const counts = Object.fromEntries(
    FILTERS.map((f) => [f.key, bookingRows.filter(({ booking }) => booking.kind === "request" && matchesFilter(booking.status, f.key)).length]),
  ) as Record<FilterKey, number>;
  const messageFilter = searchParams.status === "archived" ? "archived" : searchParams.status === "all" ? "all" : "active";
  const messages = allMessages.filter((message) => messageFilter === "all" || (messageFilter === "archived" ? message.status === "archived" : message.status !== "archived"));

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald">Guest communication</p>
        <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">Bookings & messages</h1>
        <p className="mt-1 text-sm text-ink/60">Review requests, contact guests, and keep your inbox organized.</p>
      </header>

      {searchParams.updated ? (
        <p role="status" className={`rounded-xl border px-4 py-3 text-sm font-medium ${UPDATED[searchParams.updated]?.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald/20 bg-emerald/10 text-emerald"}`}>
          {(UPDATED[searchParams.updated] ?? UPDATED.saved).text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 rounded-2xl border border-gold/20 bg-cream-light p-2">
        <TabLink href="/admin/bookings" active={view === "bookings"}>Booking requests</TabLink>
        <TabLink href="/admin/bookings?view=messages" active={view === "messages"}>Messages</TabLink>
      </div>

      {view === "bookings" ? (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink">Bookings</h2>
              <p className="mt-1 text-sm text-ink/55">Each booking shows the next step. New requests and guests staying now come first.</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filter bookings">
            {FILTERS.map((f) => (
              <TabLink key={f.key} href={f.key === "all" ? "/admin/bookings" : `/admin/bookings?status=${f.key}`} active={statusFilter === f.key}>
                <span className="whitespace-nowrap">{f.label}{counts[f.key] ? <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-xs">{counts[f.key]}</span> : null}</span>
              </TabLink>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {requests.length === 0 ? (
              <div className="rounded-2xl border border-gold/25 bg-cream-light p-7 text-center">
                <CalendarRange className="mx-auto h-8 w-8 text-emerald/60" />
                <p className="mt-3 font-semibold text-ink">Nothing here right now</p>
                <p className="mt-1 text-sm text-ink/55">New requests from your website will show up here.</p>
              </div>
            ) : requests.map(({ booking: b, roomName, roomPrice }) => {
              const st = STATUS[b.status] ?? { label: b.status, badge: "bg-ink/10 text-ink/60" };
              const nights = nightsOf(b.checkIn, b.checkOut);
              const total = roomPrice ? roomPrice * nights : 0;
              const advance = b.paymentStatus === "paid" ? siteConfig.advanceAmount : 0;
              const when = whenLabel(b.checkIn, b.checkOut, b.status, today);
              const started = b.checkIn <= today;
              const guest = b.guestName || "this guest";
              return (
              <article key={b.id} className={`rounded-2xl border bg-cream-light p-4 shadow-soft sm:p-5 ${b.status === "pending" ? "border-amber-300" : "border-gold/25"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-ink">{b.guestName || "Guest"}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}>{st.label}</span>
                      {when ? <span className="rounded-full bg-amber-300 px-2.5 py-1 text-xs font-bold text-ink">{when}</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-ink/60">{roomName ?? "Room not selected"} · {b.guests || "Guest count not added"} · #{String(b.id).padStart(6, "0")}</p>
                  </div>
                  <p className="text-xs text-ink/45">Booked {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "recently"}</p>
                </div>

                <div className="mt-4 grid gap-3 rounded-xl bg-cream p-3 text-sm sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2 text-ink/75"><CalendarRange className="h-4 w-4 shrink-0 text-emerald" />{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {nights} night{nights === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-2 text-ink/75">
                    <IndianRupee className="h-4 w-4 shrink-0 text-emerald" />
                    {PAYMENT[b.paymentStatus] ?? "Pay at villa"}
                    {total && b.paymentStatus !== "settled" && b.paymentStatus !== "refunded" ? <span className="text-ink/55"> · to collect ₹{Math.max(0, total - advance).toLocaleString("en-IN")}</span> : null}
                  </span>
                  {b.phone ? <a href={`tel:${b.phone}`} className="inline-flex min-h-10 items-center gap-2 font-medium text-ink/75 hover:text-emerald"><Phone className="h-4 w-4 text-emerald" />{b.phone}</a> : <span className="text-ink/45">No phone number</span>}
                  {b.email ? <a href={`mailto:${b.email}`} className="inline-flex min-h-10 items-center gap-2 break-all font-medium text-ink/75 hover:text-emerald"><Mail className="h-4 w-4 shrink-0 text-emerald" />{b.email}</a> : null}
                </div>

                {b.notes ? <p className="mt-3 whitespace-pre-wrap rounded-xl border border-gold/15 bg-white px-3 py-2.5 text-sm text-ink/65">{b.notes}</p> : null}

                {(b.status === "cancelled" || b.status === "no_show") && b.paymentStatus === "paid" ? (
                  <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">₹{siteConfig.advanceAmount} advance is still with you. Refund it, or keep it as per your policy.</p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {b.status === "pending" ? (
                    <StepButton id={b.id} step="confirm" back={back} label="Confirm booking" icon={Check} tone="primary" confirm={`Confirm ${guest}'s booking? These dates will be blocked on the website.`} />
                  ) : null}
                  {b.status === "confirmed" ? (
                    <StepButton id={b.id} step="check_in" back={back} label="Guest arrived — Check in" icon={LogIn} tone="primary" />
                  ) : null}
                  {b.status === "checked_in" ? (
                    <details className="w-full rounded-xl border border-emerald/30 bg-white p-3 sm:w-auto">
                      <summary className="flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-emerald"><LogOut className="h-4 w-4" />Check out</summary>
                      <form action={bookingStepAction} className="mt-2 flex flex-col gap-2">
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="step" value="check_out" />
                        <input type="hidden" name="back" value={back} />
                        {b.paymentStatus !== "settled" ? (
                          <label className="flex min-h-10 items-center gap-2 text-sm text-ink/75">
                            <input type="checkbox" name="paidFull" defaultChecked className="h-5 w-5 accent-emerald" />
                            Full payment collected{total ? ` (₹${Math.max(0, total - advance).toLocaleString("en-IN")})` : ""}
                          </label>
                        ) : null}
                        {today < b.checkOut && today > b.checkIn ? <p className="text-xs text-ink/55">Leaving early: the remaining nights will become free again.</p> : null}
                        <button type="submit" className={`${buttonBase} border-emerald bg-emerald text-white`}>Confirm check out</button>
                      </form>
                    </details>
                  ) : null}
                  {b.phone ? (
                    <>
                      <a href={`tel:${b.phone}`} className={`${buttonBase} border-emerald/30 text-emerald`}><Phone className="h-4 w-4" />Call</a>
                      <a href={whatsappUrl(b.phone)} target="_blank" rel="noreferrer" className={`${buttonBase} border-emerald/30 text-emerald`}><MessageCircle className="h-4 w-4" />WhatsApp</a>
                    </>
                  ) : null}
                  {b.status === "confirmed" && started ? (
                    <StepButton id={b.id} step="no_show" back={back} label="Didn't arrive" icon={UserX} tone="warn" confirm={`Mark ${guest} as didn't arrive? The dates will become free for other guests.`} />
                  ) : null}
                  {b.status === "pending" || b.status === "confirmed" ? (
                    <StepButton id={b.id} step="cancel" back={back} label="Cancel" icon={X} tone="warn" confirm={`Cancel ${guest}'s booking? The dates will become free again.`} />
                  ) : null}
                  {(b.status === "cancelled" || b.status === "no_show") && b.paymentStatus === "paid" ? (
                    <StepButton id={b.id} step="refund" back={back} label="Mark advance refunded" icon={RotateCcw} tone="plain" confirm="Have you returned the advance to the guest?" />
                  ) : null}
                  {b.status === "checked_out" && b.paymentStatus !== "settled" ? (
                    <StepButton id={b.id} step="paid_full" back={back} label="Mark fully paid" icon={IndianRupee} tone="plain" />
                  ) : null}
                  {b.status === "cancelled" || b.status === "no_show" ? (
                    <StepButton id={b.id} step="reopen" back={back} label="Restore booking" icon={Undo2} tone="plain" confirm="Restore this booking? Its dates will be blocked again if they are still free." />
                  ) : null}
                  {["pending", "cancelled", "no_show"].includes(b.status) ? (
                    <form action={deleteBookingAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmButton message="Permanently delete this booking? This cannot be undone." className={`${buttonBase} border-red-200 text-red-700`}><Trash2 className="h-4 w-4" />Delete</ConfirmButton>
                    </form>
                  ) : null}
                </div>
              </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink">Website messages</h2>
              <p className="mt-1 text-sm text-ink/55">Read and reply to questions from guests.</p>
            </div>
            <div className="flex gap-2">
              <TabLink href="/admin/bookings?view=messages" active={messageFilter === "active"}>Inbox</TabLink>
              <TabLink href="/admin/bookings?view=messages&status=archived" active={messageFilter === "archived"}>Archived</TabLink>
              <TabLink href="/admin/bookings?view=messages&status=all" active={messageFilter === "all"}>All</TabLink>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-gold/25 bg-cream-light p-7 text-center">
                <MailOpen className="mx-auto h-8 w-8 text-emerald/60" />
                <p className="mt-3 font-semibold text-ink">No messages here</p>
                <p className="mt-1 text-sm text-ink/55">Website enquiries will appear here.</p>
              </div>
            ) : messages.map((m) => (
              <article key={m.id} className={`rounded-2xl border p-4 sm:p-5 ${m.status === "new" ? "border-emerald/30 bg-emerald/[0.04]" : "border-gold/25 bg-cream-light"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-ink">{m.name || "Website visitor"}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${m.status === "new" ? "bg-emerald text-white" : "bg-ink/10 text-ink/60"}`}>{m.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink/45">{m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}</p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-cream p-3 text-sm leading-6 text-ink/75">{m.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.phone ? <a href={`tel:${m.phone}`} className={`${buttonBase} border-emerald/30 text-emerald`}><Phone className="h-4 w-4" />Call</a> : null}
                  {m.phone ? <a href={whatsappUrl(m.phone)} target="_blank" rel="noreferrer" className={`${buttonBase} border-emerald bg-emerald text-white`}><MessageCircle className="h-4 w-4" />WhatsApp</a> : null}
                  {m.email ? <a href={`mailto:${m.email}`} className={`${buttonBase} border-gold/40 text-ink/70`}><Mail className="h-4 w-4" />Email</a> : null}
                  {m.status !== "read" ? <form action={setMessageStatusAction}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="status" value="read" /><button className={`${buttonBase} border-emerald/30 text-emerald`}><MailOpen className="h-4 w-4" />Mark as read</button></form> : null}
                  {m.status !== "archived" ? <form action={setMessageStatusAction}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="status" value="archived" /><button className={`${buttonBase} border-gold/40 text-ink/70`}><Archive className="h-4 w-4" />Archive</button></form> : null}
                  <form action={deleteMessageAction}><input type="hidden" name="id" value={m.id} /><ConfirmButton message="Permanently delete this message?" className={`${buttonBase} border-red-200 text-red-700`}><Trash2 className="h-4 w-4" />Delete</ConfirmButton></form>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
