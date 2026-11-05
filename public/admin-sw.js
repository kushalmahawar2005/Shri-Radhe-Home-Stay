/* Service worker for the Shri Radha Villa Stay admin app (scope: /admin/).
 * Shows push notifications for new bookings and messages, and opens the
 * right admin page when a notification is tapped. It does not cache pages:
 * the admin panel must always show live data. */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Shri Radha Villa Stay", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Shri Radha Villa Stay";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/admin-app/icon-192.png",
      badge: "/admin-app/badge-96.png",
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || "/admin/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/admin/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin + "/admin")) {
          await client.focus();
          if ("navigate" in client) await client.navigate(url);
          return;
        }
      }
      await self.clients.openWindow(url);
    })(),
  );
});

// A fetch handler keeps the app installable in every browser. Requests go
// straight to the network — nothing is cached.
self.addEventListener("fetch", () => {});
