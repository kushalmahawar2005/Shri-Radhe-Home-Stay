import type { Metadata, Viewport } from "next";
import { AdminPwa } from "@/components/admin/app-tools";

/** Makes /admin installable as its own app (separate from the public site). */
export const metadata: Metadata = {
  manifest: "/admin-app/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Radha Admin", statusBarStyle: "default" },
  icons: { apple: "/admin-app/apple-icon-180.png" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1f4d3a",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminPwa />
      {children}
    </>
  );
}
