"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, ImageIcon } from "lucide-react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Photo could not be uploaded. Please try again.");
  return data.url as string;
}

/* ── Single image field ─────────────────────────────────────────────── */
export function ImageField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative h-28 w-full max-w-48 shrink-0 overflow-hidden rounded-xl border border-gold/30 bg-cream">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/30">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald/40 px-3 py-2 text-sm font-medium text-emerald transition hover:bg-emerald/10 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            {busy ? "Uploading…" : value ? "Change photo" : "Choose photo"}
          </button>
          <input
            type="text"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} URL`}
            placeholder="Or paste a photo link"
            className="w-full max-w-full rounded-lg border border-gold/40 bg-white px-3 py-2.5 text-sm text-ink sm:w-72"
          />
        </div>
      </div>
      {error ? <p role="alert" className="mt-1 text-sm text-red-600">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Multiple images (gallery strip) ────────────────────────────────── */
export function GalleryField({
  value,
  onChange,
  label = "Gallery images",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file));
      }
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative h-20 w-28 overflow-hidden rounded-lg border border-gold/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gold/40 text-xs text-ink/50 transition hover:border-emerald/50 hover:text-emerald disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
          Add photo
        </button>
      </div>
      {error ? <p role="alert" className="mt-1 text-sm text-red-600">{error}</p> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
