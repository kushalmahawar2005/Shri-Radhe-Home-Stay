import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getBrand, getContact } from "@/lib/content-store";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-emerald focus:px-4 focus:py-2 focus:text-cream-light"
      >
        Skip to content
      </a>
      <Navbar
        brand={{
          name: brand.name,
          shortName: brand.shortName,
          logo: brand.logo,
        }}
        whatsappPrimary={contact.links.whatsappPrimary}
      />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab whatsappPrimary={contact.links.whatsappPrimary} />
    </>
  );
}
