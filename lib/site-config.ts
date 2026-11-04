/**
 * ────────────────────────────────────────────────────────────────────────
 *  SHRI RADHA VILLA STAY — single source of truth.
 *
 *  Non-coders: edit ONLY this file to change phones, address, links,
 *  rooms, facilities and nearby places. Everything on the website reads
 *  from here. After editing, run `npm run build` to regenerate the site.
 * ────────────────────────────────────────────────────────────────────────
 */

export type Room = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  blurb: string;
  features: string[];
  guests: string;
  price: string; // short label, e.g. "On Request"
  priceNight: string; // per-night rate shown on cards/detail, e.g. "₹1,500"
  tagline: string; // detail-page subtitle
  bed: string; // e.g. "King Size Bed"
  size: string; // e.g. "180 sq.ft"
  gallery: string[]; // thumbnail strip on the detail page
  amenities: string[]; // "Room Amenities" list
  highlights: string[]; // "Room Highlights" list
};

export type Facility = {
  /** lucide-react icon name (see components/icon.tsx mapping) */
  icon: string;
  label: string;
};

export type Nearby = {
  name: string;
  distance: string;
  image: string;
  alt: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  rating: number;
};

const PHONE_PRIMARY = "8619301401";
const PHONE_SECONDARY = "9799496789";
const E164_PRIMARY = "+918619301401";
const E164_SECONDARY = "+919799496789";

/** Pre-filled WhatsApp booking message. */
const WHATSAPP_MESSAGE =
  "Jai Shri Krishna, I'd like to book a stay at Shri Radha Villa Stay. Please share availability and details.";

/** The live domain. Every canonical, sitemap URL and schema @id builds on it. */
const PRODUCTION_URL = "https://shreeradhehomestay.in";

