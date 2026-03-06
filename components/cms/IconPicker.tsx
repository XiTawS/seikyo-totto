"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";

// Build icon list — Lucide exports ForwardRef objects with { $$typeof, render }
const iconEntries: [string, React.ComponentType<any>][] = [];
for (const [name, component] of Object.entries(LucideIcons)) {
  if (
    component &&
    name[0] === name[0].toUpperCase() &&
    !name.endsWith("Icon") &&
    !name.startsWith("Lucide") &&
    name !== "default" &&
    name !== "icons" &&
    (typeof component === "function" || (typeof component === "object" && (component as any).render))
  ) {
    iconEntries.push([name, component as React.ComponentType<any>]);
  }
}

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export default function IconPicker({ value, onChange, className = "" }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.Scissors;

  const filtered = useMemo(() => {
    if (!search) return iconEntries.slice(0, 150);
    const s = search.toLowerCase();
    return iconEntries.filter(([name]) => name.toLowerCase().includes(s)).slice(0, 150);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        title="Changer l'icône"
      >
        <CurrentIcon className="w-5 h-5 text-[var(--color-primary)]" />
      </button>

      {open && (
        <div
          ref={pickerRef}
          className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex flex-col"
          style={{ width: 380, maxHeight: 480, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <p className="text-sm font-medium text-gray-700 mb-3">Choisir une icône</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gray-300 text-black"
            autoFocus
          />
          <div className="overflow-y-auto flex-1 grid grid-cols-8 gap-1">
            {filtered.map(([name, Ic]) => (
              <button
                key={name}
                onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
                title={name}
                className={`flex items-center justify-center p-2 rounded-lg transition-all hover:bg-gray-100 ${
                  name === value ? "bg-gray-200 ring-2 ring-gray-400" : ""
                }`}
              >
                <Ic width={20} height={20} className="text-gray-700" />
              </button>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-8">Aucune icône trouvée</p>}
        </div>
      )}
    </div>
  );
}
