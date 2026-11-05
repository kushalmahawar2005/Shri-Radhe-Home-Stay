import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The admin panel always reflects live data.
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-cream font-sans text-ink md:flex-row">
      <AdminSidebar email={session.email} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