/**
 * Resolves the public site URL.
 *
 * A localhost value leaking into a production build would put
 * `http://localhost:3000` into the sitemap, every canonical tag and every
 * JSON-LD id — which de-indexes the whole site. So in production a localhost
 * override is ignored and the real domain wins.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  const isLocal = !!configured && /^https?:\/\/(localhost|127\.0\.0\.1)/.test(configured);

  if (configured && !(isLocal && process.env.NODE_ENV === "production")) {
    return configured;
  }
  return PRODUCTION_URL;
}

export const siteConfig = {
  name: "Shri Radha Villa Stay",
  shortName: "Shri Radha",
  tagline: "Stay With Peace & Devotion",
  description:
    "Book a family-friendly homestay in Nathdwara, an 8-minute walk from Shrinathji Temple. AC rooms, attached bathrooms, free Wi-Fi and parking at Shri Radha Villa Stay.",
  intro:
    "Experience a comfortable stay near Shrinathji Temple with modern amenities, spiritual surroundings and authentic Nathdwara hospitality.",

  // ── Public site URL (override via NEXT_PUBLIC_SITE_URL) ──
  url: resolveSiteUrl(),

  // ── Transparent brand emblem used in the navbar, footer and structured data ──
  // Drop your file in /public and put its path here, e.g. "/logo.png".
  // Set to null to fall back to the built-in gold feather/leaf mark.
  logo: "/logo-brand.webp" as string | null,

  // ── NAP (Name / Address / Phone) ──
  address: {
    street: "Haldighati Road, Kumbhalgarh Road",
    city: "Nathdwara",
    state: "Rajasthan",
    postalCode: "313301",
    country: "IN",
    full: "Haldighati Road, Kumbhalgarh Road, Nathdwara, Rajasthan",
    // Approximate coordinates for Nathdwara — replace with exact lat/lng.
    lat: 24.9302049,
    lng: 73.8125976,
  },

  phones: {
    primary: PHONE_PRIMARY,
    secondary: PHONE_SECONDARY,
    e164Primary: E164_PRIMARY,
    e164Secondary: E164_SECONDARY,
    telPrimary: `tel:${E164_PRIMARY}`,
    telSecondary: `tel:${E164_SECONDARY}`,
  },

  // ── Links / CTAs ──
  links: {
    instagram: "https://instagram.com/shriradhehomestay_",
    instagramHandle: "@shriradhehomestay_",
    facebook: "https://facebook.com/",
    // WhatsApp deep links with a pre-filled message.
    whatsappPrimary: `https://wa.me/918619301401?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`,
    whatsappSecondary: `https://wa.me/919799496789?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`,
    // TODO: paste the real Google Maps embed URL (Maps → Share → Embed a map).
    mapsEmbed:
      "https://www.google.com/maps?q=24.9302049,73.8125976&z=17&output=embed",
    // TODO: paste the real Google Maps directions link.
    mapsDirections:
      "https://www.google.com/maps/dir/?api=1&destination=24.9302049,73.8125976",
  },

  templeWalkTime: "8 minute walk",

  checkInTime: "12:00 PM",
  checkOutTime: "10:00 AM",

  // ₹ advance amount for online booking confirmation
  advanceAmount: 500,

  // ── Navigation ──
  nav: [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Gallery", href: "/gallery" },
    { label: "Nearby Attractions", href: "/attractions" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // ── Quick facts strip ──
  quickFacts: [
    { icon: "MapPin", label: "Nathdwara, Rajasthan" },
    { icon: "Footprints", label: "8 Min Walk to Shrinathji Temple" },
    { icon: "Snowflake", label: "3 AC Rooms" },
    { icon: "Bath", label: "Attached Bathrooms" },
    { icon: "Wifi", label: "Free WiFi" },
    { icon: "Car", label: "Parking Available" },
  ] satisfies Facility[],

  // ── About feature pills ──
  aboutFeatures: [
    { icon: "Users", label: "Family Friendly" },
    { icon: "Flower2", label: "Spiritual Environment" },
    { icon: "Sparkles", label: "Clean Rooms" },
    { icon: "Droplets", label: "24x7 Water" },
    { icon: "Car", label: "Taxi Assistance" },
    { icon: "HeartHandshake", label: "Warm Hospitality" },
  ] satisfies Facility[],

  // ── Rooms ──
  rooms: [
    {
      slug: "deluxe",
      name: "Deluxe Room",
      image: "/images/room-deluxe-enhanced.webp",
      alt: "Deluxe AC room with comfortable bedding at Shri Radha Villa Stay",
      blurb:
        "A cosy, well-appointed AC room perfect for couples and solo pilgrims seeking a peaceful stay near the temple.",
      features: ["AC", "Attached Bathroom", "Free WiFi", "2 Guests"],
      guests: "2 Guests",
      price: "On Request",
      priceNight: "₹2,500",
      tagline: "Comfort, Peace & Devotion",
      bed: "King Size Bed",
      size: "180 sq.ft",
      gallery: [
        "/images/room-deluxe-enhanced.webp",
        "/images/02.jpg",
        "/images/03.jpg",
        "/images/BathroomB.jpg",
      ],
      amenities: [
        "Air Conditioner",
        "Free High-Speed WiFi",
        "King Size Bed",
        "LED Television",
        "Attached Bathroom",
        "Hot & Cold Water",
        "Daily Housekeeping",
        "Room Service",
        "Wardrobe",
        "Seating Area",
      ],
      highlights: [
        "Temple Town View",
        "Peaceful Environment",
        "Ideal for Couples & Pilgrims",
      ],
    },
    {
      slug: "family",
      name: "Family Room",
      image: "/images/room-family-enhanced.webp",
      alt: "Spacious family room with multiple beds at Shri Radha Villa Stay",
      blurb:
        "A spacious, family-friendly room with room to relax together after darshan — ideal for families travelling with children or elders.",
      features: ["Spacious", "Family Friendly", "AC", "3–4 Guests"],
      guests: "3–4 Guests",
      price: "On Request",
      priceNight: "₹3,000",
      tagline: "Space, Comfort & Togetherness",
      bed: "2 King Size Beds",
      size: "300 sq.ft",
      gallery: [
        "/images/room-family-enhanced.webp",
        "/images/r2.jpg",
        "/images/r3.jpg",
        "/images/BathroomC.jpg",
      ],
      amenities: [
        "Air Conditioner",
        "Free High-Speed WiFi",
        "2 King Size Beds",
        "LED Television",
        "Attached Bathroom",
        "Hot & Cold Water",
        "Daily Housekeeping",
        "Room Service",
        "Extra Bedding",
        "Spacious Seating",
      ],
      highlights: [
        "Spacious Layout",
        "Ideal for Families",
        "Room for Children & Elders",
      ],
    },
    {
      slug: "premium",
      name: "Premium Room",
      image: "/images/room-premium-enhanced.webp",
      alt: "Premium room with temple town view and luxury bedding",
      blurb:
        "Our finest room with a temple-town view and luxury bedding, for guests who want an elevated, restful stay.",
      features: ["Temple Town View", "Luxury Bedding", "AC", "5–6 Guests"],
      guests: "5–6 Guests",
      price: "On Request",
      priceNight: "₹3,500",
      tagline: "Luxury, Calm & Devotion",
      bed: "King Size Bed",
      size: "240 sq.ft",
      gallery: [
        "/images/room-premium-enhanced.webp",
        "/images/c2.jpg",
        "/images/c3.jpg",
        "/images/BathroomA.jpg",
      ],
      amenities: [
        "Air Conditioner",
        "Free High-Speed WiFi",
        "King Size Bed",
        "LED Television",
        "Attached Bathroom",
        "Hot & Cold Water",
        "Daily Housekeeping",
        "Room Service",
        "Premium Bedding",
        "Balcony / View",
      ],
      highlights: [
        "Temple Town View",
        "Luxury Interiors",
        "Elevated Restful Stay",
      ],
    },
  ] satisfies Room[],

  // ── Divine energy gallery cards ──
  divineEnergy: [
    {
      title: "Shrinathji Darshan",
      caption: "A traditional Pichwai-inspired view of Shrinathji",
      image: "/images/divine-shrinathji-illustration.webp",
      alt: "AI-created Pichwai-style illustration of Shrinathji, lotuses and peacocks",
    },
    {
      title: "Bhajan & Spiritual Atmosphere",
      caption: "An evening of music, prayer and quiet reflection",
      image: "/images/divine-bhajan-illustration.webp",
      alt: "AI-created watercolor illustration of a small evening bhajan in a haveli courtyard",
    },
    {
      title: "Traditional Nathdwara Culture",
      caption: "The intricate colours and craft of Pichwai art",
      image: "/images/divine-pichwai-illustration.webp",
      alt: "AI-created illustration of a Nathdwara artist painting a Pichwai cloth",
    },
  ],

  // ── Facilities (10 line-icon tiles) ──
  facilities: [
    { icon: "Snowflake", label: "AC Rooms" },
    { icon: "Droplets", label: "24x7 Water" },
    { icon: "Bath", label: "Attached Bathrooms" },
    { icon: "Wifi", label: "Free WiFi" },
    { icon: "Car", label: "Parking" },
    { icon: "Sun", label: "Terrace Area" },
    { icon: "ConciergeBell", label: "Reception" },
    { icon: "CarTaxiFront", label: "Taxi Service" },
    { icon: "Users", label: "Family Stay" },
    { icon: "BedDouble", label: "Clean Linen" },
  ] satisfies Facility[],

  // ── Green highlight band ──
  highlights: [
    { icon: "Landmark", label: "Temple Nearby", sub: "8 min walk" },
    { icon: "Wifi", label: "Free WiFi", sub: "High speed internet" },
    { icon: "Car", label: "Parking", sub: "Safe and secure" },
    { icon: "CarTaxiFront", label: "Taxi Support", sub: "Local travel assistance" },
  ],

  // ── Nearby attractions ──
  nearby: [
    {
      name: "Shrinathji Temple",
      distance: "8 Min Walk",
      image: "/images/nearby-temple-illustration.webp",
      alt: "AI-created watercolor illustration inspired by Nathdwara temple architecture",
    },
    {
      name: "Statue of Belief",
      distance: "Short Drive",
      image: "/images/nearby-statue-illustration.webp",
      alt: "AI-created watercolor illustration inspired by the Statue of Belief in Nathdwara",
    },
    {
      name: "Haldighati",
      distance: "Nearby",
      image: "/images/nearby-haldighati-illustration.webp",
      alt: "AI-created watercolor illustration of the ochre Aravalli landscape at Haldighati",
    },
    {
      name: "Kumbhalgarh Fort",
      distance: "Day Trip",
      image: "/images/nearby-kumbhalgarh-illustration.webp",
      alt: "AI-created watercolor illustration inspired by Kumbhalgarh Fort and its Aravalli ridge",
    },
  ] satisfies Nearby[],

  // ── Testimonials ──
  testimonials: [
    {
      quote:
        "Very clean rooms and peaceful environment. Very close to Shrinathji Temple.",
      author: "Rajesh Sharma",
      location: "Pilgrim Guest",
      rating: 5,
    },
    {
      quote:
        "Felt like a home away from home. The hosts were warm and the location is perfect for early-morning darshan.",
      author: "Meena Agarwal",
      location: "Family Traveller",
      rating: 5,
    },
    {
      quote:
        "Spotless rooms, hot water round the clock and easy parking. Highly recommended for families.",
      author: "Suresh Patel",
      location: "Verified Stay",
      rating: 5,
    },
  ] satisfies Testimonial[],
} as const;

export type SiteConfig = typeof siteConfig;

/* ──────────────────────────────────────────────────────────────────────
 *  GALLERY — filterable photo grid (/gallery)
 * ──────────────────────────────────────────────────────────────────── */
