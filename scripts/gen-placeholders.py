#!/usr/bin/env python3
"""Generate labelled placeholder images so the site looks finished
before the owner supplies real photos. Re-run with: python3 scripts/gen-placeholders.py
Brand palette: cream #F7F1E1, emerald #1E4A3C, gold #C7A24A, ink #33291E.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)

CREAM = (247, 241, 225)
CREAM_L = (251, 246, 234)
EMERALD = (30, 74, 60)
GOLD = (199, 162, 74)
INK = (51, 41, 30)

def font(size):
    for p in [
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/Library/Fonts/Georgia.ttf",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def small_font(size):
    for p in [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def gradient(w, h, top, bottom):
    base = Image.new("RGB", (w, h), top)
    draw = ImageDraw.Draw(base)
    for y in range(h):
        t = y / max(h - 1, 1)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        draw.line([(0, y), (w, y)], fill=c)
    return base

def make(name, w, h, title, subtitle, scheme="cream"):
    if scheme == "emerald":
        img = gradient(w, h, (26, 64, 52), (16, 40, 32))
        title_col, sub_col, border = CREAM_L, GOLD, GOLD
    elif scheme == "gold":
        img = gradient(w, h, (224, 199, 126), (199, 162, 74))
        title_col, sub_col, border = INK, (90, 70, 30), INK
    else:
        img = gradient(w, h, CREAM_L, (235, 224, 198))
        title_col, sub_col, border = EMERALD, GOLD, GOLD

    d = ImageDraw.Draw(img)
    # gold inner frame
    m = max(8, int(min(w, h) * 0.035))
    d.rectangle([m, m, w - m, h - m], outline=border, width=3)

    # simple decorative motifs (arches / temple silhouette)
    cx = w // 2
    archw = int(w * 0.22)
    archh = int(h * 0.18)
    ay = int(h * 0.30)
    for dx in (-int(w * 0.24), 0, int(w * 0.24)):
        d.arc(
            [cx + dx - archw // 2, ay, cx + dx + archw // 2, ay + archh * 2],
            start=180, end=360, fill=border, width=2,
        )
        d.line([cx + dx - archw // 2, ay + archh, cx + dx - archw // 2, ay + archh + int(h*0.12)], fill=border, width=2)
        d.line([cx + dx + archw // 2, ay + archh, cx + dx + archw // 2, ay + archh + int(h*0.12)], fill=border, width=2)
    # dome
    d.ellipse([cx - 14, ay - 26, cx + 14, ay + 2], outline=border, width=2)
    d.line([cx, ay - 40, cx, ay - 26], fill=border, width=2)

    # title
    tf = font(max(20, int(min(w, h) * 0.085)))
    sf = small_font(max(12, int(min(w, h) * 0.038)))

    tb = d.textbbox((0, 0), title, font=tf)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    ty = int(h * 0.60)
    d.text(((w - tw) / 2, ty), title, font=tf, fill=title_col)

    if subtitle:
        sb = d.textbbox((0, 0), subtitle, font=sf)
        sw = sb[2] - sb[0]
        d.text(((w - sw) / 2, ty + th + int(h * 0.04)), subtitle, font=sf, fill=sub_col)

    # "PLACEHOLDER" tag
    tag = "PLACEHOLDER PHOTO"
    tgf = small_font(max(9, int(min(w, h) * 0.026)))
    tgb = d.textbbox((0, 0), tag, font=tgf)
    tgw = tgb[2] - tgb[0]
    d.text(((w - tgw) / 2, h - m - int(h * 0.07)), tag, font=tgf, fill=sub_col)

    path = os.path.join(OUT, name)
    img.save(path, quality=82, optimize=True)
    print("wrote", name)

IMAGES = [
    ("hero-room.jpg", 1200, 900, "Hero Room", "hero-room.jpg", "cream"),
    ("building.jpg", 1000, 800, "Our Building", "building.jpg", "cream"),
    ("room-deluxe.jpg", 1000, 750, "Deluxe Room", "room-deluxe.jpg", "cream"),
    ("room-family.jpg", 1000, 750, "Family Room", "room-family.jpg", "cream"),
    ("room-premium.jpg", 1000, 750, "Premium Room", "room-premium.jpg", "cream"),
    ("darshan.jpg", 800, 1000, "Shrinathji Darshan", "darshan.jpg", "emerald"),
    ("bhajan.jpg", 800, 1000, "Bhajan", "bhajan.jpg", "emerald"),
    ("culture.jpg", 800, 1000, "Nathdwara Culture", "culture.jpg", "emerald"),
    ("nearby-shrinathji.jpg", 800, 800, "Shrinathji Temple", "5-8 Min Walk", "cream"),
    ("nearby-statue.jpg", 800, 800, "Statue of Belief", "Short Drive", "cream"),
    ("nearby-haldighati.jpg", 800, 800, "Haldighati", "Nearby", "cream"),
    ("nearby-kumbhalgarh.jpg", 800, 800, "Kumbhalgarh Fort", "Day Trip", "cream"),
    ("temple.jpg", 1000, 750, "Shrinathji Temple", "temple.jpg", "emerald"),
    ("terrace.jpg", 1000, 750, "Terrace Area", "terrace.jpg", "cream"),
    ("food.jpg", 1000, 750, "Veg Food", "food.jpg", "gold"),
    ("og-image.jpg", 1200, 630, "Shri Radha Home Stay", "Stay With Peace & Devotion · Nathdwara", "emerald"),
]

for args in IMAGES:
    make(*args)

print("done — all placeholders generated.")
