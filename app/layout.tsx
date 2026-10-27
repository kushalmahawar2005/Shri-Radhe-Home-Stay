import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { ALL_KEYWORDS } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

/** Keyword-forward default title — the phrase people actually search for. */
const DEFAULT_TITLE = `Home Stay in Nathdwara Near Shrinathji Temple | ${siteConfig.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_TITLE,
    // Page titles already carry "Nathdwara"; keep the suffix short so Google
    // does not truncate the keyword out of the SERP.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ALL_KEYWORDS,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "Travel & Accommodation",
  alternates: { canonical: "/" },
  // Phone numbers are already real links; stop iOS from re-styling them.
  formatDetection: { telephone: false, address: false, email: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: DEFAULT_TITLE,
    description: siteConfig.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name}, Nathdwara`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: siteConfig.description,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E4A3C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${mukta.variable}`}>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
