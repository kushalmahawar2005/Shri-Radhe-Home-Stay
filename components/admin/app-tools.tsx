"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, BellRing, CheckCircle2, Download, Loader2, Share, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
 *  Admin web app: service worker, "Install app" and push notifications.
 * ──────────────────────────────────────────────────────────────────── */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function getRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  return (
    (await navigator.serviceWorker.getRegistration("/admin/")) ??
    (await navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" }))
  );
}

/* The install prompt fires once, early — keep it for any button that asks. */
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

/** Registers the admin service worker. Render once in the admin layout. */
export function AdminPwa() {
  useEffect(() => {
    getRegistration().catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      listeners.forEach((fn) => fn());
    };
    const onInstalled = () => {
      deferredPrompt = null;
      listeners.forEach((fn) => fn());
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return null;
}

function useInstallState() {
  const [, force] = useState(0);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(isStandalone());
    const fn = () => {
      setInstalled(isStandalone());
      force((n) => n + 1);
    };
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return { installed, canPrompt: Boolean(deferredPrompt) };
}

/* ── Install button ─────────────────────────────────────────────────── */

export function InstallAppButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { installed, canPrompt } = useInstallState();
  const [help, setHelp] = useState(false);

  if (installed) {
    return compact ? null : (
      <p className={cn("flex min-h-11 items-center gap-2 text-sm font-medium text-emerald", className)}>
        <CheckCircle2 className="h-4 w-4" /> App is installed on this device
      </p>
    );
  }

  async function install() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      listeners.forEach((fn) => fn());
    } else {
      setHelp(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={install}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
          compact ? "text-emerald hover:bg-emerald/10" : "justify-center bg-emerald text-white hover:bg-emerald-dark",
          className,
        )}
      >
        <Download className="h-4 w-4" />
        {canPrompt || compact ? "Download app" : "Install app on this device"}
      </button>
      {help ? <InstallHelp onClose={() => setHelp(false)} /> : null}
    </>
  );
}

function InstallHelp({ onClose }: { onClose: () => void }) {
  const ios = isIos();
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="install-help-title" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-cream-light p-5 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 id="install-help-title" className="font-serif text-lg font-semibold text-emerald">Install the admin app</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-ink/60 hover:bg-cream"><X className="h-5 w-5" /></button>
        </div>
        {ios ? (
          <ol className="mt-3 space-y-2 text-sm text-ink/75">
            <li>1. Open this page in <strong>Safari</strong>.</li>
            <li className="flex flex-wrap items-center gap-1">2. Tap the <Share className="inline h-4 w-4" /> <strong>Share</strong> button.</li>
            <li>3. Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
            <li>4. Open the app from your home screen and turn on notifications.</li>
          </ol>
        ) : (
          <ol className="mt-3 space-y-2 text-sm text-ink/75">
            <li>1. Open this page in <strong>Chrome</strong> (or Edge).</li>
            <li>2. Tap the <strong>⋮</strong> menu at the top right.</li>
            <li>3. Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          </ol>
        )}
        <button type="button" onClick={onClose} className="mt-4 min-h-11 w-full rounded-xl bg-emerald text-sm font-semibold text-white">Got it</button>
      </div>
    </div>
  );
}

/* ── Notifications ──────────────────────────────────────────────────── */

type PushState = "loading" | "unsupported" | "needs-install" | "off" | "on" | "blocked" | "not-configured";

export function NotificationsCard() {
  const [state, setState] = useState<PushState>("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) return setState("not-configured");
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported) return setState(isIos() && !isStandalone() ? "needs-install" : "unsupported");
    if (Notification.permission === "denied") return setState("blocked");
    const reg = await getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    setState(sub ? "on" : "off");
  }, []);

  useEffect(() => {
    refresh().catch(() => setState("unsupported"));
  }, [refresh]);

  async function turnOn() {
    setBusy(true);
    setMessage("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }
      const reg = await getRegistration();
      if (!reg) throw new Error("no-sw");
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) }));
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "save-failed");
      }
      setState("on");
      setMessage("Notifications are on for this device.");
    } catch (err) {
      setMessage(err instanceof Error && err.message.length > 12 ? err.message : "Could not turn on notifications. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    setMessage("");
    try {
      const reg = await getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/admin/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("off");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { sent?: number };
      setMessage(data.sent ? `Test sent to ${data.sent} device${data.sent === 1 ? "" : "s"}. It should appear in a few seconds.` : "No device received it. Try turning notifications off and on again.");
    } finally {
      setBusy(false);
    }
  }

  const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:opacity-60";

  return (
    <div>
      <div className="flex items-center gap-2">
        {state === "on" ? <BellRing className="h-5 w-5 text-emerald" /> : state === "blocked" ? <BellOff className="h-5 w-5 text-red-600" /> : <Bell className="h-5 w-5 text-ink/60" />}
        <p className="font-semibold text-ink">
          {state === "on" ? "Booking alerts are ON" : state === "loading" ? "Checking…" : "Booking alerts are off"}
        </p>
      </div>

      <p className="mt-1 text-sm text-ink/60">
        {state === "on" && "You'll get a notification on this device for every new booking."}
        {state === "off" && "Get a notification on this phone or computer the moment a guest books."}
        {state === "blocked" && "Notifications are blocked for this site. Allow them in your browser or phone settings, then reload this page."}
        {state === "needs-install" && "On iPhone, first install the app (button above), open it from your home screen, then turn on alerts here."}
        {state === "unsupported" && "This browser can't show notifications. Try Chrome on Android or a computer, or the installed app on iPhone."}
        {state === "not-configured" && "Notifications are not set up on the server yet (missing VAPID keys)."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {state === "off" ? (
          <button type="button" onClick={turnOn} disabled={busy} className={cn(btn, "bg-emerald text-white hover:bg-emerald-dark")}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />} Turn on booking alerts
          </button>
        ) : null}
        {state === "on" ? (
          <>
            <button type="button" onClick={sendTest} disabled={busy} className={cn(btn, "bg-emerald text-white hover:bg-emerald-dark")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />} Send test alert
            </button>
            <button type="button" onClick={turnOff} disabled={busy} className={cn(btn, "border border-gold/40 text-ink/70 hover:bg-cream")}>
              Turn off
            </button>
          </>
        ) : null}
      </div>
      {message ? <p role="status" className="mt-2 text-sm text-emerald">{message}</p> : null}
    </div>
  );
}

/** Dashboard card: install the app + booking alerts. */
export function AdminAppCard() {
  return (
    <section className="rounded-2xl border border-gold/25 bg-cream-light p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/10"><Smartphone className="h-5 w-5 text-emerald" /></span>
        <div>
          <h2 className="font-serif text-lg font-semibold text-emerald">Phone app & booking alerts</h2>
          <p className="mt-0.5 text-sm text-ink/60">Install this admin panel like an app and get notified about every new booking.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-cream p-4">
          <p className="mb-2 text-sm font-semibold text-ink">1. Install the app</p>
          <InstallAppButton />
        </div>
        <div className="rounded-xl bg-cream p-4">
          <p className="mb-2 text-sm font-semibold text-ink">2. Turn on alerts</p>
          <NotificationsCard />
        </div>
      </div>
    </section>
  );
}
