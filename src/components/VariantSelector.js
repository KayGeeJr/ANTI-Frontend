"use client";

import { useMemo } from "react";

export default function VariantSelector({ option, value, onChange }) {
  const label = useMemo(() => option.name, [option.name]);

  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-neutral-700 mb-2">
        {label === "color" ? "Color" : label === "size" ? "Size" : label}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {option.values.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={[
                "px-3 py-1.5 text-sm border rounded-full transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
              ].join(" ")}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

