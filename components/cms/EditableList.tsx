"use client";

import { useState, useCallback, useEffect } from "react";
import { useCMS } from "./CMSProvider";
import { Plus, Trash2 } from "lucide-react";

interface ListItem {
  id: string;
  [key: string]: string;
}

interface EditableListProps {
  contentKey: string;
  defaultItems: ListItem[];
  renderItem: (item: ListItem, index: number, isAdmin: boolean, onUpdate: (field: string, value: string) => void) => React.ReactNode;
  fields: { key: string; label: string; placeholder: string }[];
  addLabel?: string;
}

export default function EditableList({
  contentKey,
  defaultItems,
  renderItem,
  fields,
  addLabel = "Ajouter",
}: EditableListProps) {
  const { content, isAdmin, loaded, updateContent } = useCMS();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [items, setItems] = useState<ListItem[]>(defaultItems);

  useEffect(() => {
    if (!loaded) return;
    const stored = content[contentKey];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      } catch {}
    }
  }, [loaded, content, contentKey]);

  const saveItems = useCallback(
    (newItems: ListItem[]) => {
      setItems(newItems);
      updateContent(contentKey, JSON.stringify(newItems), "text");
    },
    [contentKey, updateContent]
  );

  const addItem = useCallback(() => {
    const id = `item-${Date.now()}`;
    const item: ListItem = { id, ...newItem };
    saveItems([...items, item]);
    setNewItem({});
    setShowAdd(false);
  }, [items, newItem, saveItems]);

  const removeItem = useCallback(
    (id: string) => saveItems(items.filter((i) => i.id !== id)),
    [items, saveItems]
  );

  const updateItem = useCallback(
    (id: string, field: string, value: string) => {
      saveItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, saveItems]
  );

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id} className="relative group/item">
          {renderItem(item, i, isAdmin, (field, value) => updateItem(item.id, field, value))}
          {isAdmin && (
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg z-10"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}

      {isAdmin && (
        <>
          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 flex items-center gap-2 text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors py-3 font-medium"
            >
              <Plus className="w-4 h-4" /> {addLabel}
            </button>
          ) : (
            <div className="mt-4 bg-black/5 border border-black/10 rounded-xl p-5 space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-[var(--color-text-muted)] mb-1 block">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={newItem[f.key] || ""}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)]"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={addItem} className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-white text-xs px-4 py-2 rounded-full transition-colors font-medium">
                  Ajouter
                </button>
                <button onClick={() => { setShowAdd(false); setNewItem({}); }} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs px-3 py-2 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
