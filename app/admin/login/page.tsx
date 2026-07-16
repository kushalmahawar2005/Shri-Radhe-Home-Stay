import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  // Already logged in → straight to the dashboard.
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-serif text-2xl font-bold text-emerald">
            Shri Radha Villa Stay
          </p>
          <p className="mt-1 text-sm text-ink/55">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-cream-light p-6 shadow-card">
          <h1 className="mb-5 text-center font-serif text-xl font-semibold text-ink">
            Welcome back
          </h1>
          <LoginForm from={searchParams.from} />
        </div>
      </div>
    </main>
  );
}
