"use client";

import { useState, useRef, useCallback, createElement } from "react";
import { useCMS } from "./CMSProvider";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  tag?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableText({
  contentKey,
  defaultValue,
  tag = "span",
  className = "",
  style,
}: EditableTextProps) {
  const { content, isAdmin, loaded, updateContent } = useCMS();
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const value = loaded ? content[contentKey] || defaultValue : defaultValue;

  const handleBlur = useCallback(() => {
    setEditing(false);
    const newValue = ref.current?.innerText?.trim() || defaultValue;
    if (newValue !== value) {
      updateContent(contentKey, newValue, "text");
    }
  }, [contentKey, defaultValue, value, updateContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
  }, []);

  if (!isAdmin) {
    return createElement(tag, { className, style }, value);
  }

  return createElement(tag, {
    ref,
    className: `${className} ${
      editing
        ? "outline outline-2 outline-rose-400/50 outline-offset-2 rounded"
        : "hover:outline-dashed hover:outline-1 hover:outline-rose-400/30 hover:outline-offset-2 cursor-pointer"
    }`,
    style: { ...style, minWidth: "1em" },
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus: () => setEditing(true),
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    children: value,
  });
}
