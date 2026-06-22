"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * Editable list of short strings (features / amenities / highlights).
 */
export function ListInput({
  value,
  onChange,
  label,
  placeholder = "Add item…",
}: {
  value: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <div className="flex flex-wrap gap-2">
        {value.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-sm text-emerald"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={`Remove ${item}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="w-full max-w-xs rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm text-ink"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-lg border border-emerald/40 px-3 py-2 text-sm font-medium text-emerald hover:bg-emerald/10"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
