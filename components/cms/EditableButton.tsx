"use client";

import { useState, useRef, useCallback } from "react";
import { useCMS } from "./CMSProvider";
import { Link, Type, X } from "lucide-react";

interface EditableButtonProps {
  contentKeyText: string;
  contentKeyUrl: string;
  defaultText: string;
  defaultUrl: string;
  className?: string;
  target?: string;
  children?: React.ReactNode;
}

export default function EditableButton({
  contentKeyText,
  contentKeyUrl,
  defaultText,
  defaultUrl,
  className = "",
  target,
  children,
}: EditableButtonProps) {
  const { content, isAdmin, loaded, updateContent } = useCMS();
  const [editing, setEditing] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [editText, setEditText] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const text = loaded ? content[contentKeyText] || defaultText : defaultText;
  const url = loaded ? content[contentKeyUrl] || defaultUrl : defaultUrl;

  const openEditor = useCallback(() => {
    setEditText(text);
    setEditUrl(url);
    setEditing(true);
  }, [text, url]);

  const save = useCallback(() => {
    if (editText.trim() && editText.trim() !== text) {
      updateContent(contentKeyText, editText.trim(), "text");
    }
    if (editUrl.trim() && editUrl.trim() !== url) {
      updateContent(contentKeyUrl, editUrl.trim(), "text");
    }
    setEditing(false);
  }, [editText, editUrl, text, url, contentKeyText, contentKeyUrl, updateContent]);

  if (!isAdmin) {
    return (
      <a href={url} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className={className}>
        {text}
        {children}
      </a>
    );
  }

  return (
    <>
      <button onClick={openEditor} className={`${className} hover:ring-2 hover:ring-rose-400/50 hover:ring-offset-2 transition-all`}>
        {text}
        {children}
      </button>

      {editing && (
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center px-4" onClick={() => setEditing(false)}>
          <div ref={popupRef} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Modifier le bouton</h3>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1.5">
                <Type className="w-3.5 h-3.5" /> Texte
              </label>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-black"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1.5">
                <Link className="w-3.5 h-3.5" /> URL
              </label>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-black"
              />
            </div>
            <button
              onClick={save}
              className="w-full bg-gray-900 text-white rounded-full py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