export type GalleryCategory =
  | "Rooms"
  | "Exterior"
  | "Terrace"
  | "Reception"
  | "Temple"
  | "Surroundings";

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
};

export const galleryImages: GalleryImage[] = [
  { src: "/images/room-deluxe-enhanced.webp", alt: "Deluxe room at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/room-family-enhanced.webp", alt: "Family room at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/room-premium-enhanced.webp", alt: "Premium room at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/r2.jpg", alt: "A guest room with comfortable furnishings", category: "Rooms" },
  { src: "/images/r3.jpg", alt: "A family room with sleeping and seating space", category: "Rooms" },
  { src: "/images/02.jpg", alt: "Room interior at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/03.jpg", alt: "Room interior at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/c2.jpg", alt: "Room interior at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/c3.jpg", alt: "Room interior at Shri Radha Villa Stay", category: "Rooms" },
  { src: "/images/nearby-temple-illustration.webp", alt: "Illustration inspired by Nathdwara temple architecture", category: "Temple" },
  { src: "/images/divine-shrinathji-illustration.webp", alt: "Pichwai-style illustration of Shrinathji", category: "Temple" },
  { src: "/images/divine-bhajan-illustration.webp", alt: "Illustration of an evening bhajan in a haveli courtyard", category: "Temple" },
  { src: "/images/divine-pichwai-illustration.webp", alt: "Illustration of a Pichwai artist at work", category: "Surroundings" },
  { src: "/images/nearby-statue-illustration.webp", alt: "Illustration inspired by the Statue of Belief", category: "Surroundings" },
  { src: "/images/nearby-haldighati-illustration.webp", alt: "Illustrated Haldighati landscape", category: "Surroundings" },
  { src: "/images/nearby-kumbhalgarh-illustration.webp", alt: "Illustration inspired by Kumbhalgarh Fort", category: "Surroundings" },
];

