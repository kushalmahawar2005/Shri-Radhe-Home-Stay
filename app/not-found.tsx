import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lotus } from "@/components/decor";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-gradient px-6 text-center">
      <Lotus className="h-12 w-20 text-gold" />
      <h1 className="mt-4 font-serif text-6xl font-bold text-emerald">404</h1>
      <p className="mt-2 font-serif text-2xl text-ink">Page not found</p>
      <p className="mt-2 max-w-sm text-ink/70">
        The page you&apos;re looking for has wandered off. Let&apos;s get you
        back home.
      </p>
      <Button asChild variant="primary" className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}
