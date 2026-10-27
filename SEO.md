# SEO — Shri Radha Villa Stay

Iss file me do cheezein hain: (1) site me jo SEO kaam **ho chuka** hai, aur
(2) jo kaam **aapko Google par karna hai** — code se nahi hota, par ranking
usi se aati hai.

---

## 1. Site me kya ho chuka hai (code side — done)

### Technical

| Cheez | Status |
|---|---|
| Canonical URLs (sab trailing slash ke saath, `trailingSlash: true` se match) | ✅ |
| `robots.txt` — `/admin/`, `/api/`, `/booking/success/` blocked | ✅ |
| AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) allowed | ✅ |
| `sitemap.xml` — saare 12 indexable URLs, priority ke saath | ✅ |
| Production URL safety — localhost galti se live sitemap me nahi jaayega (`lib/site-config.ts`) | ✅ |
| AVIF/WebP images + 1-year edge cache (`next.config.js`) | ✅ |
| Purane/typo URLs ke liye 301 redirects (`/book`, `/contact-us`, `/homestay` …) | ✅ |
| `lang="en-IN"`, `poweredByHeader` off | ✅ |

### Metadata

- Har page ka apna keyword-targeted title + description (sab 60–80 chars).
- Home title: **Home Stay in Nathdwara Near Shrinathji Temple**
- Open Graph + Twitter cards har page par (WhatsApp me link share karne par
  photo + text dikhega).
- Keyword list `lib/seo.ts` me hai — 3 clusters: commercial, local/travel,
  aur Hindi/Hinglish variants.

### Structured data (schema.org)

Ye woh cheez hai jisse Google ko samajh aata hai ki aap kya ho:

- **Hotel + LodgingBusiness** — address, phone, geo, 10 amenities, check-in/out
  time, room offers with prices, rating aur reviews. Har page par.
- **Organization + WebSite** — brand entity (Knowledge Panel ke liye).
- **HotelRoom + Offer** — har room page par price ke saath.
- **FAQPage** — home aur contact page par (Google SERP me sawaal-jawaab dikhte hain).
- **BreadcrumbList** — har page par.
- **ItemList of TouristAttraction** — attractions page par.
- **Article** — Nathdwara guide page par.

### Naye content pages (ye asli ranking lever hain)

1. **`/stay-near-shrinathji-temple/`** — "stay near Shrinathji Temple",
   "hotels near Shrinathji Temple Nathdwara", "Shrinathji mandir ke pass hotel"
   ke liye banaya gaya. Distance table, walking benefits, rates, 6 FAQs.
2. **`/nathdwara-guide/`** — "Shrinathji darshan timing", "how to reach
   Nathdwara", "Nathdwara to Udaipur distance", "best time to visit Nathdwara".
   Ye informational traffic laata hai jo baad me booking banta hai.
3. **Home page par** long-form intro block + FAQ section (pehle home page par
   text bahut kam tha — Google ko rank karne ke liye text chahiye).

Dono naye pages footer se linked hain, sitemap me hain, aur home page se
internal links jaate hain.

---

## 2. Ab aapko Google par kya karna hai (ye 70% ranking hai)

Local searches — "home stay near nathdwara", "hotel near shrinathji temple" —
me sabse upar **Google Map pack** aata hai, uske baad OTA sites (MakeMyTrip,
Booking.com), phir normal websites. Sirf website se aap map pack me nahi
aayenge. Ye karna zaroori hai:

### Step 1 — Google Business Profile (sabse zaroori) ⚠️

1. https://business.google.com par free listing banaiye.
2. **Name:** `Shri Radha Villa Stay` — bilkul wahi jo website par hai.
3. **Category:** primary = `Guest house`, secondary = `Homestay`, `Hotel`.
4. **Address + phone:** website se **exact same** — Haldighati Road,
   Kumbhalgarh Road, Nathdwara, Rajasthan 313301 · 8619301401.
   (Isko NAP consistency kehte hain — ek bhi akshar alag hoga to Google
   confuse hota hai.)
5. **Website field me:** `https://shreeradhehomestay.in`
6. Postcard/phone se verify kariye.
7. Kam se kam **20 asli photos** daaliye — rooms, bathroom, building bahar se,
   terrace, reception. Har hafte 1-2 nayi photo add karte rahiye.
