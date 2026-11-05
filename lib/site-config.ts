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

/** Facilities included with every room (confirmed by the owners). */
export const COMMON_AMENITIES = [
  "Complimentary Tea, Coffee & Milk",
  "Free WiFi",
  "Private Parking",
  "24-Hour Hot & Cold Water",
  "Mineral Water",
  "Attached Bathroom with Geyser",
] as const;
const AC_AMENITIES = ["Air Conditioner", ...COMMON_AMENITIES] as const;
const NON_AC_AMENITIES = ["Ceiling Fan", ...COMMON_AMENITIES] as const;

/** `/images/rooms/<slug>/01.webp` … `NN.webp` */
function roomPhotos(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/images/rooms/${slug}/${String(i + 1).padStart(2, "0")}.webp`);
}

export const siteConfig = {
  name: "Shri Radha Villa Stay",
  shortName: "Shri Radha",
  tagline: "Stay With Peace & Devotion",
  description:
    "Book a family-friendly homestay in Nathdwara, an 8-minute walk from Shrinathji Temple. 7 AC & non-AC rooms with attached bathrooms, free tea & coffee, Wi-Fi and parking at Shri Radha Villa Stay.",
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
    { icon: "Snowflake", label: "7 Rooms · AC & Non-AC" },
    { icon: "Bath", label: "Attached Bathrooms" },
    { icon: "Wifi", label: "Free WiFi" },
    { icon: "Car", label: "Private Parking" },
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
  // Every room includes complimentary tea, coffee & milk, free WiFi, private
  // parking, 24-hour hot & cold water, mineral water and an attached bathroom
  // with geyser (as confirmed by the owners, Nov 2026).
  rooms: [
    {
      slug: "radha-rani",
      name: "Radha Rani",
      image: "/images/room-premium-enhanced.webp",
      alt: "Radha Rani AC room with a large bed and sitting area at Shri Radha Villa Stay",
      blurb:
        "Our largest AC room, with space for five adults — ideal for bigger families and groups visiting Shrinathji together.",
      features: ["AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "5 Guests"],
      guests: "5 Adults",
      price: "On Request",
      priceNight: "₹4,500",
      tagline: "Spacious AC Room for Big Families",
      bed: "Double Bed + Extra Bedding",
      size: "",
      gallery: [
        "/images/room-premium-enhanced.webp",
        "/images/c2.jpg",
        "/images/c3.jpg",
        "/images/BathroomA.jpg",
      ],
      amenities: [...AC_AMENITIES],
      highlights: ["Sleeps 5 Adults", "Our Largest Room", "Ideal for Big Families"],
    },
    {
      slug: "makhan-chor",
      name: "Makhan Chor",
      image: "/images/rooms/makhan-chor/01.webp",
      alt: "Makhan Chor AC room with two double beds at Shri Radha Villa Stay",
      blurb:
        "A freshly renovated AC room with two double beds and traditional Rajasthani wall art — comfortable for four adults.",
      features: ["AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "4 Guests"],
      guests: "4 Adults",
      price: "On Request",
      priceNight: "₹4,200",
      tagline: "Newly Renovated AC Room",
      bed: "2 Double Beds",
      size: "",
      gallery: roomPhotos("makhan-chor", 8),
      amenities: [...AC_AMENITIES],
      highlights: ["Newly Renovated", "Two Double Beds", "Rajasthani Wall Art"],
    },
    {
      slug: "bal-gopal",
      name: "Bal Gopal",
      image: "/images/room-family-enhanced.webp",
      alt: "Bal Gopal AC room with a loft bed that children love at Shri Radha Villa Stay",
      blurb:
        "A cheerful AC room with a loft-style bed that children love — for three adults and one child.",
      features: ["AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "3 Adults + 1 Child"],
      guests: "3 Adults + 1 Child",
      price: "On Request",
      priceNight: "₹4,000",
      tagline: "Fun AC Room for Families with Kids",
      bed: "Double Bed + Loft Bed",
      size: "",
      gallery: [
        "/images/room-family-enhanced.webp",
        "/images/r2.jpg",
        "/images/r3.jpg",
        "/images/BathroomC.jpg",
      ],
      amenities: [...AC_AMENITIES],
      highlights: ["Loft Bed Kids Love", "Family Friendly", "Cheerful Interiors"],
    },
    {
      slug: "madhuvan",
      name: "Madhuvan",
      image: "/images/rooms/madhuvan/03.webp",
      alt: "Madhuvan room with two double beds and sunflower wall decor at Shri Radha Villa Stay",
      blurb:
        "A bright, airy room with two double beds and sunflower décor — room for four adults at a simple, honest price.",
      features: ["Non-AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "4 Guests"],
      guests: "4 Adults",
      price: "On Request",
      priceNight: "₹4,000",
      tagline: "Bright Room for Four",
      bed: "2 Double Beds",
      size: "",
      gallery: roomPhotos("madhuvan", 7),
      amenities: [...NON_AC_AMENITIES],
      highlights: ["Sleeps 4 Adults", "Two Double Beds", "Bright & Airy"],
    },
    {
      slug: "radhika-rajkunj",
      name: "Radhika Rajkunj",
      image: "/images/rooms/radhika-rajkunj/03.webp",
      alt: "Radhika Rajkunj room with two double beds and a sitting corner at Shri Radha Villa Stay",
      blurb:
        "A spacious room with two double beds and its own cane-chair sitting corner — comfortable for four adults.",
      features: ["Non-AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "4 Guests"],
      guests: "4 Adults",
      price: "On Request",
      priceNight: "₹4,000",
      tagline: "Spacious Room with a Sitting Corner",
      bed: "2 Double Beds",
      size: "",
      gallery: roomPhotos("radhika-rajkunj", 7),
      amenities: [...NON_AC_AMENITIES],
      highlights: ["Sleeps 4 Adults", "Private Sitting Corner", "Spacious Layout"],
    },
    {
      slug: "kishori-kripa",
      name: "Kishori Kripa",
      image: "/images/rooms/kishori-kripa/06.webp",
      alt: "Kishori Kripa room with traditional painted walls at Shri Radha Villa Stay",
      blurb:
        "A peaceful room with hand-painted Rajasthani borders — for three adults and one child.",
      features: ["Non-AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "3 Adults + 1 Child"],
      guests: "3 Adults + 1 Child",
      price: "On Request",
      priceNight: "₹4,000",
      tagline: "Peaceful Room with Traditional Art",
      bed: "Double Bed + Single Bed",
      size: "",
      gallery: roomPhotos("kishori-kripa", 7),
      amenities: [...NON_AC_AMENITIES],
      highlights: ["Hand-Painted Walls", "Family Friendly", "Quiet & Peaceful"],
    },
    {
      slug: "kanupriya",
      name: "Kanupriya",
      image: "/images/rooms/kanupriya/02.webp",
      alt: "Kanupriya room with colourful butterfly wall decor at Shri Radha Villa Stay",
      blurb:
        "A colourful, cosy room with butterfly décor and a dressing area — for three adults and one child.",
      features: ["Non-AC", "Attached Bath + Geyser", "Tea, Coffee & Milk", "3 Adults + 1 Child"],
      guests: "3 Adults + 1 Child",
      price: "On Request",
      priceNight: "₹4,000",
      tagline: "Colourful, Cosy Family Room",
      bed: "Double Bed + Single Bed",
      size: "",
      gallery: roomPhotos("kanupriya", 9),
      amenities: [...NON_AC_AMENITIES],
      highlights: ["Colourful Décor", "Dressing Area", "Family Friendly"],
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
    { icon: "Snowflake", label: "AC & Non-AC Rooms" },
    { icon: "Droplets", label: "24x7 Hot & Cold Water" },
    { icon: "Bath", label: "Attached Bathrooms" },
    { icon: "Wifi", label: "Free WiFi" },
    { icon: "Car", label: "Private Parking" },
    { icon: "Coffee", label: "Tea, Coffee & Milk" },
    { icon: "GlassWater", label: "Mineral Water" },
    { icon: "Sun", label: "Terrace Area" },
    { icon: "ConciergeBell", label: "Reception" },
    { icon: "CarTaxiFront", label: "Taxi Service" },
    { icon: "Users", label: "Family Stay" },
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
/** Gallery photos are grouped by room name (e.g. "Madhuvan"). */
export type GalleryCategory = string;

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
};

/** The gallery shows every photo of every room, grouped by room. */
export const galleryImages: GalleryImage[] = siteConfig.rooms.flatMap((room) =>
  room.gallery.map((src, i) => ({
    src,
    alt: `${room.name} room at Shri Radha Villa Stay — photo ${i + 1}`,
    category: room.name,
  })),
);

export const galleryCategories: ("All" | GalleryCategory)[] = [
  "All",
  ...siteConfig.rooms.map((room) => room.name),
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
    image: "/images/shrinathji-temple-photo.webp",
    alt: "Entrance to Shrinathji Temple in Nathdwara",
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
    image: "/images/eklingji-temple-photo.webp",
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
    image: "/images/udaipur-lake-pichola.webp",
    alt: "Lake Pichola and Jag Mandir in Udaipur",
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
    q: "Are all rooms air-conditioned?",
    a: "We have 7 rooms: Radha Rani, Makhan Chor and Bal Gopal are AC rooms, while Madhuvan, Radhika Rajkunj, Kishori Kripa and Kanupriya are non-AC rooms. Every room has an attached bathroom with geyser.",
  },
  {
    q: "Are tea and coffee included?",
    a: "Yes. Tea, coffee and milk are complimentary in every room, along with mineral water.",
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
/** Guest choices offered on the availability card and booking form. */
export const guestOptions = [
  "1 Adult",
  "2 Adults",
  "2 Adults + 1 Child",
  "3 Adults",
  "3 Adults + 1 Child",
  "4 Adults",
  "5 Adults",
] as const;

export const bookingPerks = [
  { icon: "Footprints", title: "8 Min Walk", sub: "to Shrinathji Temple" },
  { icon: "Coffee", title: "Free Tea & Coffee", sub: "In every room" },
  { icon: "Flower2", title: "Peaceful", sub: "Spiritual environment" },
  { icon: "HeartHandshake", title: "Best Price", sub: "Honest & transparent" },
];