export const galleryCategories: ("All" | GalleryCategory)[] = [
  "All",
  "Rooms",
  "Exterior",
  "Terrace",
  "Reception",
  "Temple",
  "Surroundings",
];

/* ──────────────────────────────────────────────────────────────────────
 *  NEARBY ATTRACTIONS — full list with travel times (/attractions)
 * ──────────────────────────────────────────────────────────────────── */
export type AttractionCategory =
  | "Temple"
  | "Historical"
  | "Nature"
  | "Spiritual"
  | "City & Culture";

export type Attraction = {
  name: string;
  category: AttractionCategory;
  blurb: string;
  image: string;
  alt: string;
  byCar: string;
  byBike: string;
  byWalk: string;
  mapUrl: string;
};

export const attractions: Attraction[] = [
  {
    name: "Shrinathji Temple",
    category: "Temple",
    blurb:
      "The heart of devotion in Nathdwara. Dedicated to Lord Shrinathji (Krishna), this sacred temple is one of the most important pilgrimage sites for Vaishnav devotees.",
    image: "/images/nearby-temple-illustration.webp",
    alt: "AI-created watercolor illustration inspired by Nathdwara temple architecture",
    byCar: "1.2 km",
    byBike: "5 Min",
    byWalk: "8 Min Walk",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shrinathji+Temple+Nathdwara",
  },
  {
    name: "Statue of Belief",
    category: "Spiritual",
    blurb:
      "A symbol of faith and inspiration — the tallest statue of Lord Shiva in the world, standing 351 feet tall on the outskirts of Nathdwara.",
    image: "/images/nearby-statue-illustration.webp",
    alt: "AI-created watercolor illustration inspired by the Statue of Belief in Nathdwara",
    byCar: "4.5 km",
    byBike: "10 Min",
    byWalk: "—",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Statue+of+Belief+Nathdwara",
  },
  {
    name: "Haldighati",
    category: "Historical",
    blurb:
      "The historic land of bravery, famous for the battle of Maharana Pratap and Chetak. This place is a symbol of Rajput valour and pride.",
    image: "/images/nearby-haldighati-illustration.webp",
    alt: "AI-created watercolor illustration of the Aravalli landscape at Haldighati",
    byCar: "18 km",
    byBike: "30 Min",
    byWalk: "—",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Haldighati+Rajasthan",
  },
  {
    name: "Kumbhalgarh Fort",
    category: "Historical",
    blurb:
      "A UNESCO World Heritage Site and a magnificent fort with massive walls, running rivers and a rich history of Mewar.",
    image: "/images/nearby-kumbhalgarh-illustration.webp",
    alt: "AI-created watercolor illustration inspired by Kumbhalgarh Fort",
    byCar: "48 km",
    byBike: "75 Min",
    byWalk: "—",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kumbhalgarh+Fort",
  },
  {
    name: "Eklingji Temple",
    category: "Temple",
    blurb:
      "A divine abode of Lord Shiva — an ancient temple dedicated to Lord Eklingji, the presiding deity of Mewar.",
    image: "/images/temple.jpg",
    alt: "Eklingji Temple near Nathdwara",
    byCar: "22 km",
    byBike: "35 Min",
    byWalk: "—",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Eklingji+Temple",
  },
  {
    name: "Udaipur",
    category: "City & Culture",
    blurb:
      "The City of Lakes — a beautiful city known for its lakes, palaces, gardens and royal heritage, perfect for a day trip from Nathdwara.",
    image: "/images/building.jpg",
    alt: "Udaipur, the City of Lakes",
    byCar: "48 km",
    byBike: "70 Min",
    byWalk: "—",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Udaipur+Rajasthan",
  },
];

