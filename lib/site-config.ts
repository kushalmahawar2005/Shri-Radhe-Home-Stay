/**
 * ────────────────────────────────────────────────────────────────────────
 *  SHRI RADHA HOME STAY — single source of truth.
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
  "Jai Shri Krishna, I'd like to book a stay at Shri Radha Home Stay. Please share availability and details.";

export const siteConfig = {
  name: "Shri Radha Home Stay",
  shortName: "Shri Radha",
  tagline: "Stay With Peace & Devotion",
  description:
    "A serene, family-friendly homestay in Nathdwara, just a 5–8 minute walk from the Shrinathji Temple. 3 AC rooms with attached bathrooms, 24x7 hot water, free WiFi and warm hospitality.",
  intro:
    "Experience a comfortable stay near Shrinathji Temple with modern amenities, spiritual surroundings and authentic Nathdwara hospitality.",

  // ── Public site URL (override via NEXT_PUBLIC_SITE_URL) ──
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://shriradhahomestay.com",

  // ── Logo image (shown next to the wordmark in navbar & footer) ──
  // Drop your file in /public and put its path here, e.g. "/logo.png".
  // Set to null to fall back to the built-in gold feather/leaf mark.
  logo: "/logo.jpg" as string | null,

  // ── NAP (Name / Address / Phone) ──
  address: {
    street: "Haldighati Road, Kumbhalgarh Road",
    city: "Nathdwara",
    state: "Rajasthan",
    postalCode: "313301",
    country: "IN",
    full: "Haldighati Road, Kumbhalgarh Road, Nathdwara, Rajasthan",
    // Approximate coordinates for Nathdwara — replace with exact lat/lng.
    lat: 24.9305,
    lng: 73.8242,
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
      "https://www.google.com/maps?q=Nathdwara%20Rajasthan&output=embed",
    // TODO: paste the real Google Maps directions link.
    mapsDirections:
      "https://www.google.com/maps/dir/?api=1&destination=Shrinathji+Temple+Nathdwara",
  },

  templeWalkTime: "5–8 minute walk",

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
    { icon: "Footprints", label: "5–8 Min Walk to Shrinathji Temple" },
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
      image: "/images/02.jpg",
      alt: "Deluxe AC room with comfortable bedding at Shri Radha Home Stay",
      blurb:
        "A cosy, well-appointed AC room perfect for couples and solo pilgrims seeking a peaceful stay near the temple.",
      features: ["AC", "Attached Bathroom", "Free WiFi", "2 Guests"],
      guests: "2 Guests",
      price: "On Request",
      priceNight: "₹1,500",
      tagline: "Comfort, Peace & Devotion",
      bed: "King Size Bed",
      size: "180 sq.ft",
      gallery: [
        "/images/01.jpg",
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
      image: "/images/r3.jpg",
      alt: "Spacious family room with multiple beds at Shri Radha Home Stay",
      blurb:
        "A spacious, family-friendly room with room to relax together after darshan — ideal for families travelling with children or elders.",
      features: ["Spacious", "Family Friendly", "AC", "3–4 Guests"],
      guests: "3–4 Guests",
      price: "On Request",
      priceNight: "₹2,500",
      tagline: "Space, Comfort & Togetherness",
      bed: "2 King Size Beds",
      size: "300 sq.ft",
      gallery: [
        "/images/r1.jpg",
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
      image: "/images/c1.jpg",
      alt: "Premium room with temple town view and luxury bedding",
      blurb:
        "Our finest room with a temple-town view and luxury bedding, for guests who want an elevated, restful stay.",
      features: ["Temple Town View", "Luxury Bedding", "AC", "5–6 Guests"],
      guests: "5–6 Guests",
      price: "On Request",
      priceNight: "₹3,200",
      tagline: "Luxury, Calm & Devotion",
      bed: "King Size Bed",
      size: "240 sq.ft",
      gallery: [
        "/images/c1.jpg",
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
      caption: "Experience Divine Peace and Blessings",
      image: "/images/darshan.jpg",
      alt: "Shrinathji deity darshan in Nathdwara",
    },
    {
      title: "Bhajan & Spiritual Atmosphere",
      caption: "Start your day with positivity and peace",
      image: "/images/bhajan.jpg",
      alt: "Devotees singing bhajans in a spiritual atmosphere",
    },
    {
      title: "Traditional Nathdwara Culture",
      caption: "Experience the rich heritage and devotion",
      image: "/images/culture.jpg",
      alt: "Traditional Pichwai art and Nathdwara culture",
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
    { icon: "Landmark", label: "Temple Nearby", sub: "5–8 min walk" },
    { icon: "Wifi", label: "Free WiFi", sub: "High speed internet" },
    { icon: "Car", label: "Parking", sub: "Safe and secure" },
    { icon: "CarTaxiFront", label: "Taxi Support", sub: "Local travel assistance" },
  ],

  // ── Nearby attractions ──
  nearby: [
    {
      name: "Shrinathji Temple",
      distance: "5–8 Min Walk",
      image: "/images/shrenathji.jpg",
      alt: "Shrinathji Temple, Nathdwara",
    },
    {
      name: "Statue of Belief",
      distance: "Short Drive",
      image: "/images/statue.jpg",
      alt: "Statue of Belief (Vishwas Swaroopam), Nathdwara",
    },
    {
      name: "Haldighati",
      distance: "Nearby",
      image: "/images/haldighati.jpg",
      alt: "Haldighati historic battlefield site near Nathdwara",
    },
    {
      name: "Kumbhalgarh Fort",
      distance: "Day Trip",
      image: "/images/kumbalgarh.jpg",
      alt: "Kumbhalgarh Fort, a UNESCO World Heritage site",
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
  { src: "/images/room-deluxe.jpg", alt: "Deluxe AC room", category: "Rooms" },
  { src: "/images/building.jpg", alt: "Heritage-style building exterior", category: "Exterior" },
  { src: "/images/room-premium.jpg", alt: "Premium room interior", category: "Rooms" },
  { src: "/images/hero-room.jpg", alt: "Reception and lobby area", category: "Reception" },
  { src: "/images/food.jpg", alt: "Dining and terrace seating", category: "Terrace" },
  { src: "/images/nearby-shrinathji.jpg", alt: "Shrinathji Temple, Nathdwara", category: "Temple" },
  { src: "/images/terrace.jpg", alt: "Open terrace with seating", category: "Terrace" },
  { src: "/images/room-family.jpg", alt: "Spacious family room", category: "Rooms" },
  { src: "/images/nearby-statue.jpg", alt: "Statue of Belief, Nathdwara", category: "Surroundings" },
  { src: "/images/darshan.jpg", alt: "Shrinathji darshan", category: "Temple" },
  { src: "/images/culture.jpg", alt: "Traditional Pichwai art and culture", category: "Surroundings" },
  { src: "/images/nearby-kumbhalgarh.jpg", alt: "Kumbhalgarh Fort", category: "Surroundings" },
  { src: "/images/temple.jpg", alt: "Temple town view", category: "Temple" },
  { src: "/images/03.jpg", alt: "Comfortable bedding and decor", category: "Rooms" },
  { src: "/images/nearby-haldighati.jpg", alt: "Haldighati historic site", category: "Surroundings" },
  { src: "/images/bhajan.jpg", alt: "Bhajan and spiritual atmosphere", category: "Temple" },
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
    image: "/images/nearby-shrinathji.jpg",
    alt: "Shrinathji Temple, Nathdwara",
    byCar: "1.2 km",
    byBike: "5 Min",
    byWalk: "15 Min Walk",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shrinathji+Temple+Nathdwara",
  },
  {
    name: "Statue of Belief",
    category: "Spiritual",
    blurb:
      "A symbol of faith and inspiration — the tallest statue of Lord Shiva in the world, standing 351 feet tall on the outskirts of Nathdwara.",
    image: "/images/nearby-statue.jpg",
    alt: "Statue of Belief (Vishwas Swaroopam), Nathdwara",
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
    image: "/images/nearby-haldighati.jpg",
    alt: "Haldighati historic battlefield site near Nathdwara",
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
    image: "/images/nearby-kumbhalgarh.jpg",
    alt: "Kumbhalgarh Fort, a UNESCO World Heritage site",
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
    "Shri Radha Home Stay is a humble initiative born out of love, devotion and a desire to provide a peaceful and comfortable stay for devotees visiting the holy town of Nathdwara.",
  story: [
    "Nathdwara is not just a destination, it is an emotion for every devotee of Lord Shrinathji. Over the years, we realised that visitors come here not only for darshan but also for peace, blessings and a break from their busy lives.",
    "With this thought, we opened the doors of our home to guests, creating them like family and ensuring they feel the same warmth, care and positivity that we value in our own lives.",
    "Today, Shri Radha Home Stay is more than just a place to stay — it is an experience of devotion, comfort and heartfelt hospitality.",
  ],
  storyBadges: [
    { icon: "Footprints", title: "Close to Shrinathji Temple", sub: "Just 5–8 Minutes Walk" },
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
    q: "How far is the Shri Radha Home Stay from the Shrinathji Temple?",
    a: "We are located just a 5–8 minute walk from the Shrinathji Temple, making it perfect for early-morning darshan.",
  },
  {
    q: "Do you provide parking facilities?",
    a: "Yes, we provide safe and secure parking for our guests, including cars and two-wheelers.",
  },
  {
    q: "Is WiFi available at the homestay?",
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
  { icon: "Footprints", title: "5–8 Min Walk", sub: "to Shrinathji Temple" },
  { icon: "Snowflake", title: "AC Rooms", sub: "Clean & comfortable" },
  { icon: "Flower2", title: "Peaceful", sub: "Spiritual environment" },
  { icon: "HeartHandshake", title: "Best Price", sub: "Honest & transparent" },
];
