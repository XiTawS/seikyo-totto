"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useCMS } from "./CMSProvider";
import { Pencil } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Build icon map from lucide-react — ForwardRef objects
const iconMap: Record<string, React.ComponentType<any>> = {};
const iconNames: string[] = [];

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
    iconMap[name] = component as React.ComponentType<any>;
    iconNames.push(name);
  }
}

interface EditableIconProps {
  contentKey: string;
  defaultIcon: string;
  size?: number;
  className?: string;
}

export default function EditableIcon({
  contentKey,
  defaultIcon,
  size = 24,
  className = "",
}: EditableIconProps) {
  const { content, isAdmin, updateContent } = useCMS();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const iconName = content[contentKey] || defaultIcon;
  const IconComponent = iconMap[iconName] || iconMap[defaultIcon];

  const filtered = useMemo(() => {
    if (!search) return iconNames.slice(0, 120);
    const s = search.toLowerCase();
    return iconNames.filter((n) => n.toLowerCase().includes(s)).slice(0, 120);
  }, [search]);

  const handleSelect = useCallback(
    (name: string) => {
      updateContent(contentKey, name, "text");
      setPickerOpen(false);
      setSearch("");
    },
    [contentKey, updateContent]
  );

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  if (!IconComponent) return null;

  if (!isAdmin) {
    return <IconComponent width={size} height={size} className={className} />;
  }

  return (
    <div className="relative inline-flex" ref={triggerRef}>
      <div onClick={() => setPickerOpen(!pickerOpen)} className="relative cursor-pointer group/icon">
        <IconComponent width={size} height={size} className={className} />
        <div className="absolute -top-1 -right-1 opacity-0 group-hover/icon:opacity-100 transition-opacity bg-gray-900 rounded-full w-4 h-4 flex items-center justify-center">
          <Pencil className="w-2.5 h-2.5 text-white" />
        </div>
      </div>

      {pickerOpen && (
        <div
          ref={pickerRef}
          className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex flex-col"
          style={{ width: 380, maxHeight: 480, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une icône..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gray-300 text-black"
            autoFocus
          />
          <div className="overflow-y-auto flex-1 grid grid-cols-8 gap-1">
            {filtered.map((name) => {
              const Ic = iconMap[name];
              const isSelected = name === iconName;
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  title={name}
                  className={`flex items-center justify-center p-2 rounded-lg transition-all hover:bg-gray-100 ${isSelected ? "bg-gray-200 ring-2 ring-gray-400" : ""}`}
                >
                  <Ic width={20} height={20} className="text-gray-700" />
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-8">Aucune icône trouvée</p>}
        </div>
      )}
    </div>
  );
}