8. Har hafte ek **Google Post** daaliye (offer, festival, darshan timing).

### Step 2 — Reviews (ye ranking me sabse bada difference laata hai)

- Har guest ke check-out par unhe review link bhejiye (WhatsApp par).
- Target: **pehle 3 mahine me 30+ reviews**, phir har mahine 5-10.
- Har review ka jawaab dijiye — 24 ghante ke andar, Hindi ya English me.
- Review me guest naturally "Shrinathji temple ke paas" likhe to Google usko
  strong local signal maanta hai. (Review ka text likh ke mat dijiye — Google
  fake review pakad leta hai aur listing suspend ho jaati hai.)

### Step 3 — Google Search Console

1. https://search.google.com/search-console par site add kariye.
2. Verify karne ke liye Vercel me environment variable set kariye:
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<google ka code>` — verification tag
   apne aap lag jaayega.
3. Sitemap submit kariye: `https://shreeradhehomestay.in/sitemap.xml`
4. "URL Inspection" me har naye page ko **Request Indexing** kariye:
   - `/`
   - `/stay-near-shrinathji-temple/`
   - `/nathdwara-guide/`
   - `/rooms/`
5. Bing Webmaster Tools par bhi same kariye (free, 5 minute) — ChatGPT search
   Bing ka index use karta hai.

### Step 4 — Vercel me production env variable ⚠️

Vercel dashboard → Settings → Environment Variables → Production:

```
NEXT_PUBLIC_SITE_URL=https://shreeradhehomestay.in
```

Agar ye set nahi hoga to code ab bhi safe fallback use karega, par explicitly
set karna behtar hai.

### Step 5 — Citations (free listings)

Har jagah **exact same** naam, address, phone daaliye:

- Justdial, Sulekha, IndiaMART
- TripAdvisor, Holidify, Tripoto
- MakeMyTrip / Goibibo / Booking.com (commission lagta hai, par ye sites
  khud Google me top par rank karti hain — indirect visibility milti hai)
- Facebook Page + Instagram bio me website link (abhi Facebook link
  `facebook.com/` placeholder hai — asli page banaiye ya hata dijiye)
- Apple Maps aur Bing Places par bhi listing daaliye

### Step 6 — Backlinks

- Nathdwara / Rajasthan travel blogs se guest post ya listing
- Local taxi operators, tour guides ki websites se link
- Pichwai art, Nathdwara tourism ke community pages

---

## 3. Realistic expectation

Jo maine site me kiya hai woh **foundation** hai — iske bina rank karna
possible hi nahi tha. Par:

- **1-2 mahina:** Google naye pages index karega, brand name
  ("Shri Radha Villa Stay") par #1 aayega.
- **3-4 mahina:** GBP + 20-30 reviews ke baad map pack me dikhna shuru hoga
  long-tail keywords par ("home stay near shrinathji temple").
- **6-12 mahina:** consistent reviews + content ke saath main commercial
  keywords par top 3-5.

"100 keywords par #1" — MakeMyTrip aur Booking.com jaisi sites ke upar aana
realistic nahi hai un keywords par jahan woh dominate karti hain. Par **local
map pack me #1** aana bilkul realistic hai, aur booking ke liye woh zyada
valuable hai — kyunki wahan se direct call aati hai, commission ke bina.

---

## 4. Naya content add karne ke liye

Agar aage aur keywords capture karne hain, ye pages banaiye
(`app/(site)/<slug>/page.tsx` — `nathdwara-guide` ko template ki tarah copy
kar lijiye):

| Page | Target keywords |
|---|---|
| `/nathdwara-to-udaipur/` | Nathdwara to Udaipur distance, taxi, day trip |
| `/kumbhalgarh-day-trip/` | Kumbhalgarh from Nathdwara, fort timings |
| `/shrinathji-darshan-timing/` | darshan timing (abhi guide page me hai — alag page aur strong hoga) |
| `/nathdwara-festivals/` | Annakut, Janmashtami, Holi Nathdwara |

Har naye page ke liye: `app/sitemap.ts` ke `PAGES` array me entry add kariye.