export const attractionCategories: ("All Places" | AttractionCategory)[] = [
  "All Places",
  "Temple",
  "Historical",
  "Nature",
  "Spiritual",
  "City & Culture",
];

/* ──────────────────────────────────────────────────────────────────────
 *  ABOUT — story, hosts, hospitality promise (/about)
 * ──────────────────────────────────────────────────────────────────── */
export const about = {
  tagline: "A Home, Where Devotion Meets Comfort.",
  intro:
    "Shri Radha Villa Stay is a humble initiative born out of love, devotion and a desire to provide a peaceful and comfortable stay for devotees visiting the holy town of Nathdwara.",
  story: [
    "Nathdwara is not just a destination, it is an emotion for every devotee of Lord Shrinathji. Over the years, we realised that visitors come here not only for darshan but also for peace, blessings and a break from their busy lives.",
    "With this thought, we opened the doors of our home to guests, creating them like family and ensuring they feel the same warmth, care and positivity that we value in our own lives.",
    "Today, Shri Radha Villa Stay is more than just a place to stay — it is an experience of devotion, comfort and heartfelt hospitality.",
  ],
  storyBadges: [
    { icon: "Footprints", title: "Close to Shrinathji Temple", sub: "Just 8 Minutes Walk" },
    { icon: "Users", title: "Personalised Hospitality", sub: "Guests are Family" },
    { icon: "Flower2", title: "Peaceful Environment", sub: "Spiritual & Relaxing Stay" },
    { icon: "HeartHandshake", title: "Best Price Guarantee", sub: "Honest & Transparent" },
  ],
  hosts: [
    { name: "Our Host Family", role: "Owners & Hosts", image: "/images/building.jpg" },
  ],
  promises: [
    { icon: "Sparkles", title: "Clean & Comfortable Rooms", desc: "Well-maintained and hygienic" },
    { icon: "Droplets", title: "Warm & Personal Service", desc: "Always here to help you" },
    { icon: "ConciergeBell", title: "Modern Amenities", desc: "Comfort meets tradition" },
    { icon: "Flower2", title: "Peaceful & Spiritual Environment", desc: "Feel the divine energy" },
    { icon: "MapPin", title: "Prime Location", desc: "Close to temple & major places" },
    { icon: "HeartHandshake", title: "Value for Money", desc: "Premium stay at honest prices" },
  ],
} as const;

/* ──────────────────────────────────────────────────────────────────────
 *  FAQ — shown on the contact page
 * ──────────────────────────────────────────────────────────────────── */
export const faqs = [
  {
    q: "How far is the Shri Radha Villa Stay from the Shrinathji Temple?",
    a: "We are located just an 8 minute walk from the Shrinathji Temple, making it perfect for early-morning darshan.",
  },
  {
    q: "Do you provide parking facilities?",
    a: "Yes, we provide safe and secure parking for our guests, including cars and two-wheelers.",
  },
  {
    q: "Is WiFi available at the villa?",
    a: "Yes, free high-speed WiFi is available in all rooms and common areas.",
  },
  {
    q: "Do you provide taxi or travel assistance?",
    a: "Yes, we can arrange taxis and local travel assistance for darshan and nearby sightseeing.",
  },
  {
    q: "Can I check-in early or check-out late?",
    a: "Early check-in and late check-out are subject to availability. Please contact us in advance and we will do our best to help.",
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  BOOKING — trust badges shown on the booking page/success page
 * ──────────────────────────────────────────────────────────────────── */
export const bookingPerks = [
  { icon: "Footprints", title: "8 Min Walk", sub: "to Shrinathji Temple" },
  { icon: "Snowflake", title: "AC Rooms", sub: "Clean & comfortable" },
  { icon: "Flower2", title: "Peaceful", sub: "Spiritual environment" },
  { icon: "HeartHandshake", title: "Best Price", sub: "Honest & transparent" },
];
